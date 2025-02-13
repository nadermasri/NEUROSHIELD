import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginContainer = styled(Container)`
  padding: 4rem;
  max-width: 400px;
  margin: 2rem auto;
  background-color: #1a1a1a;
  border-radius: 8px;
`;

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password, role: 'admin' });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', 'admin');
        navigate('/admin-dashboard');
      }
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <LoginContainer>
      <Typography variant="h4" style={{ color: '#00bcd4', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
        Admin Login
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField label="Email" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" variant="outlined" required InputLabelProps={{ style: { color: '#ffffff' } }} InputProps={{ style: { color: '#ffffff', backgroundColor: '#2a2a2a' } }} />
        <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" variant="outlined" required InputLabelProps={{ style: { color: '#ffffff' } }} InputProps={{ style: { color: '#ffffff', backgroundColor: '#2a2a2a' } }} />
        <Button type="submit" variant="contained" fullWidth style={{ backgroundColor: '#00bcd4', color: '#ffffff', marginTop: '1rem', fontWeight: 'bold' }}>
          Login
        </Button>
      </form>
    </LoginContainer>
  );
};

export default AdminLogin;
