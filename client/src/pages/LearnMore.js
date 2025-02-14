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
            NeuroShield’s solution is divided into four key phases:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Data Assessment: Collect and clean training data, identify biases and anomalies, and detect data poisoning attempts." primaryTypographyProps={{ style: { color: '#ffffff' } }} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Model Assessment: Evaluate your AI model’s source code and architecture for vulnerabilities using advanced tools like CodeBERT." primaryTypographyProps={{ style: { color: '#ffffff' } }} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Attack Simulation: Simulate real-world adversarial attacks to stress-test model robustness and identify hidden vulnerabilities." primaryTypographyProps={{ style: { color: '#ffffff' } }} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Result Dashboard & Recommendation System: Present vulnerability scores, phase-specific insights, and actionable mitigation strategies in a user-friendly dashboard." primaryTypographyProps={{ style: { color: '#ffffff' } }} />
            </ListItem>
          </List>
          <Typography variant="body2">
            These phases work together to provide a complete security evaluation, enabling organizations to secure their AI systems against emerging threats.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <Typography style={{ color: '#00bcd4', fontWeight: 'bold' }}>Technical & Non-Technical Constraints</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            <strong>Technical Constraints:</strong> High computational resources, support for diverse frameworks (TensorFlow, PyTorch, ONNX), and real-time processing capabilities are critical to our solution.
          </Typography>
          <Typography variant="body2">
            <strong>Non-Technical Constraints:</strong> Compliance with industry standards (IEEE, NIST, ISO, OWASP) and regulatory requirements is essential for building trust and ensuring the solution is legally sound.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <Typography style={{ color: '#00bcd4', fontWeight: 'bold' }}>Deliverables & Additional Features</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            NeuroShield delivers a fully functional vulnerability detection tool, comprehensive documentation, a GitHub repository containing the source code, API integrations for seamless deployment, and a demo video. These deliverables ensure that organizations can confidently integrate robust security measures into their AI workflows.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </LearnMoreContainer>
  );
};

export default LearnMore;
