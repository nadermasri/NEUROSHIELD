import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Accordion, AccordionSummary, AccordionDetails, Box, Button } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import styled from 'styled-components';
import axios from 'axios';
import { motion } from 'framer-motion';

const DashboardContainer = styled(Container)`
  padding: 4rem;
`;

const AdminDashboard = () => {
  const [testerMetrics, setTesterMetrics] = useState([]);
  const [selectedTester, setSelectedTester] = useState(null);

  // Fetch testers and their assessment metrics from the backend
  const fetchTesterMetrics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/users', { headers: { Authorization: token } });
      setTesterMetrics(res.data);
    } catch (error) {
      console.error('Error fetching tester metrics:', error);
      alert('Error fetching tester metrics');
    }
  };

  useEffect(() => {
    fetchTesterMetrics();
  }, []);

  // When "View Details" is clicked, set the selected tester.
  // We expect that selectedTester.assessments is an array.
  const handleViewDetails = (testerData) => {
    setSelectedTester(testerData);
  };

  // If a tester is selected, determine their latest assessment (by createdAt)
  const latestAssessment = selectedTester && selectedTester.assessments && selectedTester.assessments.length > 0
    ? selectedTester.assessments.reduce((prev, curr) =>
        new Date(prev.createdAt) > new Date(curr.createdAt) ? prev : curr
      )
    : null;

  return (
    <DashboardContainer>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Typography variant="h3" align="center" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '2rem' }}>
          Admin Dashboard
        </Typography>
        <Paper sx={{ width: '100%', overflowX: 'auto', backgroundColor: '#1a1a1a', marginBottom: '2rem' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: '#00bcd4', fontWeight: 'bold' }}>Tester Name</TableCell>
                <TableCell style={{ color: '#00bcd4', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell style={{ color: '#00bcd4', fontWeight: 'bold' }}>Total Assessments</TableCell>
                <TableCell style={{ color: '#00bcd4', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testerMetrics.map((item) => (
                <TableRow key={item.tester._id}>
                  <TableCell style={{ color: '#ffffff' }}>{item.tester.name}</TableCell>
                  <TableCell style={{ color: '#ffffff' }}>{item.tester.email}</TableCell>
                  <TableCell style={{ color: '#ffffff' }}>{item.assessmentCount}</TableCell>
                  <TableCell>
                    <Button variant="contained" style={{ backgroundColor: '#00bcd4', color: '#ffffff' }} onClick={() => handleViewDetails(item)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        {selectedTester && (
          <Box sx={{ marginTop: '2rem', backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '8px' }}>
            <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
              Details for {selectedTester.tester.name}
            </Typography>
            <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff', marginBottom: '1rem' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
                <Typography style={{ color: '#00bcd4', fontWeight: 'bold' }}>Profile Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  <strong>Email:</strong> {selectedTester.tester.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Joined:</strong> {new Date(selectedTester.tester.createdAt).toLocaleDateString()}
                </Typography>
              </AccordionDetails>
            </Accordion>
            {latestAssessment ? (
              <Accordion style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: '#00bcd4' }} />}>
                  <Typography style={{ color: '#00bcd4', fontWeight: 'bold' }}>Latest Assessment Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    <strong>Assessment Type:</strong> {latestAssessment.type}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Submitted:</strong> {new Date(latestAssessment.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Security Score:</strong> {latestAssessment.data.securityScore ? latestAssessment.data.securityScore + '%' : 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Detected Vulnerabilities:</strong> {latestAssessment.data.vulnerabilities ? latestAssessment.data.vulnerabilities.join(', ') : 'None'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Mitigation Strategies:</strong> {latestAssessment.data.mitigationStrategies ? latestAssessment.data.mitigationStrategies.join(', ') : 'None'}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ) : (
              <Typography variant="body2" style={{ color: '#ffffff' }}>No assessments available for this tester.</Typography>
            )}
            <Button onClick={() => setSelectedTester(null)} variant="outlined" style={{ marginTop: '1rem', color: '#00bcd4', borderColor: '#00bcd4' }}>
              Close Details
            </Button>
          </Box>
        )}
      </motion.div>
    </DashboardContainer>
  );
};

export default AdminDashboard;
