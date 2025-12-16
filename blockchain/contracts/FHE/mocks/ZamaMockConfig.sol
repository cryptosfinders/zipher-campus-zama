// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { ACLMock } from "./ACLMock.sol";
import { CoprocessorMock } from "./CoprocessorMock.sol";
import { VerifierMock } from "./VerifierMock.sol";
import { DecryptionOracleMock } from "./DecryptionOracleMock.sol";

contract ZamaMockConfig {

    ACLMock public acl;
    CoprocessorMock public cop;
    DecryptionOracleMock public oracle;
    VerifierMock public kms;

    constructor() {
        acl = new ACLMock();
        cop = new CoprocessorMock();
        oracle = new DecryptionOracleMock();
        kms = new VerifierMock();
    }

    /// @notice MUST return a tuple so JS can destructure it
    function deployMocks()
        external
        view
        returns (
            address,
            address,
            address,
            address
        )
    {
        return (
            address(acl),
            address(cop),
            address(oracle),
            address(kms)
        );
    }
}
