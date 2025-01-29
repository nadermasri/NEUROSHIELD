// src/pages/ContactUs.js
import React, { useState } from 'react';
import styled from 'styled-components';
import Fade from 'react-reveal/Fade'; // Corrected Import
import { TextField, Button, Container, Typography } from '@mui/material';

const ContactContainer = styled(Container)`
  min-height: 100vh;
  padding: 5rem 10%;
  background: #121212;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContactBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 4rem 5rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  width: 100%;
  max-width: 600px;
  color: #ffffff;
`;

const StyledTextField = styled(TextField)`
  & .MuiInputBase-input {
    color: #ffffff;
  }
  & .MuiInputLabel-root {
    color: #cfd8dc;
  }
  & .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border-color: #cfd8dc;
  }
  &:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border-color: #ffae00;
  }
  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #ffae00;
  }
`;

const StyledButton = styled(Button)`
  background-color: #ffae00;
  color: #1a1a1a;
  font-weight: bold;
  padding: 0.8rem 2rem;
  margin-top: 1.5rem;
  transition: background-color 0.3s ease;
  width: 100%;

  &:hover {
    background-color: #e6b800;
  }
`;

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to backend)
    console.log('Form Data:', formData);
    alert('Form Submitted Successfully!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <ContactContainer>
      {/* Wrapping the ContactBox with Fade component to handle the animation */}
      <Fade bottom>
        <ContactBox>
          <Typography variant="h4" align="center" gutterBottom>
            Contact Us
          </Typography>
          <form onSubmit={handleSubmit}>
            <StyledTextField
              label="Name"
              name="name"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <StyledTextField
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <StyledTextField
              label="Message"
              name="message"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              multiline
              rows={6}
              value={formData.message}
              onChange={handleChange}
            />
            <StyledButton type="submit" variant="contained">
              Submit
            </StyledButton>
          </form>
        </ContactBox>
      </Fade>
    </ContactContainer>
  );
};

export default ContactUs;
