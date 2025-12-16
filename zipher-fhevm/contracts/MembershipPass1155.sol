// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * MembershipPass1155
 * ERC-1155 token representing memberships to groups/courses
 * Required by Marketplace + Registrar
 */
contract MembershipPass1155 is ERC1155, Ownable {

    // Track total supply per courseId
    mapping(uint256 => uint256) public totalSupply;

    constructor(string memory uri_)
        ERC1155(uri_)
        Ownable(msg.sender)
    {}

    /**
     * REQUIRED by Marketplace:
     * mintMembership(to, courseId, amount)
     */
    function mintMembership(
        address to,
        uint256 courseId,
        uint256 amount
    ) external onlyOwner {
        _mint(to, courseId, amount, "");
        totalSupply[courseId] += amount;
    }

    /**
     * Burn membership tokens (admin-controlled)
     */
    function burnMembership(
        address from,
        uint256 courseId,
        uint256 amount
    ) external onlyOwner {
        _burn(from, courseId, amount);
        totalSupply[courseId] -= amount;
    }

    /**
     * Standard mint wrapper (optional)
     */
    function mint(address to, uint256 id, uint256 amount) external onlyOwner {
        _mint(to, id, amount, "");
        totalSupply[id] += amount;
    }

    function burn(address from, uint256 id, uint256 amount) external onlyOwner {
        _burn(from, id, amount);
        totalSupply[id] -= amount;
    }
}
