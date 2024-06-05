// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Funding} from "../src/Funding.sol";
import {SkyRocketToken} from "../src/SkyRocketToken.sol";
import {Project} from "../src/Project.sol";
import {mockDAI} from "../src/MockTokens/mockDAI.sol";
import {mockUSDC} from "../src/MockTokens/mockUSDC.sol";
import {mockUSDT} from "../src/MockTokens/mockUSDT.sol";
// import {DeploySkyRocket} from "../script/DeploySkyRocket.s.sol";
import {Test} from "../lib/forge-std/src/Test.sol";
import {console} from "../lib/forge-std/src/console.sol";


contract FundingTest is Test {
    Funding funding;
    Project project;
    SkyRocketToken sktToken;
    //DeploySkyRocket deployScript;
    mockDAI mockdai;
    mockUSDC mockusdc;
    mockUSDT mockusdt;
    address user;
    address deployer;
    address projectAddress;

    address[] public allowedToken;
    function setUp() external {
        user = makeAddr("1");
        deployer = makeAddr("2");
        projectAddress = makeAddr("prAd");

        mockdai = new mockDAI(address(deployer));
        mockusdc = new mockUSDC(address(deployer));
        mockusdt = new mockUSDT(address(deployer));

        allowedToken.push(address(mockdai));
        allowedToken.push(address(mockusdc));
        allowedToken.push(address(mockusdt));

        console.log("Pass");

        funding = new Funding(address(deployer), allowedToken);

        sktToken = SkyRocketToken(0x5B0091f49210e7B2A57B03dfE1AB9D08289d9294);
        project = Project(0xDD4c722d1614128933d6DC7EFA50A6913e804E12);

        vm.prank(deployer);
        mockdai.transfer(address(user), 100e6);

        vm.prank(user);
        mockdai.approve(address(project), 100e6);

        // deployScript = new DeploySkyRocket();
        
    }


    /////////////////////////////////////////////
    /////////// Tests that should fail //////////
    ////////////////////////////////////////////

    function testUserDepositWithUnAllowedToken() public {
        vm.prank(user);
        vm.expectRevert();
        funding.fundWithStableCoin(address(sktToken), 50e6);
        vm.stopPrank();
        
    }

    function testUserDepositWithLessThan1() public {
        vm.prank(user);
        vm.expectRevert();
        funding.fundWithStableCoin(address(mockdai),1e5);
        vm.stopPrank();
    }

    function testUserDepositWhenPaused() public {
        vm.prank(user);
        vm.expectRevert();
        funding.fundWithStableCoin(address(mockdai), 50e6);
        vm.stopPrank();
    }

    function testUserMintsSKTDirectly() public {
        vm.prank(user);
        vm.expectRevert();
        sktToken.mint(user, 100e6);
        vm.stopPrank();
    }

    function testUserAddsProject() public {
        vm.prank(user);
        vm.expectRevert();
        project.addProject(address(projectAddress), 1000e6, block.timestamp + 14 days);
        vm.stopPrank();
    }

    function testUserFundsDirectlyToProject() public {
        vm.prank(deployer);
        project.addProject(address(projectAddress), 1000e6, block.timestamp + 14 days);
        vm.stopPrank();

        vm.prank(user);
        vm.expectRevert();
        project.fundsAccumulation(address(user), address(mockdai), 50e6);
        vm.stopPrank();
    }

    function testUserGetsCurrentProjectDetailsWithNoProject() public {
        vm.prank(user);
        vm.expectRevert();
        project.currentProjectDetails();
        vm.stopPrank();
    }

    modifier addProject() {
        vm.prank(deployer);
        project.addProject(address(projectAddress), 1000e6, block.timestamp + 14 days);
        vm.stopPrank();
        _;
    }

    function testUserUpdatesGoals() public addProject {
        vm.prank(user);
        vm.expectRevert();
        project.updateGoals(2000e6);
        vm.stopPrank();
    }

    function testUserUpdatesDeadline() public addProject {
        vm.prank(user);
        vm.expectRevert();
        project.extendDeadline(block.timestamp + 6 days);
        vm.stopPrank();
    }

    function testAdminExtendsDeadline6Days() public addProject {
        vm.prank(deployer);
        vm.expectRevert();
        project.extendDeadline(block.timestamp + 6 days);
        vm.stopPrank();
    }

    function testAdminAddProjectWithAddress0() public {
        vm.prank(deployer);
        vm.expectRevert();
        project.addProject(address(0), 1000e6, block.timestamp + 14 days);
        vm.stopPrank();
    }

    function testAdminProjectWithLessDeadline() public {
        vm.prank(deployer);
        vm.expectRevert();
        project.addProject(address(projectAddress), 1000e6, block.timestamp + 1 days);
        vm.stopPrank();
    }

    function testSimulateProcedureWithAdminReleaseEarly() public addProject {
        address funder0 = makeAddr("funder0");
        address funder1 = makeAddr("funder1");
        address funder2 = makeAddr("funder2");
        address funder3 = makeAddr("funder3");

        vm.startPrank(deployer);
        mockusdc.transfer(funder0, 500e6);
        mockdai.transfer(funder1, 500e6);
        mockusdt.transfer(funder2, 500e6);
        mockusdc.transfer(funder3, 500e6);
        mockdai.transfer(funder3, 500e6);
        mockusdt.transfer(funder3, 500e6);
        vm.stopPrank();

        vm.startPrank(funder0);
        mockusdc.approve(address(project), 400e6);
        funding.fundWithStableCoin(address(mockusdc), 400e6);
        vm.stopPrank();

        vm.startPrank(funder1);
        mockdai.approve(address(project), 300e6);
        funding.fundWithStableCoin(address(mockdai), 300e6);
        vm.stopPrank();

        vm.startPrank(funder2);
        mockusdt.approve(address(project), 300e6);
        funding.fundWithStableCoin(address(mockusdt), 300e6);
        vm.stopPrank();

        assert(sktToken.balanceOf(address(funder0)) == 400e6);
        assert(sktToken.balanceOf(address(funder1)) == 300e6);
        assert(sktToken.balanceOf(address(funder2)) == 300e6);

        project.currentProjectDetails();

        vm.prank(deployer);
        vm.expectRevert();
        vm.stopPrank();
    }

    function testSimulateProcedureWithAdminReleaseLowAmount() public addProject {
        address funder0 = makeAddr("funder0");
        address funder1 = makeAddr("funder1");
        address funder2 = makeAddr("funder2");
        address funder3 = makeAddr("funder3");

        vm.startPrank(deployer);
        mockusdc.transfer(funder0, 500e6);
        mockdai.transfer(funder1, 500e6);
        mockusdt.transfer(funder2, 500e6);
        mockusdc.transfer(funder3, 500e6);
        mockdai.transfer(funder3, 500e6);
        mockusdt.transfer(funder3, 500e6);
        vm.stopPrank();

        vm.startPrank(funder0);
        mockusdc.approve(address(project), 400e6);
        funding.fundWithStableCoin(address(mockusdc), 400e6);
        vm.stopPrank();

        vm.startPrank(funder1);
        mockdai.approve(address(project), 300e6);
        funding.fundWithStableCoin(address(mockdai), 300e6);
        vm.stopPrank();

        assert(sktToken.balanceOf(address(funder0)) == 400e6);
        assert(sktToken.balanceOf(address(funder1)) == 300e6);

        project.currentProjectDetails();

        vm.warp(block.timestamp + 15 days);

        vm.prank(deployer);
        vm.expectRevert();
        vm.stopPrank();
    }

    function testAdminUpdate0GoalAmount() public addProject {
        vm.prank(deployer);
        vm.expectRevert();
        project.updateGoals(0);
        vm.stopPrank();
    }

    /////////////////////////////////////////////
    /////////// Tests that should pass //////////
    ////////////////////////////////////////////

    function testUserReturnDecimals() public {
        vm.prank(user);
        sktToken.decimals();
        vm.stopPrank();
    }

    function testCurrentProjectDetails() public addProject {
        vm.prank(user);
        project.currentProjectDetails();
        vm.stopPrank();
    }

    function testAdminUpdateGoalAmount() public addProject {
        vm.prank(deployer);
        project.updateGoals(2000e6);
        vm.stopPrank();
    }

    function testAdminExtendDeadlineProperly() public addProject {
        vm.prank(deployer);
        project.extendDeadline(block.timestamp + 21 days);
        vm.stopPrank();
    }

    function testSKYROCKETDecimals() public {
        vm.prank(user);
        sktToken.decimals();
    }

    function testFundingMintsSKT() public {
        vm.prank(address(funding));
        sktToken.mint(address(user), 10e18);
        vm.stopPrank();
    }


    function testSimulateProcedureWithDefaultRelease() public addProject {
        address funder0 = makeAddr("funder0");
        address funder1 = makeAddr("funder1");
        address funder2 = makeAddr("funder2");
        address funder3 = makeAddr("funder3");

        vm.startPrank(deployer);
        mockusdc.transfer(funder0, 500e6);
        mockdai.transfer(funder1, 500e6);
        mockusdt.transfer(funder2, 500e6);
        mockusdc.transfer(funder3, 500e6);
        mockdai.transfer(funder3, 500e6);
        mockusdt.transfer(funder3, 500e6);
        vm.stopPrank();

        vm.startPrank(funder0);
        mockusdc.approve(address(project), 400e6);
        funding.fundWithStableCoin(address(mockusdc), 400e6);
        vm.stopPrank();

        vm.startPrank(funder1);
        mockdai.approve(address(project), 300e6);
        funding.fundWithStableCoin(address(mockdai), 300e6);
        vm.stopPrank();

        vm.startPrank(funder2);
        mockusdt.approve(address(project), 300e6);
        funding.fundWithStableCoin(address(mockusdt), 300e6);
        vm.stopPrank();

        assert(sktToken.balanceOf(address(funder0)) == 400e6);
        assert(sktToken.balanceOf(address(funder1)) == 300e6);
        assert(sktToken.balanceOf(address(funder2)) == 300e6);

        assert(mockusdc.balanceOf(address(address(projectAddress))) == 400e6);
        assert(mockdai.balanceOf(address(address(projectAddress))) == 300e6);
        assert(mockusdt.balanceOf(address(address(projectAddress))) == 300e6);
    }

    function testSimulateProcedureWithAdminForceRelease() public addProject {
        address funder0 = makeAddr("funder0");
        address funder1 = makeAddr("funder1");
        address funder2 = makeAddr("funder2");
        address funder3 = makeAddr("funder3");

        vm.startPrank(deployer);
        mockusdc.transfer(funder0, 500e6);
        mockdai.transfer(funder1, 500e6);
        mockusdt.transfer(funder2, 500e6);
        mockusdc.transfer(funder3, 500e6);
        mockdai.transfer(funder3, 500e6);
        mockusdt.transfer(funder3, 500e6);
        vm.stopPrank();

        vm.startPrank(funder0);
        mockusdc.approve(address(project), 400e6);
        funding.fundWithStableCoin(address(mockusdc), 400e6);
        vm.stopPrank();

        vm.startPrank(funder1);
        mockdai.approve(address(project), 300e6);
        funding.fundWithStableCoin(address(mockdai), 300e6);
        vm.stopPrank();


        assert(sktToken.balanceOf(address(funder0)) == 400e6);
        assert(sktToken.balanceOf(address(funder1)) == 300e6);

        project.currentProjectDetails();

        vm.prank(deployer);
        project.forceReleaseFunds();
        vm.stopPrank();

        assert(mockusdc.balanceOf(address(address(projectAddress))) == 400e6);
        assert(mockdai.balanceOf(address(address(projectAddress))) == 300e6);
    }

    function testSimulateProcedureWithReleaseAndUserDeposits() public addProject {
        address funder0 = makeAddr("funder0");
        address funder1 = makeAddr("funder1");
        address funder2 = makeAddr("funder2");
        address funder3 = makeAddr("funder3");

        vm.startPrank(deployer);
        mockusdc.transfer(funder0, 500e6);
        mockdai.transfer(funder1, 500e6);
        mockusdt.transfer(funder2, 500e6);
        mockusdc.transfer(funder3, 500e6);
        mockdai.transfer(funder3, 500e6);
        mockusdt.transfer(funder3, 500e6);
        vm.stopPrank();

        vm.startPrank(funder0);
        mockusdc.approve(address(project), 400e6);
        funding.fundWithStableCoin(address(mockusdc), 400e6);
        vm.stopPrank();

        vm.startPrank(funder1);
        mockdai.approve(address(project), 300e6);
        funding.fundWithStableCoin(address(mockdai), 300e6);
        vm.stopPrank();


        assert(sktToken.balanceOf(address(funder0)) == 400e6);
        assert(sktToken.balanceOf(address(funder1)) == 300e6);

        project.currentProjectDetails();

        vm.prank(deployer);
        project.forceReleaseFunds();
        vm.stopPrank();

        assert(mockusdc.balanceOf(address(address(projectAddress))) == 400e6);
        assert(mockdai.balanceOf(address(address(projectAddress))) == 300e6);

        vm.startPrank(funder3);
        mockusdc.approve(address(project), 400e6);
        vm.expectRevert();
        funding.fundWithStableCoin(address(mockusdc), 400e6);
        vm.stopPrank();

    }

    function testSimulateProcedureWithAdminReleaseAndNewProject() public addProject {
        address funder0 = makeAddr("funder0");
        address funder1 = makeAddr("funder1");
        address funder2 = makeAddr("funder2");
        address funder3 = makeAddr("funder3");

        vm.startPrank(deployer);
        mockusdc.transfer(funder0, 500e6);
        mockdai.transfer(funder1, 500e6);
        mockusdt.transfer(funder2, 500e6);
        mockusdc.transfer(funder3, 500e6);
        mockdai.transfer(funder3, 500e6);
        mockusdt.transfer(funder3, 500e6);
        vm.stopPrank();

        vm.startPrank(funder0);
        mockusdc.approve(address(project), 400e6);
        funding.fundWithStableCoin(address(mockusdc), 400e6);
        vm.stopPrank();

        vm.startPrank(funder1);
        mockdai.approve(address(project), 300e6);
        funding.fundWithStableCoin(address(mockdai), 300e6);
        vm.stopPrank();

        vm.startPrank(funder2);
        mockusdt.approve(address(project), 300e6);
        funding.fundWithStableCoin(address(mockusdt), 300e6);
        vm.stopPrank();

        assert(sktToken.balanceOf(address(funder0)) == 400e6);
        assert(sktToken.balanceOf(address(funder1)) == 300e6);
        assert(sktToken.balanceOf(address(funder2)) == 300e6);

        project.currentProjectDetails();

        vm.warp(block.timestamp + 15 days);

        vm.prank(deployer);
        vm.stopPrank();

        assert(mockusdc.balanceOf(address(address(projectAddress))) == 400e6);
        assert(mockdai.balanceOf(address(address(projectAddress))) == 300e6);
        assert(mockusdt.balanceOf(address(address(projectAddress))) == 300e6);

        address projectAddress2 = makeAddr("prAd2");

        vm.prank(deployer);
        project.addProject(projectAddress2, 500e6, block.timestamp + 21 days);
        vm.stopPrank();
    }

    function testSimulateProcedureWithAdminReleaseUSDT() public addProject {
        address funder0 = makeAddr("funder0");
        address funder1 = makeAddr("funder1");
        address funder2 = makeAddr("funder2");
        address funder3 = makeAddr("funder3");

        vm.startPrank(deployer);
        mockusdc.transfer(funder0, 500e6);
        mockdai.transfer(funder1, 500e6);
        mockusdt.transfer(funder2, 500e6);
        mockusdc.transfer(funder3, 500e6);
        mockdai.transfer(funder3, 500e6);
        mockusdt.transfer(funder3, 500e6);
        vm.stopPrank();

        vm.startPrank(funder2);
        mockusdt.approve(address(project), 500e6);
        funding.fundWithStableCoin(address(mockusdt), 500e6);
        vm.stopPrank();

        vm.startPrank(funder3);
        mockusdt.approve(address(project), 500e6);
        funding.fundWithStableCoin(address(mockusdt), 500e6);
        vm.stopPrank();


        project.currentProjectDetails();

        vm.warp(block.timestamp + 15 days);

        vm.prank(deployer);
        vm.stopPrank();

        assert(mockusdt.balanceOf(address(address(projectAddress))) == 1000e6);
    }

    function testSimulateProcedureWithAdminReleaseUSDC() public addProject {
        address funder0 = makeAddr("funder0");
        address funder1 = makeAddr("funder1");
        address funder2 = makeAddr("funder2");
        address funder3 = makeAddr("funder3");

        vm.startPrank(deployer);
        mockusdc.transfer(funder0, 500e6);
        mockdai.transfer(funder1, 500e6);
        mockusdt.transfer(funder2, 500e6);
        mockusdc.transfer(funder3, 500e6);
        mockdai.transfer(funder3, 500e6);
        mockusdt.transfer(funder3, 500e6);
        vm.stopPrank();

        vm.startPrank(funder0);
        mockusdc.approve(address(project), 500e6);
        funding.fundWithStableCoin(address(mockusdc), 500e6);
        vm.stopPrank();

        vm.startPrank(funder3);
        mockusdc.approve(address(project), 500e6);
        funding.fundWithStableCoin(address(mockusdc), 500e6);
        vm.stopPrank();


        project.currentProjectDetails();

        vm.warp(block.timestamp + 15 days);

        vm.prank(deployer);
        vm.stopPrank();

        assert(mockusdc.balanceOf(address(address(projectAddress))) == 1000e6);
    }

    function testSimulateProcedureWithAdminReleaseDAI() public addProject {
        address funder0 = makeAddr("funder0");
        address funder1 = makeAddr("funder1");
        address funder2 = makeAddr("funder2");
        address funder3 = makeAddr("funder3");

        vm.startPrank(deployer);
        mockusdc.transfer(funder0, 500e6);
        mockdai.transfer(funder1, 500e6);
        mockusdt.transfer(funder2, 500e6);
        mockusdc.transfer(funder3, 500e6);
        mockdai.transfer(funder3, 500e6);
        mockusdt.transfer(funder3, 500e6);
        vm.stopPrank();

        vm.startPrank(funder1);
        mockdai.approve(address(project), 500e6);
        funding.fundWithStableCoin(address(mockdai), 500e6);
        vm.stopPrank();

        vm.startPrank(funder3);
        mockdai.approve(address(project), 500e6);
        funding.fundWithStableCoin(address(mockdai), 500e6);
        vm.stopPrank();


        project.currentProjectDetails();

        vm.warp(block.timestamp + 15 days);

        vm.prank(deployer);
        vm.stopPrank();

        assert(mockdai.balanceOf(address(address(projectAddress))) == 1000e6);
    }

    function testSimulateProcedureWithAdminForceReleaseDAI() public addProject {
        address funder0 = makeAddr("funder0");
        address funder1 = makeAddr("funder1");
        address funder2 = makeAddr("funder2");
        address funder3 = makeAddr("funder3");

        vm.startPrank(deployer);
        mockusdc.transfer(funder0, 500e6);
        mockdai.transfer(funder1, 500e6);
        mockusdt.transfer(funder2, 500e6);
        mockusdc.transfer(funder3, 500e6);
        mockdai.transfer(funder3, 500e6);
        mockusdt.transfer(funder3, 500e6);
        vm.stopPrank();

        vm.startPrank(funder1);
        mockdai.approve(address(project), 500e6);
        funding.fundWithStableCoin(address(mockdai), 500e6);
        vm.stopPrank();

        vm.startPrank(funder3);
        mockdai.approve(address(project), 500e6);
        funding.fundWithStableCoin(address(mockdai), 500e6);
        vm.stopPrank();


        project.currentProjectDetails();

        vm.warp(block.timestamp + 15 days);

        vm.prank(deployer);
        project.forceReleaseFunds();
        vm.stopPrank();

        assert(mockdai.balanceOf(address(address(projectAddress))) == 1000e6);
    }

    function testSimulateProcedureWithAdminForceReleaseUSDC() public addProject {
        address funder0 = makeAddr("funder0");
        address funder1 = makeAddr("funder1");
        address funder2 = makeAddr("funder2");
        address funder3 = makeAddr("funder3");

        vm.startPrank(deployer);
        mockusdc.transfer(funder0, 500e6);
        mockdai.transfer(funder1, 500e6);
        mockusdt.transfer(funder2, 500e6);
        mockusdc.transfer(funder3, 500e6);
        mockdai.transfer(funder3, 500e6);
        mockusdt.transfer(funder3, 500e6);
        vm.stopPrank();

        vm.startPrank(funder0);
        mockusdc.approve(address(project), 500e6);
        funding.fundWithStableCoin(address(mockusdc), 500e6);
        vm.stopPrank();

        vm.startPrank(funder3);
        mockusdc.approve(address(project), 500e6);
        funding.fundWithStableCoin(address(mockusdc), 500e6);
        vm.stopPrank();


        project.currentProjectDetails();

        vm.warp(block.timestamp + 15 days);

        vm.prank(deployer);
        project.forceReleaseFunds();
        vm.stopPrank();

        assert(mockusdc.balanceOf(address(address(projectAddress))) == 1000e6);
    }

    function testSimulateProcedureWithAdminForceReleaseUSDT() public addProject {
        address funder0 = makeAddr("funder0");
        address funder1 = makeAddr("funder1");
        address funder2 = makeAddr("funder2");
        address funder3 = makeAddr("funder3");

        vm.startPrank(deployer);
        mockusdc.transfer(funder0, 500e6);
        mockdai.transfer(funder1, 500e6);
        mockusdt.transfer(funder2, 500e6);
        mockusdc.transfer(funder3, 500e6);
        mockdai.transfer(funder3, 500e6);
        mockusdt.transfer(funder3, 500e6);
        vm.stopPrank();

        vm.startPrank(funder2);
        mockusdt.approve(address(project), 500e6);
        funding.fundWithStableCoin(address(mockusdt), 500e6);
        vm.stopPrank();

        vm.startPrank(funder3);
        mockusdt.approve(address(project), 500e6);
        funding.fundWithStableCoin(address(mockusdt), 500e6);
        vm.stopPrank();


        project.currentProjectDetails();

        vm.warp(block.timestamp + 9 days);

        vm.prank(deployer);
        project.forceReleaseFunds();
        vm.stopPrank();

        assert(mockusdt.balanceOf(address(address(projectAddress))) == 1000e6);
    }

    function testSimulateProcedureWithAdminForceReleaseUSDTandDAI() public addProject {
        address funder0 = makeAddr("funder0");
        address funder1 = makeAddr("funder1");
        address funder2 = makeAddr("funder2");
        address funder3 = makeAddr("funder3");

        vm.startPrank(deployer);
        mockusdc.transfer(funder0, 500e6);
        mockdai.transfer(funder1, 500e6);
        mockusdt.transfer(funder2, 500e6);
        mockusdc.transfer(funder3, 500e6);
        mockdai.transfer(funder3, 500e6);
        mockusdt.transfer(funder3, 500e6);
        vm.stopPrank();

        // vm.startPrank(funder1);
        // mockdai.approve(address(project), 500e6);
        // funding.fundWithStableCoin(address(mockdai), 500e6);
        // vm.stopPrank();

        vm.startPrank(funder3);
        mockusdt.approve(address(project), 500e6);
        funding.fundWithStableCoin(address(mockusdt), 500e6);
        vm.stopPrank();

        vm.startPrank(funder0);
        mockusdc.approve(address(project), 500e6);
        funding.fundWithStableCoin(address(mockusdc), 500e6);
        vm.stopPrank();


        project.currentProjectDetails();

        vm.warp(block.timestamp + 15 days);

        vm.prank(deployer);
        vm.stopPrank();
    }

    // function testDeploy() public {
    //     deployScript.run();
    // }

    

}
