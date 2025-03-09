import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Collapse,
  Box,
  Tabs,
  Tab,
  AppBar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

// Dashboard container with dark gradient background
const DashboardContainer = styled(Container)`
  padding: 4rem;
  background: linear-gradient(135deg, #141e30, #243b55);
  min-height: 100vh;
`;

// Paper container with a glassmorphism effect
const StyledPaper = styled(Paper)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
`;

// Styled table with transparent background
const StyledTable = styled(Table)`
  background-color: transparent;
`;

// Custom table cell for table body rows
const StyledTableCell = styled(TableCell)`
  color: #fff;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

// Custom table cell for table header
const StyledTableHeadCell = styled(TableCell)`
  color: #00bcd4;
  font-weight: bold;
  border-bottom: 2px solid rgba(0, 188, 212, 0.8);
`;

// Styled AppBar for tabs
const StyledAppBar = styled(AppBar)`
  background: rgba(0, 0, 0, 0.3);
  box-shadow: none;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

// Helper component for Tab Panels
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`assessment-tabpanel-${index}`}
      aria-labelledby={`assessment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AssessmentDashboard = () => {
  const [assessments, setAssessments] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [csrfToken, setCsrfToken] = useState("");
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCsrfToken();
    fetchAssessments();
  }, []);

  const fetchCsrfToken = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/csrf-token", {
        withCredentials: true,
      });
      setCsrfToken(res.data.csrfToken);
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
  };

  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/assessments/my-assessments",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setAssessments(res.data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      alert("Error fetching assessments");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assessment?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/assessments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-csrf-token": csrfToken,
          },
          withCredentials: true,
        });
        setAssessments(assessments.filter((a) => a._id !== id));
      } catch (error) {
        console.error("Error deleting assessment:", error);
        alert("Error deleting assessment");
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewDetails = (assessment) => {
    setSelectedAssessment(assessment);
    setOpenDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setSelectedAssessment(null);
  };

  // Generate PDF with advanced formatting
  const handleDownloadPDF = (assessment) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = margin;

    // Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Assessment Report", pageWidth / 2, y, { align: "center" });
    y += 12;

    // Separator
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Basic details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const details = [
      `Assessment ID: ${assessment._id}`,
      `Type: ${assessment.type}`,
      `Date: ${new Date(assessment.createdAt).toLocaleString()}`,
      `User: ${assessment.user || "N/A"}`,
    ];
    details.forEach((detail) => {
      doc.text(detail, margin, y);
      y += 8;
    });

    y += 5;
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Vulnerability details if applicable
    if (assessment.type === "vulnerability" || assessment.type === "code") {
      const vulnerabilities =
        assessment.type === "vulnerability"
          ? assessment.data.details || []
          : assessment.data.vulnerabilities || [];
      doc.setFont("helvetica", "bold");
      doc.text("Vulnerability Details:", margin, y);
      y += 8;
      doc.setFont("helvetica", "normal");

      if (vulnerabilities.length === 0) {
        doc.text("No vulnerabilities found.", margin, y);
        y += 8;
      } else {
        vulnerabilities.forEach((vuln, index) => {
          if (y > doc.internal.pageSize.getHeight() - margin - 20) {
            doc.addPage();
            y = margin;
          }
          doc.setFont("helvetica", "bold");
          doc.text(`Vulnerability ${index + 1}:`, margin, y);
          y += 7;
          doc.setFont("helvetica", "normal");
          doc.text(`CVE: ${vuln.CVE}`, margin + 5, y);
          y += 7;
          doc.text(`Attack Type: ${vuln.attack_type}`, margin + 5, y);
          y += 7;
          doc.text(`Severity: ${vuln.severity_score}`, margin + 5, y);
          y += 7;
          const splitMitigation = doc.splitTextToSize(
            `Mitigation: ${vuln.mitigation || "N/A"}`,
            pageWidth - margin - 10
          );
          doc.text(splitMitigation, margin + 5, y);
          y += splitMitigation.length * 7 + 5;
        });
      }
    } else {
      doc.text(
        "No detailed results available for this assessment type.",
        margin,
        y
      );
      y += 8;
    }

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Generated by NeuroShield Dashboard",
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
    doc.save(`assessment-${assessment._id}.pdf`);
  };

  // Filter assessments based on tab
  const filteredAssessments = assessments.filter((assessment) => {
    if (tabValue === 0) return true; // Overall: all
    if (tabValue === 1) return assessment.type === "vulnerability";
    if (tabValue === 2) return assessment.type === "deployed";
    if (tabValue === 3) return assessment.type === "dataset";
    return true;
  });

  return (
    <DashboardContainer>
      <Typography
        variant="h3"
        align="center"
        sx={{ color: "#00bcd4", fontWeight: "bold", mb: 2 }}
      >
        Assessment Dashboard
      </Typography>
      <StyledAppBar position="static" color="default">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            label="Overall"
            id="assessment-tab-0"
            aria-controls="assessment-tabpanel-0"
          />
          <Tab
            label="Framework Vulnerability"
            id="assessment-tab-1"
            aria-controls="assessment-tabpanel-1"
          />
          <Tab
            label="Attack Assessment"
            id="assessment-tab-2"
            aria-controls="assessment-tabpanel-2"
          />
          <Tab
            label="Data Assessment"
            id="assessment-tab-3"
            aria-controls="assessment-tabpanel-3"
          />
        </Tabs>
      </StyledAppBar>
      <TabPanel value={tabValue} index={0}>
        <StyledPaper>
          <EnhancedTable
            assessments={filteredAssessments}
            toggleExpand={toggleExpand}
            expandedId={expandedId}
            handleViewDetails={handleViewDetails}
            handleDelete={handleDelete}
            handleDownloadPDF={handleDownloadPDF}
          />
        </StyledPaper>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <StyledPaper>
          <EnhancedTable
            assessments={filteredAssessments}
            toggleExpand={toggleExpand}
            expandedId={expandedId}
            handleViewDetails={handleViewDetails}
            handleDelete={handleDelete}
            handleDownloadPDF={handleDownloadPDF}
          />
        </StyledPaper>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <StyledPaper>
          <EnhancedTable
            assessments={filteredAssessments}
            toggleExpand={toggleExpand}
            expandedId={expandedId}
            handleViewDetails={handleViewDetails}
            handleDelete={handleDelete}
            handleDownloadPDF={handleDownloadPDF}
          />
        </StyledPaper>
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <StyledPaper>
          <EnhancedTable
            assessments={filteredAssessments}
            toggleExpand={toggleExpand}
            expandedId={expandedId}
            handleViewDetails={handleViewDetails}
            handleDelete={handleDelete}
            handleDownloadPDF={handleDownloadPDF}
          />
        </StyledPaper>
      </TabPanel>

      {/* Enhanced Details Modal */}
      <Dialog
        open={openDetailsModal}
        onClose={handleCloseDetailsModal}
        fullWidth
        maxWidth="md"
        sx={{ backdropFilter: "blur(4px)" }}
      >
        <DialogTitle sx={{ bgcolor: "#00bcd4", color: "#fff" }}>
          Assessment Details
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: "rgba(255,255,255,0.05)" }}>
          {selectedAssessment && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Assessment ID:</strong> {selectedAssessment._id}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Type:</strong> {selectedAssessment.type}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Date:</strong>{" "}
                {new Date(selectedAssessment.createdAt).toLocaleString()}
              </Typography>
              {selectedAssessment.type === "vulnerability" ||
              selectedAssessment.type === "code" ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Vulnerability & Mitigation Details
                  </Typography>
                  {(selectedAssessment.type === "vulnerability" &&
                    selectedAssessment.data.details.length === 0) ||
                  (selectedAssessment.type === "code" &&
                    selectedAssessment.data.vulnerabilities.length === 0) ? (
                    <Typography>No vulnerabilities found.</Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {(selectedAssessment.type === "vulnerability"
                        ? selectedAssessment.data.details
                        : selectedAssessment.data.vulnerabilities
                      ).map((vuln, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <StyledPaper
                            sx={{
                              bgcolor: "#424242",
                              color: "#fff",
                              p: 2,
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                            >
                              Framework: {vuln.framework}
                            </Typography>
                            <Typography variant="subtitle2">
                              <strong>CVE:</strong> {vuln.CVE}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Attack:</strong> {vuln.attack_type}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Severity:</strong> {vuln.severity_score}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Mitigation:</strong>{" "}
                              {vuln.mitigation || "No mitigation provided"}
                            </Typography>
                          </StyledPaper>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              ) : (
                <Typography variant="body1">
                  Detailed results are not available for this assessment type.
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#00bcd4" }}>
          <Button
            onClick={handleCloseDetailsModal}
            variant="contained"
            sx={{ color: "#fff" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContainer>
  );
};

// Enhanced table component with row-by-row layout
const EnhancedTable = ({
  assessments,
  toggleExpand,
  expandedId,
  handleViewDetails,
  handleDelete,
  handleDownloadPDF,
}) => {
  return (
    <StyledTable>
      <TableHead>
        <TableRow>
          <StyledTableHeadCell>Type</StyledTableHeadCell>
          <StyledTableHeadCell>Date</StyledTableHeadCell>
          <StyledTableHeadCell>Count</StyledTableHeadCell>
          <StyledTableHeadCell>Mitigations</StyledTableHeadCell>
          <StyledTableHeadCell>Actions</StyledTableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {assessments.map((assessment) => {
          const vulnerabilities =
            assessment.type === "code"
              ? assessment.data.vulnerabilities || []
              : assessment.type === "vulnerability"
              ? assessment.data.details || []
              : [];
          const count =
            assessment.type === "deployed" || assessment.type === "dataset"
              ? "N/A"
              : vulnerabilities.length;
          return (
            <React.Fragment key={assessment._id}>
              <TableRow
                sx={{
                  transition: "background 0.3s",
                  "&:hover": { background: "rgba(255,255,255,0.1)" },
                }}
              >
                <StyledTableCell>{assessment.type}</StyledTableCell>
                <StyledTableCell>
                  {new Date(assessment.createdAt).toLocaleString()}
                </StyledTableCell>
                <StyledTableCell>{count}</StyledTableCell>
                <StyledTableCell>
                  {vulnerabilities.length > 0 ? (
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "#00bcd4", color: "#fff" }}
                      onClick={() => toggleExpand(assessment._id)}
                    >
                      {expandedId === assessment._id
                        ? "Hide Mitigations"
                        : "Show Mitigations"}
                    </Button>
                  ) : (
                    "N/A"
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: "#00bcd4", color: "#fff", mr: 1 }}
                    onClick={() => handleViewDetails(assessment)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: "#4caf50", color: "#fff", mr: 1 }}
                    onClick={() => handleDownloadPDF(assessment)}
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ borderColor: "#f44336", color: "#f44336" }}
                    onClick={() => handleDelete(assessment._id)}
                  >
                    Delete
                  </Button>
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} sx={{ p: 0 }}>
                  <Collapse
                    in={expandedId === assessment._id}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box
                      sx={{
                        m: 2,
                        bgcolor: "rgba(0,188,212,0.1)",
                        p: 2,
                        borderRadius: "8px",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "#00bcd4", mb: 1 }}
                      >
                        Mitigation Recommendations
                      </Typography>
                      {vulnerabilities.map((vuln, index) => (
                        <StyledPaper
                          key={index}
                          sx={{ bgcolor: "rgba(255,255,255,0.1)", p: 1, mb: 1 }}
                        >
                          <Typography variant="body2">
                            <strong>Framework:</strong> {vuln.framework}
                          </Typography>
                          <Typography variant="body2">
                            <strong>CVE:</strong> {vuln.CVE}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Mitigation:</strong>{" "}
                            {vuln.mitigation || "No mitigation provided"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Attack:</strong> {vuln.attack_type}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Severity:</strong> {vuln.severity_score}
                          </Typography>
                        </StyledPaper>
                      ))}
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          );
        })}
      </TableBody>
    </StyledTable>
  );
};

export default AssessmentDashboard;
