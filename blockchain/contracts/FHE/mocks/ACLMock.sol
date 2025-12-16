// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

contract ACLMock {
    function check(address, bytes32) external pure returns (bool) {
        return true;
    }
}
