// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SkyRocketToken} from "SkyRocketToken.sol";

contract Funding {
    // Mapping to track total funds deposited by a user
    mapping(address => uint256) totalDeposits;
    // Mapping to track funds deposited by a user for a project
    mapping(address => mapping(address => uint256)) projectDeposits;
    // Mapping to track the allowed stablecoins
    mapping(address => bool) allowedTokens;

    // address of the admin
    address admin;
    // SkyRocketToken contract
    SkyRocketToken SKT;
    // Current Project
    address project;

    /// @notice Initializes the funding contract.
    /// @param  _admin         The address of the admin.
    /// @param  _allowedTokens Array containing addresses of allowed tokens.
    constructor(address _admin, address[] memory _allowedTokens) {
        admin = _admin;
        for (uint256 i = 0; i < _allowedTokens.length; i++) {
            allowedTokens[_allowedTokens[i]] = true;
        }
        SKT = new SkyRocketToken();
    }

    /// @notice Modifier for onlyAdmin calls
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    /// @notice Allows users to fund with stablecoins.
    /// @param  _token   The address of the token being deposited.
    /// @param  _amount  The amount of tokens being deposited.
    function fundWithStableCoin(address _token, uint256 _amount) external {
        require(allowedTokens[_token], "Token not allowed");
        require(amount >= 1e6, "Amount should be greater or equal to 1");
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        totalDeposits[msg.sender] += _amount;
        projectDeposits[msg.sender][project] += _amount;
        SKT.mint(msg.sender, _amount);
    }

    /// @notice Allows users to fund with ether which is swapped into USDC.
    function fundWithEther() external {
        require(msg.value > 0, "Amount should be greater than 0");
        // convert to usdc here
        // update state variables
        // mint SKT to the msg.sender
    }
}
