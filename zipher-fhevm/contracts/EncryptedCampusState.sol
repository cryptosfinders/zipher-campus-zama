// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * EncryptedCampusState – Zipher Campus FHE state layer
 *
 * Features:
 *  - Encrypted membership     (ebool)
 *  - Encrypted reputation     (euint64)
 *  - Encrypted voting         (euint8 choice, euint64 tallies)
 *  - Encrypted analytics      (euint64 metrics)
 *  - ACL permissions          (FHE.allow / FHE.allowThis)
 *  - External encrypted input (externalEuintXX / externalEbool)
 *
 * Decryption model:
 *  - On-chain contracts NEVER call decrypt.
 *  - Off-chain (Hardhat plugin / Relayer+Gateway+KMS) will decrypt
 *    using the returned handles (ebool / euint64 / euint8) +
 *    the ACL we configure here.
 */

import {
    FHE,
    ebool,
    euint8,
    euint64,
    externalEbool,
    externalEuint8,
    externalEuint64
} from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract EncryptedCampusState is ZamaEthereumConfig {
    /* ---------------------------------------------------------------------- */
    /*                                  ACCESS                                */
    /* ---------------------------------------------------------------------- */

    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /* ---------------------------------------------------------------------- */
    /* 1️⃣  ENCRYPTED MEMBERSHIP (groupId → user → ebool)                       */
    /* ---------------------------------------------------------------------- */

    // groupId => user => encrypted active flag
    mapping(bytes32 => mapping(address => ebool)) private _membership;

    event MembershipUpdated(bytes32 indexed groupId, address indexed user);

    /// @notice Set membership using a plaintext bool (simple path)
    function setMembership(
        bytes32 groupId,
        address user,
        bool isActive
    ) external onlyAdmin {
        ebool enc = FHE.asEbool(isActive);
        _membership[groupId][user] = enc;

        // Allow contract + admin to decrypt off-chain
        FHE.allowThis(enc);
        FHE.allow(enc, admin);

        emit MembershipUpdated(groupId, user);
    }

    /// @notice Set membership from an encrypted boolean input
    /// @dev externalEbool + proof comes from relayer / Hardhat plugin
    function setMembershipEncrypted(
        bytes32 groupId,
        address user,
        externalEbool encFlag,
        bytes calldata inputProof
    ) external onlyAdmin {
        ebool flag = FHE.fromExternal(encFlag, inputProof);
        _membership[groupId][user] = flag;

        FHE.allowThis(flag);
        FHE.allow(flag, admin);

        emit MembershipUpdated(groupId, user);
    }

    /// @notice Return encrypted membership handle (for off-chain decrypt)
    function getMembershipHandle(
        bytes32 groupId,
        address user
    ) external view returns (ebool) {
        return _membership[groupId][user];
    }

    /* ---------------------------------------------------------------------- */
    /* 2️⃣  ENCRYPTED REPUTATION (groupId → user → euint64)                     */
    /* ---------------------------------------------------------------------- */

    mapping(bytes32 => mapping(address => euint64)) private _reputation;

    event ReputationUpdated(bytes32 indexed groupId, address indexed user);

    /// @notice Initialize reputation if not set
    function initReputation(
        bytes32 groupId,
        address user,
        uint64 initialValue
    ) external onlyAdmin {
        euint64 current = _reputation[groupId][user];

        if (!FHE.isInitialized(current)) {
            euint64 enc = FHE.asEuint64(initialValue);
            _reputation[groupId][user] = enc;

            FHE.allowThis(enc);
            FHE.allow(enc, admin);

            emit ReputationUpdated(groupId, user);
        }
    }

    /// @notice Add plaintext delta to encrypted reputation
    function addReputation(
        bytes32 groupId,
        address user,
        uint64 delta
    ) external onlyAdmin {
        euint64 current = _reputation[groupId][user];

        if (!FHE.isInitialized(current)) {
            current = FHE.asEuint64(0);
        }

        euint64 updated = FHE.add(current, FHE.asEuint64(delta));
        _reputation[groupId][user] = updated;

        FHE.allowThis(updated);
        FHE.allow(updated, admin);

        emit ReputationUpdated(groupId, user);
    }

    /// @notice Add encrypted delta (externalEuint64) to reputation
    function addReputationEncrypted(
        bytes32 groupId,
        address user,
        externalEuint64 encDelta,
        bytes calldata inputProof
    ) external onlyAdmin {
        euint64 delta = FHE.fromExternal(encDelta, inputProof);
        euint64 current = _reputation[groupId][user];

        if (!FHE.isInitialized(current)) {
            current = FHE.asEuint64(0);
        }

        euint64 updated = FHE.add(current, delta);
        _reputation[groupId][user] = updated;

        FHE.allowThis(updated);
        FHE.allow(updated, admin);

        emit ReputationUpdated(groupId, user);
    }

    /// @notice Return encrypted reputation handle
    function getReputationHandle(
        bytes32 groupId,
        address user
    ) external view returns (euint64) {
        return _reputation[groupId][user];
    }

    /* ---------------------------------------------------------------------- */
    /* 3️⃣  ENCRYPTED VOTING (pollId → option → euint64 tally)                  */
    /* ---------------------------------------------------------------------- */

    struct PollConfig {
        uint8 maxOption;  // valid options: 0..maxOption
        bool exists;
        bool isSealed;    // 'sealed' is a reserved keyword in newer Solidity
    }

    mapping(bytes32 => PollConfig) public polls;

    // pollId => user => hasVoted
    mapping(bytes32 => mapping(address => bool)) public hasVoted;

    // pollId => optionIndex => encrypted tally
    mapping(bytes32 => mapping(uint8 => euint64)) private _tallies;

    event PollCreated(bytes32 indexed pollId, uint8 maxOption);
    event PollSealed(bytes32 indexed pollId);
    event VoteCast(bytes32 indexed pollId, address indexed voter);

    /// @notice Create a new poll (options 0..maxOption)
    function createPoll(bytes32 pollId, uint8 maxOption) external onlyAdmin {
        require(maxOption > 0, "maxOption > 0");

        PollConfig storage p = polls[pollId];
        require(!p.exists, "Poll exists");

        p.maxOption = maxOption;
        p.exists = true;
        p.isSealed = false;

        // Initialize encrypted tallies to 0
        for (uint8 i = 0; i <= maxOption; i++) {
            euint64 zero = FHE.asEuint64(0);
            _tallies[pollId][i] = zero;

            // Allow contract + admin to decrypt tallies off-chain
            FHE.allowThis(zero);
            FHE.allow(zero, admin);
        }

        emit PollCreated(pollId, maxOption);
    }

    /// @notice Cast an encrypted vote (option is encrypted euint8)
    /// @dev externalEuint8 + proof come from relayer/SDK
    function castVoteEncrypted(
        bytes32 pollId,
        externalEuint8 encOption,
        bytes calldata inputProof
    ) external {
        PollConfig memory p = polls[pollId];
        require(p.exists, "Poll missing");
        require(!p.isSealed, "Poll sealed");
        require(!hasVoted[pollId][msg.sender], "Already voted");

        // Encrypted choice 0..maxOption
        euint8 vote = FHE.fromExternal(encOption, inputProof);

        // Accumulate tally homomorphically:
        // for each option i:
        //   delta = (vote == i) ? 1 : 0
        //   tally[i] += delta
        for (uint8 i = 0; i <= p.maxOption; i++) {
            ebool isThis = FHE.eq(vote, FHE.asEuint8(i));
            euint64 delta = FHE.select(
                isThis,
                FHE.asEuint64(1),
                FHE.asEuint64(0)
            );

            euint64 current = _tallies[pollId][i];
            if (!FHE.isInitialized(current)) {
                current = FHE.asEuint64(0);
            }

            euint64 updated = FHE.add(current, delta);
            _tallies[pollId][i] = updated;

            FHE.allowThis(updated);
            FHE.allow(updated, admin);
        }

        hasVoted[pollId][msg.sender] = true;
        emit VoteCast(pollId, msg.sender);
    }

    /// @notice Seal poll (no more votes)
    function sealPoll(bytes32 pollId) external onlyAdmin {
        PollConfig storage p = polls[pollId];
        require(p.exists, "Poll missing");
        require(!p.isSealed, "Already sealed");

        p.isSealed = true;

        emit PollSealed(pollId);
    }

    /// @notice Return encrypted tally handle for an option
    function getTallyHandle(
        bytes32 pollId,
        uint8 option
    ) external view returns (euint64) {
        return _tallies[pollId][option];
    }

    /* ---------------------------------------------------------------------- */
    /* 4️⃣  ENCRYPTED ANALYTICS (metricId → euint64)                            */
    /* ---------------------------------------------------------------------- */

    mapping(bytes32 => euint64) private _metrics;

    event MetricUpdated(bytes32 indexed metricId);

    /// @notice Increment metric with plaintext delta
    function incrementMetric(bytes32 metricId, uint64 delta) external onlyAdmin {
        euint64 current = _metrics[metricId];

        if (!FHE.isInitialized(current)) {
            current = FHE.asEuint64(0);
        }

        euint64 updated = FHE.add(current, FHE.asEuint64(delta));
        _metrics[metricId] = updated;

        FHE.allowThis(updated);
        FHE.allow(updated, admin);

        emit MetricUpdated(metricId);
    }

    /// @notice Increment metric with encrypted delta
    function incrementMetricEncrypted(
        bytes32 metricId,
        externalEuint64 encDelta,
        bytes calldata inputProof
    ) external onlyAdmin {
        euint64 delta = FHE.fromExternal(encDelta, inputProof);
        euint64 current = _metrics[metricId];

        if (!FHE.isInitialized(current)) {
            current = FHE.asEuint64(0);
        }

        euint64 updated = FHE.add(current, delta);
        _metrics[metricId] = updated;

        FHE.allowThis(updated);
        FHE.allow(updated, admin);

        emit MetricUpdated(metricId);
    }

    /// @notice Return encrypted metric handle
    function getMetricHandle(bytes32 metricId) external view returns (euint64) {
        return _metrics[metricId];
    }
}
