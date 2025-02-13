import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';

const AssessmentContainer = styled(Container)`
  min-height: 100vh;
  padding: 5rem 10%;
  background-color: #1a1a1a;
  color: #ffffff;
`;

const FormBox = styled.div`
  background: rgba(30, 30, 30, 0.95);
  padding: 3rem 4rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
`;

const DeployedModelAssessment = () => {
  const [modelUrl, setModelUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/assessments/deployed', { modelUrl }, { headers: { Authorization: token } });
      alert(res.data.message);
      setModelUrl('');
    } catch (error) {
      alert('Error submitting deployed model assessment');
    }
  };

  return (
    <AssessmentContainer>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <FormBox>
          <Typography variant="h4" align="center" gutterBottom>
            Deployed Model Assessment
          </Typography>
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Enter the URL of your deployed AI model:
            </Typography>
            <TextField
              label="Model URL"
              variant="outlined"
              fullWidth
              value={modelUrl}
              onChange={(e) => setModelUrl(e.target.value)}
              required
              sx={{
                backgroundColor: '#2a2a2a',
                borderRadius: '8px',
                marginBottom: '2rem',
                input: { color: '#ffffff' },
                '& .MuiInputLabel-root': { color: '#ffffff' }
              }}
            />
            <Box sx={{ textAlign: 'center' }}>
              <Button type="submit" variant="contained" sx={{ backgroundColor: '#00bcd4', color: '#ffffff', fontWeight: 'bold', padding: '0.8rem 2rem', '&:hover': { backgroundColor: '#00838f' } }}>
                Submit Assessment
              </Button>
            </Box>
          </form>
        </FormBox>
      </motion.div>
    </AssessmentContainer>
  );
};

export default DeployedModelAssessment;
