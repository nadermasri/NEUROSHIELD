import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Container,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  Grid,
  Box
} from '@mui/material';
import { motion } from 'framer-motion';
import UploadIcon from '@mui/icons-material/Upload';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AssessmentContainer = styled(Container)`
  min-height: 100vh;
  padding: 5rem 10%;
  background-color: #1a1a1a;
  color: #ffffff;
  @media (max-width: 960px) {
    padding: 5rem 5%;
  }
`;

const FormBox = styled.div`
  background: rgba(30, 30, 30, 0.95);
  padding: 3rem 4rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
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

const CustomTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    background-color: #2a2a2a;
    color: #ffffff;
    border-radius: 8px;
    & fieldset { border-color: #ffffff; }
    &:hover fieldset { border-color: #00bcd4; }
    &.Mui-focused fieldset { border-color: #00bcd4; }
  }
  & .MuiInputLabel-root { color: #ffffff; }
`;

const UploadSection = styled(Box)`
  margin-top: 3rem;
  text-align: center;
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
    'Vector DB'
  ];

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedLibraries((prev) => ({
      ...prev,
      [name]: { checked, version: prev[name]?.version || '' }
    }));
  };

  const handleVersionChange = (e, library) => {
    const { value } = e.target;
    setSelectedLibraries((prev) => ({
      ...prev,
      [library]: { ...prev[library], version: value }
    }));
  };

  const handleFileChange = (e) => {
    setCodeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const librariesUsed = Object.keys(selectedLibraries)
      .filter((lib) => selectedLibraries[lib].checked)
      .map((lib) => ({ name: lib, version: selectedLibraries[lib].version }));

    const formData = new FormData();
    formData.append('libraries', JSON.stringify(librariesUsed));
    if (codeFile) formData.append('codeFile', codeFile);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/assessments/code', formData, {
        headers: { Authorization: token, 'Content-Type': 'multipart/form-data' }
      });
      if (res && res.data && res.data.message) {
        alert(res.data.message);
      } else {
        alert('Assessment submitted successfully');
      }
      setSelectedLibraries({});
      setCodeFile(null);
    } catch (error) {
      console.error("Error submitting assessment:", error);
      const errorMsg = error.response?.data?.message || "Error submitting assessment";
      alert(errorMsg);
    }
  };

  return (
    <AssessmentContainer>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
                  <LibraryLogo
                    src={`/assets/logos/${lib.toLowerCase().replace(/ /g, '-').replace(/\//g, '-')}.png`}
                    alt={`${lib} Logo`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/logos/placeholder.png';
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedLibraries[lib]?.checked || false}
                        onChange={handleCheckboxChange}
                        name={lib}
                        sx={{ color: '#ffffff', '&.Mui-checked': { color: '#00bcd4' } }}
                      />
                    }
                    label={lib}
                    sx={{ flexGrow: 1, '& .MuiFormControlLabel-label': { color: '#ffffff', fontSize: '1.1rem' } }}
                  />
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
            <UploadSection>
              <Typography variant="h6" gutterBottom>
                Upload Your Code File:
              </Typography>
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
                {codeFile ? 'Change File' : 'Upload File'}
                <input type="file" hidden onChange={handleFileChange} accept=".js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.rb,.go,.php,.html,.css,.json,.txt" />
              </Button>
              {codeFile && (
                <Typography variant="body1" sx={{ marginTop: '1rem' }}>
                  Selected File: {codeFile.name}
                </Typography>
              )}
            </UploadSection>
            <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
              <Button type="submit" variant="contained" sx={{ backgroundColor: '#00bcd4', color: '#ffffff', fontWeight: 'bold', padding: '0.8rem 2rem', '&:hover': { backgroundColor: '#00838f' } }}>
                Submit Assessment
              </Button>
            </Box>
          </form>
          <UploadSection>
            <Typography variant="h6" gutterBottom>
              Already on Code Assessment?
            </Typography>
            <Button variant="contained" component={Link} to="/code-assessment" startIcon={<UploadIcon />} sx={{ backgroundColor: '#00bcd4', color: '#ffffff', fontWeight: 'bold' }}>
              Refresh Page
            </Button>
          </UploadSection>
        </FormBox>
      </motion.div>
    </AssessmentContainer>
  );
};

export default CodeAssessment;
