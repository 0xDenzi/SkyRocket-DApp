import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import FundingABI from '../../contracts/out/Funding.sol/Funding.json';

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
  color: #000000
`;

const FeeText = styled.span`
  color: #000000
`;

const Form1 = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';

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

    try {
      const tx = await contract.fundWithStableCoin(ethers.utils.getAddress(selectedToken), ethers.utils.parseUnits(fromAmount, 6));
      await tx.wait();
      console.log('Funded successfully:', tx);
    } catch (error) {
      console.error('Error funding:', error);
    }
  };

  return (
    <Wrapper>
      <SwapForm onSubmit={handleSubmit}>
        <InputContainer>
          <Input type="number" value={fromAmount} onChange={(e) => setFromAmount(e.target.value)} placeholder="0.00" />
          <Select onChange={(e) => setSelectedToken(e.target.value)}>
            <option value="0xADDRESS_FOR_USDC">USDC</option>
            <option value="0xADDRESS_FOR_DAI">DAI</option>
            <option value="0xADDRESS_FOR_USDT">USDT</option>
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
