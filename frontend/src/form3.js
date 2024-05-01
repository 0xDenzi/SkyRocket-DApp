// import React from 'react';

// const ForumPostPage = ({ title, author, date, content }) => {
//   return (
//     <div className='qwe'>
//     <div className="forum-post-container"> {/* Outer container */}
//       <h3>{title || 'Sample Title'}  {/* Use a default title if not provided */}</h3>
//       <div className="post-info">
//         <span>Posted by: {author || 'Sample Author'}</span>  {/* Use default author if not provided */}
//         <span>Date: {date || '2024-05-02'}</span>  {/* Use default date if not provided */}
//       </div>
//       <div className="post-content" dangerouslySetInnerHTML={{ __html: content }} />
//       <button className="post-button">HELLO</button>
//     </div>

//       <style jsx>{`  /* Inline Styling with JSX */
//         .forum-post-container {
//             background-color: #f5f5f5; /* Add a light background for the form */
//             border-radius: 5px; /* Add subtle border rounding */
//             height: 200%;
//             width: 40%;
//             border: 4px solid orange;
//         }

//         .qwe {
//             display: flex; /* Enable flexbox for centering */
//             justify-content: center; /* Horizontally center content */
//             align-items: flex-start; /* Vertically align content at the top */
//             padding: 100px; /* Adjust padding values as needed */
//             height: 100px
//         }

//         .post-info,
//         .post-content {
//           margin-bottom: 0.5rem;
//         }

//         .post-button {
//           background-color: #4CAF50;
//           color: white;
//           padding:10px 20px;
//           border: none;
//           border-radius: 4px;
//           cursor: pointer;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ForumPostPage;

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
  align-items: center;
  border: 4px solid orange; /* Add border */
  background-color: #fff; /* Add white background color */
  gap: 2rem; /* Add spacing between form elements */
  width: 100%;
  max-width: 600px; /* Set a maximum width for the form */
  height: 400px;
  padding: 20px;
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
  padding: 10px 30px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top:300px;
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
  const [toAmount, setToAmount] = useState(''); // Assume toAmount is initially empty

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
       
        <SwapInfo>
          
        </SwapInfo>
        <Button type="submit">Create Proposal</Button>
      </SwapForm>
    </Wrapper>
  );
};

export default Form1;
