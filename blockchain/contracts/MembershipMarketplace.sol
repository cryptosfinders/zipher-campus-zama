// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {MembershipPass1155} from "./MembershipPass1155.sol";

/**
 * @title MembershipMarketplace
 * @notice Simple marketplace that sells MembershipPass1155 courses for ETH.
 *
 * Notes:
 *  - Price enforcement is handled inside MembershipPass1155.marketplaceMint(...)
 *  - ETH sent here currently stays in this contract (TODO: wire SplitPayout if you want full revenue sharing)
 */
contract MembershipMarketplace is ReentrancyGuard {
    MembershipPass1155 public immutable membership;
    address public owner;

    event PassPurchased(
        uint256 indexed courseId,
        address indexed buyer,
        uint256 amountPaid
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(MembershipPass1155 membershipContract) {
        require(address(membershipContract) != address(0), "Membership address zero");
        membership = membershipContract;
        owner = msg.sender;
    }

    /**
     * @notice Buy a membership pass for a given courseId.
     * @dev MembershipPass1155 enforces that amountPaid >= priceWei.
     */
    function buy(uint256 courseId) external payable nonReentrant {
        uint256 amountPaid = msg.value;
        membership.marketplaceMint(msg.sender, courseId, amountPaid);

        emit PassPurchased(courseId, msg.sender, amountPaid);
    }

    /**
     * @notice Owner can withdraw accumulated ETH (until SplitPayout wiring is added).
     */
    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "Zero address");
        require(amount <= address(this).balance, "Insufficient balance");
        to.transfer(amount);
    }
}
