// client/src/pages/TesterDashboard.js
import React from 'react';
import { Container, Typography, Grid, Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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

const TesterDashboard = () => {
  const navOptions = [
    {
      title: 'Code Assessment',
      description: 'Assess your AI model code for vulnerabilities.',
      image: '/assets/offerings/model.png', // ensure you have this image in public/assets/offerings/
      link: '/code-assessment'
    },
    {
      title: 'Deployed Model Assessment',
      description: 'Simulate attacks on your deployed models.',
      image: '/assets/offerings/attack.png',
      link: '/deployed-assessment'
    },
    {
      title: 'Dataset Assessment',
      description: 'Evaluate training datasets for quality and security.',
      image: '/assets/offerings/data.png',
      link: '/dataset-assessment'
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
    </DashboardContainer>
  );
};

export default TesterDashboard;
