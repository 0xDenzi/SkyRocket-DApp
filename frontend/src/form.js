import React, { useState } from 'react';
import styled from 'styled-components';
import Form1 from './form1';
import Form2 from './form2';

const Wrapper = styled.div`
  display: flex; /* Enable flexbox for centering */
  justify-content: center; /* Horizontally center content */
  align-items: flex-start; /* Vertically align content at the top */
  padding: 50px; /* Adjust padding values as needed */
  height: 10px
`;


const FormContainer = styled.div`
  background-color: #f5f5f5; /* Add a light background for the form */
  border-radius: 5px; /* Add subtle border rounding */
  height: 10%;
  border: 4px solid orange;
`;

const SwapForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem; /* Add spacing between form elements */
  width: 10%;
  max-width: 10px; /* Set a maximum width for the form */
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
  margin: 1px; /* Add margin between buttons */
  &.active {
    background-color: #FFA500; /* Active button color (orange) */
  }
`;

const SwapInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #ccc;
  margin-top: 0.5rem;
`;

const SwapInfoText = styled.span``;

const FeeText = styled.span``;

const Form = ({ activeForm }) => {

  const [currentForm, setCurrentForm] = useState(activeForm || 'Form1'); // Set the initial form (optional)
  const [clickedButton, setClickedButton] = useState(null);

  const handleFormSwitch = (formName) => {
    setCurrentForm(formName);
    setClickedButton(formName);
  };

  const FormContent = currentForm === 'Form1' ? <Form1 /> : <Form2 />;

  return (
    <Wrapper>
        <div className='lol'>
            <div id='innerDiv'>
            <Button
            onClick={() => handleFormSwitch('Form1')}
            className={clickedButton === 'Form1' ? 'active' : ''} // Apply 'active' class if clicked
          >
            ETH
          </Button>
          <Button
            onClick={() => handleFormSwitch('Form2')}
            className={clickedButton === 'Form2' ? 'active' : ''} // Apply 'active' class if clicked
          >
            Stable Coin
          </Button>
            </div>
            <FormContainer>
                {FormContent}
            </FormContainer> 
        </div>
      
    </Wrapper>
  );
};

export default Form;
