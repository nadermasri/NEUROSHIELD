// client/src/components/Footer.js
import React from 'react';
import { Container, Typography } from '@mui/material';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 2rem;
  text-align: center;
  margin-top: 3rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <Typography variant="body2">
        © {new Date().getFullYear()} NeuroShield. All rights reserved.
      </Typography>
      <Typography variant="body2">
        <a href="/privacy" style={{ color: '#00bcd4' }}>Privacy Policy</a> | <a href="/terms" style={{ color: '#00bcd4' }}>Terms & Conditions</a>
      </Typography>
    </FooterContainer>
  );
};

export default Footer;
