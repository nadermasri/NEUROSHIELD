// client/src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box, Button } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import styled from 'styled-components';
import axios from 'axios';
import { motion } from 'framer-motion';

const DashboardContainer = styled(Container)`
  padding: 4rem;
`;

const MessagesSection = styled(Paper)`
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 2rem;
  margin-top: 2rem;
`;

const AdminDashboard = () => {
  const [testerMetrics, setTesterMetrics] = useState([]);
  const [selectedTester, setSelectedTester] = useState(null);
  const [contactMessages, setContactMessages] = useState([]);

  // Function to fetch tester metrics
  const fetchTesterMetrics = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTesterMetrics(res.data);
    } catch (error) {
      console.error('Error fetching tester metrics:', error);
      alert('Error fetching tester metrics');
    }
  };

  // Function to fetch contact messages (admin only)
  const fetchContactMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/contacts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContactMessages(res.data);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      alert('Error fetching contact messages');
    }
  };

  useEffect(() => {
    fetchTesterMetrics();
    fetchContactMessages();
  }, []);

  return (
    <DashboardContainer>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Typography variant="h3" align="center" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '2rem' }}>
          Admin Dashboard
        </Typography>
        {/* Existing Tester Metrics Table */}
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
                    <Button
                      variant="contained"
                      style={{ backgroundColor: '#00bcd4', color: '#ffffff' }}
                      onClick={() => setSelectedTester(item)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* Contact Messages Section (Admin Only) */}
        <MessagesSection elevation={3}>
          <Typography variant="h4" align="center" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
            Contact Messages
          </Typography>
          {contactMessages.length === 0 ? (
            <Typography variant="body1" style={{ color: '#ffffff' }}>
              No messages received.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: '#00bcd4', fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell style={{ color: '#00bcd4', fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell style={{ color: '#00bcd4', fontWeight: 'bold' }}>Subject</TableCell>
                  <TableCell style={{ color: '#00bcd4', fontWeight: 'bold' }}>Message</TableCell>
                  <TableCell style={{ color: '#00bcd4', fontWeight: 'bold' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contactMessages.map((msg) => (
                  <TableRow key={msg._id}>
                    <TableCell style={{ color: '#00bcd4' }}>{msg.name}</TableCell>
                    <TableCell style={{ color: '#d3d3d3' }}>{msg.email}</TableCell>
                    <TableCell style={{ color: '#d3d3d3' }}>{msg.subject || 'N/A'}</TableCell>
                    <TableCell style={{ color: '#d3d3d3' }}>{msg.message}</TableCell>
                    <TableCell style={{ color: '#d3d3d3' }}>{new Date(msg.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </MessagesSection>

        {/* Optional: Additional admin functionality (e.g., viewing tester details) */}
        {selectedTester && (
          <Box sx={{ marginTop: '2rem', backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '8px' }}>
            <Typography variant="h5" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
              Details for {selectedTester.tester.name}
            </Typography>
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
