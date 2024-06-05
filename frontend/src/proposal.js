import React, { useState, useEffect } from 'react';
import "./proposal.css";
import axios from 'axios';

const Form = () => {
  // State variables to store form data
  const [name, setName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const walletAddress = localStorage.getItem('walletAddress');
    if (!walletAddress) {
      console.log("No wallet connected");
      return;
    }

    const formData = {
      project_title: name,
      company_name: projectTitle,
      description: description,
      goal_amount: parseInt(goal),
      deadline: deadline + "T23:59:59Z", // Formatting the deadline
      likes: 0, // Initial likes count
      walletAddress: walletAddress
    };

    try {
      const response = await axios.post('http://localhost:3000/api/proposals', formData);
      console.log('Form submitted:', response.data);
      // Clear the form fields after successful submission
      setName("");
      setProjectTitle("");
      setDescription("");
      setGoal("");
      setDeadline("");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
};

  const walletAddress = localStorage.getItem('walletAddress');
  if (!walletAddress) {
    console.log("No wallet connected");
    return;
  }

  return (
    <div className="body-proposal">
      <div className="form-container">
        <h2 className="form-heading">Proposal Submission</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
          <h5 className="form-label" style={{
                textAlign: "left",
                paddingLeft: 2,
                paddingRight: 0,
              }}>Project Title</h5>
            <input
              type="text"
              id="name"
              style={{
                textAlign: "center",
                paddingLeft: 0,
                paddingRight: 0,
              }}
              placeholder="Project Title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />
          </div>
  
          <div className="form-group">
            <h5 className="form-label" style={{
                textAlign: "left",
                paddingLeft: 2,
                paddingRight: 0,
              }}>Company Name</h5>
            <input
              type="text"
              id="projectTitle"
              style={{
                textAlign: "center",
                paddingLeft: 0,
                paddingRight: 0,
              }}
              placeholder="Company Name"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              required
              className="form-input"
            />
          </div>
  
          <div className="form-group">
          <h5 className="form-label" style={{
                textAlign: "left",
                paddingLeft: 2,
                paddingRight: 0,
              }}>Description</h5>
            <textarea
              id="description"
              placeholder="Description"
              style={{
                textAlign: "center",
                paddingLeft: 0,
                height: "130px",
                paddingRight: 0,
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="form-textarea"
            />
          </div>
  
          <div className="form-group">
          <h5 className="form-label" style={{
                textAlign: "left",
                paddingLeft: 2,
                paddingRight: 0,
              }}>Goal Amount</h5>
            <input
              type="text"
              id="goal"
              style={{
                textAlign: "center",
                paddingLeft: 0,
                paddingRight: 0,
              }}
              placeholder="Goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
              className="form-input"
            />
          </div>
  
          <div className="form-group">
          <h5 className="form-label" style={{
                textAlign: "left",
                paddingLeft: 2,
                paddingRight: 0,
              }}>Deadline</h5>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              className="form-input"
            />
          </div>
  
          <button type="submit" className="form-button">
            Create Proposal
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default Form;