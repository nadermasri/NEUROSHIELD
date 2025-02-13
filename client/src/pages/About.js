// client/src/pages/About.js
import React from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from 'styled-components';

const AboutContainer = styled(Container)`
  padding: 4rem;
`;

const About = () => {
  return (
    <AboutContainer>
      <Typography variant="h3" align="center" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '2rem' }}>
        About NeuroShield
      </Typography>
      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <Typography style={{ color: '#00bcd4', fontWeight: 'bold' }}>Scope of the Project</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            NeuroShield is designed to detect vulnerabilities throughout the AI lifecycle. Our tool examines data quality, model integrity, and system deployment to protect against attacks such as data poisoning, adversarial manipulations, and backdoor threats.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <Typography style={{ color: '#00bcd4', fontWeight: 'bold' }}>Problem Origin</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            With AI systems being deployed in critical sectors—healthcare, finance, and autonomous vehicles—the increasing sophistication of adversaries has exposed gaps in traditional security frameworks.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <Typography style={{ color: '#00bcd4', fontWeight: 'bold' }}>Nature & Significance</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            The integrity of AI models relies heavily on the quality of their data and the robustness of their code. Our solution not only identifies vulnerabilities but also provides a pathway to remediate them, ensuring that AI systems remain trustworthy.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <Typography style={{ color: '#00bcd4', fontWeight: 'bold' }}>Motivation & Deliverables</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            Driven by the need to protect critical AI deployments, NeuroShield provides a layered security approach. Our deliverables include a fully functional vulnerability detection tool, detailed user and technical documentation, a comprehensive GitHub repository, and a demo video.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </AboutContainer>
  );
};

export default About;
