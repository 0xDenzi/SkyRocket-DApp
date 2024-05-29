import React from 'react';
import './AdminPortal.css'; // Ensure you link the CSS file correctly

const AdminPortal = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted');
    // Add logic to handle form submission
  };

  return (
    <div className='body-admin'> {/* Parent div wrapping all content */}
      <div className="navbar-admin">
        <h1>Admin Portal</h1>
        <button className="connect-wallet">Connect Wallet</button>
      </div>
      <div className="admin-portal">
        {/* <div className="outside-container"> */}
        <div className="vertical-container">
          <div className="section vertical-section">
            <input type="text" className="input-box" placeholder="Wallet Address" />
            <input type="text" className="input-box" placeholder="Goal Amount" />
            <input type="text" className="input-box" placeholder="Deadline" />
            <button className="button red-button">Add Project</button>
          </div>
          <div className="force-release-container">
            <button className="force-release-button">Force Release Funds</button>
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

        <div className="bottom-buttons">
          <button className="button red-button">Pause</button>
          <button className="button red-button">Unpause</button>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default AdminPortal;
