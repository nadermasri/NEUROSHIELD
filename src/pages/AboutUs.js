// src/pages/AboutUs.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion'; // Correct import
import Tilt from 'react-parallax-tilt'; // Correct import
import { Typography, Container, Grid } from '@mui/material';

const AboutContainer = styled(Container)`
  min-height: 100vh;
  padding: 5rem 10%;
  background: #1a1a1a;
  color: #ffffff;
`;

const AboutBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const ImageBox = styled.div`
  flex: 1 1 40rem;
  text-align: center;
`;

const StyledImage = styled.img`
  width: 80%;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(255, 174, 0, 0.6);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ContentBox = styled.div`
  flex: 1 1 40rem;
`;

const AboutUs = () => {
  return (
    <AboutContainer>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          About Us
        </Typography>
        <AboutBox>
          <ImageBox>
            <Tilt
              tiltMaxAngleX={25}
              tiltMaxAngleY={25}
              perspective={1000}
              scale={1.05}
              transitionSpeed={500}
              style={{ height: 250, width: 300 }}
            >
              <StyledImage src="/path-to-about-image.jpg" alt="About Us" /> {/* Replace with your image path */}
            </Tilt>
          </ImageBox>
          <ContentBox>
            <Typography variant="h6" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              We specialize in assessing AI models to ensure their robustness and reliability. Our platform provides comprehensive tools and methodologies to evaluate both development-phase and deployed AI models against various security threats and performance metrics.
            </Typography>
            <Typography variant="h6" gutterBottom>
              Our Vision
            </Typography>
            <Typography variant="body1" paragraph>
              To be the leading platform in AI model assessment, fostering trust and security in AI technologies across industries.
            </Typography>
          </ContentBox>
        </AboutBox>
      </motion.div>
    </AboutContainer>
  );
};

export default AboutUs;
