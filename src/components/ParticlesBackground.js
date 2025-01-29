// src/components/ParticlesBackground.js
import React, { useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import styled from 'styled-components';

const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    try {
      // Load the full tsparticles package
      await loadFull(engine);
      console.log("tsparticles loaded successfully");
    } catch (error) {
      console.error("Error loading tsparticles:", error);
    }
  }, []);

  const particlesOptions = {
    background: {
      color: {
        value: '#1a1a1a', // Adjust as needed
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: { enable: true, mode: 'push' },
        onHover: { enable: true, mode: 'repulse' },
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      color: { value: '#ffae00' },
      links: {
        color: '#ffffff',
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      collisions: { enable: false },
      move: {
        direction: 'none',
        enable: true,
        outModes: { default: 'bounce' },
        random: false,
        speed: 2,
        straight: false,
      },
      number: {
        density: { enable: true, area: 800 },
        value: 80,
      },
      opacity: { value: 0.5 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 5 } },
    },
    detectRetina: true,
  };

  return (
    <ParticlesContainer>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
      />
    </ParticlesContainer>
  );
};

export default ParticlesBackground;
