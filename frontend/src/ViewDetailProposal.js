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

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/proposals/${id}`);
        setProposal(response.data);
        setLikes(Number(response.data.likes) || 0);  // Ensure likes is a number
      } catch (error) {
        console.error('Error fetching proposal:', error);
      }
    };
  
    fetchProposal();
  }, [id]);
  

  return (
    <div className="body-proposal">
      <div className="form-container">
        <h2 className="form-heading">Proposal Details</h2>
        <form>
          <div className="form-group">
          <h5>Project Title</h5>
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
          <h5>Company Name</h5>
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

          {/* <div className="form-group">
            <input
              type="text"
              id="walletAddress"
              style={{
                textAlign: "center",
                paddingLeft: 0,
                paddingRight: 0,
              }}
              placeholder="XYZ Enterprise Wallet Address"
              value={proposal.wallet_address || ''}
              readOnly
              className="form-input"
            />
          </div> */}

          <div className="form-group">
          <h5>Description</h5>
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
            <h5>Goal Amount</h5>
            <input
              type="text"
              id="goalAmount"
              style={{
                textAlign: "center",
                paddingLeft: 0,
                paddingRight: 0,
              }}
              placeholder="Amount"
              value={proposal.goal_amount || ''}
              readOnly
              className="form-input"
            />
          </div>

          {/* <div className="form-group">
            <input
              type="text"
              id="duration"
              style={{
                textAlign: "center",
                paddingLeft: 0,
                paddingRight: 0,
              }}
              placeholder="Duration"
              value={proposal.duration || ''}
              readOnly
              className="form-input"
            />
          </div> */}

          <div className="form-group">
          <h5>Deadline</h5>
            <input
              type="text"
              id="deadline"
              style={{
                textAlign: "center",
                paddingLeft: 0,
                paddingRight: 0,
              }}
              placeholder="Date"
              value={proposal.deadline || ''}
              readOnly
              className="form-input"
            />
          </div>
        </form>
        <LikeButton onClick={() => setLikes((prevLikes) => prevLikes + 1)}>
          👍
          <LikeCount>{likes}</LikeCount>
        </LikeButton>
      </div>
    </div>
  );
}

export default ViewDetailProposal;
