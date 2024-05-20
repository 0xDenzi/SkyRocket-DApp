import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import FundingABI from '../src/abis/Funding.json';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px;
`;

const SwapForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 400px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const InputLabel = styled.label`
  flex: 0 0 30%;
  font-weight: bold;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #282d37;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const SwapInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #ccc;
  margin-top: 0.5rem;
`;

const SwapInfoText = styled.span`
  color: #000000;
`;

const FeeText = styled.span`
  color: #000000;
`;

const Form1 = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('0x88DD019E2070E61B0300c9F1206a7265eb322122'); // USDC token address
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const ERC20_ABI = [
    // Only include the functions you need
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)"
  ];
  

  const contractAddress = '0xB19aB8f4024D1F2fF24932F6622B906439e08d27'; // funding.sol

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, FundingABI.abi, signer);
      setProvider(provider);
      setSigner(signer);
      setContract(contract);
    } else {
      console.error('Please install MetaMask!');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!contract) return;
  
    const tokenContract = new ethers.Contract(selectedToken, ERC20_ABI, signer);
    const fundingAmount = ethers.utils.parseUnits(fromAmount, 6); // Adjust the '6' based on the token's decimals
  
    try {
      // Check current allowance
      const allowance = await tokenContract.allowance(signer.getAddress(), contract.address);
      if (allowance.lt(fundingAmount)) {
        // Not enough allowance, need to approve
        const approveTx = await tokenContract.approve(contract.address, fundingAmount);
        await approveTx.wait();
        console.log('Approval successful');
      }
  
      // Proceed to fund
      const fundTx = await contract.fundWithStableCoin(
        ethers.utils.getAddress(selectedToken),
        fundingAmount,
        { gasLimit: 5000000 } // Optional: Adjust gas limit as necessary
      );
      await fundTx.wait();
      console.log('Funded successfully:', fundTx);
    } catch (error) {
      console.error('Error during the funding process:', error);
    }
  };
  
  

  return (
    <Wrapper>
      <SwapForm onSubmit={handleSubmit}>
        <InputContainer>
          <Input type="number" value={fromAmount} onChange={(e) => setFromAmount(e.target.value)} placeholder="0.00" />
          <Select onChange={(e) => setSelectedToken(e.target.value)}>
            <option value="0x88DD019E2070E61B0300c9F1206a7265eb322122">USDC</option> 
            <option value="0x387Ac9a53478308FB12580Ce82a798De78670830">DAI</option>
            <option value="0x34c1ec11E2c50799e2B65CF996dF9CE09B296D39">USDT</option>
          </Select>
        </InputContainer>
        <SwapInfo>
          <SwapInfoText>1 ETH = 0.0000 USDC (15%)</SwapInfoText>
          <FeeText>Fee: - ETH</FeeText>
        </SwapInfo>
        <Button type="submit">Fund</Button>
      </SwapForm>
    </Wrapper>
  );
};

export default Form1;
