// client/src/pages/LearnMore.js
import React from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from 'styled-components';

const LearnMoreContainer = styled(Container)`
  padding: 4rem;
`;

const LearnMore = () => {
  return (
    <LearnMoreContainer>
      <Typography variant="h3" align="center" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '2rem' }}>
        Learn More About NeuroShield
      </Typography>
      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <Typography style={{ color: '#00bcd4', fontWeight: 'bold' }}>Proposed Solution Methodology</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            NeuroShield is divided into four key phases:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Data Assessment: Collect and analyze training data to identify inconsistencies, biases, and poisoning attempts." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Model Assessment: Evaluate your AI model’s code and architecture to detect potential vulnerabilities." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Attack Simulation: Mimic adversarial attacks such as inference, extraction, and evasion to test model robustness." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Result Dashboard & Recommendation System: Present detailed vulnerability scores, phase-specific results, and actionable mitigation strategies." />
            </ListItem>
          </List>
          <Typography variant="body2">
            By integrating these phases, NeuroShield delivers a comprehensive solution that adapts to emerging threats and maintains optimal security standards.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <Typography style={{ color: '#00bcd4', fontWeight: 'bold' }}>Technical & Non-Technical Constraints</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            <strong>Technical Constraints:</strong> High computational resources, support for multiple frameworks (TensorFlow, PyTorch, ONNX), and real-time data processing capabilities.
          </Typography>
          <Typography variant="body2">
            <strong>Non-Technical Constraints:</strong> Compliance with international cybersecurity standards (IEEE, NIST, OWASP) and alignment with industry best practices.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <Typography style={{ color: '#00bcd4', fontWeight: 'bold' }}>Additional Features & Deliverables</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            NeuroShield’s final deliverables include a full-fledged vulnerability detection tool, detailed documentation, source code repository, API integration, and a demo video, ensuring a robust and deployable solution.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </LearnMoreContainer>
  );
};

export default LearnMore;
