import React, { useEffect, useState } from 'react';
import './AdminPortal.css'; // Ensure you link the CSS file correctly
import { BsFillRocketTakeoffFill } from "react-icons/bs";
import { Link, useLocation } from 'react-router-dom'; // Use Link for client-side navigation

const AdminPortal = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const location = useLocation();

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress("");
        }
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted');
  };

  return (
    <div className='body-admin'>
      <div className="navbar-admin">
        <Link to="/" className="navbar-brand">
          Sky<span>Rocket</span>
          <BsFillRocketTakeoffFill />
        </Link>
        <button className="connect-wallet" onClick={connectWallet}>
          {walletAddress ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
        </button>
      </div>
      <div className="admin-portal">
        <div className="horizontal-container">
          <div className="vertical-container">
            <div className="section vertical-section">
              <input type="text" className="input-box" placeholder="Wallet Address" />
              <input type="text" className="input-box" placeholder="Goal Amount" />
              <input type="text" className="input-box" placeholder="Deadline" />
              <button className="button red-button">Add Project</button>
            </div>
          </div>

          <div className="vertical-container">
            <div className="section vertical-section">
              <input type="text" className="input-box" placeholder="New Goal" />
              <button className="button red-button">Update Goals</button>
            </div>
            <div className="section vertical-section">
              <input type="text" className="input-box" placeholder="New Deadline" />
              <button className="button red-button">Extend Deadline</button>
            </div>
          </div>
        </div>

        <div className="funds-container">
          <button className="release-funds-button">Release Funds</button>
          <button className="force-release-button">Force Release Funds</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;