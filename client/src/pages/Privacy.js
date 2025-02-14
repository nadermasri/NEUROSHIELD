import React from 'react';
import { Container, Typography, Divider } from '@mui/material';
import styled from 'styled-components';

const PrivacyContainer = styled(Container)`
  padding: 4rem;
  background-color: #1a1a1a;
  color: #ffffff;
  margin-top: 2rem;
`;

const Privacy = () => {
  return (
    <PrivacyContainer>
      <Typography 
        variant="h3" 
        align="center" 
        style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '2rem' }}
      >
        Privacy Policy
      </Typography>
      
      <Typography variant="body1" paragraph>
        Welcome to NeuroShield. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. We are committed to protecting your personal data and your right to privacy.
      </Typography>

      <Divider style={{ backgroundColor: '#00bcd4', margin: '2rem 0' }} />

      <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
        1. Information Collection
      </Typography>
      <Typography variant="body1" paragraph>
        We collect personal information such as your name, email address, and other contact details when you register on our site, subscribe to our newsletter, or interact with our services. We also collect non-personal information using cookies and other tracking technologies to enhance your experience.
      </Typography>

      <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
        2. Use of Information
      </Typography>
      <Typography variant="body1" paragraph>
        The information we collect is used to improve our services, personalize your experience, and communicate with you about updates or promotional offers. We do not sell or rent your personal information to third parties without your explicit consent.
      </Typography>

      <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
        3. Cookies and Tracking Technologies
      </Typography>
      <Typography variant="body1" paragraph>
        Our website uses cookies to store your preferences, analyze usage trends, and improve the overall functionality of our services. You can manage or disable cookies in your browser settings, although doing so may affect certain features of our site.
      </Typography>

      <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
        4. Data Security
      </Typography>
      <Typography variant="body1" paragraph>
        We implement a range of security measures to protect your data against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, firewalls, and secure server configurations. However, no method of transmission over the Internet is completely secure.
      </Typography>

      <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
        5. Third-Party Services
      </Typography>
      <Typography variant="body1" paragraph>
        We may share your information with trusted third-party service providers who help us operate our website and deliver our services. These third parties are contractually obligated to maintain the confidentiality and security of your data.
      </Typography>

      <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
        6. Your Rights and Choices
      </Typography>
      <Typography variant="body1" paragraph>
        You have the right to access, update, or delete your personal information at any time. If you wish to exercise any of these rights or have questions about your data, please contact us using the information provided below.
      </Typography>

      <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
        7. Changes to This Policy
      </Typography>
      <Typography variant="body1" paragraph>
        We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. We encourage you to review our Privacy Policy periodically.
      </Typography>

      <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
        8. Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        If you have any questions about this Privacy Policy, please contact us at:
        <br /><br />
        <strong>Email:</strong> info@neuroshield.com 
        <br />
        <strong>Phone:</strong> +961-70-788088
      </Typography>
    </PrivacyContainer>
  );
};

export default Privacy;
