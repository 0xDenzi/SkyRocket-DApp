// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "../../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

/// @notice  This ERC20 contract represents the DAI token.
///          This contract should support the following functionalities:
///          - Initiating DAI tokens.
///          - Total Supply of 25000000 DAI tokens
contract mockDAI is ERC20 {
    /// @notice Initializes the DAI token contract ($DAI).
    /// @param  init    The initial address to mint $DAI supply.
    constructor(address init) ERC20("mockDAI", "mDAI") {
        _mint(init, 25000000e6);
    }

    /// @notice returns the decimals of $DAI.
    function decimalsDAI() public pure returns (uint8) {
        return 6;
    }
}
