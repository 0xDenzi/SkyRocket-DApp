import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ethIcon from './Assests/eth-icon.png';
import usdcIcon from './Assests/usdc-icon.png';

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
  justify-content: space-between;
  border: none;
`;

const Icon = styled.img`
  width: 24px;
`;

const CurrencyLabel = styled.span`
  color: #fff;
  margin-left: 10px;
  font-size: 1rem;
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

const ErrorMessage = styled.div`
  color: orange;
  font-size: 0.75rem;
  font-family: Arial, sans-serif;
  text-align: left;
  margin-top: 5px;
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

const Select = styled.div`
  display: flex;
  background: #1c2028;
  border-radius: 5px;
  padding: 5px;
  justify-content: space-between;
`;

const Option = styled.div`
  background: ${props => props.active ? '#2575fc' : 'transparent'};
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
  transition: background-color 0.3s;
`;

const CustomInput = styled.input`
  background: transparent;
  border: 1px solid #ccc;
  color: white;
  padding: 5px;
  border-radius: 5px;
  width: 50px;
  text-align: center;
  margin-right: 5px;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #fff;
`;

const SettingOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  color: #aaa;
  margin-bottom: 5px;
`;

const ConversionRateContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 5px;
`;

const ConversionRate = styled.div`
  color: #fff;
  text-align: left;
`;

const GasFee = styled.div`
  color: #fff;
  text-align: right;
`;

const Form1 = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState(0);
  const [ethRate, setEthRate] = useState(0);
  const [slippage, setSlippage] = useState('2');
  const [deadline, setDeadline] = useState('20');
  const [fromAmountError, setFromAmountError] = useState('');
  const [slippageError, setSlippageError] = useState('');
  const [deadlineError, setDeadlineError] = useState('');
  const [gasPrice, setGasPrice] = useState('0');

  useEffect(() => {
    const url = `https://rest.coinapi.io/v1/exchangerate/ETH/USDC`;

    const fetchETHPrice = async () => {
      try {
        const response = await axios.get(url, { headers: { 'X-CoinAPI-Key': process.env.REACT_APP_COINAPI_KEY } });
        setEthRate(parseFloat(response.data.rate).toFixed(2));
      } catch (error) {
        console.error('Error fetching ETH price:', error);
      }
    };

    fetchETHPrice();
    const interval = setInterval(fetchETHPrice, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!fromAmount) setToAmount(0);
    else if (fromAmount && ethRate) {
      setToAmount((parseFloat(fromAmount) * parseFloat(ethRate)).toFixed(2));
    }
  }, [fromAmount, ethRate]);

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

  const handleFromAmountChange = (event) => {
    const value = event.target.value;
    setFromAmount(value);
    if (parseFloat(value) <= 0) {
      setFromAmountError('Input can not be 0 or negative');
    } else {
      setFromAmountError('');
    }
  };

  const handleSlippageChange = (value) => {
    setSlippage(value);
    if (parseFloat(value) <= 0) {
      setSlippageError('Input can not be 0 or negative');
    } else {
      setSlippageError('');
    }
  };

  const handleDeadlineChange = (event) => {
    const value = event.target.value;
    setDeadline(value);
    if (parseFloat(value) <= 0) {
      setDeadlineError('Input can not be 0 or negative');
    } else {
      setDeadlineError('');
    }
  };

  return (
    <Wrapper>
      <SwapForm>
        <InputContainer>
          <Icon src={ethIcon} alt="ETH" />
          <CurrencyLabel>ETH</CurrencyLabel>
          <Input type="number" value={fromAmount} onChange={handleFromAmountChange} placeholder="0.00" />
        </InputContainer>
        {fromAmountError && <ErrorMessage>{fromAmountError}</ErrorMessage>}
        <InputContainer>
          <Icon src={usdcIcon} alt="USDC" />
          <CurrencyLabel>USDC</CurrencyLabel>
          <Input type="number" value={toAmount} placeholder="0.00" disabled />
        </InputContainer>
        <SettingsContainer>
          <SettingOption>
            <Label>Slippage tolerance</Label>
            <Select>
              {['.5', '1', '2'].map((option) => (
                <Option key={option} active={slippage === option} onClick={() => handleSlippageChange(option)}>
                  {option}%
                </Option>
              ))}
              <CustomInput type="number" value={slippage !== '0.5' || slippage !== '1' || slippage !== '2' ? slippage : ''} onChange={(e) => handleSlippageChange(e.target.value)} />
              <span>%</span>
            </Select>
            {slippageError && <ErrorMessage>{slippageError}</ErrorMessage>}
          </SettingOption>
          <SettingOption>
            <Label>Transaction deadline</Label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CustomInput type="number" min="1" max="120" value={deadline} onChange={handleDeadlineChange} />
              <span style={{ marginLeft: '5px' }}>Minutes</span>
            </div>
            {deadlineError && <ErrorMessage>{deadlineError}</ErrorMessage>}
          </SettingOption>
        </SettingsContainer>
        <ConversionRateContainer>
          <ConversionRate>1 ETH = {ethRate} USDC</ConversionRate>
          <GasFee>Gas Fee: {gasPrice} Gwei</GasFee>
        </ConversionRateContainer>
        <Button>Fund</Button>
      </SwapForm>
    </Wrapper>
  );
};

export default Form1;
