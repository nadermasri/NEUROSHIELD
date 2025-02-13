import React, { useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import UploadIcon from '@mui/icons-material/Upload';
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

const UploadSection = styled(Box)`
  margin-top: 3rem;
  text-align: center;
`;

const DatasetAssessment = () => {
  const [datasetFile, setDatasetFile] = useState(null);

  const handleFileChange = (e) => {
    setDatasetFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (datasetFile) formData.append('datasetFile', datasetFile);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/assessments/dataset', formData, {
        headers: { Authorization: token, 'Content-Type': 'multipart/form-data' }
      });
      alert(res.data.message);
      setDatasetFile(null);
    } catch (error) {
      alert('Error submitting dataset assessment');
    }
  };

  return (
    <AssessmentContainer>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <FormBox>
          <Typography variant="h4" align="center" gutterBottom>
            Dataset Assessment
          </Typography>
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Upload the dataset used for training your AI model:
            </Typography>
            <UploadSection>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                sx={{
                  backgroundColor: '#00bcd4',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  padding: '0.8rem 2rem',
                  border: '2px solid #00bcd4',
                  '&:hover': { backgroundColor: '#00838f', border: '2px solid #00838f' }
                }}
              >
                {datasetFile ? 'Change File' : 'Upload File'}
                <input type="file" hidden onChange={handleFileChange} accept=".csv,.json,.xlsx" />
              </Button>
              {datasetFile && (
                <Typography variant="body1" sx={{ marginTop: '1rem' }}>
                  Selected File: {datasetFile.name}
                </Typography>
              )}
            </UploadSection>
            <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
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

export default DatasetAssessment;
