// src/components/LoginOption.js
import React from 'react';
import styled from 'styled-components';
import { Fade } from 'react-reveal';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

const LoginBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 3rem 4rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease;
  width: 100%;
  max-width: 350px;

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

  @media (max-width: 600px) {
    padding: 2rem 3rem;

    h3 {
      font-size: 1.8rem;
    }

    p {
      font-size: 1.2rem;
    }
  }
`;

const LoginOption = ({ title, description, onClick }) => {
  return (
    <Fade bottom>
      <LoginBox onClick={onClick}>
        <Typography variant="h3">{title}</Typography>
        <Typography variant="body1">{description}</Typography>
      </LoginBox>
    </Fade>
  );
};

LoginOption.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default LoginOption;
