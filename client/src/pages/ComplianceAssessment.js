import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, Paper, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Radio, RadioGroup, FormLabel } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const ComplianceContainer = styled(Container)`
  padding: 4rem;
  background-color: #1a1a1a;
  color: #ffffff;
  min-height: 100vh;
`;

const FormPaper = styled(Paper)`
  padding: 2rem;
  background-color: #2a2a2a;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const ComplianceAssessment = () => {
  const [selectedFramework, setSelectedFramework] = useState('');
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const frameworkOptions = ['NIST AI RMF', 'NIST Differential Privacy', 'ISO27001'];
  const token = localStorage.getItem("token");

  // Fetch CSRF token on mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/csrf-token', { withCredentials: true })
      .then(res => setCsrfToken(res.data.csrfToken))
      .catch(err => console.error("Error fetching CSRF token:", err));
  }, []);

  const handleFrameworkChange = (e) => {
    const framework = e.target.value;
    setSelectedFramework(framework);
    // Fetch questions for the selected framework using "x-csrf-token"
    axios.get(`http://localhost:5000/api/compliance/questions?framework=${encodeURIComponent(framework)}`, { 
      withCredentials: true,
      headers: { 
         Authorization: `Bearer ${token}`,
         "x-csrf-token": csrfToken 
      }
    })
      .then(res => {
        console.log("Fetched questions:", res.data.questions);
        setQuestions(res.data.questions);
        setResponses({});
      })
      .catch(err => console.error('Error fetching questions:', err));
  };

  const handleResponseChange = (id, value) => {
    setResponses({ ...responses, [String(id).trim()]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFramework) {
      alert('Please select a framework.');
      return;
    }
    axios.post('http://localhost:5000/api/compliance', { framework: selectedFramework, responses }, { 
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

  const handleDownloadPDF = () => {
    if (!assessmentResult) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = margin;
    const lineHeight = 7;
  
    const printText = (text, x, initialY) => {
      const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
      lines.forEach((line) => {
        if (initialY + lineHeight > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          initialY = margin;
        }
        doc.text(line, x, initialY);
        initialY += lineHeight;
      });
      return initialY;
    };
  
    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Compliance Assessment Report", pageWidth / 2, margin + 10, { align: "center" });
    y = margin + 22;
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
  
    // Basic Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const details = [
      `Assessment ID: ${assessmentResult._id}`,
      `Framework: ${assessmentResult.framework}`,
      `Score: ${assessmentResult.score ? assessmentResult.score.toFixed(2) : 0}%`,
      `Date: ${new Date(assessmentResult.createdAt).toLocaleString()}`
    ];
    details.forEach(detail => {
      y = printText(detail, margin, y);
    });
    y += 5;
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
  
    // Questionnaire Responses
    doc.setFont("helvetica", "bold");
    y = printText("Questionnaire Responses:", margin, y);
    doc.setFont("helvetica", "normal");
    questions.forEach(q => {
      const userAnswer = (responses[String(q.id)] || "").trim().toLowerCase();
      const expected = q.expectedAnswer;
      y = printText(`Q: ${q.question}`, margin, y);
      y = printText(`Your Answer: ${userAnswer}`, margin + 5, y);
      y = printText(`Expected Answer: ${expected}`, margin + 5, y);
      y += 5; // extra spacing between questions
    });
    y += 5;
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
  
    // Recommendations
    doc.setFont("helvetica", "bold");
    y = printText("Recommendations:", margin, y);
    doc.setFont("helvetica", "normal");
    assessmentResult.recommendations.forEach(rec => {
      y = printText("- " + rec, margin + 5, y);
    });
  
    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Generated by NeuroShield Compliance Tool", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
    doc.save(`compliance-assessment-${assessmentResult._id}.pdf`);
  };

  return (
    <ComplianceContainer>
      <Typography variant="h3" align="center" sx={{ color: "#00bcd4", fontWeight: "bold", mb: 2 }}>
        Compliance & Regulation Assessment
      </Typography>
      <FormPaper elevation={3}>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#00bcd4" }}>Select Framework</InputLabel>
            <Select
              value={selectedFramework}
              label="Select Framework"
              onChange={handleFrameworkChange}
              sx={{ color: "#fff", backgroundColor: "#2a2a2a" }}
            >
              {frameworkOptions.map((framework, idx) => (
                <MenuItem key={idx} value={framework}>{framework}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {questions.length > 0 && (
          <form onSubmit={handleSubmit}>
            {questions.map(q => (
              <Box key={q.id} sx={{ mb: 2 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ color: "#00bcd4" }}>{q.question}</FormLabel>
                  <RadioGroup
                    row
                    name={String(q.id).trim()}
                    value={responses[String(q.id).trim()] || ""}
                    onChange={(e) => handleResponseChange(q.id, e.target.value)}
                  >
                    <FormControlLabel value="yes" control={<Radio sx={{ color: "#00bcd4" }} />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio sx={{ color: "#00bcd4" }} />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Box>
            ))}
            <Button type="submit" variant="contained" sx={{ bgcolor: "#00bcd4", color: "#fff", mt: 2 }}>
              Submit Assessment
            </Button>
          </form>
        )}
      </FormPaper>
      {assessmentResult && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ color: "#00bcd4", mb: 2 }}>
            Assessment Results
          </Typography>
          <Typography variant="body1">
            Your compliance score is {assessmentResult.score ? assessmentResult.score.toFixed(2) : 0}%.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Recommendations:
          </Typography>
          <Box component="ul">
            {assessmentResult.recommendations.map((rec, idx) => (
              <li key={idx}>
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  {rec}
                </Typography>
              </li>
            ))}
          </Box>
          <Button variant="contained" sx={{ bgcolor: "#4caf50", color: "#fff", mt: 2 }} onClick={handleDownloadPDF}>
            Download PDF Report
          </Button>
        </Box>
      )}
    </ComplianceContainer>
  );
};

export default ComplianceAssessment;
