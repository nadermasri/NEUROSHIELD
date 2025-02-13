import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const DashboardContainer = styled(Container)`
  padding: 4rem;
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1'];

const AssessmentDashboard = () => {
  const [assessments, setAssessments] = useState([]);
  const [vulnDistribution, setVulnDistribution] = useState([]);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const token = localStorage.getItem('token');
        // Replace with your actual endpoint
        const res = await axios.get('http://localhost:5000/api/assessments/my', { headers: { Authorization: token } });
        setAssessments(res.data);
        
        // Calculate vulnerability distribution based on all assessments
        const distribution = {};
        res.data.forEach((item) => {
          if (item.data && item.data.vulnerabilities) {
            item.data.vulnerabilities.forEach((vuln) => {
              distribution[vuln] = (distribution[vuln] || 0) + 1;
            });
          }
        });
        const distArray = Object.keys(distribution).map((key) => ({ name: key, value: distribution[key] }));
        setVulnDistribution(distArray);
      } catch (error) {
        console.error('Error fetching assessments:', error);
      }
    };

    fetchAssessments();
  }, []);

  // Prepare data for the line chart: security score trend over time.
  const lineChartData = assessments.map((item) => ({
    date: new Date(item.createdAt).toLocaleDateString(),
    securityScore: item.data && item.data.securityScore ? item.data.securityScore : 0
  }));

  return (
    <DashboardContainer>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Typography variant="h3" align="center" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '2rem' }}>
          Assessment Dashboard
        </Typography>
        <Grid container spacing={3}>
          {/* Security Score Trend (Line Chart) */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ backgroundColor: '#1a1a1a', padding: '1rem' }}>
              <Typography variant="h5" style={{ color: '#00bcd4', marginBottom: '1rem' }}>
                Security Score Trend
              </Typography>
              <LineChart
                width={500}
                height={300}
                data={lineChartData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="date" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="securityScore" stroke="#00bcd4" activeDot={{ r: 8 }} />
              </LineChart>
            </Paper>
          </Grid>
          {/* Vulnerability Distribution (Pie Chart) */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ backgroundColor: '#1a1a1a', padding: '1rem' }}>
              <Typography variant="h5" style={{ color: '#00bcd4', marginBottom: '1rem' }}>
                Vulnerability Distribution
              </Typography>
              <PieChart width={500} height={300}>
                <Pie
                  data={vulnDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#00bcd4"
                  label
                >
                  {vulnDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </Paper>
          </Grid>
          {/* Mitigation Strategies */}
          <Grid item xs={12}>
            <Paper sx={{ backgroundColor: '#1a1a1a', padding: '1rem' }}>
              <Typography variant="h5" style={{ color: '#00bcd4', marginBottom: '1rem' }}>
                Mitigation Strategies
              </Typography>
              {assessments.length > 0 && assessments[0].data && assessments[0].data.mitigationStrategies ? (
                assessments[0].data.mitigationStrategies.map((strategy, idx) => (
                  <Typography key={idx} variant="body1" style={{ marginBottom: '0.5rem' }}>
                    • {strategy}
                  </Typography>
                ))
              ) : (
                <Typography variant="body1">No mitigation strategies available.</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </DashboardContainer>
  );
};

export default AssessmentDashboard;
