import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import axios from 'axios';
import FundingABI from '../src/abis/Funding.json';
import usdcIcon from './Assests/usdc-icon.png';
import daiIcon from './Assests/dai-icon.png';
import usdtIcon from './Assests/usdt-icon.png';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #131722;
  border-radius: 20px;
  width: auto;
  overflow: hidden;
`;

const SwapForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 450px;
`;

const InputContainer = styled.div`
  background: #1c2028;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border: none;
`;

const Icon = styled.img`
  width: 24px;
  cursor: pointer;
`;

const CurrencyLabel = styled.span`
  color: #fff;
  margin-left: 10px;
  font-size: 1rem;
  cursor: pointer;
`;

const DropdownArrow = styled.span`
  margin-left: 5px;
  color: #fff;
  cursor: pointer;
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 35px;
  left: 0;
  background: #1c2028;
  border-radius: 5px;
  padding: 10px;
  display: ${props => (props.show ? 'block' : 'none')};
  z-index: 10;
`;

const DropdownItem = styled.div`
  padding: 5px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    background: #333;
  }
`;

const DropdownIcon = styled.img`
  width: 24px;
  margin-right: 5px;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 1rem;
  text-align: right;
  padding: 10px;
  margin: 0 10px;
  width: 100%;
  &:focus {
    outline: none;
  }
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Button = styled.button`
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const SwapInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #ccc;
  margin-top: 0.5rem;
`;

const SwapInfoText = styled.span`
  color: #fff;
`;

const FeeText = styled.span`
  color: #fff;
`;

const ErrorMessage = styled.div`
  color: orange;
  font-size: 0.75rem;
  font-family: Arial, sans-serif;
  text-align: left;
  margin-top: 5px;
`;

const Form2 = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('0x88DD019E2070E61B0300c9F1206a7265eb322122'); // USDC token address
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [fromAmountError, setFromAmountError] = useState('');
  const [gasPrice, setGasPrice] = useState('0');

  const ERC20_ABI = [
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

  useEffect(() => {
    const fetchGasPrice = async () => {
      const url = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;

      try {
        const response = await axios.get(url);
        const gasPrice = response.data.result.SafeGasPrice; // Use SafeGasPrice as the base fee in Gwei
        setGasPrice(gasPrice);
      } catch (error) {
        console.error('Error fetching gas price:', error);
      }
    };

    fetchGasPrice();
    const interval = setInterval(fetchGasPrice, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleTokenSelect = (token) => {
    setSelectedToken(token);
    setShowDropdown(false);
  };

  const handleFromAmountChange = (event) => {
    const value = event.target.value;
    setFromAmount(value);
    if (parseFloat(value) <= 0) {
      setFromAmountError('Input can not be 0 or negative');
    } else {
      setFromAmountError('');
    }
  };

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
          <DropdownContainer>
            <div onClick={() => setShowDropdown(!showDropdown)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              {selectedToken === '0x88DD019E2070E61B0300c9F1206a7265eb322122' && <Icon src={usdcIcon} alt="USDC" />}
              {selectedToken === '0x387Ac9a53478308FB12580Ce82a798De78670830' && <Icon src={daiIcon} alt="DAI" />}
              {selectedToken === '0x34c1ec11E2c50799e2B65CF996dF9CE09B296D39' && <Icon src={usdtIcon} alt="USDT" />}
              <CurrencyLabel>
                {selectedToken === '0x88DD019E2070E61B0300c9F1206a7265eb322122' && 'USDC'}
                {selectedToken === '0x387Ac9a53478308FB12580Ce82a798De78670830' && 'DAI'}
                {selectedToken === '0x34c1ec11E2c50799e2B65CF996dF9CE09B296D39' && 'USDT'}
              </CurrencyLabel>
              <DropdownArrow>▼</DropdownArrow>
            </div>
            <DropdownMenu show={showDropdown}>
              <DropdownItem onClick={() => handleTokenSelect('0x88DD019E2070E61B0300c9F1206a7265eb322122')}>
                <DropdownIcon src={usdcIcon} alt="USDC" /> USDC
              </DropdownItem>
              <DropdownItem onClick={() => handleTokenSelect('0x387Ac9a53478308FB12580Ce82a798De78670830')}>
                <DropdownIcon src={daiIcon} alt="DAI" /> DAI
              </DropdownItem>
              <DropdownItem onClick={() => handleTokenSelect('0x34c1ec11E2c50799e2B65CF996dF9CE09B296D39')}>
                <DropdownIcon src={usdtIcon} alt="USDT" /> USDT
              </DropdownItem>
            </DropdownMenu>
          </DropdownContainer>
          <Input type="number" value={fromAmount} onChange={handleFromAmountChange} placeholder="0.00" />
        </InputContainer>
        {fromAmountError && <ErrorMessage>{fromAmountError}</ErrorMessage>}
        <SwapInfo>
          <FeeText>Fee: {gasPrice} Gwei</FeeText>
        </SwapInfo>
        <Button type="submit">Fund</Button>
      </SwapForm>
    </Wrapper>
  );
};

export default Form2;
