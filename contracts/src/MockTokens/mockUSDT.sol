// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "../../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

/// @notice  This ERC20 contract represents the USDT token.
///          This contract should support the following functionalities:
///          - Initiating USDT tokens.
///          - Total Supply of 25000000 USDT tokens
contract mockUSDT is ERC20 {
    /// @notice Initializes the USDT token contract ($USDT).
    /// @param  init    The initial address to mint $USDT supply.
    constructor(address init) ERC20("mockUSDT", "mUSDT") {
        _mint(init, 25000000e6);
    }

    /// @notice returns the decimals of $USDT.
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
