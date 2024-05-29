// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Funding} from "../src/Funding.sol";
import {SkyRocketToken} from "../src/SkyRocketToken.sol";
import {Project} from "../src/Project.sol";
import {mockDAI} from "../src/MockTokens/mockDAI.sol";
import {mockUSDC} from "../src/MockTokens/mockUSDC.sol";
import {mockUSDT} from "../src/MockTokens/mockUSDT.sol";
import {Test} from "../lib/forge-std/src/Test.sol";
import {console} from "../lib/forge-std/src/console.sol";

contract FundingTest is Test {
    Funding funding;
    Project project;
    mockDAI mockdai;
    mockUSDC mockusdc;
    mockUSDT mockusdt;
    address user;
    address deployer;

    address[] public allowedToken;
    function setUp() external {
        user = makeAddr("1");
        deployer = makeAddr("2");

        mockdai = new mockDAI(address(deployer));
        mockusdc = new mockUSDC(address(deployer));
        mockusdt = new mockUSDT(address(deployer));

        allowedToken.push(address(mockdai));
        allowedToken.push(address(mockusdc));
        allowedToken.push(address(mockusdt));

        console.log("Pass");

        funding = new Funding(address(deployer), allowedToken);

        address project = 0xDD4c722d1614128933d6DC7EFA50A6913e804E12;

        vm.prank(deployer);
        mockdai.transfer(address(user), 100e6);

        vm.prank(user);
        mockdai.approve(address(project), 100e6);
        
    }

    function testUserDeposit() public {
        vm.prank(user);
        funding.fundWithStableCoin(address(mockdai), 50e6);
        vm.stopPrank();
    }

}
