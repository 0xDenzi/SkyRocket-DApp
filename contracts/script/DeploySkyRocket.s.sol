// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {SkyRocketToken} from "../src/SkyRocketToken.sol";
import {Funding} from "../src/Funding.sol";
import {Project} from "../src/Project.sol";

contract DeploySkyRocket is Script {

    address public deployer = 0x2fAFA5Ce36B88693b446F1d1BFa9A2fdB63b47A2;
    address[] public tokenAddresses;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Assuming the addresses of the deployed tokens are known
        address daiAddress = 0x2BD311122823a95fd28f534814bd38C458948dC4; // Replace with actual address
        address usdcAddress = 0xD2dE6032b0BC2aCC3D5a03Df8b024fA4FaC7B0a9; // Replace with actual address
        address usdtAddress = 0xd6fDaA3a7535372B568476c2B6ea1C11a16a1e44; // Replace with actual address

        tokenAddresses.push(daiAddress);
        tokenAddresses.push(usdcAddress);
        tokenAddresses.push(usdtAddress);

        Funding funding = new Funding(address(deployer), tokenAddresses);

        // Additional setup steps, such as creating liquidity pairs, would go here.

        vm.stopBroadcast();
     }
}