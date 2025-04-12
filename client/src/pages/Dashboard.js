// client/src/pages/TesterDashboard.js
import React from 'react';
import { Container, Typography, Grid, Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Dashboard container with a dark gradient background and maximum width
const DashboardContainer = styled(Container)`
  padding: 3rem 1rem; /* Slightly less padding to fit more cards horizontally */
  background: linear-gradient(135deg, #1e1e1e, #333);
  min-height: 100vh;
  color: #ffffff;
  max-width: 1200px;
  margin: 0 auto;
`;

// Header for welcome message
const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

// Card with a fixed height and a max-width to prevent it from stretching too wide
const NavCard = styled(Card)`
  background-color: #1a1a1a;
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  max-width: 280px; /* Limit the card width */
  height: 350px;    /* Fixed card height */
  display: flex;
  flex-direction: column;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 20px rgba(0, 188, 212, 0.8);
  }
`;

// Card media with reduced height for a balanced layout
const NavCardMedia = styled(CardMedia)`
  height: 180px;
  object-fit: cover;
`;

// Card content styled as a flex container for vertical layout
const NavCardContent = styled(CardContent)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
`;

const TextContainer = styled.div`
  min-height: 80px; 
  max-height: 100px;
  overflow: auto;
`;

const DetailContainer = styled.div`
  min-height: 80px;
  max-height: 80px;
  border-top: 1px solid #424242;
  padding-top: 0.5rem;
  overflow: auto;
`;

// Title and text styles
const Title = styled(Typography)`
  color: #00bcd4;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Description = styled(Typography)`
  color: #ffffff;
`;

const DetailText = styled(Typography)`
  color: #b0bec5;
  font-style: italic;
  font-size: 0.8rem;
`;

const TesterDashboard = () => {
  // Navigation options for the tester dashboard
  const navOptions = [
    {
      title: 'Framework Vulnerability Assessment',
      description: 'Assess your AI model frameworks for potential vulnerabilities.',
      detail: 'Cross-reference your framework versions against known vulnerabilities to receive risk scores and mitigation tips.',
      image: '/assets/offerings/model.png',
      link: '/framework-assessment'
    },
    {
      title: 'Code Assessment',
      description: 'Upload your code for security analysis.',
      detail: 'Scan your source code with advanced static analysis tools to uncover potential issues.',
      image: '/assets/offerings/data.png',
      link: '/Vulncode-assessment'
    },
    {
      title: 'Adversarial Attack Simulation',
      description: 'Simulate adversarial attacks on your AI models.',
      detail: 'Evaluate the resilience of your models by simulating attacks and reviewing the results.',
      image: '/assets/offerings/attack.png',
      link: '/adversarial-attack-simulation'
    },
    {
      title: 'Compliance & Regulation Assessment',
      description: 'Check your compliance against AI regulatory frameworks.',
      detail: 'Evaluate your organization’s compliance with guidelines like NIST AI RMF and NIST SP 800-226.',
      image: '/assets/offerings/compliance.png',
      link: '/compliance-assessment'
    },
    {
      title: 'Assessment History',
      description: 'View past assessments and details.',
      detail: 'Access your historical assessment data, including scores, trends, and detailed reports.',
      image: '/assets/offerings/history.png',
      link: '/assessment-dashboard'
    },
    {
      title: 'Analysis & Dashboard',
      description: 'View historical score trends and recommendations.',
      detail: 'Access interactive charts, detailed reports, and tailored remediation strategies.',
      image: '/assets/offerings/dashboard.png',
      link: '/analysis-dashboard'
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

      {/* 
        Using auto-sizing Grid items instead of fixed breakpoints
        so they will wrap and center nicely based on maxWidth of each card.
      */}
      <Grid container spacing={4} justifyContent="center" wrap="wrap">
        {navOptions.map((option, index) => (
          <Grid item key={index}>
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
