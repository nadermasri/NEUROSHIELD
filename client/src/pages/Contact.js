// client/src/pages/Contact.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Grid } from '@mui/material';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';
import MapEmbed from '../components/MapEmbed';

const ContactContainer = styled(Container)`
  padding: 4rem;
  max-width: 900px;
  margin: 2rem auto;
`;

const ContactPaper = styled(Paper)`
  padding: 2rem;
  background-color: #1a1a1a;
  color: #ffffff;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ExtraInfo = styled(Paper)`
  margin-top: 2rem;
  padding: 2rem;
  background-color: #1a1a1a;
  color: #ffffff;
  text-align: center;
`;

const SocialLinks = styled.div`
  margin-top: 1rem;
  a {
    color: #00bcd4;
    margin: 0 0.5rem;
    font-weight: bold;
  }
`;

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await axios.post('http://localhost:5000/api/contact', form);
      alert(res.data.message || 'Thank you for contacting us! We will get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending contact form:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <ContactContainer>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Typography variant="h3" align="center" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '2rem' }}>
          Contact NeuroShield
        </Typography>
        <Grid container spacing={3}>
          {/* Contact Form */}
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
                  InputLabelProps={{ style: { color: '#00bcd4' } }}
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
                  InputLabelProps={{ style: { color: '#00bcd4' } }}
                  InputProps={{ style: { color: '#ffffff', backgroundColor: '#2a2a2a' } }}
                />
                <TextField
                  label="Phone"
                  name="phone"
                  fullWidth
                  value={form.phone}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  InputLabelProps={{ style: { color: '#00bcd4' } }}
                  InputProps={{ style: { color: '#ffffff', backgroundColor: '#2a2a2a' } }}
                />
                <TextField
                  label="Subject"
                  name="subject"
                  fullWidth
                  value={form.subject}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  InputLabelProps={{ style: { color: '#00bcd4' } }}
                  InputProps={{ style: { color: '#ffffff', backgroundColor: '#2a2a2a' } }}
                />
                <TextField
                  label="Message"
                  name="message"
                  multiline
                  rows={6}
                  fullWidth
                  value={form.message}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  required
                  InputLabelProps={{ style: { color: '#00bcd4' } }}
                  InputProps={{ style: { color: '#ffffff', backgroundColor: '#2a2a2a' } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={sending}
                  style={{ backgroundColor: '#00bcd4', color: '#ffffff', marginTop: '1rem', fontWeight: 'bold' }}
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </ContactPaper>
          </Grid>
          {/* Map and Location Info */}
          <Grid item xs={12} md={6}>
            <ContactPaper elevation={3}>
              <Typography variant="h5" style={{ color: '#00bcd4', marginBottom: '1rem' }}>
                Our Location
              </Typography>
              <MapEmbed />
              <Typography variant="body1" style={{ marginTop: '0.5rem' }}>
                American University of Beirut, Bliss Street, Beirut, Lebanon
              </Typography>
            </ContactPaper>
          </Grid>
        </Grid>
        {/* Extra Contact Information */}
        <ExtraInfo elevation={3}>
          <Typography variant="h5" style={{ color: '#00bcd4', marginBottom: '1rem', fontWeight: 'bold' }}>
            Additional Contact Information
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> info@neuroshield.com
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong> +961-70-788088
          </Typography>
          <Typography variant="body1">
            <strong>Office Hours:</strong> Monday - Friday, 9AM - 5PM (GMT+3)
          </Typography>
          <SocialLinks>
            <Typography variant="body2">
              Follow us on:
            </Typography>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </SocialLinks>
        </ExtraInfo>
      </motion.div>
    </ContactContainer>
  );
};

export default Contact;
