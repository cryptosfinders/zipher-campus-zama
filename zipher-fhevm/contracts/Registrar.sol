// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

/// @title Registrar for Zipher FH-EVM Courses
/// @notice Local-dev version (registerCourse is open to anyone)
contract Registrar {
    struct Course {
        uint256 priceWei;
        address[] payees;
        uint16[] sharesBps;
        uint64 accessDuration;
        uint64 transferCooldown;
        bool exists;
    }

    /// @notice Marketplace contract allowed to sell memberships
    address public marketplace;

    /// @notice Membership pass ERC1155 contract
    address public membershipToken;

    /// @notice Admin address (unused during local dev)
    address public owner;

    mapping(uint256 => Course) private _courses;

    event CourseRegistered(
        uint256 indexed courseId,
        uint256 priceWei,
        address[] payees,
        uint16[] sharesBps,
        uint64 accessDuration,
        uint64 transferCooldown
    );

    event CourseUpdated(
        uint256 indexed courseId,
        uint256 priceWei,
        address[] payees,
        uint16[] sharesBps,
        uint64 accessDuration,
        uint64 transferCooldown
    );

    event MarketplaceUpdated(address indexed marketplace);
    event MembershipTokenUpdated(address indexed membershipToken);

    error InvalidShares();
    error ZeroAddress();
    error CourseNotFound();

    constructor(address _marketplace, address _membershipToken) {
        owner = msg.sender;

        if (_marketplace == address(0)) revert ZeroAddress();
        marketplace = _marketplace;
        emit MarketplaceUpdated(_marketplace);

        if (_membershipToken != address(0)) {
            membershipToken = _membershipToken;
            emit MembershipTokenUpdated(_membershipToken);
        }
    }

    /* ---------------------------------------------------------------------- */
    /* Local-Dev Only: open to anyone                                         */
    /* ---------------------------------------------------------------------- */
    function registerCourse(
        uint256 courseId,
        uint256 priceWei,
        address[] calldata payees,
        uint256[] calldata sharesBps,
        uint256 accessDuration,
        uint256 transferCooldown
    ) external {
        if (payees.length != sharesBps.length) revert InvalidShares();

        uint256 total;
        uint16[] memory shares16 = new uint16[](sharesBps.length);

        for (uint256 i = 0; i < sharesBps.length; i++) {
            total += sharesBps[i];
            shares16[i] = uint16(sharesBps[i]);
        }

        if (total > 10_000) revert InvalidShares();

        Course storage c = _courses[courseId];
        c.priceWei = priceWei;
        c.payees = payees;
        c.sharesBps = shares16;
        c.accessDuration = uint64(accessDuration);
        c.transferCooldown = uint64(transferCooldown);
        c.exists = true;

        emit CourseRegistered(
            courseId,
            priceWei,
            payees,
            shares16,
            uint64(accessDuration),
            uint64(transferCooldown)
        );
    }

    /* ---------------------------------------------------------------------- */
    /* Views                                                                  */
    /* ---------------------------------------------------------------------- */

    function getCourse(
        uint256 courseId
    )
        external
        view
        returns (
            uint256 priceWei,
            address[] memory payees,
            uint16[] memory sharesBps,
            uint64 accessDuration,
            uint64 transferCooldown,
            bool exists
        )
    {
        Course storage c = _courses[courseId];
        if (!c.exists) revert CourseNotFound();
        return (
            c.priceWei,
            c.payees,
            c.sharesBps,
            c.accessDuration,
            c.transferCooldown,
            true
        );
    }

    function courseExists(uint256 courseId) external view returns (bool) {
        return _courses[courseId].exists;
    }

    function getCourseForSale(
        uint256 courseId
    )
        external
        view
        returns (uint256 priceWei, address[] memory payees, uint16[] memory sharesBps)
    {
        Course storage c = _courses[courseId];
        if (!c.exists) revert CourseNotFound();
        return (c.priceWei, c.payees, c.sharesBps);
    }

    /* ---------------------------------------------------------------------- */
    /* Admin setters (still allowed)                                          */
    /* ---------------------------------------------------------------------- */

    function setMarketplace(address _marketplace) external {
        if (_marketplace == address(0)) revert ZeroAddress();
        marketplace = _marketplace;
        emit MarketplaceUpdated(_marketplace);
    }

    function setMembershipToken(address _membershipToken) external {
        if (_membershipToken == address(0)) revert ZeroAddress();
        membershipToken = _membershipToken;
        emit MembershipTokenUpdated(_membershipToken);
    }
}
