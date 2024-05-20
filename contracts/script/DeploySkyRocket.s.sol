//SPDX-License-Identify: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {SkyRocketToken} from "../src/SkyRocketToken.sol";
import {Funding} from "../src/Funding.sol";
import {Project} from "../src/Project.sol";
import {mockDAI} from "../src/MockTokens/mockDAI.sol";
import {mockUSDC} from "../src/MockTokens/mockUSDC.sol";
import {mockUSDT} from "../src/MockTokens/mockUSDT.sol";

contract DeploySkyRocket is Script {

    address[] public tokenAddresses;
    address public deployer = 0x2fAFA5Ce36B88693b446F1d1BFa9A2fdB63b47A2;

    function run() external {
        
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        mockDAI dai = new mockDAI(address(deployer));
        mockUSDC usdc = new mockUSDC(address(deployer));
        mockUSDT usdt = new mockUSDT(address(deployer));

        tokenAddresses.push(address(dai));
        tokenAddresses.push(address(usdc));
        tokenAddresses.push(address(usdt));

        Funding funding = new Funding(address(deployer), tokenAddresses);

        vm.stopBroadcast();
    }
}