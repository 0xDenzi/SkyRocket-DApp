    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.19;

    import {IERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

    contract Project {

        event ProjectAdded(address indexed projectWallet, uint256 indexed projectId, uint256 goalAmount, uint256 deadline);
        event Paused(bool indexed value);
        event Unpaused(bool indexed value);
        event TokensFunded(address indexed account, uint256 indexed projectId, address token, uint256 amount);
        event FundsReleased(address indexed receiver, uint256 projectId, uint256 amount);
        event ForceFundsReleased(address indexed receiver, uint256 projectId, uint256 amount);
        event GoalsUpdated(uint256 newGoalAmount);
        event DeadlineExtended(uint256 newDeadline);


        // Struct to handle projects
        struct raiseProjects {
            address projectWallet;
            uint256 goalAmount;
            uint256 deadline;
            uint256 amountRaised;
        }

        // mapping of an id to the struct
        mapping(uint256 => raiseProjects) projects;
        // Counter for projects, Always increasing
        uint256 public projectCounter;

        // address of admin
        address public admin;
        // address of funding contract
        address public funding;

        // Tokens
        address public mDAI;
        address public mUSDC;
        address public mUSDT;

        // Pause variable
        bool pause;

        /// @notice Initializes the SkyRocket Project Contract.
        /// @param  _admin            The address of the Admin.
        /// @param  _funding          The address of the Funding contract.
        /// @param  _allowedTokens    The addresses of the Allowed Tokens.
        constructor(
            address _admin,
            address _funding,
            address[] memory _allowedTokens
        ) {
            admin = _admin;
            funding = _funding;

            mDAI = _allowedTokens[0];
            mUSDC = _allowedTokens[1];
            mUSDT = _allowedTokens[2];

            pause = true;
        }

        /// @notice Modifier for onlyAdmin calls.
        modifier onlyAdmin() {
            require(msg.sender == admin, "Only Admin is allowed to call");
            _;
        }

        /// @notice Modifier for onlyFunding calls.
        modifier onlyFunding() {
            require(
                msg.sender == funding,
                "Only Funding Contract is allowed to call"
            );
            _;
        }

        modifier onlyUnpaused() {
            require(pause == false, "Funding is paused");
            _;
        }

        /// @notice Adds a project to this contract.
        /// @param  _projectWallet   The address of the fund seeker.
        /// @param  _goalAmount      The goal amount of funds desired.
        /// @param  _deadline        The deadline for the fundraising.
        function addProject(
            address _projectWallet,
            uint256 _goalAmount,
            uint256 _deadline
        ) external onlyAdmin {
            require(_projectWallet != address(0), "0 Address");
            require(
                _deadline >= block.timestamp + 14 days,
                "Deadline less than 14 days not allowed"
            );

            projects[projectCounter].projectWallet = _projectWallet;
            projects[projectCounter].goalAmount = _goalAmount;
            projects[projectCounter].deadline = _deadline;

            emit ProjectAdded(_projectWallet, projectCounter, _goalAmount, _deadline);
            projectCounter++;

            Unpause();
            emit Unpaused(pause);

            
        }

        /// @notice Transfers funds from user through the funding contract.
        /// @param  _account   The address of the funder.
        /// @param  _token     The token which is being funded.
        /// @param  _amount    The amount which is being funded.
        function fundsAccumulation(
            address _account,
            address _token,
            uint256 _amount
        ) external onlyFunding onlyUnpaused {
            IERC20(_token).transferFrom(_account, address(this), _amount);
            projects[projectCounter - 1].amountRaised += _amount;

            emit TokensFunded(_account, projectCounter - 1, _token, _amount);

            // If goal amount is reached upon funding from a user, transfer the amount collected
            if (projects[projectCounter - 1].amountRaised >= projects[projectCounter - 1].goalAmount)
            {
                address receiver = projects[projectCounter - 1].projectWallet;

                uint256 mDAIbalance = IERC20(mDAI).balanceOf(address(this));
                uint256 mUSDCbalance = IERC20(mUSDC).balanceOf(address(this));
                uint256 mUSDTbalance = IERC20(mUSDT).balanceOf(address(this));

                uint256 totalAmount = mDAIbalance + mUSDCbalance + mUSDTbalance;

                IERC20(mDAI).transfer(receiver, IERC20(mDAI).balanceOf(address(this)));
                IERC20(mUSDC).transfer(receiver,IERC20(mUSDC).balanceOf(address(this)));
                IERC20(mUSDT).transfer(receiver,IERC20(mUSDT).balanceOf(address(this)));
                

                emit FundsReleased(receiver, projectCounter - 1, totalAmount);

                Pause();
                emit Paused(pause);
            }

        }

        // /// @notice Transfers funds from this contract to the fundseekers.
        // function releaseFundsToProject() external onlyAdmin {
        //     require(block.timestamp > projects[projectCounter - 1].deadline,"Deadline not reached yet");
        //     require(projects[projectCounter - 1].amountRaised >=projects[projectCounter - 1].goalAmount,"Goal not reached yet");

        //     address receiver = projects[projectCounter - 1].projectWallet;

        //     uint256 mDAIbalance = IERC20(mDAI).balanceOf(address(this));
        //     uint256 mUSDCbalance = IERC20(mUSDC).balanceOf(address(this));
        //     uint256 mUSDTbalance = IERC20(mUSDT).balanceOf(address(this));

        //     uint256 totalAmount = mDAIbalance + mUSDCbalance + mUSDTbalance;

        //     IERC20(mDAI).transfer(receiver, IERC20(mDAI).balanceOf(address(this)));
        //     IERC20(mUSDC).transfer(receiver,IERC20(mUSDC).balanceOf(address(this)));
        //     IERC20(mUSDT).transfer(receiver,IERC20(mUSDT).balanceOf(address(this)));
            

        //     emit FundsReleased(receiver, projectCounter - 1, totalAmount);

        //     Pause();
        //     emit Paused(pause);
        // }

        /// @notice Force Transfers funds from this contract to the fundseekers.
        function forceReleaseFunds() external onlyAdmin {
            address receiver = projects[projectCounter - 1].projectWallet;

            uint256 mDAIbalance = IERC20(mDAI).balanceOf(address(this));
            uint256 mUSDCbalance = IERC20(mUSDC).balanceOf(address(this));
            uint256 mUSDTbalance = IERC20(mUSDT).balanceOf(address(this));

            uint256 totalAmount = mDAIbalance + mUSDCbalance + mUSDTbalance;

            IERC20(mDAI).transfer(receiver, IERC20(mDAI).balanceOf(address(this)));
            IERC20(mUSDC).transfer(receiver,IERC20(mUSDC).balanceOf(address(this)));
            IERC20(mUSDT).transfer(receiver,IERC20(mUSDT).balanceOf(address(this)));
            

            emit ForceFundsReleased(receiver, projectCounter - 1, totalAmount);

            Pause();
            emit Paused(pause);
        }

        /// @notice Allows updation of Goal Amount of the project.
        /// @param  _goalAmount   The new funding goal.
        function updateGoals(uint256 _goalAmount) external onlyAdmin {
            require(_goalAmount > 0, "Goal Amount can not be 0");
            projects[projectCounter - 1].goalAmount = _goalAmount;
            
            emit GoalsUpdated(_goalAmount);
        }

        /// @notice Allows updation of Deadline of the project.
        /// @param  _deadline   The new deadline.
        function extendDeadline(uint256 _deadline) external onlyAdmin {

            uint256 oldDeadline = projects[projectCounter - 1].deadline;
            require(_deadline >= oldDeadline + 7 days, "Deadline should be greater than or equal to current deadline + 7 days");

            projects[projectCounter - 1].deadline = _deadline;

            emit DeadlineExtended(_deadline);
        }

        /// @notice Returns information stored in struct of the project.
        /// @return address        The Address of the fundseeker/s.
        /// @return goalAmount     The Goal Amount of the project.
        /// @return amountRaised   The current amount raised.
        /// @return deadline       The Deadline of the project.
        function currentProjectDetails()
            external
            view
            returns (address, uint256, uint256, uint256)
        {
            require(pause == false, "No Ongoing Projects");
            return (
                projects[projectCounter - 1].projectWallet,
                projects[projectCounter - 1].goalAmount,
                projects[projectCounter - 1].amountRaised,
                projects[projectCounter - 1].deadline
            );
        }

        function Pause() private {
            pause = true;
        }

        function Unpause() private {
            pause = false;
        }
    }
