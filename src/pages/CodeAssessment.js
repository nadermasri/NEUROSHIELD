// src/pages/CodeAssessment.js
import React, { useState } from 'react';
import styled from 'styled-components';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Container,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import UploadIcon from '@mui/icons-material/Upload';
import { Link } from 'react-router-dom'; // Importing Link to fix the ESLint error

// Styled Components for Enhanced Styling
const AssessmentContainer = styled(Container)`
  min-height: 100vh;
  padding: 5rem 10%;
  background: #1a1a1a;
  color: #ffffff;

  @media (max-width: 960px) {
    padding: 5rem 5%;
  }
`;

const FormBox = styled.div`
  background: rgba(30, 30, 30, 0.9); /* Darker shade with higher opacity */
  padding: 3rem 4rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

const LibrariesGrid = styled(Grid)`
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const LibraryRow = styled(Grid)`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const LibraryLogo = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 1.5rem;
`;

const SubmitButton = styled(Button)`
  background-color: #ffae00;
  color: #1a1a1a;
  font-weight: bold;
  padding: 0.8rem 2rem;
  margin-top: 1rem;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #e6b800;
  }
`;

// Custom TextField for Version Inputs
const CustomTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    background-color: #2a2a2a; /* Slightly lighter for better visibility */
    color: #ffffff;
    border-radius: 8px;
    & fieldset {
      border-color: #ffffff; /* White borders for contrast */
    }
    &:hover fieldset {
      border-color: #ffae00; /* Change border color on hover */
    }
    &.Mui-focused fieldset {
      border-color: #ffae00; /* Change border color when focused */
    }
  }
  & .MuiInputLabel-root {
    color: #ffffff; /* White label text */
  }
`;

const UploadSection = styled(Box)`
  margin-top: 3rem;
  text-align: center;
`;

const UploadButton = styled(Button)`
  background-color: #ffae00;
  color: #1a1a1a;
  font-weight: bold;
  padding: 0.8rem 2rem;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  text-decoration: none;
  border: 2px solid #ffae00; /* Add border for better visibility */

  &:hover {
    background-color: #e6b800;
    border: 2px solid #e6b800;
  }
`;

const CodeAssessment = () => {
  const [selectedLibraries, setSelectedLibraries] = useState({});
  const [codeFile, setCodeFile] = useState(null);

  const librariesList = [
    'Airflow',
    'Apache Spark',
    'Docker',
    'Flowise',
    'Hadoop',
    'KubeFlow',
    'LangChain',
    'LlamaIndex',
    'MLflow',
    'NumPy',
    'Ollama',
    'ONNX',
    'Pandas',
    'Pytorch',
    'Redis',
    'Sagemaker',
    'SAP HANA',
    'scikit-learn',
    'SQL Azure',
    'TensorFlow',
    'Vector DB',
  ];

  // Handle Checkbox Toggle
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedLibraries((prev) => ({
      ...prev,
      [name]: { checked, version: prev[name]?.version || '' },
    }));
  };

  // Handle Version Input Change
  const handleVersionChange = (e, library) => {
    const { value } = e.target;
    setSelectedLibraries((prev) => ({
      ...prev,
      [library]: { ...prev[library], version: value },
    }));
  };

  // Handle File Upload Change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCodeFile(file);
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare data to send to backend
    const librariesUsed = Object.keys(selectedLibraries)
      .filter((lib) => selectedLibraries[lib].checked)
      .map((lib) => ({ name: lib, version: selectedLibraries[lib].version }));

    const submission = {
      libraries: librariesUsed,
      codeFile,
    };

    console.log('Submission:', submission);
    // TODO: Send data to backend (e.g., via API)
    alert('Code Assessment Submitted Successfully!');
    // Reset form
    setSelectedLibraries({});
    setCodeFile(null);
  };

  return (
    <AssessmentContainer>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FormBox>
          <Typography variant="h4" align="center" gutterBottom>
            Code Assessment
          </Typography>
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Select Libraries Used:
            </Typography>
            <LibrariesGrid container spacing={2}>
              {librariesList.map((lib, index) => (
                <LibraryRow item xs={12} key={index}>
                  {/* Library Logo */}
                  <LibraryLogo
                    src={`/assets/logos/${lib
                      .toLowerCase()
                      .replace(/ /g, '-')
                      .replace(/\//g, '-')}.png`} // Ensure your logos are named appropriately
                    alt={`${lib} Logo`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/logos/placeholder.png'; // Fallback logo
                    }}
                  />
                  {/* Library Name and Checkbox */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedLibraries[lib]?.checked || false}
                        onChange={handleCheckboxChange}
                        name={lib}
                        color="default" /* Use default color to allow custom styling */
                        sx={{
                          color: '#ffffff',
                          '&.Mui-checked': {
                            color: '#ffae00',
                          },
                        }}
                      />
                    }
                    label={lib}
                    sx={{
                      flexGrow: 1,
                      fontSize: '1.1rem',
                      '& .MuiFormControlLabel-label': {
                        color: '#ffffff', /* White label text */
                        fontSize: '1.1rem',
                      },
                    }}
                  />
                  {/* Version Input */}
                  {selectedLibraries[lib]?.checked && (
                    <CustomTextField
                      label="Version"
                      variant="outlined"
                      size="small"
                      value={selectedLibraries[lib].version}
                      onChange={(e) => handleVersionChange(e, lib)}
                      style={{ marginLeft: '1rem', width: '150px' }}
                      required
                    />
                  )}
                </LibraryRow>
              ))}
            </LibrariesGrid>
            {/* Code File Upload */}
            <UploadSection>
              <Typography variant="h6" gutterBottom>
                Upload Your Code File:
              </Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                aria-label="Upload Code File"
                sx={{
                  backgroundColor: '#ffae00',
                  color: '#1a1a1a',
                  fontWeight: 'bold',
                  padding: '0.8rem 2rem',
                  transition: 'background-color 0.3s ease',
                  border: '2px solid #ffae00',
                  '&:hover': {
                    backgroundColor: '#e6b800',
                    border: '2px solid #e6b800',
                  },
                }}
              >
                {codeFile ? 'Change File' : 'Upload File'}
                <input
                  type="file"
                  hidden
                  accept=".js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.rb,.go,.php,.html,.css,.json,.txt" // Adjust file types as needed
                  onChange={handleFileChange}
                />
              </Button>
              {codeFile && (
                <Typography variant="body1" sx={{ marginTop: '1rem' }}>
                  Selected File: {codeFile.name}
                </Typography>
              )}
            </UploadSection>
            {/* Submit Button */}
            <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
              <SubmitButton type="submit" variant="contained">
                Submit Assessment
              </SubmitButton>
            </Box>
          </form>
          {/* Go to Code Assessment Button */}
          <UploadSection>
            <Typography variant="h6" gutterBottom>
              Ready for Code Assessment?
            </Typography>
            <UploadButton
              variant="contained"
              component={Link}
              to="/code-assessment" // Ensure this route exists and is correctly set up
              startIcon={<UploadIcon />}
            >
              Go to Code Assessment
            </UploadButton>
          </UploadSection>
        </FormBox>
      </motion.div>
    </AssessmentContainer>
  );
};

export default CodeAssessment;
