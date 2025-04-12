// client/src/pages/LearnMore.js
import React from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from 'styled-components';

const LearnMoreContainer = styled(Container)`
  padding: 4rem;
`;

const SectionHeader = styled(Typography)`
  color: #00bcd4;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const SectionParagraph = styled(Typography)`
  margin-bottom: 1rem;
`;

const LearnMore = () => {
  return (
    <LearnMoreContainer>
      <Typography variant="h3" align="center" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '2rem' }}>
        Learn More About NeuroShield
      </Typography>
      
      {/* Proposed Solution Methodology updated to reflect the five phases */}
      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <SectionHeader variant="h6">Proposed Solution Methodology</SectionHeader>
        </AccordionSummary>
        <AccordionDetails>
          <SectionParagraph variant="body2">
            NeuroShield’s comprehensive solution is divided into five integrated phases:
          </SectionParagraph>
          <List>
            <ListItem>
              <ListItemText 
                primary="Framework Vulnerability Assessment: Assess your AI model frameworks for potential vulnerabilities." 
                secondary="Cross-reference framework versions against known vulnerabilities to assign risk scores and define mitigation tips." 
                primaryTypographyProps={{ style: { color: '#ffffff', fontWeight: 'bold' } }}
                secondaryTypographyProps={{ style: { color: '#ffffff' } }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Code Assessment: Upload your code for security analysis." 
                secondary="Run advanced static analysis tools to uncover hidden vulnerabilities and ensure adherence to coding best practices." 
                primaryTypographyProps={{ style: { color: '#ffffff', fontWeight: 'bold' } }}
                secondaryTypographyProps={{ style: { color: '#ffffff' } }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Adversarial Attack Simulation: Simulate adversarial attacks on your AI models." 
                secondary="Evaluate your model’s resilience by simulating various real-world attack scenarios and analyzing their impact." 
                primaryTypographyProps={{ style: { color: '#ffffff', fontWeight: 'bold' } }}
                secondaryTypographyProps={{ style: { color: '#ffffff' } }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Assessment Dashboard: View detailed metrics and recommendations." 
                secondary="Access interactive charts and detailed reports that provide tailored remediation strategies in one centralized interface." 
                primaryTypographyProps={{ style: { color: '#ffffff', fontWeight: 'bold' } }}
                secondaryTypographyProps={{ style: { color: '#ffffff' } }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Compliance & Regulation Assessment: Check your compliance against AI regulatory frameworks." 
                secondary="Evaluate your organization’s adherence to standards like NIST AI RMF and NIST SP 800-226 to receive actionable, compliance-specific recommendations." 
                primaryTypographyProps={{ style: { color: '#ffffff', fontWeight: 'bold' } }}
                secondaryTypographyProps={{ style: { color: '#ffffff' } }}
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Technical & Non-Technical Constraints */}
      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <SectionHeader variant="h6">Technical & Non-Technical Constraints</SectionHeader>
        </AccordionSummary>
        <AccordionDetails>
          <SectionParagraph variant="body2" paragraph>
            <strong>Technical Constraints:</strong> High-performance computing resources, support for diverse frameworks (such as TensorFlow, PyTorch, and ONNX), and real-time processing are essential.
          </SectionParagraph>
          <SectionParagraph variant="body2">
            <strong>Non-Technical Constraints:</strong> Adherence to industry standards (IEEE, NIST, ISO, OWASP) and compliance with regulatory requirements are key to building a trusted and legally sound solution.
          </SectionParagraph>
        </AccordionDetails>
      </Accordion>

      {/* Deliverables & Additional Features */}
      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <SectionHeader variant="h6">Deliverables & Additional Features</SectionHeader>
        </AccordionSummary>
        <AccordionDetails>
          <SectionParagraph variant="body2">
            NeuroShield delivers a fully functional vulnerability detection tool, comprehensive documentation, an open-source GitHub repository, seamless API integrations for easy deployment, and a demo video. These deliverables ensure organizations can quickly and confidently integrate robust security measures into their AI workflows.
          </SectionParagraph>
        </AccordionDetails>
      </Accordion>

      {/* Additional Footer Information */}
      <Box mt={4} textAlign="center">
        <Typography variant="body2" style={{ color: '#aaa' }}>
          NeuroShield © {new Date().getFullYear()}. Pioneering the future of secure AI.
        </Typography>
      </Box>
    </LearnMoreContainer>
  );
};

export default LearnMore;
