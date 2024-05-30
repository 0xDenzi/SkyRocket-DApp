import React from 'react';
import './AdminPortal.css'; // Ensure you link the CSS file correctly
import { BsFillRocketTakeoffFill } from "react-icons/bs";
import { Link, useLocation } from 'react-router-dom'; // Use Link for client-side navigation

const AdminPortal = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted');
    // Add logic to handle form submission
  };

  return (
    <div className='body-admin'>
  <div className="navbar-admin">
    <Link to="/" className="navbar-brand">
      Sky<span>Rocket</span>
      <BsFillRocketTakeoffFill />
    </Link>
    <button className="connect-wallet">Connect Wallet</button>
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


    // </div>
  );
};

export default AdminPortal;
