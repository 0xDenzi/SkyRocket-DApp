// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {IUniswapV2Router02} from "../src/interfaces/IUniswapV2Router02.sol";
import {IUniswapV2Factory} from "../src/interfaces/IUniswapV2Factory.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeployAndSetupUniswap is Script {
     address public deployer = 0x2fAFA5Ce36B88693b446F1d1BFa9A2fdB63b47A2;
     address public uniswapRouterAddress = 0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008; // Uniswap Router address
     // address public uniswapFactoryAddress = 0x...; // Uniswap Factory address
     address public wethAddress = 0x367D85aa4C908b5CC8a71373Ff6092C82740fF0e; // Mock WETH address
     address public usdcAddress = 0xD2dE6032b0BC2aCC3D5a03Df8b024fA4FaC7B0a9; // Mock USDC address

        function run() external {
         uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
         vm.startBroadcast(deployerPrivateKey);

         uint amountWETHDesired = 10e6; // Example amount
         uint amountUSDCDesired = 38000e6;  // Example amount

         // Ensure the deployer has enough tokens and approve the router
         IERC20(wethAddress).approve(uniswapRouterAddress, amountWETHDesired);
         IERC20(usdcAddress).approve(uniswapRouterAddress, amountUSDCDesired);

         // Instantiate the router
         IUniswapV2Router02 uniswapRouter = IUniswapV2Router02(uniswapRouterAddress);

         // Add liquidity
         uniswapRouter.addLiquidity(
             wethAddress,
             usdcAddress,
             amountWETHDesired,
             amountUSDCDesired,
             0, // Min amount WETH
             0, // Min amount USDC
            address(this), // Receiver of the liquidity tokens
            block.timestamp + 300 // Deadline
         );
         vm.stopBroadcast();
    }
}