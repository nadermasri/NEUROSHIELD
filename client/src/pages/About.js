// client/src/pages/About.js
import React from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from 'styled-components';

const AboutContainer = styled(Container)`
  padding: 4rem;
`;

const SectionTitle = styled(Typography)`
  color: #00bcd4;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const SectionContent = styled(Typography)`
  margin-bottom: 0.5rem;
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

      {/* Project Information Accordions */}
      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <SectionTitle variant="h6">Scope of the Project</SectionTitle>
        </AccordionSummary>
        <AccordionDetails>
          <SectionContent variant="body2">
            NeuroShield is designed to detect vulnerabilities across the entire AI lifecycle. It rigorously evaluates training data, secures model code, and assesses deployed systems against real-world attacks to ensure reliable and safe AI solutions.
          </SectionContent>
        </AccordionDetails>
      </Accordion>

      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <SectionTitle variant="h6">Problem Origin</SectionTitle>
        </AccordionSummary>
        <AccordionDetails>
          <SectionContent variant="body2">
            As AI systems infiltrate critical domains—such as healthcare, finance, and autonomous driving—traditional security frameworks have struggled to keep pace with emerging threats. NeuroShield was conceived to address these vulnerabilities and fill the gaps in AI security.
          </SectionContent>
        </AccordionDetails>
      </Accordion>

      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <SectionTitle variant="h6">Nature & Significance</SectionTitle>
        </AccordionSummary>
        <AccordionDetails>
          <SectionContent variant="body2">
            The trustworthiness of AI systems depends on robust security measures. NeuroShield not only detects potential vulnerabilities but also provides actionable recommendations, thus ensuring that AI deployments are both resilient and compliant with industry standards.
          </SectionContent>
        </AccordionDetails>
      </Accordion>

      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <SectionTitle variant="h6">Vision & Mission</SectionTitle>
        </AccordionSummary>
        <AccordionDetails>
          <SectionContent variant="body2">
            Our vision is to establish a new paradigm for AI security—one where vulnerabilities are proactively identified and mitigated before they can be exploited. Our mission is to empower organizations with cutting-edge tools that ensure the safe and ethical deployment of AI technologies.
          </SectionContent>
        </AccordionDetails>
      </Accordion>

      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <SectionTitle variant="h6">Technology & Architecture</SectionTitle>
        </AccordionSummary>
        <AccordionDetails>
          <SectionContent variant="body2">
            NeuroShield leverages a microservices architecture combining Node.js and Express for backend APIs, MongoDB for data storage, and auxiliary services built in Python (such as Bandit security scans and adversarial simulation scripts). It integrates seamlessly with modern frontend frameworks to deliver real-time risk assessments via a user-friendly dashboard.
          </SectionContent>
          <SectionContent variant="body2">
            The system processes code, deployed models, and compliance questionnaires using advanced algorithms and machine learning techniques, ensuring both accuracy and efficiency in vulnerability detection.
          </SectionContent>
        </AccordionDetails>
      </Accordion>

      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <SectionTitle variant="h6">Security & Compliance</SectionTitle>
        </AccordionSummary>
        <AccordionDetails>
          <SectionContent variant="body2">
            NeuroShield is built with security at its core. It deploys multiple layers of protection including static code analysis, dynamic simulation of adversarial attacks, and in-depth compliance assessments against standards such as NIST AI RMF and NIST DP SP 800.
          </SectionContent>
          <SectionContent variant="body2">
            This rigorous approach not only reinforces data integrity and system resilience but also helps organizations adhere to regulatory requirements and industry best practices.
          </SectionContent>
        </AccordionDetails>
      </Accordion>

      <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
          <SectionTitle variant="h6">Community & Future Directions</SectionTitle>
        </AccordionSummary>
        <AccordionDetails>
          <SectionContent variant="body2">
            Beyond being a cutting-edge security toolkit, NeuroShield is a community-driven project. We actively encourage contributions from developers and security experts to further enhance and evolve the platform.
          </SectionContent>
          <SectionContent variant="body2">
            Upcoming features include real-time threat intelligence, expanded support for additional frameworks, and enhanced integration capabilities with cloud-based deployments. Join us in our journey to redefine AI security.
          </SectionContent>
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
      
      {/* Additional Information Footer */}
      <Box mt={4} textAlign="center">
        <Typography variant="body2" style={{ color: '#aaa' }}>
          NeuroShield © {new Date().getFullYear()}. Empowering secure AI for a better future.
        </Typography>
      </Box>
    </AboutContainer>
  );
};

export default About;
