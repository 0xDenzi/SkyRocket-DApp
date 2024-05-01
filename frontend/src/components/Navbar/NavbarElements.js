import { FaBars } from "react-icons/fa";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";
import React, { useState } from 'react';

export const Nav = styled.nav`
	background: #282d37;
	height: 60px;
	display: flex;
	// justify-content: center;
	//padding: 0.2rem calc((100vw - 1000px) / 2);
	z-index: 12;
    //align-items: center;
`;

export const NavLink = styled(Link)`
	color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: space-between
	text-decoration: none;
	padding: 0 1rem;
	height: 100%;
	cursor: pointer;
	&.active {
		color: #4d4dff;
`;

export const NavLinkButton = styled(NavLink)`
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  background-color: transparent; /* Remove default button background */
  border: none; /* Remove default button border */
  outline: none; /* Remove default button outline */
  
  &:hover {
    background-color: #FFA500; /* Optional hover effect */
  }

  &.active {
    color: #4d4dff;
  }
`;

export const Bars = styled(FaBars)`
	display: none;
	color: #808080;
	@media screen and (max-width: 768px) {
		display: block;
		position: absolute;
		top: 0;
		right: 0;
		transform: translate(-100%, 75%);
		font-size: 1.8rem;
		cursor: pointer;
	}
`;

export const NavMenu = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end; /* Add this line to center align navbar elements */
	
white-space: nowrap; */
	@media screen and (max-width: 768px) {
		display: none;
	}
`;

export const LaunchButton = styled.button`
  background-color: orange; /* Set background color to orange */
  color: white; /* Set text color to white */
  padding: 10px 20px; /* Add padding */
  border: none; /* Remove default button border */
  border-radius: 5px; /* Add rounded corners */
  cursor: pointer; /* Make the button clickable */
  margin-left: 500px;
`;

export default { Nav, NavLink, NavMenu, LaunchButton, NavLinkButton };
