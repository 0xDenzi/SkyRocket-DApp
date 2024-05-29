import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom'; // Use Link for client-side navigation
import './fund.css'; // Importing CSS from App.css
import { BsFillRocketTakeoffFill } from "react-icons/bs";

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const location = useLocation();

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* MetaMask is installed */
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  return (
    <nav className="navbar-2">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" className="navbar-brand">
          Sky<span>Rocket</span>
          <BsFillRocketTakeoffFill />
        </Link>
        <div className="nav-links">
          <Link to="/fund" className={`nav-link ${location.pathname === "/fund" ? "active" : "inactive"}`}>Fund</Link>
          <Link to="/proposal" className={`nav-link ${location.pathname === "/proposal" ? "active" : "inactive"}`}>Proposal</Link>
        </div>
      </div>
      <button className="connect-wallet" onClick={connectWallet}>
        {walletAddress && walletAddress.length > 0
          ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
          : "Connect Wallet"}
      </button>
    </nav>
  );
};

export default Navbar;
