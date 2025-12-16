// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

contract VerifierMock {
    function verify(bytes calldata) external pure returns (bool) {
        return true;
    }
}
