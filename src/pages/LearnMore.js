// src/pages/LearnMore.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion'; // Correct import
import Tilt from 'react-parallax-tilt'; // Correct import
import { Typography, Container, Grid } from '@mui/material';

const LearnContainer = styled(Container)`
  min-height: 100vh;
  padding: 5rem 10%;
  background: #1a1a1a;
  color: #ffffff;
`;

const LearnBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const ImageBox = styled.div`
  flex: 1 1 30rem;
  text-align: center;
`;

const StyledImage = styled.img`
  width: 70%;
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

const LearnMore = () => {
  return (
    <LearnContainer>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Learn More
        </Typography>
        <LearnBox>
          <Section>
            <ImageBox>
              <Tilt
                tiltMaxAngleX={25}
                tiltMaxAngleY={25}
                perspective={1000}
                scale={1.05}
                transitionSpeed={500}
                style={{ height: 250, width: 300 }}
              >
                <StyledImage src="/path-to-learn-image1.jpg" alt="Learn More 1" /> {/* Replace with your image path */}
              </Tilt>
            </ImageBox>
            <ContentBox>
              <Typography variant="h6" gutterBottom>
                Our Methodologies
              </Typography>
              <Typography variant="body1" paragraph>
                We employ advanced methodologies to assess AI models, including code analysis, vulnerability scanning, and performance benchmarking. Our tools are designed to simulate real-world attack scenarios to evaluate model resilience.
              </Typography>
            </ContentBox>
          </Section>
          <Section>
            <ContentBox>
              <Typography variant="h6" gutterBottom>
                Our Tools
              </Typography>
              <Typography variant="body1" paragraph>
                Our platform integrates cutting-edge tools like ART for adversarial robustness testing, ensuring that deployed models can withstand various security threats. Additionally, our dataset assessment tools evaluate the quality and integrity of training data to prevent model poisoning.
              </Typography>
            </ContentBox>
            <ImageBox>
              <Tilt
                tiltMaxAngleX={25}
                tiltMaxAngleY={25}
                perspective={1000}
                scale={1.05}
                transitionSpeed={500}
                style={{ height: 250, width: 300 }}
              >
                <StyledImage src="/path-to-learn-image2.jpg" alt="Learn More 2" /> {/* Replace with your image path */}
              </Tilt>
            </ImageBox>
          </Section>
        </LearnBox>
      </motion.div>
    </LearnContainer>
  );
};

export default LearnMore;
