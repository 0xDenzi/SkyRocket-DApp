import React, { useState, useEffect } from 'react';
import "./ViewDetailProposal.css";
import styled from 'styled-components';
import axios from 'axios';

// Styled components
const LikeButton = styled.button`
  background-color: transparent;
  border: none;
  color: #FF531F;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-top: 10px;

  &:hover {
    color: #e74c3c;
  }
`;

const LikeCount = styled.span`
  margin-left: 5px;
`;

const ViewDetailProposal = () => {
  // State variables to store form data
  const [name, setName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    // Fetch initial like count if needed from the server or a database
    const fetchLikes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/likes'); // Replace with your endpoint
        setLikes(response.data.likes);
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };
    fetchLikes();
  }, []);

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

  const handleLikeClick = () => {
    setLikes((prevLikes) => prevLikes + 1);
    // Optionally, send the updated like count to the server
    axios.post('http://localhost:3000/api/likes', { likes: likes + 1 }) // Replace with your endpoint
      .catch(error => console.error('Error updating likes:', error));
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
              placeholder="Sample Title"
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
              placeholder="XYZ Enterprise"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
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
              placeholder="XYZ Enterprise Wallet Address"
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
              <label htmlFor="projectTitle" className="form-label"></label>
              <input
                type="text"
                id="projectTitle"
                style={{
                  textAlign: "center",
                  paddingLeft: 0,
                  paddingRight: 0,
                }}
                placeholder="Amount"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
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
                placeholder="Duration"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
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
                placeholder="Date"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>
        </form>
        <LikeButton onClick={handleLikeClick}>
          👍
          <LikeCount>{likes}</LikeCount>
        </LikeButton>
      </div>
    </div>
  );
}

export default ViewDetailProposal;
