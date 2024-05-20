import React from "react";
import { useEffect, useState } from "react";
import { Nav, NavLink, NavMenu, LaunchButton, NavLinkButton } from "./Navbar/NavbarElements";
import { Link } from 'react-router-dom'; // Use Link for client-side navigation
import './App.css'; // Importing CSS from App.css

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState("");

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
    <>
      <Nav style={{ display: "flex" }}>
        <NavMenu style={{ width: "100%", display: 'flex', justifyContent: 'space-between' }}>
          <NavLink style={{ marginRight: '100px', textDecoration: 'none' }} to="/home" activeStyle>
            {/* Uncomment the logo and text as needed */}
            {/* <img src={logo} style={{ height: "50%" }} /> */}
            {/* SkyRocket */}
          </NavLink>
          
          <div style={{
            display: "flex",
            alignItems: "center",
          }}>
            <NavLinkButton to="/fund">Fund</NavLinkButton>
            <NavLinkButton to="/governance">Governance</NavLinkButton>
          </div>
          <LaunchButton className="button is-white connect-wallet" onClick={connectWallet} style={{ margin: '0px 60px 0 0' }}>
            <span className="is-link has-text-weight-bold">
              {walletAddress && walletAddress.length > 0
                ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`
                : "Connect Wallet"}
            </span>
          </LaunchButton>
        </NavMenu>
      </Nav>
    </>
  );
};

export default Navbar;
