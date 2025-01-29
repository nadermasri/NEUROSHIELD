// src/pages/Home.js
import React from 'react';
import styled from 'styled-components';
import ParticlesBackground from '../components/ParticlesBackground';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Correct import
import Tilt from 'react-parallax-tilt'; // Correct import

const HomeSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 10%;
  color: #ffffff;
`;

const ContentBox = styled.div`
  z-index: 1;
  text-align: center;
  max-width: 800px;
`;

const InfoText = styled.p`
  font-size: 2rem;
  margin-bottom: 3rem;
`;

const LoginOptions = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const LoginBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 3rem 4rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.2);
  }

  h3 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #ffffff;
  }

  p {
    font-size: 1.3rem;
    color: #cfd8dc;
  }
`;

const Home = () => {
  const navigate = useNavigate();

  return (
    <HomeSection>
      <ParticlesBackground />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ContentBox>
          <h1>Assessing the robustness and security of your AI models and large language models.</h1>
          <InfoText>
                
          </InfoText>
          <InfoText>
                
                </InfoText>
          <LoginOptions>
            <Tilt
              tiltMaxAngleX={25}
              tiltMaxAngleY={25}
              perspective={1000}
              scale={1.05}
              transitionSpeed={500}
              style={{ height: 250, width: 300 }}
            >
              <LoginBox onClick={() => navigate('/testing-login')}>
                <h3>Tester Login</h3>
                <p>Evaluate and test AI models for security and performance.</p>
              </LoginBox>
            </Tilt>
            <Tilt
              tiltMaxAngleX={25}
              tiltMaxAngleY={25}
              perspective={1000}
              scale={1.05}
              transitionSpeed={500}
              style={{ height: 250, width: 300 }}
            >
              <LoginBox onClick={() => navigate('/admin-login')}>
                <h3>Admin Login</h3>
                <p>Manage assessments and view comprehensive reports.</p>
              </LoginBox>
            </Tilt>
          </LoginOptions>
        </ContentBox>
      </motion.div>
    </HomeSection>
  );
};

export default Home;
