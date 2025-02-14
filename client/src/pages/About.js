// client/src/pages/About.js
import React from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Card, CardContent, CardMedia } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from 'styled-components';

const AboutContainer = styled(Container)`
  padding: 4rem;
`;

const FoundersSection = styled(Container)`
  margin-top: 3rem;
  padding: 2rem;
  background-color: #1a1a1a;
  border-radius: 8px;
`;

const FounderCard = styled(Card)`
  background-color: #1a1a1a;
  color: #ffffff;
  margin: 1rem;
  width: 250px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 15px rgba(0, 188, 212, 0.8);
  }
`;

const FounderMedia = styled(CardMedia)`
  height: 200px;
`;

const About = () => {
  // Sample founders data (update image paths as needed)
  const founders = [
    { name: 'Nader Al Masri', image: '/assets/founders/nader.png' },
    { name: 'Ahmad Dimashkieh', image: '/assets/founders/ahmad.png' },
    { name: 'Saja Borghol', image: '/assets/founders/saja.png' },
    { name: 'Yasmeen Lamaa', image: '/assets/founders/yasmeen.png' },
    { name: 'Lynn El Hariri', image: '/assets/founders/lynn.png' }
  ];

  return (
    <AboutContainer>
      <Typography variant="h3" align="center" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '2rem' }}>
        About NeuroShield
      </Typography>
      {/* Project Details Accordions */}
      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <Typography style={{ color: '#00bcd4', fontWeight: 'bold' }}>Scope of the Project</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            NeuroShield is designed to detect vulnerabilities across the AI lifecycle—ensuring the integrity of training data, safeguarding model code, and evaluating deployed systems against real-world attacks.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <Typography style={{ color: '#00bcd4', fontWeight: 'bold' }}>Problem Origin</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            With AI systems deployed in sensitive domains such as healthcare and finance, adversaries have exposed gaps in traditional security frameworks. NeuroShield was born from the need to counteract these evolving threats.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <Typography style={{ color: '#00bcd4', fontWeight: 'bold' }}>Nature & Significance</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            The reliability of AI depends on secure data and robust models. NeuroShield identifies potential vulnerabilities and guides you in implementing effective mitigation strategies, ensuring trustworthy AI systems.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <Typography style={{ color: '#00bcd4', fontWeight: 'bold' }}>Motivation & Deliverables</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            Driven by the need to protect critical AI deployments, our deliverables include a full-fledged vulnerability detection tool, detailed documentation, source code repository, API integration, and a demo video.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Founders Section */}
      <FoundersSection>
        <Typography variant="h4" align="center" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
          Our Founders
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {founders.map((founder, index) => (
            <Grid item key={index}>
              <FounderCard>
                <FounderMedia component="img" image={founder.image} alt={founder.name} />
                <CardContent>
                  <Typography variant="h6" style={{ color: '#00bcd4', fontWeight: 'bold' }}>
                    {founder.name}
                  </Typography>
                </CardContent>
              </FounderCard>
            </Grid>
          ))}
        </Grid>
      </FoundersSection>
    </AboutContainer>
  );
};

export default About;
