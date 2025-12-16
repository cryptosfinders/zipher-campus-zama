// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {SplitPayout} from "./helpers/SplitPayout.sol";
import {MembershipPass1155} from "./MembershipPass1155.sol";

/**
 * @title Registrar
 * @notice Deploys SplitPayout contracts and wires new courses into MembershipPass1155.
 *
 * Frontend calls `registerCourse(...)` with:
 *  - courseId
 *  - priceWei
 *  - recipients (revenue payees)
 *  - sharesBps (basis points that must sum to 10000)
 *  - duration (seconds)
 *  - transferCooldown (seconds)
 */
contract Registrar is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    MembershipPass1155 public immutable membership;
    address public marketplace;

    event CourseRegistered(
        uint256 indexed courseId,
        address indexed splitter,
        uint256 priceWei,
        address indexed creator,
        uint64 duration,
        uint64 transferCooldown
    );

    constructor(MembershipPass1155 membershipContract, address admin) {
        require(address(membershipContract) != address(0), "Membership address zero");

        membership = membershipContract;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    function setMarketplace(address marketplaceAddress) external onlyRole(ADMIN_ROLE) {
        require(marketplaceAddress != address(0), "Marketplace address zero");
        marketplace = marketplaceAddress;
    }

    /**
     * @notice Registers a new course and deploys a dedicated SplitPayout contract.
     * @dev Frontend / scripts call this on FH-EVM / Sepolia.
     */
    function registerCourse(
        uint256 courseId,
        uint256 priceWei,
        address[] calldata recipients,
        uint32[] calldata sharesBps,
        uint64 duration,
        uint64 transferCooldown
    ) external returns (address splitterAddress) {
        require(marketplace != address(0), "Marketplace not set");
        require(recipients.length == sharesBps.length, "Length mismatch");

        uint256 total;
        for (uint256 i = 0; i < sharesBps.length; i++) {
            total += sharesBps[i];
        }
        require(total == 10000, "Shares must sum to 10000");

        // deploy payout splitter
        SplitPayout splitter = new SplitPayout(
            address(membership),
            marketplace,
            recipients,
            sharesBps
        );
        splitterAddress = address(splitter);

        // register course in MembershipPass1155
        membership.createCourse(
            courseId,
            priceWei,
            splitterAddress,
            msg.sender,
            duration,
            transferCooldown
        );

        emit CourseRegistered(
            courseId,
            splitterAddress,
            priceWei,
            msg.sender,
            duration,
            transferCooldown
        );
    }
}
