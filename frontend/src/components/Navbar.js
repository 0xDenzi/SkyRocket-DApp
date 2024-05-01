// Filename - "./components/Navbar.js

import React from "react";
import { Nav, NavLink, NavMenu, LaunchButton, NavLinkButton } from "./Navbar/NavbarElements";

// import logo from '../images/a.jpg'; 

const Navbar = () => {
	return (
		<>
			<Nav style={{ display: "flex"}}>
				<NavMenu style={{width: "100%", display:'flex', justifyContent:'space-between',}}>

					<NavLink style={{marginRight: '100px', textDecoration: 'none'}} to="/home" activeStyle>
						{/* <img src = {logo} style={{height: "50%", }}/> */}
						{/* SkyRocket */}
					</NavLink>
					
					<div style={{
						display:"flex",
						alignItems:"center",
					}}>
						<NavLinkButton to="/fund">Fund</NavLinkButton>
						<NavLinkButton to="/governance">Governance</NavLinkButton>
					
					</div>
						<LaunchButton style={{margin: '0px 60px 0 0'}}>Connect Wallet</LaunchButton>
				</NavMenu>
			</Nav>
		</>
	);
};

export default Navbar;
