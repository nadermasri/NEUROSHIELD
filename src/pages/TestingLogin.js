// src/pages/TestingLogin.js
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Correct import
import Tilt from 'react-parallax-tilt'; // Correct import

const TestingSection = styled.section`
  min-height: 100vh;
  padding: 5rem 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #121212;
  color: #ffffff;
`;

const OptionsContainer = styled.div`
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const OptionCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 2.5rem 3rem;
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
    font-size: 2.2rem;
    margin-bottom: 1rem;
    color: #ffffff;
  }

  p {
    font-size: 1.4rem;
    color: #cfd8dc;
  }
`;

const TestingLogin = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: 'Code Assessment',
      description: 'Assess the code of AI models during the development phase.',
      path: '/code-assessment',
    },
    {
      title: 'Deployed Model Assessment',
      description:
        'Test deployed AI models by simulating attacks using tools like ART.',
      path: '/deployed-model-assessment',
    },
    {
      title: 'Dataset Assessment',
      description: 'Evaluate datasets used for training AI models.',
      path: '/dataset-assessment',
    },
  ];

  return (
    <TestingSection>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <OptionsContainer>
          {options.map((option, index) => (
            <Tilt
              key={index}
              tiltMaxAngleX={25}
              tiltMaxAngleY={25}
              perspective={1000}
              scale={1.05}
              transitionSpeed={500}
              style={{ height: 250, width: 300 }}
            >
              <OptionCard onClick={() => navigate(option.path)}>
                <h3>{option.title}</h3>
                <p>{option.description}</p>
              </OptionCard>
            </Tilt>
          ))}
        </OptionsContainer>
      </motion.div>
    </TestingSection>
  );
};

export default TestingLogin;
