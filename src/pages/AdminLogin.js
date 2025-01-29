// src/pages/AdminLogin.js
import React, { useState } from 'react';
import styled from 'styled-components';
import Fade from 'react-reveal/Fade'; // Corrected Import
import { TextField, Button, Container, Typography } from '@mui/material';

const LoginContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
`;

const LoginBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 4rem 5rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  width: 100%;
  max-width: 500px;
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
  width: 100%;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e6b800;
  }
`;

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle admin login logic here
    console.log('Admin Credentials:', credentials);
    // Redirect or show success message
  };

  return (
    <LoginContainer>
      <Fade bottom>
        <LoginBox>
          <Typography variant="h4" align="center" gutterBottom>
            Admin Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <StyledTextField
              label="Username"
              name="username"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={credentials.username}
              onChange={handleChange}
            />
            <StyledTextField
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={credentials.password}
              onChange={handleChange}
            />
            <StyledButton type="submit" variant="contained">
              Login
            </StyledButton>
          </form>
        </LoginBox>
      </Fade>
    </LoginContainer>
  );
};

export default AdminLogin;
