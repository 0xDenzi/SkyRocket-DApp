import React, { useState, useEffect } from 'react';
import "./ViewDetailProposal.css";
import styled from 'styled-components';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
  const { id } = useParams();
  const [proposal, setProposal] = useState({});
  const [likes, setLikes] = useState(0);
  const [duration, setDuration] = useState('');
  const [formattedDeadline, setFormattedDeadline] = useState('');

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/proposals/${id}`);
        const data = response.data;
        setProposal(data);
        setLikes(Number(data.likes) || 0);
        setFormattedDeadline(new Date(data.deadline).toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        }));
      } catch (error) {
        console.error('Error fetching proposal:', error);
      }
    };

    fetchProposal();
  }, [id]);
  
  useEffect(() => {
    const updateDuration = () => {
      if (proposal.deadline) {
        const deadlineDate = new Date(proposal.deadline);
        const now = new Date();
        const timeDiff = Math.max(deadlineDate - now, 0);  // Ensure no negative values
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setDuration(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    };

    const timer = setInterval(updateDuration, 1000);  // Update duration every second
    return () => clearInterval(timer);  // Clean up the interval on component unmount
  }, [proposal.deadline]);

  const handleLikeClick = async () => {
    const walletAddress = localStorage.getItem('walletAddress');
    if (!walletAddress) {
      console.log("No wallet connected");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/toggleLike', {
        projectTitle: proposal.project_title,
        userWalletAddress: walletAddress
      });

      // Update likes based on the backend response
      setLikes(response.data.newLikeStatus ? likes + 1 : likes - 1);
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };
  
  return (
    <div className="body-proposal">
      <div className="form-container">
        <h2 className="form-heading">Proposal Details</h2>
        <form>
          <div className="form-group">
          <h5 style={{
                textAlign: "left",
                paddingLeft: 2,
                paddingRight: 0,
              }}>Project Title</h5>
            <input
              type="text"
              id="projectTitle"
              style={{
                textAlign: "center",
                paddingLeft: 0,
                paddingRight: 0,
              }}
              placeholder="Sample Title"
              value={proposal.project_title || ''}
              readOnly
              className="form-input"
            />
          </div>

          <div className="form-group">
          <h5 style={{
                textAlign: "left",
                paddingLeft: 2,
                paddingRight: 0,
              }}>Company Name</h5>
            <input
              type="text"
              id="companyName"
              style={{
                textAlign: "center",
                paddingLeft: 0,
                paddingRight: 0,
              }}
              placeholder="XYZ Enterprise"
              value={proposal.company_name || ''}
              readOnly
              className="form-input"
            />
          </div>

          <div className="form-group">
          <h5 style={{
                textAlign: "left",
                paddingLeft: 2,
                paddingRight: 0,
              }}>Project Wallet Address</h5>
            <input
              type="text"
              id="walletAddress"
              style={{
                textAlign: "center",
                paddingLeft: 0,
                paddingRight: 0,
              }}
              placeholder="XYZ Enterprise Wallet Address"
              value={proposal.walletAddress || ''}
              readOnly
              className="form-input"
            />
          </div>

          <div className="form-group">
          <h5 style={{
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
              value={proposal.description || ''}
              readOnly
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <h5 style={{
                textAlign: "left",
                paddingLeft: 2,
                paddingRight: 0,
              }}>Goal Amount</h5>
            <input
              type="text"
              id="goalAmount"
              style={{
                textAlign: "center",
                paddingLeft: 0,
                paddingRight: 0,
              }}
              placeholder="Amount"
              value={"US$ " + proposal.goal_amount || ''}
              readOnly
              className="form-input"
            />
          </div>

          <div className="form-group">
          <h5 style={{
                textAlign: "left",
                paddingLeft: 2,
                paddingRight: 0,
              }}>Duration</h5>
            <input
              type="text"
              id="duration"
              style={{
                textAlign: "center",
                paddingLeft: 0,
                paddingRight: 0,
              }}
              placeholder="Duration"
              value={duration}
              readOnly
              className="form-input"
            />
          </div>

          <div className="form-group">
          <h5 style={{
                textAlign: "left",
                paddingLeft: 2,
                paddingRight: 0,
              }}>Deadline</h5>
            <input
              type="text"
              id="deadline"
              style={{
                textAlign: "center",
                paddingLeft: 0,
                paddingRight: 0,
              }}
              placeholder="Date"
              value={formattedDeadline}
              readOnly
              className="form-input"
            />
          </div>
        </form>
        <LikeButton onClick={handleLikeClick}>
        👍 <LikeCount>{likes}</LikeCount>
      </LikeButton>
      </div>
    </div>
  );
}

export default ViewDetailProposal;
