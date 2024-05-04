import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex; /* Enable flexbox for centering */
  justify-content: center; /* Horizontally center content */
  align-items: center; /* Vertically center content (optional) */
  /* Add padding to all sides */
  padding: 100px; /* Adjust padding values as needed */
`;

const SwapForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem; /* Add spacing between form elements */
  width: 100%;
  max-width: 400px; /* Set a maximum width for the form */
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const InputLabel = styled.label`
  flex: 0 0 30%; /* Set label width */
  font-weight: bold;
`;

const Input = styled.input`
  flex: 1; /* Allow input to fill remaining space */
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
  const [toAmount,setToAmount] = useState(''); // Assume toAmount is initially empty

  const handleFromAmountChange = (event) => {
    setFromAmount(event.target.value);
  };

  // Add a function to handle toAmount changes if needed (similar to handleFromAmountChange)

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', fromAmount, toAmount);
  };

  return (
    <Wrapper>
      <SwapForm onSubmit={handleSubmit}>
        { <SwapForm onSubmit={handleSubmit}>
      
      <InputContainer>
        
        <Input type="number" value={toAmount} onChange={(e) =>setToAmount(e.target.value)} placeholder="0.00" />
        <Select>
          <option value="USDC">USDC</option>
          <option value="DAI">DAI</option>
          <option value="USDT">USDT</option>
        </Select>
      </InputContainer>
      <SwapInfo>
        <SwapInfoText>1 ETH = 0.0000 USDC (15%)</SwapInfoText>
        <FeeText>Fee: - ETH</FeeText>
      </SwapInfo>
      <Button type="submit">Fund</Button>
    </SwapForm>}
      </SwapForm>
    </Wrapper>
  );
};

export default Form1;
