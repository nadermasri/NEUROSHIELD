// client/src/pages/AnalysisDashboard.js
import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Paper, Button, LinearProgress } from '@mui/material';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

// ------------------------
// Styled Components
// ------------------------

const AnalysisContainer = styled(Container)`
  margin-top: 4rem;
  min-height: 100vh;
  color: #ffffff;
  background: linear-gradient(135deg, #0d1117, #1c1e26);
  padding: 2rem;
  border-radius: 8px;
`;

const SectionTitle = styled(Typography)`
  color: #00bcd4;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
`;

const SectionParagraph = styled(Typography)`
  margin-bottom: 1rem;
  text-align: center;
`;

const CardContainer = styled(Paper)`
  background-color: #161b22;
  padding: 1rem 2rem;
  margin: 1rem 0;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0,188,212,0.4);
`;

const ChartPaper = styled(Paper)`
  background-color: #161b22;
  padding: 1rem;
  margin-top: 2rem;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.6);
`;

const RecommendationsPaper = styled(Paper)`
  background-color: #161b22;
  padding: 1rem 2rem;
  margin-top: 2rem;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0,188,212,0.4);
`;

const ActionButton = styled(Button)`
  background: linear-gradient(45deg, #00bcd4, #00838f) !important;
  color: #ffffff !important;
  font-weight: bold;
  margin: 1rem auto !important;
  display: block;
  &:hover {
    background: linear-gradient(45deg, #00838f, #006064) !important;
  }
`;

// ------------------------
// Main Component
// ------------------------

export default function AnalysisDashboard() {
  // Update state: change "model" to "vulnerability"
  const [scoreData, setScoreData] = useState({ code: 0, vulnerability: 0, compliance: 0, attack: 0 });
  const [trendData, setTrendData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the analysis data from your API (ensure backend returns keys: code, vulnerability, compliance, attack)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/analysis', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        // Expect the backend to return { scoreData, trendData, recommendations }
        setScoreData(response.data.scoreData);
        setTrendData(response.data.trendData);
        setRecommendations(response.data.recommendations);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analysis data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handler to download a full report PDF
  const handleDownloadReport = () => {
    const doc = new jsPDF({ unit: 'pt' });
    let y = 40;
    doc.setFontSize(18);
    doc.text('AI Assessment Full Report', 40, y);
    y += 30;

    doc.setFontSize(12);
    doc.text(`Code Assessment: ${scoreData.code}/100`, 40, y);
    y += 20;
    // Replace "Model Assessment" with "Vulnerability Assessment"
    doc.text(`Vulnerability Assessment: ${scoreData.vulnerability}/100`, 40, y);
    y += 20;
    doc.text(`Compliance: ${scoreData.compliance}/100`, 40, y);
    y += 20;
    doc.text(`Attack Simulation: ${scoreData.attack}/100`, 40, y);
    y += 30;

    doc.text('Score Trend Data:', 40, y);
    y += 20;
    trendData.forEach((point, idx) => {
      const line = `${point.day}: Code ${point.code}, Vulnerability ${point.vulnerability}, Compliance ${point.compliance}, Attack ${point.attack}`;
      if (y > 700) {
        doc.addPage();
        y = 40;
      }
      doc.text(line, 40, y);
      y += 15;
    });
    y += 20;
    doc.text('Recommendations:', 40, y);
    y += 20;
    recommendations.forEach((rec, idx) => {
      const line = `${idx + 1}. ${rec}`;
      if (y > 700) {
        doc.addPage();
        y = 40;
      }
      doc.text(line, 40, y);
      y += 15;
    });

    doc.save('AI_Assessment_Full_Report.pdf');
  };

  if (loading) {
    return (
      <AnalysisContainer>
        <Typography variant="h5" align="center">Loading analysis data...</Typography>
      </AnalysisContainer>
    );
  }

  return (
    <AnalysisContainer>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <SectionTitle variant="h4">Your AI Security Analysis</SectionTitle>
        <SectionParagraph variant="body1">
          Below you can review your latest assessment results. The progress bars represent your scores, and the trend chart below shows historical performance.
        </SectionParagraph>
        
        {/* Score Cards/Progress Bars */}
        <Box display="flex" flexDirection="column" gap={2}>
          <CardContainer>
            <Typography variant="h6" style={{ color: '#00bcd4' }}>Code Assessment</Typography>
            <Typography variant="subtitle2">{scoreData.code}/100</Typography>
            <LinearProgress
              variant="determinate"
              value={scoreData.code}
              sx={{ height: 10, borderRadius: 5, marginTop: 1 }}
            />
          </CardContainer>
          
          <CardContainer>
            <Typography variant="h6" style={{ color: '#00bcd4' }}>Vulnerability Assessment</Typography>
            <Typography variant="subtitle2">{scoreData.vulnerability}/100</Typography>
            <LinearProgress
              variant="determinate"
              value={scoreData.vulnerability}
              sx={{ height: 10, borderRadius: 5, marginTop: 1 }}
            />
          </CardContainer>
          
          <CardContainer>
            <Typography variant="h6" style={{ color: '#00bcd4' }}>Compliance</Typography>
            <Typography variant="subtitle2">{scoreData.compliance}/100</Typography>
            <LinearProgress
              variant="determinate"
              value={scoreData.compliance}
              sx={{ height: 10, borderRadius: 5, marginTop: 1 }}
            />
          </CardContainer>
          
          <CardContainer>
            <Typography variant="h6" style={{ color: '#00bcd4' }}>Attack Simulation</Typography>
            <Typography variant="subtitle2">{scoreData.attack}/100</Typography>
            <LinearProgress
              variant="determinate"
              value={scoreData.attack}
              sx={{ height: 10, borderRadius: 5, marginTop: 1 }}
            />
          </CardContainer>
        </Box>

        <Box textAlign="center" mt={2}>
          <ActionButton onClick={handleDownloadReport} variant="contained">
            Download Full Report
          </ActionButton>
        </Box>

        {/* Score Trends Chart */}
        <ChartPaper>
          <Typography variant="h6" style={{ color: '#00bcd4', marginBottom: '1rem' }}>
            Historical Score Trends
          </Typography>
          <Box width="100%" height={300}>
            <ResponsiveContainer>
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="day" stroke="#ffffff" />
                <YAxis domain={[0, 100]} stroke="#ffffff" />
                <Tooltip contentStyle={{ backgroundColor: '#161b22', color: '#fff' }} />
                <Legend wrapperStyle={{ color: '#00bcd4' }}/>
                <Line type="monotone" dataKey="code" stroke="#8884d8" name="Code" strokeWidth={2}/>
                <Line type="monotone" dataKey="vulnerability" stroke="#82ca9d" name="Vulnerability" strokeWidth={2}/>
                <Line type="monotone" dataKey="compliance" stroke="#ffc658" name="Compliance" strokeWidth={2}/>
                <Line type="monotone" dataKey="attack" stroke="#ff7300" name="Attack" strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </ChartPaper>

        {/* Recommendations Section */}
        <RecommendationsPaper>
          <Typography variant="h6" style={{ color: '#00bcd4', marginBottom: '1rem' }}>
            Recommendations:
          </Typography>
          <Box component="ul" sx={{ paddingLeft: '1.2rem', margin: 0 }}>
            {recommendations.map((rec, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem', color: '#ffffff' }}>{rec}</li>
            ))}
          </Box>
        </RecommendationsPaper>
      </motion.div>
    </AnalysisContainer>
  );
}
