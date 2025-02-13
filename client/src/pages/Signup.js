import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupContainer = styled(Container)`
  padding: 4rem;
  max-width: 400px;
  margin: 2rem auto;
  background-color: #1a1a1a;
  border-radius: 8px;
`;

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', form);
      alert('Signup successful! Please login.');
      navigate('/tester-login');
    } catch (error) {
      alert('Signup failed: ' + error.response.data.message);
    }
  };
  
  return (
    <SignupContainer>
      <Typography variant="h4" align="center" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '2rem' }}>
        Tester Signup
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" fullWidth value={form.name} onChange={handleChange} margin="normal" variant="outlined" required InputLabelProps={{ style: { color: '#ffffff' } }} InputProps={{ style: { color: '#ffffff', backgroundColor: '#2a2a2a' } }} />
        <TextField label="Email" name="email" type="email" fullWidth value={form.email} onChange={handleChange} margin="normal" variant="outlined" required InputLabelProps={{ style: { color: '#ffffff' } }} InputProps={{ style: { color: '#ffffff', backgroundColor: '#2a2a2a' } }} />
        <TextField label="Password" name="password" type="password" fullWidth value={form.password} onChange={handleChange} margin="normal" variant="outlined" required InputLabelProps={{ style: { color: '#ffffff' } }} InputProps={{ style: { color: '#ffffff', backgroundColor: '#2a2a2a' } }} />
        <Button type="submit" variant="contained" fullWidth style={{ backgroundColor: '#00bcd4', color: '#ffffff', marginTop: '1rem', fontWeight: 'bold' }}>
          Sign Up
        </Button>
      </form>
    </SignupContainer>
  );
};

export default Signup;
