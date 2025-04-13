// client/src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useMediaQuery
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import styled from 'styled-components';
import axios from "axios";
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';

// Styled Components

// Dashboard container with a subtle gradient background
const DashboardContainer = styled(Container)`
  padding: 4rem;
  background: linear-gradient(135deg, #0d1117 0%, #1c1e26 100%);
  min-height: 100vh;
`;

// Header styling with refresh icon
const Header = styled(Box)`
  text-align: center;
  margin-bottom: 3rem;
  color: #00bcd4;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

// Metrics section styling
const MetricsContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled(Paper)`
  background-color: #161b22;
  color: #00bcd4;
  padding: 1.5rem 2rem;
  flex: 1 1 200px;
  text-align: center;
  border-radius: 12px;
  border: 2px solid #00bcd4;
  box-shadow: 0px 4px 8px rgba(0, 188, 212, 0.4);
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const IconWrapper = styled(Box)`
  margin-bottom: 0.5rem;
  font-size: 2rem;
`;

// Control Bar for search and report actions
const ControlBar = styled(Box)`
  margin-bottom: 2rem;
  text-align: center;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

// Gradient Button for consistent styling
const GradientButton = styled(Button)`
  background: linear-gradient(45deg, #00bcd4, #00838f);
  color: #ffffff;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 188, 212, 0.6);
  &:hover {
    background: linear-gradient(45deg, #00838f, #006064);
  }
`;

// SectionPaper for messages and notifications
const SectionPaper = styled(Paper)`
  background-color: #161b22;
  color: #ffffff;
  padding: 2rem;
  margin-top: 2rem;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.6);
`;

// Table header cell for consistent styling
const TableHeaderCell = styled(TableCell)`
  color: #00bcd4 !important;
  font-weight: bold !important;
  padding: 0.75rem !important;
`;

// THIS IS THE MISSING DEFINITION:
// NotificationsSection is a styled component for the notifications panel.
const NotificationsSection = styled(Paper)`
  background-color: #161b22;
  color: #ffffff;
  padding: 1.5rem;
  margin-top: 2rem;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.6);
`;

// Tester Details Dialog styles
const DetailsBox = styled(Box)`
  background-color: #161b22;
  padding: 1rem;
  border-radius: 8px;
  color: #ffffff;
  margin-top: 1rem;
`;

const TesterDetailsDialog = ({ open, onClose, tester }) => {
  const handleDownloadTesterPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(16);
    doc.text(`Tester Report`, 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Name: ${tester.tester.name}`, 20, y);
    y += 7;
    doc.text(`Email: ${tester.tester.email}`, 20, y);
    y += 7;
    doc.text(`Total Assessments: ${tester.assessmentCount}`, 20, y);
    y += 7;
    // You can add additional tester information here
    doc.save(`tester-report-${tester.tester.name.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle style={{ backgroundColor: '#00bcd4', color: '#fff' }}>Tester Details</DialogTitle>
      <DialogContent dividers style={{ backgroundColor: '#161b22' }}>
        {tester ? (
          <DetailsBox>
            <Typography variant="h6" gutterBottom>
              {tester.tester.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Email:</strong> {tester.tester.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Total Assessments:</strong> {tester.assessmentCount}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Last Login:</strong> N/A
            </Typography>
            {/* Add additional tester details here */}
          </DetailsBox>
        ) : (
          <Typography>No tester details available.</Typography>
        )}
      </DialogContent>
      <DialogActions style={{ backgroundColor: '#00bcd4' }}>
        <GradientButton onClick={handleDownloadTesterPDF}>Download PDF</GradientButton>
        <GradientButton onClick={onClose} variant="outlined" style={{ borderColor: '#00bcd4', color: '#fff' }}>
          Close
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
};

const AdminDashboard = () => {
  const [testerMetrics, setTesterMetrics] = useState([]);
  const [selectedTester, setSelectedTester] = useState(null);
  const [contactMessages, setContactMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);
  const isMobile = useMediaQuery('(max-width:600px)');

  // Fetch tester metrics from API
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

  // Fetch contact messages from API
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

  // Dummy notifications data
  const fetchNotifications = async () => {
    const dummyNotifications = [
      { id: 1, message: 'New tester registered: John Doe.' },
      { id: 2, message: 'System maintenance scheduled for Saturday, 2 AM.' },
      { id: 3, message: 'Monthly report is now available for download.' }
    ];
    setNotifications(dummyNotifications);
  };

  useEffect(() => {
    fetchTesterMetrics();
    fetchContactMessages();
    fetchNotifications();
  }, []);

  // Filter tester metrics based on search term
  const filteredTesterMetrics = testerMetrics.filter(item =>
    item.tester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tester.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Summary Metrics
  const totalTesters = testerMetrics.length;
  const totalAssessments = testerMetrics.reduce((sum, item) => sum + item.assessmentCount, 0);
  const averageAssessments = totalTesters > 0 ? (totalAssessments / totalTesters).toFixed(2) : 0;

  // Overall Report PDF Generation
  const handleDownloadOverallReport = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(18);
    doc.text("Admin Dashboard Report", 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Total Testers: ${totalTesters}`, 20, y);
    y += 7;
    doc.text(`Total Assessments: ${totalAssessments}`, 20, y);
    y += 7;
    doc.text(`Average Assessments per Tester: ${averageAssessments}`, 20, y);
    y += 10;
    doc.text("Tester Details:", 20, y);
    y += 7;
    testerMetrics.forEach((item, idx) => {
      const line = `${idx + 1}. ${item.tester.name} (${item.tester.email}) - Assessments: ${item.assessmentCount}`;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 20, y);
      y += 7;
    });
    doc.save("Admin_Dashboard_Report.pdf");
  };

  return (
    <DashboardContainer>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Header>
          <Typography variant="h3">Admin Dashboard</Typography>
          <IconButton onClick={fetchTesterMetrics} style={{ color: '#00bcd4' }}>
            <RefreshIcon />
          </IconButton>
        </Header>

        {/* Summary Metrics Section */}
        <MetricsContainer>
          <MetricCard elevation={3}>
            <IconWrapper>
              <GroupIcon fontSize={isMobile ? 'medium' : 'large'} />
            </IconWrapper>
            <Typography variant="h6">Total Testers</Typography>
            <Typography variant="h4">{totalTesters}</Typography>
          </MetricCard>
          <MetricCard elevation={3}>
            <IconWrapper>
              <AssessmentIcon fontSize={isMobile ? 'medium' : 'large'} />
            </IconWrapper>
            <Typography variant="h6">Total Assessments</Typography>
            <Typography variant="h4">{totalAssessments}</Typography>
          </MetricCard>
          <MetricCard elevation={3}>
            <IconWrapper>
              <AssessmentIcon fontSize={isMobile ? 'medium' : 'large'} />
            </IconWrapper>
            <Typography variant="h6">Avg Assessments/Testers</Typography>
            <Typography variant="h4">{averageAssessments}</Typography>
          </MetricCard>
          <MetricCard elevation={3}>
            <IconWrapper>
              <MessageIcon fontSize={isMobile ? 'medium' : 'large'} />
            </IconWrapper>
            <Typography variant="h6">Contact Messages</Typography>
            <Typography variant="h4">{contactMessages.length}</Typography>
          </MetricCard>
        </MetricsContainer>

        {/* Control Bar */}
        <ControlBar>
          <TextField 
            label="Search Testers"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              backgroundColor: '#ffffff',
              width: '300px'
            }}
          />
          <GradientButton onClick={handleDownloadOverallReport}>
            Download Overall PDF
          </GradientButton>
        </ControlBar>

        {/* Tester Metrics Table */}
        <Paper sx={{ width: '100%', overflowX: 'auto', backgroundColor: '#161b22', marginBottom: '2rem', borderRadius: '12px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Tester Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Total Assessments</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTesterMetrics.map((item) => (
                <TableRow key={item.tester._id} sx={{ '&:hover': { backgroundColor: '#232a33' } }}>
                  <TableCell style={{ color: '#ffffff' }}>{item.tester.name}</TableCell>
                  <TableCell style={{ color: '#ffffff' }}>{item.tester.email}</TableCell>
                  <TableCell style={{ color: '#ffffff' }}>{item.assessmentCount}</TableCell>
                  <TableCell>
                    <GradientButton
                      onClick={() => setSelectedTester(item)}
                      size="small"
                      style={{ textTransform: 'none' }}
                    >
                      View Details
                    </GradientButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* Contact Messages Section */}
        <SectionPaper>
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
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Email</TableHeaderCell>
                  <TableHeaderCell>Subject</TableHeaderCell>
                  <TableHeaderCell>Message</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contactMessages.map((msg) => (
                  <TableRow key={msg._id} sx={{ '&:hover': { backgroundColor: '#232a33' } }}>
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
        </SectionPaper>

        {/* Notifications Section */}
        <NotificationsSection elevation={3}>
          <Typography variant="h5" align="center" style={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '1rem' }}>
            System Notifications
          </Typography>
          {notifications.length === 0 ? (
            <Typography variant="body1">No new notifications.</Typography>
          ) : (
            notifications.map(notification => (
              <Box key={notification.id} sx={{ marginBottom: '0.5rem', padding: '0.5rem', borderBottom: '1px solid #424242' }}>
                <Typography variant="body2">{notification.message}</Typography>
              </Box>
            ))
          )}
        </NotificationsSection>

        {/* Tester Details Dialog */}
        {selectedTester && (
          <TesterDetailsDialog
            open={Boolean(selectedTester)}
            onClose={() => setSelectedTester(null)}
            tester={selectedTester}
          />
        )}
      </motion.div>
    </DashboardContainer>
  );
};

export default AdminDashboard;
