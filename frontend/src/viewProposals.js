import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Styled components
const OuterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 93.8vh;
  padding: 50px;
  background: hsla(215, 41%, 16%, 1);
  background: radial-gradient(circle, hsla(215, 41%, 16%, 1) 34%, hsla(273, 16%, 22%, 1) 74%, hsla(198, 31%, 48%, 1) 100%);
  background: -moz-radial-gradient(circle, hsla(215, 41%, 16%, 1) 34%, hsla(273, 16%, 22%, 1) 74%, hsla(198, 31%, 48%, 1) 100%);
  background: -webkit-radial-gradient(circle, hsla(215, 41%, 16%, 1) 34%, hsla(273, 16%, 22%, 1) 74%, hsla(198, 31%, 48%, 1) 100%);
  filter: progid: DXImageTransform.Microsoft.gradient(startColorstr="#182639", endColorstr="#3A3042", GradientType=1);
  overflow: hidden;
`;

const Wrapper = styled.div`
  width: 800px;
  background-color: #131722;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 8px 2px #558aa0;
  position: relative; // Added to position the submit button absolutely within the wrapper
`;

const SubmitButton = styled.button`
  position: absolute;
  bottom: 10px; // Adjust according to your layout
  right: 10px; // Adjust according to your layout
  background-color: #FF531F;
  border: none;
  color: white;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 5px;

  &:hover {
    background-color: #e74c3c;
  }
`;

const Header = styled.div`
  background-color: #282d37;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  text-align: center;
  color: white;
`;

const ProposalList = styled.div`
  padding: 20px;
`;

const ProposalItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #7f8c8d;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #2c3e50;
  }
`;

const ProposalDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProposalTitle = styled.div`
  font-weight: bold;
`;

const ProposalDate = styled.div`
  font-size: 0.9em;
  color: #7f8c8d;
`;

const ProposalActions = styled.div`
  display: flex;
  align-items: center;
`;

const LikeButton = styled.button`
  background-color: transparent;
  border: none;
  color: #FF531F;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    color: #e74c3c;
  }
`;

const LikeCount = styled.span`
  margin-left: 5px;
`;

const ActionButton = styled.button`
  background-color: #FF531F;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  margin-left: 10px;

  &:hover {
    background-color: #e74c3c;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0;
`;

const PageButton = styled.button`
  background-color: #7f8c8d;
  border: none;
  color: white;
  cursor: pointer;
  padding: 10px;
  margin: 0 5px;
  border-radius: 5px;

  &:hover {
    background-color: #e74c3c;
  }

  &:disabled {
    background-color: #FF531F;
    cursor: not-allowed;
  }
`;

const ViewProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const proposalsPerPage = 4;
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/proposals');
        const data = response.data.map((proposal) => ({
          id: proposal._id,
          title: proposal.project_title,  // Ensure the property name matches what's returned from the API
          dateCreated: new Date(proposal.deadline).toLocaleDateString(),
          likes: proposal.likes,
        }));
        setProposals(data);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      }
    };
    fetchProposals();
  }, []);

  const handleProposalClick = (id) => {
    navigate(`/viewdetailproposal/${id}`);
  };

  const handleLikeClick = async (id) => {
    const proposal = proposals.find(p => p.id === id);  // Find the proposal by ID
    if (!proposal) {
      console.error("Proposal not found");
      return;
    }

    const walletAddress = localStorage.getItem('walletAddress');
    if (!walletAddress) {
      console.log("No wallet connected");
      return;
    }

    console.log("Project title is:", proposal.title); // Check the title being passed

    try {
      const response = await axios.post('http://localhost:3000/api/toggleLike', {
        projectTitle: proposal.title,
        userWalletAddress: walletAddress
      });

      setProposals(prevProposals =>
        prevProposals.map(p =>
          p.id === id ? { ...p, likes: response.data.newLikeStatus ? p.likes + 1 : p.likes - 1 } : p
        )
      );
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const indexOfLastProposal = currentPage * proposalsPerPage;
  const indexOfFirstProposal = indexOfLastProposal - proposalsPerPage;
  const currentProposals = proposals.slice(indexOfFirstProposal, indexOfLastProposal);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(proposals.length / proposalsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <OuterContainer>
      <Wrapper>
        <Header>
          <h2>Project Proposals</h2>
        </Header>
        <ProposalList>
          {currentProposals.map((proposal) => (
            <ProposalItem key={proposal.id} onClick={() => handleProposalClick(proposal.id)}>
              <ProposalDetails>
                <ProposalTitle>{proposal.title}</ProposalTitle>
                <ProposalDate>{proposal.dateCreated}</ProposalDate>
              </ProposalDetails>
              <ProposalActions>
                <LikeButton onClick={(e) => { e.stopPropagation(); handleLikeClick(proposal.id); }}>
                  👍 <LikeCount>{proposal.likes}</LikeCount>
                </LikeButton>
                <ActionButton>View</ActionButton>
              </ProposalActions>
            </ProposalItem>
          ))}
        </ProposalList>
        <Pagination>
          {pageNumbers.map(number => (
            <PageButton key={number} onClick={() => setCurrentPage(number)}
                        disabled={currentPage === number}>
              {number}
            </PageButton>
          ))}
        </Pagination>
        <SubmitButton onClick={() => navigate('/createproposal')}>Submit Proposal</SubmitButton>
      </Wrapper>
    </OuterContainer>
  );
};

export default ViewProposals;
