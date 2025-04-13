// client/src/pages/TesterLogin.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

// Ensure cookies are sent with requests
axios.defaults.withCredentials = true;

const LoginContainer = styled(Container)`
  padding: 4rem;
  max-width: 400px;
  margin: 2rem auto;
  background-color: #1a1a1a;
  border-radius: 8px;
`;

const TesterLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  // Fetch the CSRF token once when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/api/csrf-token')
      .then(response => {
        setCsrfToken(response.data.csrfToken);
      })
      .catch(error => {
        console.error('Error fetching CSRF token:', error);
      });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password, role: 'tester' },
        { headers: { 'csrf-token': csrfToken } }
      );

      if (res.data.accessToken) {
        const token = res.data.accessToken;

        localStorage.setItem('token', token);
        localStorage.setItem('role', 'tester');

        // Decode token and calculate expiration
        const decoded = jwtDecode(token);
        const expiryTime = decoded.exp * 1000;
        const now = Date.now();
        const timeout = expiryTime - now;

        // Schedule logout
        if (timeout > 0) {
          setTimeout(() => {
            alert("Your session has expired. Please login again.");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/login";
          }, timeout);
        }

        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Login error:", err);

      // Custom handling for too many requests
      if (err.response?.status === 429) {
        alert("Too many login attempts. Please wait before trying again.");
      } else if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <LoginContainer>
      <Typography variant="h4" style={{ color: '#00bcd4', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
        Tester Login
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          variant="outlined"
          required
          InputLabelProps={{ style: { color: '#ffffff' } }}
          InputProps={{ style: { color: '#ffffff', backgroundColor: '#2a2a2a' } }}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          variant="outlined"
          required
          InputLabelProps={{ style: { color: '#ffffff' } }}
          InputProps={{ style: { color: '#ffffff', backgroundColor: '#2a2a2a' } }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          style={{ backgroundColor: '#00bcd4', color: '#ffffff', marginTop: '1rem', fontWeight: 'bold' }}
        >
          Login
        </Button>
      </form>
    </LoginContainer>
  );
};

export default TesterLogin;
