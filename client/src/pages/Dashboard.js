// client/src/pages/TesterDashboard.js
import React from 'react';
import { Container, Typography, Grid, Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Dashboard container with a dark gradient background and padding
const DashboardContainer = styled(Container)`
  padding: 4rem;
  background: linear-gradient(135deg, #1e1e1e, #333);
  min-height: 100vh;
  color: #ffffff;
`;

// Header for welcome message
const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

// Styled NavCard with rounded corners, overflow hidden, and enhanced hover effects
const NavCard = styled(Card)`
  background-color: #1a1a1a;
  margin: 0rem;
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 450px;
  display: flex;
  flex-direction: column;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 20px rgba(0, 188, 212, 0.8);
  }
`;

// Card media with increased height and object-fit cover
const NavCardMedia = styled(CardMedia)`
  height: 220px;
  object-fit: cover;
`;

// Card content styled as a flex container with two fixed-height sections
const NavCardContent = styled(CardContent)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
`;

// Container for the top text (title and description)
const TextContainer = styled.div`
  min-height: 100px;
  max-height: 120px;
  overflow: auto;
`;

// Container for the details with a fixed height and top border divider
const DetailContainer = styled.div`
  min-height: 120px;
  max-height: 120px;
  border-top: 1px solid #424242;
  padding-top: 0.5rem;
  overflow: auto;
`;

// Title styling for the card
const Title = styled(Typography)`
  color: #00bcd4;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

// Description styling for the card
const Description = styled(Typography)`
  color: #ffffff;
`;

// Detail text styling (inside the detail container)
const DetailText = styled(Typography)`
  color: #b0bec5;
  font-style: italic;
  font-size: 0.8rem;
`;

const TesterDashboard = () => {
  // Updated navigation options
  const navOptions = [
    {
      title: 'Framework Vulnerability Assessment',
      description: 'Assess your AI model frameworks for potential vulnerabilities.',
      detail: 'This tool cross-references your framework versions against known vulnerabilities, providing risk scores and mitigation tips.',
      image: '/assets/offerings/model.png',
      link: '/framework-assessment'
    },
    {
      title: 'Code Assessment',
      description: 'Upload your code for security analysis.',
      detail: 'Scan your source code with advanced static analysis tools to uncover potential security issues and best practices violations.',
      image: '/assets/offerings/data.png',
      link: '/Vulncode-assessment'
    },
    {
      title: 'Adversarial Attack Simulation',
      description: 'Simulate adversarial attacks on your AI models.',
      detail: 'Evaluate the resilience of your models by simulating adversarial attacks and analyzing the results.',
      image: '/assets/offerings/attack.png',
      link: '/adversarial-attack-simulation'
    },
    {
      title: 'Assessment Dashboard',
      description: 'View detailed metrics and recommendations.',
      detail: 'Access interactive charts, detailed reports, and tailored remediation strategies in one centralized dashboard.',
      image: '/assets/offerings/dashboard.png',
      link: '/assessment-dashboard'
    },
    {
      title: 'Compliance & Regulation Assessment',
      description: 'Check your compliance against AI regulatory frameworks.',
      detail: 'Evaluate your organization’s compliance with guidelines such as NIST AI RMF, NIST SP 800-226, and ISO 27001, and receive actionable recommendations.',
      image: '/assets/offerings/compliance.png',
      link: '/compliance-assessment'
    }
  ];

  return (
    <DashboardContainer>
      <Header>
        <Typography variant="h3" sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
          Tester Dashboard
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, color: '#cfd8dc' }}>
          Welcome! Select an option below to start your security and compliance assessments.
        </Typography>
      </Header>
      <Grid container spacing={4} justifyContent="center">
        {navOptions.map((option, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <CardActionArea component={Link} to={option.link}>
                <NavCard>
                  {option.image && (
                    <NavCardMedia component="img" image={option.image} alt={option.title} />
                  )}
                  <NavCardContent>
                    <TextContainer>
                      <Title variant="h6">{option.title}</Title>
                      <Description variant="body2">{option.description}</Description>
                    </TextContainer>
                    <DetailContainer>
                      <DetailText variant="body2">{option.detail}</DetailText>
                    </DetailContainer>
                  </NavCardContent>
                </NavCard>
              </CardActionArea>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </DashboardContainer>
  );
};

export default TesterDashboard;
