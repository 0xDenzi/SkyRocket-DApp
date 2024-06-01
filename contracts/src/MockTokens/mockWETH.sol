// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "../../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

/// @notice  This ERC20 contract represents the WETH token.
///          This contract should support the following functionalities:
///          - Initiating WETH tokens.
///          - Total Supply of 25000000 WETH tokens
contract mockWETH is ERC20 {
    /// @notice Initializes the WETH token contract (WETH).
    /// @param  init    The initial address to mint WETH supply.
    constructor(address init) ERC20("mockWETH", "mWETH") {
        _mint(init, 25000000e6);
    }

    /// @notice returns the decimals of $DAI.
    function decimals() public override pure returns (uint8) {
        return 6;
    }
}
