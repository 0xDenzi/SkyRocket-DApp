import React, { useState } from "react";
import "./proposal.css";

const Form = () => {
  // State variables to store form data
  const [name, setName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can do something with the form data, like send it to a server
    console.log("Form submitted:", { name, projectTitle, description, goal });
    // Clearing the form fields after submission
    setName("");
    setProjectTitle("");
    setDescription("");
    setGoal("");
  };

  return (
    <div className="body-proposal">
      <div className="form-container">
        <h2 className="form-heading">Proposal Submission</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label"></label>
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
            <label htmlFor="projectTitle" className="form-label"></label>
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
            <label htmlFor="description" className="form-label"></label>
            <div className="styleit">
              <textarea
                id="description"
                placeholder="Description"
                style={{
                  textAlign: "center",
                  paddingLeft: 0,
                  height:"130px",
                  paddingRight: 0,
                }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="form-textarea"
              />
            </div>
          </div>
             <div className="containerLast">
          <textarea  id="goal"placeholder="Goal"  value={goal} onChange={(e) => setGoal(e.target.value)}required className="form-text"/>

           <textarea id="Deadline"placeholder="Deadline"value={deadline}onChange={(e) => setDeadline(e.target.value)}required className="form-textgoal"/> 
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