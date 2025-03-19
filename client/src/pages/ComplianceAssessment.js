//client/src/pages/ComplianceAssessment.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';
import axios from 'axios';

const ComplianceContainer = styled(Container)(({ theme }) => ({
  padding: '4rem 2rem',
  background: 'linear-gradient(135deg, #121212, #1e1e1e)',
  color: '#eee',
  minHeight: '100vh'
}));

const Header = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: '2rem'
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: '2rem',
  backgroundColor: '#1e1e1e',
  borderRadius: '16px',
  marginBottom: '2rem',
  boxShadow: '0px 6px 18px rgba(0,0,0,0.7)'
}));

const SectionBox = styled(motion.div)(({ theme }) => ({
  marginTop: '2rem',
  padding: '1.5rem',
  border: '1px solid #26a69a',
  borderRadius: '12px',
  backgroundColor: '#242424',
  boxShadow: '0px 4px 12px rgba(0,0,0,0.6)'
}));

const GroupSelectWrapper = styled(Box)(({ theme }) => ({
  marginBottom: '1.5rem'
}));

// Updated answer options
const answerOptions = [
  "Fully Implemented",
  "Substantially Implemented",
  "Partially Implemented",
  "Not Implemented",
  "N/A"
];

const groupOptions = ['Govern', 'Map', 'Measure', 'Manage'];

const ComplianceAssessment = () => {
  const [framework, setFramework] = useState('');
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [selectedGroups, setSelectedGroups] = useState([]); // Only for NIST AI RMF
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get('http://localhost:5000/api/csrf-token', { withCredentials: true })
      .then(res => setCsrfToken(res.data.csrfToken))
      .catch(err => console.error("Error fetching CSRF token:", err));
  }, []);

  const handleFrameworkChange = (e) => {
    const selectedFramework = e.target.value;
    setFramework(selectedFramework);
    setSelectedGroups([]);
    axios.get(`http://localhost:5000/api/compliance/questions?framework=${encodeURIComponent(selectedFramework)}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        "x-csrf-token": csrfToken
      }
    })
      .then(res => {
        console.log('Questions fetched:', res.data.questions);
        setQuestions(res.data.questions);
        setResponses({});
      })
      .catch(err => console.error('Error fetching questions:', err));
  };

  // Multi-select handler (only used for NIST AI RMF)
  const handleGroupsChange = (event) => {
    const { target: { value } } = event;
    setSelectedGroups(typeof value === 'string' ? value.split(',') : value);
  };

  const handleResponseChange = (id, value) => {
    setResponses({ ...responses, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!framework) {
      alert('Please select a framework.');
      return;
    }
    // Send selectedGroups only if framework is NIST AI RMF.
    const payload = { framework, responses };
    if (framework === "NIST AI RMF") {
      payload.selectedGroups = selectedGroups;
    }
    axios.post('http://localhost:5000/api/compliance', payload, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        "x-csrf-token": csrfToken
      }
    })
      .then(res => {
        setAssessmentResult(res.data.assessment);
        alert('Compliance assessment submitted successfully.');
      })
      .catch(err => {
        console.error('Error submitting compliance assessment:', err);
        alert('Error submitting compliance assessment.');
      });
  };

  // Group questions by "group"
  const groupedQuestions = questions.reduce((groups, q) => {
    const group = q.group || 'Other';
    if (!groups[group]) groups[group] = [];
    groups[group].push(q);
    return groups;
  }, {});

  // For NIST AI RMF, use selected groups; for Differential Privacy, no grouping.
  const groupsToRender = framework === "NIST AI RMF"
    ? (selectedGroups.length > 0 ? selectedGroups : groupOptions)
    : [];

  // PDF Generation: Wrap text and add page breaks if needed.
  const handleDownloadPDF = () => {
    if (!assessmentResult) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let y = margin;
    const lineHeight = 7;
    doc.setFontSize(16);
    doc.text(`Compliance Assessment Report`, margin, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Framework: ${framework}`, margin, y);
    y += 8;
    doc.text(`Score: ${assessmentResult.score ? assessmentResult.score.toFixed(2) : 0}%`, margin, y);
    y += 10;
    doc.text(`Responses:`, margin, y);
    y += 8;
    Object.entries(responses).forEach(([qid, answer]) => {
      const question = questions.find(q => q.id === qid);
      if (question) {
        // Prepare text with question and answer.
        const text = `${qid} - ${question.question}: ${answer}`;
        // Split text into lines based on available width.
        const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
        // If y + lines height exceeds page height, add a new page.
        if (y + lines.length * lineHeight > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        lines.forEach((line) => {
          doc.text(line, margin, y);
          y += lineHeight;
        });
        y += 2; // add extra spacing
      }
    });
    doc.save(`compliance-assessment-${assessmentResult._id}.pdf`);
  };

  return (
    <ComplianceContainer>
      <Header>
        <Typography variant="h3" sx={{ color: "#26a69a", fontWeight: "bold", mb: 1 }}>
          Compliance & Regulation Assessment
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#aaa" }}>
          Evaluate your organization's adherence to AI security standards.
        </Typography>
      </Header>
      <FormPaper elevation={8}>
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#26a69a" }}>Select Framework</InputLabel>
            <Select
              value={framework}
              label="Select Framework"
              onChange={handleFrameworkChange}
              sx={{ color: "#fff", backgroundColor: "#2e2e2e" }}
            >
              <MenuItem value="NIST AI RMF">NIST AI RMF</MenuItem>
              <MenuItem value="NIST Differential Privacy">NIST Differential Privacy</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {framework === "NIST AI RMF" && (
          <GroupSelectWrapper>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#26a69a" }}>Select Question Groups</InputLabel>
              <Select
                multiple
                value={selectedGroups}
                onChange={handleGroupsChange}
                input={<OutlinedInput label="Select Question Groups" sx={{ color: "#fff" }} />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} sx={{ backgroundColor: "#26a69a", color: "#fff" }} />
                    ))}
                  </Box>
                )}
                sx={{ color: "#fff", backgroundColor: "#2e2e2e" }}
              >
                {groupOptions.map((group) => (
                  <MenuItem key={group} value={group}>
                    {group}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </GroupSelectWrapper>
        )}
        {questions.length > 0 ? (
          <form onSubmit={handleSubmit}>
            {framework === "NIST AI RMF" ? (
              groupsToRender.map((group) => (
                groupedQuestions[group] && groupedQuestions[group].length > 0 && (
                  <SectionBox
                    key={group}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Typography variant="h5" sx={{ color: "#26a69a", mb: 2 }}>
                      {group} Questions
                    </Typography>
                    {groupedQuestions[group].map((q) => (
                      <Box key={q.id} sx={{ mb: 2 }}>
                        <FormControl component="fieldset" fullWidth>
                          <FormLabel component="legend" sx={{ color: "#fff", mb: 1, fontWeight: 500 }}>
                            {q.question}
                          </FormLabel>
                          <RadioGroup
                            row
                            name={q.id}
                            value={responses[q.id] || ""}
                            onChange={(e) => handleResponseChange(q.id, e.target.value)}
                          >
                            {answerOptions.map((option, idx) => (
                              <FormControlLabel
                                key={idx}
                                value={option}
                                control={<Radio sx={{ color: "#fff" }} />}
                                label={option}
                                sx={{ color: "#fff" }}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    ))}
                  </SectionBox>
                )
              ))
            ) : (
              // For NIST Differential Privacy: render all questions in one section.
              <SectionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h5" sx={{ color: "#26a69a", mb: 2 }}>
                  Questions
                </Typography>
                {questions.map((q) => (
                  <Box key={q.id} sx={{ mb: 2 }}>
                    <FormControl component="fieldset" fullWidth>
                      <FormLabel component="legend" sx={{ color: "#fff", mb: 1, fontWeight: 500 }}>
                        {q.question}
                      </FormLabel>
                      <RadioGroup
                        row
                        name={q.id}
                        value={responses[q.id] || ""}
                        onChange={(e) => handleResponseChange(q.id, e.target.value)}
                      >
                        {answerOptions.map((option, idx) => (
                          <FormControlLabel
                            key={idx}
                            value={option}
                            control={<Radio sx={{ color: "#fff" }} />}
                            label={option}
                            sx={{ color: "#fff" }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Box>
                ))}
              </SectionBox>
            )}
            {/* For NIST AI RMF, do not render an additional "Other" section */}
            <Button type="submit" variant="contained" sx={{ bgcolor: "#26a69a", color: "#fff", mt: 3, fontWeight: "bold", fontSize: '1.1rem' }}>
              Submit Assessment
            </Button>
          </form>
        ) : (
          <Typography variant="body1" align="center">
            No questions to display. (Ensure you're logged in and the CSV file is correct.)
          </Typography>
        )}
      </FormPaper>
      {assessmentResult && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ color: "#26a69a", mb: 2 }}>
            Assessment Results
          </Typography>
          <Typography variant="body1">
            Your compliance score is {assessmentResult.score ? assessmentResult.score.toFixed(2) : 0}%.
          </Typography>
          <Button variant="contained" sx={{ bgcolor: "#388e3c", color: "#fff", mt: 2 }} onClick={handleDownloadPDF}>
            Download PDF Report
          </Button>
        </Box>
      )}
    </ComplianceContainer>
  );
};

export default ComplianceAssessment;
