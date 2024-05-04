import React, { useState } from "react";
import "./proposal.css";

const Form = () => {
  // State variables to store form data
  const [name, setName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can do something with the form data, like send it to a server
    console.log("Form submitted:", { name, projectTitle, description });
    // Clearing the form fields after submission
    setName("");
    setProjectTitle("");
    setDescription("");
  };

  return (
    
    <div className="form-container">
      <h2 className="form-heading">Submit Your Application</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Company Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="form-input" />
        </div>
        <div className="form-group">
          <label htmlFor="projectTitle" className="form-label">Project Title:</label>
          <input type="text" id="projectTitle" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} required className="form-input" />
        </div>
        <div className="form-group">

          <label htmlFor="description" className="form-label">Description:</label>
<div className="styleit">
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="form-textarea" />
        </div>
        </div>
        <button type="submit" className="form-button">Submit</button>
      </form>
    </div>
  );
};

export default Form;