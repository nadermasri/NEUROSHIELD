import React from 'react';
import { Container, Typography, Divider } from '@mui/material';
import styled from 'styled-components';

const TermsContainer = styled(Container)`
  padding: 4rem;
  background-color: #1a1a1a;
  color: #ffffff;
  margin-top: 2rem;
`;

const Terms = () => {
  return (
    <TermsContainer>
      <Typography 
        variant="h3" 
        align="center" 
        style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '2rem' }}
      >
        Terms & Conditions
      </Typography>
      
      <Typography variant="body1" paragraph>
        Welcome to NeuroShield. These Terms & Conditions ("Terms") govern your use of our website and services. By accessing or using our services, you agree to be bound by these Terms. If you do not agree, please refrain from using our services.
      </Typography>
      
      <Divider style={{ backgroundColor: '#00bcd4', margin: '2rem 0' }} />

      <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
        1. Acceptance of Terms
      </Typography>
      <Typography variant="body1" paragraph>
        By creating an account or using our services, you agree to comply with and be legally bound by these Terms and any additional terms and conditions that may apply. We reserve the right to modify these Terms at any time, and such modifications shall become effective immediately upon posting.
      </Typography>

      <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
        2. User Responsibilities
      </Typography>
      <Typography variant="body1" paragraph>
        You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account. You also agree not to misuse our services or engage in any conduct that could harm our website, services, or other users.
      </Typography>

      <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
        3. Intellectual Property Rights
      </Typography>
      <Typography variant="body1" paragraph>
        All content on our website, including but not limited to text, graphics, logos, images, and software, is the property of NeuroShield or its licensors and is protected by applicable intellectual property laws. You are granted a limited, non-exclusive license to use the content for personal, non-commercial purposes only.
      </Typography>

      <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
        4. Limitations of Liability
      </Typography>
      <Typography variant="body1" paragraph>
        NeuroShield shall not be liable for any indirect, incidental, special, or consequential damages that result from the use of, or inability to use, our services. Your use of our services is at your own risk, and we provide our services "as is" without any warranties of any kind.
      </Typography>

      <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
        5. Dispute Resolution
      </Typography>
      <Typography variant="body1" paragraph>
        Any disputes arising out of or related to these Terms shall be resolved through binding arbitration in accordance with the rules of the applicable jurisdiction. By using our services, you agree to submit to such arbitration.
      </Typography>

      <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
        6. Governing Law
      </Typography>
      <Typography variant="body1" paragraph>
        These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which NeuroShield operates, without regard to any conflict of law principles.
      </Typography>

      <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
        7. Changes to These Terms
      </Typography>
      <Typography variant="body1" paragraph>
        We reserve the right to update or modify these Terms at any time. All changes will be posted on this page, and your continued use of our services after such changes have been posted constitutes your acceptance of the new Terms.
      </Typography>

      <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
        8. Contact Information
      </Typography>
      <Typography variant="body1" paragraph>
        If you have any questions regarding these Terms, please contact us at:
        <br /><br />
        <strong>Email:</strong> info@neuroshield.com 
        <br />
        <strong>Phone:</strong> +961-70-788088
      </Typography>
    </TermsContainer>
  );
};

export default Terms;
