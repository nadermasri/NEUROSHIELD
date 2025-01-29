// src/components/Loader.js
import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  from { top: 0; }
  to { top: -120%; }
`;

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  transition: all 1s ease;

  &.fade-out {
    animation: ${fadeOut} 1s forwards;
  }
`;

const Spinner = styled.div`
  border: 8px solid rgba(255, 174, 0, 0.3);
  border-top: 8px solidrgb(0, 0, 0);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Loader = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const loader = document.getElementById('loader');
      loader.classList.add('fade-out');
    }, 2000); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <LoaderContainer id="loader">
      <Spinner />
    </LoaderContainer>
  );
};

export default Loader;
