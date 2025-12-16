// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Minimal stub Marketplace.
 * Right now it's just a placeholder that gives a non-zero address.
 * You can extend it later with actual listing logic.
 */
contract Marketplace {
    address public owner;

    constructor() {
        owner = msg.sender;
    }
}
