// client/src/pages/CodeAssessment.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Typography, Button, TextField, Box } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import icons from Material UI
import CodeIcon from '@mui/icons-material/Code';
import CloudIcon from '@mui/icons-material/Cloud';
import BuildIcon from '@mui/icons-material/Build';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import LanguageIcon from '@mui/icons-material/Language';
import FunctionsIcon from '@mui/icons-material/Functions';
import ScienceIcon from '@mui/icons-material/Science';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

// Container and styling remain similar to your original component
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

const UploadSection = styled(Box)`
  margin-top: 2rem;
  text-align: center;
`;

// Mapping from library names (in lowercase) to icons.
const libraryIcons = {
  airflow: <CloudIcon fontSize="small" />,
  'apache spark': <WhatshotIcon fontSize="small" />,
  docker: <BuildIcon fontSize="small" />,
  flowise: <DeveloperModeIcon fontSize="small" />,
  hadoop: <CloudIcon fontSize="small" />,
  kubeflow: <CloudIcon fontSize="small" />,
  langchain: <LanguageIcon fontSize="small" />,
  llamainDEX: <FunctionsIcon fontSize="small" />, // Example for LlamaIndex
  mlflow: <ScienceIcon fontSize="small" />,
  numpy: <FunctionsIcon fontSize="small" />,
  ollama: <CodeIcon fontSize="small" />,
  onnx: <CodeIcon fontSize="small" />,
  pandas: <FunctionsIcon fontSize="small" />,
  pytorch: <LocalFireDepartmentIcon fontSize="small" />,
  redis: <CloudIcon fontSize="small" />,
  sagemaker: <CloudIcon fontSize="small" />,
  'sap hana': <BuildIcon fontSize="small" />,
  'scikit-learn': <ScienceIcon fontSize="small" />,
  'sql azure': <CloudIcon fontSize="small" />,
  tensorflow: <DeveloperModeIcon fontSize="small" />,
  'vector db': <CloudIcon fontSize="small" />
};

const CodeAssessment = () => {
  const [selectedLibraries, setSelectedLibraries] = useState({});
  const [reqFile, setReqFile] = useState(null);
  const [parsedFrameworks, setParsedFrameworks] = useState({});
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  // List of libraries to display
  const librariesList = [
    'Airflow', 'Apache Spark', 'Docker', 'Flowise', 'Hadoop', 'KubeFlow',
    'LangChain', 'LlamaIndex', 'MLflow', 'NumPy', 'Ollama', 'ONNX', 'Pandas',
    'Pytorch', 'Redis', 'Sagemaker', 'SAP HANA', 'scikit-learn', 'SQL Azure',
    'TensorFlow', 'Vector DB'
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

  // Handle file upload for requirements.txt
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
      navigate('/assessment-dashboard', { state: res.data });
    } catch (error) {
      console.error('Error checking vulnerabilities:', error);
      alert(error.response?.data?.message || 'Error checking vulnerabilities');
    }
  };

  return (
    <AssessmentContainer>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <FormBox>
          <Typography variant="h4" align="center" gutterBottom style={{ color: '#00bcd4', fontWeight: 'bold' }}>
            AI Security Code Assessment
          </Typography>
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Select Libraries Used:
            </Typography>
            {librariesList.map((lib, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
                {/* Display the icon (fallback to CodeIcon if not mapped) */}
                <Box sx={{ marginRight: '0.5rem', color: '#00bcd4' }}>
                  {libraryIcons[lib.toLowerCase()] || <CodeIcon fontSize="small" />}
                </Box>
                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                  {lib}
                </Typography>
                <input
                  type="checkbox"
                  name={lib}
                  checked={selectedLibraries[lib]?.checked || false}
                  onChange={handleCheckboxChange}
                  style={{ accentColor: '#00bcd4', marginRight: '0.5rem' }}
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
                      backgroundColor: '#2a2a2a',
                      '& .MuiOutlinedInput-root': { color: '#ffffff' },
                      width: '120px'
                    }}
                  />
                )}
              </Box>
            ))}
            <Typography variant="h6" gutterBottom sx={{ marginTop: '2rem' }}>
              Or Upload Requirements.txt (pip freeze output):
            </Typography>
            <UploadSection>
              <Button variant="contained" component="label" sx={{ backgroundColor: '#00bcd4', color: '#ffffff', fontWeight: 'bold' }}>
                {reqFile ? 'Change File' : 'Upload File'}
                <input type="file" hidden accept=".txt" onChange={handleReqFileChange} />
              </Button>
              {reqFile && (
                <Typography variant="body1" sx={{ marginTop: '1rem' }}>
                  Selected File: {reqFile.name}
                </Typography>
              )}
            </UploadSection>
            <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>
              <Button type="submit" variant="contained" sx={{ backgroundColor: '#00bcd4', color: '#ffffff', fontWeight: 'bold' }}>
                Check Vulnerabilities
              </Button>
            </Box>
          </form>
        </FormBox>
      </motion.div>
    </AssessmentContainer>
  );
};

export default CodeAssessment;
