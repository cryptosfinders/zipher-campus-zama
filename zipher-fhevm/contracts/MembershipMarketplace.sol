// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./Registrar.sol";
import "./MembershipPass1155.sol";

/// @title MembershipMarketplace
/// @notice Takes FH-EVM native payment and mints membership passes.
///
/// Flow:
///  - Frontend figures out `courseId` and price from backend/Registrar
///  - User calls buyMembership{value:price}(courseId)
///  - Marketplace pulls course config from Registrar, forwards ETH, and mints pass
contract MembershipMarketplace {
    Registrar public immutable registrar;
    MembershipPass1155 public immutable membership;
    address public immutable treasury;

    event MembershipPurchased(
        uint256 indexed courseId,
        address indexed buyer,
        uint256 priceWei
    );

    error InsufficientPayment();
    error ZeroAddress();

    constructor(
        address _registrar,
        address _membership,
        address _treasury
    ) {
        if (_registrar == address(0)) revert ZeroAddress();
        if (_membership == address(0)) revert ZeroAddress();
        if (_treasury == address(0)) revert ZeroAddress();

        registrar = Registrar(_registrar);
        membership = MembershipPass1155(_membership);
        treasury = _treasury;
    }

    /// @notice User buys a membership for `courseId`
    function buyMembership(uint256 courseId) external payable {
      (
        uint256 priceWei,
        address[] memory payees,
        uint16[] memory sharesBps
      ) = registrar.getCourseForSale(courseId);

      if (msg.value < priceWei) revert InsufficientPayment();

      // Split ETH according to payees / sharesBps
      uint256 remaining = msg.value;
      for (uint256 i = 0; i < payees.length; i++) {
          uint256 shareAmount = (msg.value * sharesBps[i]) / 10_000;
          if (shareAmount > 0 && payees[i] != address(0)) {
              remaining -= shareAmount;
              (bool ok, ) = payees[i].call{value: shareAmount}("");
              require(ok, "Payout failed");
          }
      }

      // Any dust goes to treasury
      if (remaining > 0) {
          (bool ok2, ) = treasury.call{value: remaining}("");
          require(ok2, "Treasury payout failed");
      }

      // Mint 1 membership pass to buyer
      membership.mintMembership(msg.sender, courseId, 1);

      emit MembershipPurchased(courseId, msg.sender, msg.value);
    }

    receive() external payable {}
}
