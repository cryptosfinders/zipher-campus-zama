// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ZipherCampusBadge1155
 * @notice Soulbound course completion badges for Zipher Campus learners.
 * @dev 
 *  - Non-transferable (SBT style)
 *  - Mintable only by addresses with MINTER_ROLE
 *  - Batch mint supported for efficient distribution
 *  - URI can be updated by admin (for metadata upgrades)
 */
contract ZipherCampusBadge1155 is ERC1155, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event BadgeMinted(address indexed to, uint256 indexed courseId);

    constructor(string memory uri, address admin) ERC1155(uri) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    /**
     * @notice Mint a single completion badge (soulbound) for a learner.
     */
    function mintCompletion(address to, uint256 courseId)
        external
        onlyRole(MINTER_ROLE)
    {
        _mint(to, courseId, 1, "");
        emit BadgeMinted(to, courseId);
    }

    /**
     * @notice Batch mint the same course badge to multiple learners.
     * @dev Uses a simple loop; gas optimized by limiting writes to only _mint().
     */
    function mintBatch(address[] calldata recipients, uint256 courseId)
        external
        onlyRole(MINTER_ROLE)
    {
        uint256 len = recipients.length;
        for (uint256 i = 0; i < len; i++) {
            _mint(recipients[i], courseId, 1, "");
            emit BadgeMinted(recipients[i], courseId);
        }
    }

    /**
     * @notice Update the global metadata URI.
     */
    function setURI(string memory newURI)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setURI(newURI);
    }

    /**
     * SOULBOUND OVERRIDES
     * -----------------------------------------------------
     * Prevent transfers & approvals to maintain soulbound properties.
     */

    function setApprovalForAll(address, bool)
        public
        pure
        override
    {
        revert("Badge approvals disabled");
    }

    function safeTransferFrom(address, address, uint256, uint256, bytes memory)
        public
        pure
        override
    {
        revert("Badge non-transferable");
    }

    function safeBatchTransferFrom(address, address, uint256[] memory, uint256[] memory, bytes memory)
        public
        pure
        override
    {
        revert("Badge non-transferable");
    }

    /**
     * @dev Additional transfer guard at the internal hook level.
     * Prevents transfers even if someone bypasses UI/frontends.
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override {
        if (from != address(0) && to != address(0)) {
            revert("Badge is non-transferable");
        }
        super._update(from, to, ids, values);
    }

    /**
     * @inheritdoc ERC1155
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
