// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

contract CoprocessorMock {
    function fheOp(bytes32, bytes32, bytes1) external pure returns (bytes32) {
        return bytes32(uint256(1));
    }
}
