// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

/// Core logic for FHE campus reputation (no network config here).
/// This contract uses the FHE library types and functions but does not
/// set the coprocessor config itself. Use a thin wrapper that inherits
/// ZamaEthereumConfig (production) or ZamaMockConfig (tests).
import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";

abstract contract FHECampusReputationCore {
    struct User {
        euint32 xp;
        euint32 level;
    }

    mapping(address => User) internal users;

    /// Emit only that reputation changed; do NOT emit ciphertexts
    event ReputationUpdated(address indexed user);

    /// Add encrypted XP (external handle + input proof).
    /// - externalEuint32: handle created off-chain and bound to (contract,address)
    /// - inputProof: zero-knowledge proof authorizing the handle
    function addXP(externalEuint32 encryptedValue, bytes calldata inputProof) public virtual {
        // Validate and convert the external handle into an internal encrypted value
        euint32 v = FHE.fromExternal(encryptedValue, inputProof);

        // Initialize xp if not set
        if (!FHE.isInitialized(users[msg.sender].xp)) {
            users[msg.sender].xp = FHE.asEuint32(0);
        }

        // Homomorphically add xp
        users[msg.sender].xp = FHE.add(users[msg.sender].xp, v);

        // Compute level as xp / 100 (division by plaintext allowed)
        users[msg.sender].level = FHE.div(users[msg.sender].xp, uint32(100));

        // Grant permissions:
        // - allow the caller (msg.sender) to decrypt their own new xp & level
        // - allow the contract to keep using them (allowThis) for subsequent ops
        FHE.allow(users[msg.sender].xp, msg.sender);
        FHE.allow(users[msg.sender].level, msg.sender);

        FHE.allowThis(users[msg.sender].xp);
        FHE.allowThis(users[msg.sender].level);

        emit ReputationUpdated(msg.sender);
    }

    /// Return the encrypted xp handle (euint32)
    function getEncryptedXP() external view returns (euint32) {
        return users[msg.sender].xp;
    }

    /// Return the encrypted level handle (euint32)
    function getEncryptedLevel() external view returns (euint32) {
        return users[msg.sender].level;
    }
}
