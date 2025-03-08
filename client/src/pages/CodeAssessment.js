import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Typography, Button, TextField, Box, Checkbox } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import icons
import CodeIcon from '@mui/icons-material/Code';
import CloudIcon from '@mui/icons-material/Cloud';
import BuildIcon from '@mui/icons-material/Build';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import LanguageIcon from '@mui/icons-material/Language';
import FunctionsIcon from '@mui/icons-material/Functions';
import ScienceIcon from '@mui/icons-material/Science';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

// Full-screen container that centers content
const StyledContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #141e30, #243b55);
`;

// Glassmorphism card for the form
const FormCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  max-width: 1200px;
  width: 100%;
`;

// Container for the library list
const LibraryList = styled(Box)`
  margin-top: 1.5rem;
`;

// Single library row styling
const LibraryRow = styled(Box)`
  display: flex;
  align-items: center;
  margin: 0.75rem 0;
`;

// Icon wrapper for fixed size and color
const IconWrapper = styled(Box)`
  margin-right: 1rem;
  color: #00bcd4;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CodeAssessment = () => {
  const [selectedLibraries, setSelectedLibraries] = useState({});
  const [reqFile, setReqFile] = useState(null);
  const [parsedFrameworks, setParsedFrameworks] = useState({});
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  // List of libraries to display
  const librariesList = [
    'Flowise', 'Horovod', 'LangChain', 'LlamaIndex', 'MLflow', 'NumPy', 'Ollama', 'ONNX', 'Pandas',
    'Pytorch', 'scikit-learn', 'TensorFlow', 'Vector DB', 'Hugging Face Transformers'
  ];

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/csrf-token', { withCredentials: true })
      .then((res) => setCsrfToken(res.data.csrfToken))
      .catch((err) => console.error('Error fetching CSRF token:', err));
  }, []);

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

  // Handle file upload for requirements.txt (pip freeze output)
  const handleReqFileChange = (e) => {
    const file = e.target.files[0];
    setReqFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      const frameworks = {};
      lines.forEach((line) => {
        if (line.includes('==')) {
          const [pkg, version] = line.split('==').map((s) => s.trim());
          if (pkg && version) {
            frameworks[pkg.toLowerCase()] = version;
          }
        }
      });
      setParsedFrameworks(frameworks);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const frameworksToCheck =
      Object.keys(parsedFrameworks).length > 0
        ? parsedFrameworks
        : Object.entries(selectedLibraries)
            .filter(([_, data]) => data.checked)
            .reduce((acc, [lib, data]) => {
              acc[lib.toLowerCase()] = data.version;
              return acc;
            }, {});

    if (Object.keys(frameworksToCheck).length === 0) {
      alert('Please select at least one library or upload a requirements.txt file.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/vulnerabilities/check-vulnerabilities',
        { frameworks: frameworksToCheck },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken
          },
          withCredentials: true
        }
      );
      console.log('Vulnerability check response:', res.data);
      navigate('/assessment-dashboard');
    } catch (error) {
      console.error('Error checking vulnerabilities:', error);
      alert(error.response?.data?.message || 'Error checking vulnerabilities');
    }
  };

  // Mapping from library names (in lowercase) to icons
  const libraryIcons = {
    airflow: <CloudIcon />,
    'apache spark': <WhatshotIcon />,
    docker: <BuildIcon />,
    flowise: <DeveloperModeIcon />,
    hadoop: <CloudIcon />,
    kubeflow: <CloudIcon />,
    langchain: <LanguageIcon />,
    llamainDEX: <FunctionsIcon />,
    mlflow: <ScienceIcon />,
    numpy: <FunctionsIcon />,
    ollama: <CodeIcon />,
    onnx: <CodeIcon />,
    pandas: <FunctionsIcon />,
    pytorch: <LocalFireDepartmentIcon />,
    redis: <CloudIcon />,
    sagemaker: <CloudIcon />,
    'sap hana': <BuildIcon />,
    'scikit-learn': <ScienceIcon />,
    'sql azure': <CloudIcon />,
    tensorflow: <DeveloperModeIcon />,
    'vector db': <CloudIcon />
  };

  return (
    <StyledContainer>
      <FormCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" align="center" sx={{ color: '#00bcd4', mb: 3, fontWeight: 'bold' }}>
          AI Security Code Assessment
        </Typography>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
            Select Libraries Used:
          </Typography>
          <LibraryList>
            {librariesList.map((lib, index) => (
              <LibraryRow key={index}>
                <IconWrapper>
                  {libraryIcons[lib.toLowerCase()] || <CodeIcon />}
                </IconWrapper>
                <Typography variant="body1" sx={{ flexGrow: 1, color: '#fff' }}>
                  {lib}
                </Typography>
                <Checkbox
                  name={lib}
                  checked={selectedLibraries[lib]?.checked || false}
                  onChange={handleCheckboxChange}
                  sx={{ color: '#00bcd4' }}
                />
                {selectedLibraries[lib]?.checked && (
                  <TextField
                    label="Version"
                    variant="outlined"
                    size="small"
                    value={selectedLibraries[lib].version}
                    onChange={(e) => handleVersionChange(e, lib)}
                    required
                    sx={{
                      width: '120px',
                      ml: 1,
                      input: { color: '#fff' },
                      '& .MuiInputLabel-root': { color: '#fff' },
                      '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00bcd4' } },
                    }}
                  />
                )}
              </LibraryRow>
            ))}
          </LibraryList>
          <Typography variant="h6" sx={{ color: '#fff', mt: 3, mb: 1 }}>
            Or Upload Requirements.txt (pip freeze output):
          </Typography>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Button variant="contained" component="label" sx={{ bgcolor: '#00bcd4', color: '#fff' }}>
              {reqFile ? 'Change File' : 'Upload File'}
              <input type="file" hidden accept=".txt" onChange={handleReqFileChange} />
            </Button>
            {reqFile && (
              <Typography variant="body1" sx={{ color: '#fff', mt: 1 }}>
                Selected File: {reqFile.name}
              </Typography>
            )}
          </Box>
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#00bcd4', color: '#fff', px: 4, py: 1.5, fontSize: '1rem' }}>
              Check Vulnerabilities
            </Button>
          </Box>
        </form>
      </FormCard>
    </StyledContainer>
  );
};

export default CodeAssessment;
