// client/src/pages/AssessmentDashboard.js
import React from 'react';
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
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const DashboardContainer = styled(Container)`
  padding: 4rem;
`;

const VulnerabilityTable = styled(Table)`
  background-color: #1a1a1a;
`;

const AssessmentDashboard = () => {
  const location = useLocation();
  const vulnerabilityData = location.state;

  return (
    <DashboardContainer>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Typography variant="h3" align="center" sx={{ color: '#00bcd4', fontWeight: 'bold', marginBottom: '2rem' }}>
          Assessment Dashboard
        </Typography>
        {vulnerabilityData ? (
          <>
            <Card sx={{ marginBottom: '2rem', backgroundColor: '#1a1a1a' }}>
              <CardHeader
                title={
                  <Typography variant="h5" align="center" sx={{ color: '#00bcd4' }}>
                    Vulnerability Summary
                  </Typography>
                }
                sx={{ backgroundColor: '#121212' }}
              />
              <CardContent>
                <Box sx={{ padding: '1rem' }}>
                  <Typography variant="body1" sx={{ color: '#ffffff' }}>
                    Total Vulnerabilities Found: {vulnerabilityData.summary.total_vulnerabilities}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ffffff' }}>
                    Average Risk Score: {vulnerabilityData.summary.risk_score} ({vulnerabilityData.summary.risk_level} Risk)
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            <Paper sx={{ width: '100%', overflowX: 'auto', backgroundColor: '#1a1a1a' }}>
              <VulnerabilityTable>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#00bcd4', fontWeight: 'bold' }}>Framework</TableCell>
                    <TableCell sx={{ color: '#00bcd4', fontWeight: 'bold' }}>CVE ID</TableCell>
                    <TableCell sx={{ color: '#00bcd4', fontWeight: 'bold' }}>Attack Type</TableCell>
                    <TableCell sx={{ color: '#00bcd4', fontWeight: 'bold' }}>Severity Score</TableCell>
                    <TableCell sx={{ color: '#00bcd4', fontWeight: 'bold' }}>Mitigation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vulnerabilityData.details.map((vuln, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ color: '#ffffff' }}>{vuln.framework}</TableCell>
                      <TableCell sx={{ color: '#ffffff' }}>{vuln.CVE}</TableCell>
                      <TableCell sx={{ color: '#ffffff' }}>{vuln.attack_type}</TableCell>
                      <TableCell sx={{ color: '#ffffff' }}>{vuln.severity_score}</TableCell>
                      <TableCell sx={{ color: '#ffffff' }}>{vuln.mitigation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </VulnerabilityTable>
            </Paper>
          </>
        ) : (
          <Typography variant="body1" align="center" sx={{ color: '#ffffff' }}>
            No vulnerability data available. Please run an assessment.
          </Typography>
        )}
      </motion.div>
    </DashboardContainer>
  );
};

export default AssessmentDashboard;
