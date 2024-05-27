import React, { useState } from 'react';
import styled from 'styled-components';
import Form1 from './form1';
import Form2 from './form2';
import Stars from './Assests/stars.jpg';

// Styled Components
// Styled Components
const OuterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 92.2vh; // Ensure full viewport height
  padding: 50px;
  background-image: url(${Stars}); // Use the imported Stars image
  background-size: cover;
  background-position: center;
`;

const Wrapper = styled.div`
  width: 500px; // Set a fixed width
  background-color: #131722;
  border-radius: 20px;
  overflow: hidden; // Ensures no internal content spills out
  box-shadow: 0 0 8px 2px rgba(33, 114, 229, 0.75); // Neon blue glow effect applied here
`;

const ButtonContainer = styled.div`
  display: flex;
  background-color: #282d37; // Set a background color that matches the button inactive state
  border-radius: 20px 20px 0 0; // Rounded corners only at the top
`;

const Button = styled.button`
  flex: 1; // Each button takes equal space
  padding: 15px 30px;
  border: none;
  color: white;
  background-color: transparent; // Transparent background to blend into the container
  cursor: pointer;
  transition: background 0.3s;

  &:hover, &.active {
    background-color: #2172e5; // Highlight on hover and active
  }

  &:first-child {
    border-right: 1px solid #131722; // Divider between the buttons
  }
`;

const FormContainer = styled.div`
  padding: 20px;
`;

// Component Function
const Form = ({ activeForm }) => {
  const [currentForm, setCurrentForm] = useState(activeForm || 'Form1');
  const handleFormSwitch = (formName) => {
    setCurrentForm(formName);
  };

  const FormContent = currentForm === 'Form1' ? <Form1 /> : <Form2 />;

  return (
    <OuterContainer>
      <Wrapper>
        <ButtonContainer>
          <Button
            onClick={() => handleFormSwitch('Form1')}
            className={currentForm === 'Form1' ? 'active' : ''}
          >
            ETH
          </Button>
          <Button
            onClick={() => handleFormSwitch('Form2')}
            className={currentForm === 'Form2' ? 'active' : ''}
          >
            Stable Coin
          </Button>
        </ButtonContainer>
        <FormContainer>
          {FormContent}
        </FormContainer>
      </Wrapper>
    </OuterContainer>
  );
};

export default Form;
