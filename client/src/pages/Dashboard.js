// client/src/pages/TesterDashboard.js
import React from 'react';
import { Container, Typography, Grid, Card, CardActionArea, CardContent, CardMedia, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import UploadForm from "../components/UploadForm"; // Import the Upload Form

const DashboardContainer = styled(Container)`
  padding: 4rem;
  text-align: center;
`;

const NavCard = styled(Card)`
  background-color: #1a1a1a;
  color: #ffffff;
  margin: 1rem;
  transition: transform 0.3s, box-shadow 0.3s;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 15px rgba(0, 188, 212, 0.8);
  }
  height: 250px;
`;

const NavCardMedia = styled(CardMedia)`
  height: 140px;
`;

const NavCardContent = styled(CardContent)`
  text-align: center;
`;

const UploadCard = styled(Card)`
  background-color: #1e1e1e;
  color: #ffffff;
  padding: 2rem;
  margin-top: 2rem;
  text-align: center;
`;

const TesterDashboard = () => {
  const navOptions = [
    {
      title: 'Framework/Libraries Code Assessment',
      description: 'Assess your AI model frameworks used for vulnerabilities.',
      image: '/assets/offerings/model.png',
      link: '/code-assessment'
    },
    {
      title: 'Deployed Model Assessment',
      description: 'Simulate attacks on your deployed models.',
      image: '/assets/offerings/attack.png',
      link: '/deployed-assessment'
    },
    {
      title: 'Code Assessment',
      description: 'Upload your code for security analysis.',
      image: '/assets/offerings/data.png',
      link: '/Vulncode-assessment'
    },
    {
      title: 'Assessment Dashboard',
      description: 'View detailed metrics, charts, and mitigation strategies.',
      image: '/assets/offerings/dashboard.png',
      link: '/assessment-dashboard'
    }
  ];

  return (
    <DashboardContainer>
      <Typography variant="h3" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '2rem' }}>
        Tester Dashboard
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {navOptions.map((option, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <CardActionArea component={Link} to={option.link}>
                <NavCard>
                  {option.image && (
                    <NavCardMedia component="img" image={option.image} alt={option.title} />
                  )}
                  <NavCardContent>
                    <Typography variant="h6" style={{ color: '#00bcd4', fontWeight: 'bold' }}>
                      {option.title}
                    </Typography>
                    <Typography variant="body2">
                      {option.description}
                    </Typography>
                  </NavCardContent>
                </NavCard>
              </CardActionArea>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* 🚀 Add Upload Section Below the Dashboard Grid */}
      {/* <Box mt={4}>
        <UploadCard>
          <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
            Upload Your Python Files for Security Assessment
          </Typography>
          <UploadForm />
        </UploadCard>
      </Box> */}
    </DashboardContainer>
  );
};

export default TesterDashboard;
