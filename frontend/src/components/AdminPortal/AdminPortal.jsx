import React, { useEffect, useState } from 'react';
import './AdminPortal.css';
import { BsFillRocketTakeoffFill } from "react-icons/bs";
import { Link, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import ProjectContract from '../../abis/Project.json';

const AdminPortal = () => {
  const [contract, setContract] = useState(null);
  //const [walletAddress, setWalletAddress] = useState("");
  const [navbarWalletAddress, setNavbarWalletAddress] = useState(""); // Separate state for the navbar wallet
  const [formWalletAddress, setFormWalletAddress] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  // Initialize when component mounts
  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, []);

  // Function to manage connection to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setNavbarWalletAddress(accounts[0]); // Update the navbar wallet address
        console.log("Connected:", accounts[0]);
      } catch (err) {
        console.error("Error connecting:", err.message);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };

  // Function to fetch the current connected wallet
  const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setNavbarWalletAddress(accounts[0]); // Maintain this for the navbar
          console.log("Connected:", accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error("Error connecting:", err.message);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };

  // Add listener for account changes
  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setNavbarWalletAddress(accounts[0]); // Update the navbar wallet address here
          console.log("Updated:", accounts[0]);
        } else {
          setNavbarWalletAddress("");
          console.log("Please connect to MetaMask");
        }
      });
    }
  };

  useEffect(() => {
    if (navbarWalletAddress && ethers.utils.isAddress(navbarWalletAddress)) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        '0xBe1A84a1c750A9Be22777DB92da4024D2A0f0689', // project contract address
        ProjectContract.abi,
        signer
      );
      setContract(contractInstance);
    }
  }, [navbarWalletAddress]);

  // Existing functionalities remain the same
  const addProject = async () => {
    if (contract) {
      const parsedGoalAmount = ethers.utils.parseUnits(goalAmount, 6);
      await contract.addProject(formWalletAddress, parsedGoalAmount, deadline);
    }
  };

  const updateGoals = async () => {
    if (contract) {
      const parsedNewGoal = ethers.utils.parseUnits(newGoal, 6);
      await contract.updateGoals(parsedNewGoal);
    }
  };

  const extendDeadline = async () => {
    if (contract) {
      await contract.extendDeadline(newDeadline);
    }
  };

  const releaseFunds = async () => {
    if (contract) {
      await contract.releaseFunds();
    }
  };

  const forceReleaseFunds = async () => {
    if (contract) {
      await contract.forceReleaseFunds();
    }
  };

  return (
    <div className='body-admin'>
      <div className="navbar-admin">
        <Link to="/" className="navbar-brand">
          Sky<span>Rocket</span><BsFillRocketTakeoffFill />
        </Link>
        <button className="connect-wallet" onClick={connectWallet}>
          {navbarWalletAddress ? `Connected: ${navbarWalletAddress.substring(0, 6)}...${navbarWalletAddress.slice(-4)}` : "Connect Wallet"}
        </button>
      </div>
      <div className="admin-portal">
        <div className="horizontal-container">
          <div className="vertical-container">
          <div className="section vertical-section">
              <input type="text" className="input-box" placeholder="Wallet Address" value={formWalletAddress} onChange={(e) => setFormWalletAddress(e.target.value)} />
              <input type="number" className="input-box" placeholder="Goal Amount" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} />
              <input type="number" className="input-box" placeholder="Deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              <button className="button red-button" onClick={() => addProject(formWalletAddress, goalAmount, deadline)}>Add Project</button>
            </div>
          </div>

          <div className="vertical-container">
            <div className="section vertical-section">
              <input type="text" className="input-box" placeholder="New Goal" value={newGoal} onChange={(e) => setNewGoal(e.target.value)} />
              <button className="button red-button" onClick={updateGoals}>Update Goals</button>
            </div>
            <div className="section vertical-section">
              <input type="text" className="input-box" placeholder="New Deadline" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} />
              <button className="button red-button" onClick={extendDeadline}>Extend Deadline</button>
            </div>
          </div>
        </div>

        <div className="funds-container">
          <button className="force-release-button" onClick={forceReleaseFunds}>Force Release Funds</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
