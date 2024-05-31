// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {mockDAI} from "../src/MockTokens/mockDAI.sol";
import {mockUSDC} from "../src/MockTokens/mockUSDC.sol";
import {mockUSDT} from "../src/MockTokens/mockUSDT.sol";
import {mockWETH} from "../src/MockTokens/mockWETH.sol";
import {console} from "forge-std/console.sol";

contract DeployTokens is Script {
    address public deployer = 0x2fAFA5Ce36B88693b446F1d1BFa9A2fdB63b47A2;
    address[] public testAccounts = [
        0xf3bC9Fce01133Bad3a46898bD91DeE7A24d3Bef2, // Replace with actual test account addresses
        0xC7dA10b318Fe53B8FDD4C1612B98a44154e081DD,
        0x9E255510fa8F84d15bb196590a43e847E8d609a3,
        0x73d720768cD18e1a9473D874f064B08e1a5037f1
    ];

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        mockDAI dai = new mockDAI(address(deployer));
        mockUSDC usdc = new mockUSDC(address(deployer));
        mockUSDT usdt = new mockUSDT(address(deployer));
        mockWETH weth = new mockWETH(address(deployer));

        // Optionally, log the addresses of deployed tokens
        console.log("mockDAI deployed at:", address(dai));
        console.log("mockUSDC deployed at:", address(usdc));
        console.log("mockUSDT deployed at:", address(usdt));
        console.log("mockWETH deployed at:", address(weth));

        // Distribute WETH to known test accounts
        distributeWETH(address(weth), address(usdc), address(usdt), address(dai));

        vm.stopBroadcast();
    }

    // Distribute WETH to a list of addresses for testing purposes
    function distributeWETH(address _weth, address _usdc, address _usdt, address _dai) internal {
        mockWETH weth = mockWETH(_weth);
        mockUSDC usdc = mockUSDC(_usdc);
        mockUSDT usdt = mockUSDT(_usdt);
        mockDAI dai = mockDAI(_dai);
        uint256 totalAmount = 5000e6;
        uint256 amount = 1000e6; // Amount of WETH to distribute to each account

        // Approve the contract to transfer deployer's WETH
        weth.approve(address(this), totalAmount);
        usdc.approve(address(this), totalAmount);
        usdt.approve(address(this), totalAmount);
        dai.approve(address(this), totalAmount);

        for (uint i = 0; i < testAccounts.length; i++) {
            weth.transfer(testAccounts[i], amount);
            usdc.transfer(testAccounts[i], amount);
            usdt.transfer(testAccounts[i], amount);
            dai.transfer(testAccounts[i], amount);
        }
    }
}