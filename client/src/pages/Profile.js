import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';

const ProfileContainer = styled(Container)`
  padding: 4rem;
  max-width: 600px;
  margin: 2rem auto;
  background-color: #1a1a1a;
  border-radius: 8px;
`;

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/users/profile', { headers: { Authorization: token } });
      setProfile({ name: res.data.name, email: res.data.email, password: '' });
      setLoading(false);
    } catch (error) {
      alert('Error fetching profile');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/users/profile', profile, { headers: { Authorization: token } });
      alert('Profile updated successfully!');
      setProfile({ ...profile, password: '' });
    } catch (error) {
      alert('Error updating profile');
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <ProfileContainer>
      <Typography variant="h4" align="center" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '2rem' }}>
        Your Profile
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" fullWidth value={profile.name} onChange={handleChange} margin="normal" variant="outlined" required InputLabelProps={{ style: { color: '#ffffff' } }} InputProps={{ style: { color: '#ffffff', backgroundColor: '#2a2a2a' } }} />
        <TextField label="Email" name="email" type="email" fullWidth value={profile.email} onChange={handleChange} margin="normal" variant="outlined" required InputLabelProps={{ style: { color: '#ffffff' } }} InputProps={{ style: { color: '#ffffff', backgroundColor: '#2a2a2a' } }} disabled />
        <TextField label="New Password" name="password" type="password" fullWidth value={profile.password} onChange={handleChange} margin="normal" variant="outlined" InputLabelProps={{ style: { color: '#ffffff' } }} InputProps={{ style: { color: '#ffffff', backgroundColor: '#2a2a2a' } }} />
        <Button type="submit" variant="contained" fullWidth style={{ backgroundColor: '#00bcd4', color: '#ffffff', marginTop: '1rem', fontWeight: 'bold' }}>
          Update Profile
        </Button>
      </form>
    </ProfileContainer>
  );
};

export default Profile;
