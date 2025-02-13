// client/src/pages/Contact.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Grid } from '@mui/material';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import MapEmbed from '../components/MapEmbed'; // Import the component

const ContactContainer = styled(Container)`
  padding: 4rem;
  max-width: 900px;
  margin: 2rem auto;
`;

const ContactPaper = styled(Paper)`
  padding: 2rem;
  background-color: #1a1a1a;
  color: #ffffff;
`;

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you might send the message to your backend API.
    alert('Thank you for contacting us! We will get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <>
      <ContactContainer>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <Typography variant="h3" align="center" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '2rem' }}>
            Contact NeuroShield
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ContactPaper elevation={3}>
                <Typography variant="h5" style={{ color: '#00bcd4', marginBottom: '1rem' }}>
                  Get in Touch
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Name"
                    name="name"
                    fullWidth
                    value={form.name}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    required
                    InputLabelProps={{ style: { color: '#ffffff' } }}
                    InputProps={{ style: { color: '#ffffff', backgroundColor: '#2a2a2a' } }}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    fullWidth
                    value={form.email}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    required
                    InputLabelProps={{ style: { color: '#ffffff' } }}
                    InputProps={{ style: { color: '#ffffff', backgroundColor: '#2a2a2a' } }}
                  />
                  <TextField
                    label="Message"
                    name="message"
                    multiline
                    rows={4}
                    fullWidth
                    value={form.message}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    required
                    InputLabelProps={{ style: { color: '#ffffff' } }}
                    InputProps={{ style: { color: '#ffffff', backgroundColor: '#2a2a2a' } }}
                  />
                  <Button type="submit" variant="contained" fullWidth style={{ backgroundColor: '#00bcd4', color: '#ffffff', marginTop: '1rem', fontWeight: 'bold' }}>
                    Send Message
                  </Button>
                </form>
              </ContactPaper>
            </Grid>
            <Grid item xs={12} md={6}>
              <ContactPaper elevation={3}>
                <Typography variant="h5" style={{ color: '#00bcd4', marginBottom: '1rem' }}>
                  Our Location
                </Typography>
                <MapEmbed />
                <Typography variant="body2" style={{ marginTop: '1rem' }}>
                  American University of Beirut, Bliss Street, Beirut, Lebanon
                </Typography>
              </ContactPaper>
            </Grid>
          </Grid>
        </motion.div>
      </ContactContainer>
    </>
  );
};

export default Contact;
