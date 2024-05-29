// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "../../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

/// @notice  This ERC20 contract represents the USDC token.
///          This contract should support the following functionalities:
///          - Initiating USDC tokens.
///          - Total Supply of 25000000 USDC tokens
contract mockUSDC is ERC20 {
    /// @notice Initializes the USDC token contract ($USDC).
    /// @param  init    The initial address to mint $USDC supply.
    constructor(address init) ERC20("mockUSDC", "mUSDC") {
        _mint(init, 25000000e6);
    }

    /// @notice returns the decimals of $USDC.
    function decimals() public view override returns (uint8) {
        return 6;
    }
}
