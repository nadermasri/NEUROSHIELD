// client/src/pages/Home.js
import React from 'react';
import { 
  Container, Typography, Button, Grid, Card, CardContent, 
  CardMedia, Accordion, AccordionSummary, AccordionDetails, 
  List, ListItem, ListItemText, Box 
} from '@mui/material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Styled Components

// Hero Section with a background image overlay for dramatic effect
const HeroSection = styled(Box)`
  text-align: center;
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #00bcd4, #00838f);
  color: #ffffff;
  background-image: url('/assets/hero-bg.jpg'); /* update image path if needed */
  background-size: cover;
  background-position: center;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 0; 
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
  }
`;
const HeroContent = styled(Box)`
  position: relative;
  z-index: 2;
`;

// Offerings Section
const OfferingsSection = styled(Container)`
  margin-top: 4rem;
  padding: 2rem 0;
`;

// Consistent typography for section headers and paragraphs
const SectionTitle = styled(Typography)`
  color: #00bcd4;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const SectionParagraph = styled(Typography)`
  margin-bottom: 1rem;
`;

// Concern Section for key security issues
const ConcernSection = styled(Container)`
  margin-top: 4rem;
  padding: 3rem;
  background-color: #1a1a1a;
  border-radius: 12px;
`;

// FAQ Section with a dark background
const FAQSection = styled(Container)`
  margin-top: 4rem;
  padding: 2rem;
  background-color: #1a1a1a;
  border-radius: 12px;
`;

// Impact Section highlighting business value
const ImpactSection = styled(Container)`
  margin-top: 4rem;
  padding: 4rem 2rem;
  background-color: #263238;
  border-radius: 12px;
  text-align: center;
  color: #ffffff;
`;

// Call-to-Action Section
const CTASection = styled(Box)`
  margin: 4rem 0;
  text-align: center;
`;

// Offering Card with refined design and hover effects
const OfferingCard = styled(Card)`
  background-color: #1a1a1a;
  color: #ffffff;
  margin: 1rem auto;
  width: 320px;
  height: 400px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 20px rgba(0, 188, 212, 0.8);
  }
`;
const CardMediaStyled = styled(CardMedia)`
  height: 180px;
`;
const CardContentStyled = styled(CardContent)`
  padding: 1rem;
  flex-grow: 1;
`;

const Home = () => {
  // Offerings updated to match the key phases
  const offerings = [
    { 
      title: 'Framework Vulnerability Assessment',
      description: 'Assess your AI model frameworks against known vulnerabilities using comprehensive CVE analysis.',
      image: '/assets/offerings/model.png'
    },
    { 
      title: 'Code Assessment',
      description: 'Upload your code for a thorough security scan and uncover hidden vulnerabilities.',
      image: '/assets/offerings/data.png'  // Ensure you have a distinct code image file
    },
    { 
      title: 'Attack Simulation',
      description: 'Simulate adversarial attacks to evaluate your model’s resilience against malicious inputs.',
      image: '/assets/offerings/attack.png'
    },
    { 
      title: 'Compliance Assessment',
      description: 'Check your compliance with AI regulatory frameworks and get actionable recommendations.',
      image: '/assets/offerings/compliance.png'
    },
    { 
      title: 'Assessment Dashboard',
      description: 'View detailed metrics, interactive charts, and comprehensive reports in one central platform.',
      image: '/assets/offerings/dashboard.png'
    }
  ];

  // FAQ data updated for clarity
  const faqs = [
    {
      question: "What is NeuroShield?",
      answer: "NeuroShield is a comprehensive security toolkit designed to protect AI systems by evaluating data integrity, code vulnerabilities, attack resilience, and regulatory compliance."
    },
    {
      question: "Why is security critical for AI systems?",
      answer: "AI systems drive crucial decisions in healthcare, finance, and public services. Vulnerabilities can lead to data breaches, model manipulation, and operational risks, making robust security essential."
    },
    {
      question: "How does NeuroShield work?",
      answer: "It combines framework assessments, static code scans, adversarial attack simulations, and compliance evaluations to provide a complete picture of your AI system’s security."
    },
    {
      question: "What are the benefits of using NeuroShield?",
      answer: "NeuroShield improves risk management, ensures compliance, mitigates financial losses, and enhances trust by continuously monitoring and remediating vulnerabilities."
    },
    {
      question: "Who should use NeuroShield?",
      answer: "Organizations deploying AI in critical sectors such as healthcare, finance, and technology can benefit from NeuroShield’s proactive security measures."
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <Typography variant="h2" style={{ fontWeight: 'bold' }}>
              Welcome to NeuroShield
            </Typography>
            <Typography variant="h5" style={{ margin: '1rem 0' }}>
              Securing AI Systems Against Evolving Threats
            </Typography>
            <Typography variant="body1" style={{ maxWidth: '700px', margin: '0 auto 2rem' }}>
              NeuroShield is a state-of-the-art security platform that detects, assesses, and mitigates vulnerabilities throughout your AI system’s lifecycle. Protect your critical infrastructure today.
            </Typography>
            <Button component={Link} to="/tester-login" variant="contained" style={{ backgroundColor: '#ffffff', color: '#00bcd4', fontWeight: 'bold' }}>
              Get Started
            </Button>
          </motion.div>
        </HeroContent>
      </HeroSection>

      {/* Offerings Section */}
      <OfferingsSection>
        <SectionTitle variant="h4" align="center">
          Our Offerings
        </SectionTitle>
        <Grid container spacing={3} justifyContent="center">
          {offerings.map((offer, index) => (
            <Grid item key={index}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <OfferingCard>
                  <CardMediaStyled component="img" image={offer.image} alt={offer.title} />
                  <CardContentStyled>
                    <Typography variant="h6" gutterBottom style={{ color: '#00bcd4', fontWeight: 'bold' }}>
                      {offer.title}
                    </Typography>
                    <Typography variant="body2">
                      {offer.description}
                    </Typography>
                  </CardContentStyled>
                </OfferingCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </OfferingsSection>

      {/* Impact Section */}
      <ImpactSection>
        <SectionTitle variant="h4" align="center">
          Our Impact
        </SectionTitle>
        <SectionParagraph variant="body1">
          Organizations using NeuroShield report significant improvements in risk management, compliance adherence, and overall security posture.
        </SectionParagraph>
        <Box mt={2}>
          <Typography variant="h6" style={{ color: '#00bcd4', fontWeight: 'bold' }}>
            Trusted by Industry Leaders
          </Typography>
          <Typography variant="body2">
            Join a community of forward-thinking enterprises securing their AI infrastructure with NeuroShield.
          </Typography>
        </Box>
      </ImpactSection>

      {/* Concern Section */}
      <ConcernSection>
        <SectionTitle variant="h4" align="center">
          Why Privacy & Security Matters
        </SectionTitle>
        <SectionParagraph variant="body1">
          In today's digital era, AI systems drive mission-critical decisions. However, vulnerabilities in data, code, or model deployment can lead to severe breaches and system failures.
        </SectionParagraph>
        <SectionParagraph variant="body1">
          NeuroShield’s multi-layered defense strategy proactively identifies and mitigates risks to safeguard your AI investments.
        </SectionParagraph>
        <List>
          <ListItem>
            <ListItemText primary="Data Poisoning: Prevent unauthorized manipulation of training data." primaryTypographyProps={{ style: { color: '#ffffff' } }} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Adversarial Attacks: Shield your models from crafted inputs meant to mislead predictions." primaryTypographyProps={{ style: { color: '#ffffff' } }} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Model Integrity: Ensure your deployed models remain secure and unaltered." primaryTypographyProps={{ style: { color: '#ffffff' } }} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Privacy Compliance: Protect sensitive data and adhere to regulatory standards." primaryTypographyProps={{ style: { color: '#ffffff' } }} />
          </ListItem>
        </List>
      </ConcernSection>

      {/* FAQ Section */}
      <FAQSection>
        <SectionTitle variant="h4" align="center">
          Frequently Asked Questions
        </SectionTitle>
        {faqs.map((faq, index) => (
          <Accordion key={index} style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
              <Typography style={{ color: '#00bcd4', fontWeight: 'bold' }}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </FAQSection>

      {/* Call-to-Action Section */}
      <CTASection>
        <Typography variant="h4" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
          Ready to Secure Your AI?
        </Typography>
        <Typography variant="body1" style={{ maxWidth: '600px', margin: '0 auto 2rem', color: '#fff' }}>
          Take the first step toward a secure AI infrastructure. Login now and harness the power of NeuroShield to safeguard your critical systems.
        </Typography>
        <Button component={Link} to="/tester-login" variant="contained" style={{ backgroundColor: '#ffffff', color: '#00bcd4', fontWeight: 'bold' }}>
          Get Started
        </Button>
      </CTASection>
    </>
  );
};

export default Home;
