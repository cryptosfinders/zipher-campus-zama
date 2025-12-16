// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

/// Test wrapper for local Hardhat tests — inherits your ZamaMockConfig from tests/mocks
/// Make sure ZamaMockConfig deploys ACLMock, CoprocessorMock, VerifierMock and calls FHE.setCoprocessor(cfg)
import { ZamaMockConfig } from "./mocks/ZamaMockConfig.sol";
import "./FHECampusReputationCore.sol";

contract FHECampusReputationMock is ZamaMockConfig, FHECampusReputationCore {
    constructor() ZamaMockConfig() {
        // Local mocks injected by ZamaMockConfig constructor, then you can use core.
    }
}
