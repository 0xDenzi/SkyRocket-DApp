// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SkyRocketToken} from "../src/SkyRocketToken.sol";
import {Project} from "./Project.sol";
import {IUniswapV2Router02} from "../src/interfaces/IUniswapV2Router02.sol";

contract Funding {

    event FundedWithStable(address indexed user, address _token, uint256 amount);
    event FundedWithEther(address indexed user, address _token, uint256 amount);


    // Mapping to track total funds deposited by a user
    mapping(address => uint256) totalDeposits;
    // Mapping to track funds deposited by a user for a project
    mapping(address => mapping(uint256 => uint256)) projectDeposits;
    // Mapping to track the allowed stablecoins
    mapping(address => bool) allowedTokens;

    // address of the admin
    address admin;
    // SkyRocketToken contract
    SkyRocketToken SKT;
    // Project contract
    Project PJT;

    // Address for WETH
    address public constant WETH_ADDRESS = 0x367D85aa4C908b5CC8a71373Ff6092C82740fF0e;
    // Address for USDC
    address public constant USDC_ADDRESS = 0xD2dE6032b0BC2aCC3D5a03Df8b024fA4FaC7B0a9;
    // Address for Uniswap Router
    address public constant UNISWAP_ROUTER_ADDRESS = 0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008;

    /// @notice Initializes the funding contract.
    /// @param  _admin         The address of the admin.
    /// @param  _allowedTokens Array containing addresses of allowed tokens.
    constructor(address _admin, address[] memory _allowedTokens) {
        admin = _admin;
        for (uint256 i = 0; i < _allowedTokens.length; i++) {
            allowedTokens[_allowedTokens[i]] = true;
        }
        SKT = new SkyRocketToken("SkyRocket", "SKT", address(this));
        PJT = new Project(_admin, address(this), _allowedTokens);

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
        require(_amount >= 1e6, "Amount should be greater or equal to 1");
        address _account = msg.sender;
        totalDeposits[_account] += _amount;
        projectDeposits[_account][PJT.projectCounter()] += _amount;

        PJT.fundsAccumulation(_account, _token, _amount);
        SKT.mint(_account, _amount);

        emit FundedWithStable(_account, _token, _amount);
    }

    /// @notice Allows users to fund with ether which is swapped into USDC.
    /// @param _wethAmount  The amount of WETH user wants to swap
    /// @param _usdcAmount  The amount of USDC user wants to swap for
    /// @param _deadline     The deadline before which transaction is reverted
    /// @param _slippage     The min amount to swap for
    function fundWithEther(uint256 _wethAmount, uint256 _usdcAmount,uint256 _deadline, uint _slippage) external {
        address _account = msg.sender;

        require(_wethAmount > 0, "Invalid WETH amount");

        // Transfer WETH from the sender to this contract
        require(IERC20(WETH_ADDRESS).transferFrom(msg.sender, address(this), _wethAmount), "Transfer failed");

        // Approve the Uniswap Router to spend WETH
        IERC20(WETH_ADDRESS).approve(UNISWAP_ROUTER_ADDRESS, _wethAmount);

        // Setup the Uniswap swap path from WETH to USDC
        address[] memory path = new address[](2);
        path[0] = WETH_ADDRESS;
        path[1] = USDC_ADDRESS;

        // Calculate the minimum amount of USDC to accept based on the slippage
        uint minimumUSDC = _usdcAmount * (1000 - _slippage) / 1000; // Applying slippage tolerance

        // Perform the swap on Uniswap
        uint[] memory results = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS).swapExactTokensForTokens(
            _wethAmount,
            minimumUSDC, // Set minimum amount of USDC to accept from the swap
            path,
            address(this),
            _deadline // User-defined deadline
        );

        uint amountUSDCReceived = results[1]; // This is the USDC amount received from the swap

        PJT.fundsAccumulation(_account, USDC_ADDRESS, amountUSDCReceived);
        SKT.mint(_account, amountUSDCReceived);

        // Here you would typically update your contract's state and handle token minting
        emit FundedWithEther(msg.sender, USDC_ADDRESS, amountUSDCReceived);
    }
}
