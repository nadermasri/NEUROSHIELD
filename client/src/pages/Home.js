// client/src/pages/Home.js
import React from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, CardMedia, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Styled Components
const HeroSection = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #00bcd4, #00838f);
  color: #ffffff;
`;

const OfferingsSection = styled(Container)`
  margin-top: 3rem;
`;

const ConcernSection = styled(Container)`
  margin-top: 4rem;
  padding: 2rem;
  background-color: #1a1a1a;
  border-radius: 8px;
`;

const FAQSection = styled(Container)`
  margin-top: 4rem;
  padding: 2rem;
  background-color: #1a1a1a;
  border-radius: 8px;
`;

// Fixed-size card for offerings
const OfferingCard = styled(Card)`
  background-color: #1a1a1a;
  color: #ffffff;
  margin: 1rem auto;
  width: 300px;
  height: 350px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0 0 15px rgba(0, 188, 212, 0.8);
  }
`;

const CardMediaStyled = styled(CardMedia)`
  height: 140px;
`;

const CardContentStyled = styled(CardContent)`
  padding: 1rem;
`;

const Home = () => {
  // Offerings data
  const offerings = [
    { title: 'Data Assessment', description: 'Analyze training data for contamination, bias, and anomalies.', image: '/assets/offerings/data.png' },
    { title: 'Model Assessment', description: 'Scan AI model code for vulnerabilities and integrity issues.', image: '/assets/offerings/model.png' },
    { title: 'Attack Simulation', description: 'Simulate adversarial attacks to test model resilience.', image: '/assets/offerings/attack.png' },
    { title: 'Dashboard & Recommendations', description: 'Receive actionable insights to remediate identified vulnerabilities.', image: '/assets/offerings/dashboard.png' }
  ];

  // FAQ data
  const faqs = [
    {
      question: "What is NeuroShield?",
      answer: "NeuroShield is a comprehensive security toolkit designed to detect and mitigate vulnerabilities in machine learning and AI systems. It covers data integrity, model robustness, and real-time attack simulations."
    },
    {
      question: "Why is privacy and security important for AI systems?",
      answer: "AI systems are often deployed in critical areas such as healthcare, finance, and autonomous vehicles. Vulnerabilities can lead to data poisoning, adversarial attacks, and unauthorized access, potentially causing catastrophic failures or privacy breaches."
    },
    {
      question: "What types of vulnerabilities does NeuroShield detect?",
      answer: "NeuroShield identifies a range of vulnerabilities including data poisoning, backdoor attacks, and adversarial manipulations, ensuring that both the training data and model code remain secure."
    },
    {
      question: "How does NeuroShield help remediate vulnerabilities?",
      answer: "It provides actionable recommendations and best practices tailored to the identified issues, allowing organizations to prioritize mitigations and improve the overall security posture of their AI systems."
    },
    {
      question: "What are the key deliverables of the project?",
      answer: "The deliverables include a fully functional security toolkit, comprehensive user and technical documentation, a GitHub repository with source code, a demo video, and integrated APIs for seamless deployment."
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Typography variant="h2" style={{ fontWeight: 'bold' }}>
            Welcome to NeuroShield
          </Typography>
          <Typography variant="h5" style={{ margin: '1rem 0' }}>
            Securing AI Systems Against Evolving Threats
          </Typography>
          <Typography variant="body1" style={{ maxWidth: '700px', margin: '0 auto 2rem' }}>
            NeuroShield is a cutting-edge security toolkit that helps you detect, assess, and mitigate vulnerabilities across the entire lifecycle of your AI systems—from ensuring data integrity to safeguarding your deployed models.
          </Typography>
          <Button component={Link} to="/tester-login" variant="contained" style={{ backgroundColor: '#ffffff', color: '#00bcd4', fontWeight: 'bold' }}>
            Get Started
          </Button>
        </motion.div>
      </HeroSection>

      {/* Offerings Section */}
      <OfferingsSection>
        <Typography variant="h4" align="center" style={{ marginBottom: '2rem', color: '#00bcd4', fontWeight: 'bold' }}>
          Our Offerings
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {offerings.map((offer, index) => (
            <Grid item key={index}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <OfferingCard>
                  {offer.image && (
                    <CardMediaStyled component="img" image={offer.image} alt={offer.title} />
                  )}
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

      {/* Why Privacy & Security Matters Section */}
      <ConcernSection>
        <Typography variant="h4" align="center" style={{ marginBottom: '2rem', color: '#ffffff', fontWeight: 'bold' }}>
          Why Privacy & Security Matters
        </Typography>
        <Typography variant="body1" paragraph style={{ color: '#ffffff' }}>
          In today's digital era, AI systems are at the core of decision-making across healthcare, finance, and national security. However, these systems are only as secure as the data and models behind them. As cyber threats become more sophisticated, ensuring privacy and security is not optional—it’s a necessity.
        </Typography>
        <Typography variant="body1" paragraph style={{ color: '#ffffff' }}>
          Vulnerabilities in data collection, model design, and deployment can expose sensitive information, compromise model integrity, and even lead to catastrophic outcomes. NeuroShield addresses these challenges by providing a multi-layered defense that continuously monitors, assesses, and mitigates potential risks.
        </Typography>
        <Typography variant="body1" paragraph style={{ color: '#ffffff' }}>
          Key concerns include:
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Data Poisoning: Malicious manipulation of training data can skew predictions." primaryTypographyProps={{ style: { color: '#ffffff' } }} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Adversarial Attacks: Subtle perturbations in input data can force AI models to make incorrect decisions." primaryTypographyProps={{ style: { color: '#ffffff' } }} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Model Integrity: Ensuring that models are not tampered with during or after deployment is crucial for reliability." primaryTypographyProps={{ style: { color: '#ffffff' } }} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Privacy: Protecting sensitive user data from unauthorized access is of utmost importance." primaryTypographyProps={{ style: { color: '#ffffff' } }} />
          </ListItem>
        </List>
      </ConcernSection>

      {/* FAQ Section */}
      <FAQSection>
        <Typography variant="h4" align="center" style={{ marginBottom: '2rem', color: '#00bcd4', fontWeight: 'bold' }}>
          Frequently Asked Questions
        </Typography>
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
    </>
  );
};

export default Home;
