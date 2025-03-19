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
      const res = await axios.get("http://localhost:5000/api/assessments/my-assessments", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setAssessments(res.data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      alert("Error fetching assessments");
    }
  };

  // Update the current tab index
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Delete an assessment (attempt from both collections)
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

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleViewDetails = (assessment) => {
    setSelectedAssessment(assessment);
    setOpenDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
    setSelectedAssessment(null);
  };

  // PDF Generation – updated to print questionnaire details if saved
  const handleDownloadPDF = (assessment) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = margin;
    const lineHeight = 7;

    const printText = (text, x, initialY) => {
      const lines = doc.splitTextToSize(String(text), pageWidth - margin * 2);
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

    const sanitizeText = (text) => {
      if (text === null || text === undefined) return "";
      return String(text).replace(/[^\x20-\x7E]+/g, "");
    };

    if (assessment.type.toLowerCase() === "compliance") {
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Compliance Assessment Report", pageWidth / 2, margin + 10, { align: "center" });
      y = margin + 22;
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      y = printText(`Assessment ID: ${sanitizeText(assessment._id)}`, margin, y);
      y = printText(`Framework: ${sanitizeText(assessment.framework || "N/A")}`, margin, y);
      y = printText(`Date: ${new Date(assessment.createdAt).toLocaleString()}`, margin, y);
      y = printText(`Score: ${assessment.score ? assessment.score.toFixed(2) : "N/A"}%`, margin, y);
      // Print questionnaire responses if saved
      if (assessment.questions && assessment.responses) {
        doc.setFont("helvetica", "bold");
        y = printText("Questionnaire Responses:", margin, y);
        doc.setFont("helvetica", "normal");
        assessment.questions.forEach((q) => {
          const userAnswer = (assessment.responses[String(q.id)] || "").trim();
          y = printText(`Q: ${sanitizeText(q.question)}`, margin, y);
          y = printText(`Your Answer: ${sanitizeText(userAnswer)}`, margin + 5, y);
          y = printText(`Expected Answer: ${sanitizeText(q.expectedAnswer)}`, margin + 5, y);
          y += 5;
        });
      } else {
        y = printText("Questionnaire details not available.", margin, y);
      }
      if (assessment.recommendations && assessment.recommendations.length > 0) {
        y = printText("Recommendations:", margin, y);
        assessment.recommendations.forEach((rec) => {
          y = printText(`- ${sanitizeText(rec)}`, margin + 5, y);
        });
      } else {
        y = printText("No recommendations available.", margin, y);
      }
    } else if (assessment.type.toLowerCase() === "vulnerability") {
      const vulnerabilities = assessment.data.details || [];
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Vulnerability Assessment Report", pageWidth / 2, margin + 10, { align: "center" });
      y = margin + 22;
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      y = printText(`Assessment ID: ${sanitizeText(assessment._id)}`, margin, y);
      y = printText(`Date: ${new Date(assessment.createdAt).toLocaleString()}`, margin, y);
      if (vulnerabilities.length === 0) {
        y = printText("No vulnerabilities found.", margin, y);
      } else {
        doc.setFont("helvetica", "bold");
        y = printText("Vulnerability & Mitigation Details:", margin, y);
        doc.setFont("helvetica", "normal");
        vulnerabilities.forEach((vuln, index) => {
          if (y > doc.internal.pageSize.getHeight() - margin - 20) {
            doc.addPage();
            y = margin;
          }
          doc.setFont("helvetica", "bold");
          y = printText(`Vulnerability ${index + 1}:`, margin, y);
          doc.setFont("helvetica", "normal");
          y = printText(`CVE: ${sanitizeText(vuln.CVE)}`, margin + 5, y);
          y = printText(`Attack Type: ${sanitizeText(vuln.attack_type)}`, margin + 5, y);
          y = printText(`Severity: ${sanitizeText(vuln.severity_score)}`, margin + 5, y);
          y = printText(`Mitigation: ${sanitizeText(vuln.mitigation) || "N/A"}`, margin + 5, y);
          y += 5;
        });
      }
    } else if (assessment.type.toLowerCase() === "code") {
      const fileResults = assessment.data.vulnerabilities || [];
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Code Assessment Report", pageWidth / 2, margin + 10, { align: "center" });
      y = margin + 22;
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      y = printText(`Assessment ID: ${sanitizeText(assessment._id)}`, margin, y);
      y = printText(`Date: ${new Date(assessment.createdAt).toLocaleString()}`, margin, y);
      y = printText(`User: ${sanitizeText(assessment.user || "N/A")}`, margin, y);
      if (fileResults.length === 0) {
        y = printText("No vulnerabilities found.", margin, y);
      } else {
        fileResults.forEach((result) => {
          if (y > doc.internal.pageSize.getHeight() - margin - 20) {
            doc.addPage();
            y = margin;
          }
          doc.setFont("helvetica", "bold");
          y = printText(`File: ${sanitizeText(result.file)}`, margin, y);
          doc.setFont("helvetica", "normal");
          if (Array.isArray(result.issues) && result.issues.length > 0) {
            result.issues.forEach((issue) => {
              if (issue.issue_text) {
                y = printText(`🔴 Issue: ${sanitizeText(issue.issue_text)}`, margin + 5, y);
                y = printText(
                  `⚠️ Severity: ${sanitizeText(issue.issue_severity) || "N/A"} | 🔍 Confidence: ${sanitizeText(issue.issue_confidence) || "N/A"}`,
                  margin + 5,
                  y
                );
                y = printText(`📌 Line: ${sanitizeText(issue.line_number) || "N/A"}`, margin + 5, y);
                y = printText(`🔗 More Info: ${sanitizeText(issue.more_info) || "N/A"}`, margin + 5, y);
              } else {
                y = printText("No vulnerability details provided.", margin + 5, y);
              }
            });
          } else {
            y = printText(`- ${sanitizeText(result.issues)}`, margin + 5, y);
          }
          y += 5;
        });
      }
    } else {
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Assessment Report", pageWidth / 2, margin + 10, { align: "center" });
      y = margin + 22;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      y = printText(`Assessment ID: ${sanitizeText(assessment._id)}`, margin, y);
      y = printText(`Type: ${sanitizeText(assessment.type)}`, margin, y);
      y = printText(`Date: ${new Date(assessment.createdAt).toLocaleString()}`, margin, y);
      y = printText(`User: ${sanitizeText(assessment.user || "N/A")}`, margin, y);
    }

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Generated by NeuroShield Dashboard", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
    doc.save(`assessment-${assessment._id}.pdf`);
  };

  // Filter assessments by tab (Overall, Vulnerability, Attack, Code, Compliance)
  const filteredAssessments = assessments.filter((assessment) => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return assessment.type.toLowerCase() === "vulnerability";
    if (tabValue === 2) return assessment.type.toLowerCase() === "deployed";
    if (tabValue === 3) return assessment.type.toLowerCase() === "code";
    if (tabValue === 4) return assessment.type.toLowerCase() === "compliance";
    return true;
  });

  return (
    <DashboardContainer>
      <Typography variant="h3" align="center" sx={{ color: "#00bcd4", fontWeight: "bold", mb: 2 }}>
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
          <Tab label="Overall" id="assessment-tab-0" aria-controls="assessment-tabpanel-0" />
          <Tab label="Framework Vulnerability" id="assessment-tab-1" aria-controls="assessment-tabpanel-1" />
          <Tab label="Attack Assessment" id="assessment-tab-2" aria-controls="assessment-tabpanel-2" />
          <Tab label="Code Assessment" id="assessment-tab-3" aria-controls="assessment-tabpanel-3" />
          <Tab label="Compliance" id="assessment-tab-4" aria-controls="assessment-tabpanel-4" />
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
      <TabPanel value={tabValue} index={4}>
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
                <strong>Date:</strong> {new Date(selectedAssessment.createdAt).toLocaleString()}
              </Typography>
              {selectedAssessment.type.toLowerCase() === "compliance" ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Compliance Assessment Details
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Score:</strong> {selectedAssessment.score ? selectedAssessment.score.toFixed(2) : 0}%
                  </Typography>
                  {selectedAssessment.questions && selectedAssessment.responses ? (
                    <>
                      <Typography variant="body2">
                        <strong>Questionnaire Responses:</strong>
                      </Typography>
                      {selectedAssessment.questions.map((q) => (
                        <Box key={q.id} sx={{ mb: 1, p: 1, bgcolor: "#424242", borderRadius: "8px" }}>
                          <Typography variant="body2">
                            <strong>{q.id} - {q.question}</strong>
                          </Typography>
                          <Typography variant="body2">
                            <strong>Your Answer:</strong> {selectedAssessment.responses[String(q.id)] || "N/A"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Expected Answer:</strong> {q.expectedAnswer}
                          </Typography>
                        </Box>
                      ))}
                    </>
                  ) : (
                    <Typography variant="body2">Questionnaire details not available.</Typography>
                  )}
                  {selectedAssessment.recommendations && selectedAssessment.recommendations.length > 0 ? (
                    <>
                      <Typography variant="body2">
                        <strong>Recommendations:</strong>
                      </Typography>
                      {selectedAssessment.recommendations.map((rec, idx) => (
                        <Typography key={idx} variant="body2" sx={{ ml: 2 }}>
                          - {rec}
                        </Typography>
                      ))}
                    </>
                  ) : (
                    <Typography variant="body2">No recommendations available.</Typography>
                  )}
                </Box>
              ) : selectedAssessment.type.toLowerCase() === "vulnerability" ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Vulnerability & Mitigation Details
                  </Typography>
                  {selectedAssessment.data.details && selectedAssessment.data.details.length === 0 ? (
                    <Typography>No vulnerabilities found.</Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {selectedAssessment.data.details && selectedAssessment.data.details.map((vuln, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Paper
                            sx={{
                              bgcolor: "#424242",
                              color: "#fff",
                              p: 2,
                              mb: 1,
                            }}
                          >
                            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
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
                              <strong>Mitigation:</strong> {vuln.mitigation || "No mitigation provided"}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              ) : selectedAssessment.type.toLowerCase() === "code" ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Code Assessment Output
                  </Typography>
                  {selectedAssessment.data.vulnerabilities && selectedAssessment.data.vulnerabilities.length === 0 ? (
                    <Typography>No vulnerabilities found.</Typography>
                  ) : (
                    selectedAssessment.data.vulnerabilities && selectedAssessment.data.vulnerabilities.map((result, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          bgcolor: "#424242",
                          color: "#fff",
                          p: 2,
                          mb: 2,
                          borderRadius: "8px",
                        }}
                      >
                        <Typography variant="subtitle1">
                          <strong>File:</strong> {result.file}
                        </Typography>
                        {Array.isArray(result.issues) && result.issues.length > 0 ? (
                          result.issues.map((issue, i) => (
                            <Box key={i} sx={{ mt: 1 }}>
                              {issue.issue_text ? (
                                <>
                                  <Typography variant="body2">
                                    🔴 <strong>Issue:</strong> {issue.issue_text}
                                  </Typography>
                                  <Typography variant="body2">
                                    ⚠️ <strong>Severity:</strong> {issue.issue_severity || "N/A"} | 🔍 <strong>Confidence:</strong> {issue.issue_confidence || "N/A"}
                                  </Typography>
                                  <Typography variant="body2">
                                    📌 <strong>Line:</strong> {issue.line_number || "N/A"}
                                  </Typography>
                                  <Typography variant="body2">
                                    🔗 <strong>More Info:</strong>{" "}
                                    {issue.more_info ? (
                                      <a href={issue.more_info} target="_blank" rel="noopener noreferrer" style={{ color: "#00bcd4" }}>
                                        {issue.more_info}
                                      </a>
                                    ) : (
                                      "N/A"
                                    )}
                                  </Typography>
                                </>
                              ) : (
                                <Typography variant="body2">
                                  No vulnerability details provided.
                                </Typography>
                              )}
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2">No vulnerability details provided.</Typography>
                        )}
                      </Box>
                    ))
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
          <Button onClick={handleCloseDetailsModal} variant="contained" sx={{ color: "#fff" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContainer>
  );
};

// Enhanced table component with an added "Compliance" column.
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
          <StyledTableHeadCell>Compliance</StyledTableHeadCell>
          <StyledTableHeadCell>Mitigations</StyledTableHeadCell>
          <StyledTableHeadCell>Actions</StyledTableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {assessments.map((assessment) => {
          let vulnerabilities = [];
          if (assessment.type.toLowerCase() === "code") {
            vulnerabilities = assessment.data.vulnerabilities || [];
          } else if (assessment.type.toLowerCase() === "vulnerability") {
            vulnerabilities = assessment.data.details || [];
          }
          const count = assessment.type.toLowerCase() === "deployed" ? "N/A" : vulnerabilities.length;
          return (
            <React.Fragment key={assessment._id}>
              <TableRow
                sx={{
                  transition: "background 0.3s",
                  "&:hover": { background: "rgba(255,255,255,0.1)" },
                }}
              >
                <StyledTableCell>{assessment.type}</StyledTableCell>
                <StyledTableHeadCell>
                  {new Date(assessment.createdAt).toLocaleString()}
                </StyledTableHeadCell>
                <StyledTableCell>{count}</StyledTableCell>
                <StyledTableHeadCell>
                  {assessment.type.toLowerCase() === "compliance" ? (
                    assessment.score ? `${assessment.score.toFixed(2)}%` : "N/A"
                  ) : (
                    "N/A"
                  )}
                </StyledTableHeadCell>
                <StyledTableHeadCell>
                  {assessment.type.toLowerCase() === "vulnerability" && vulnerabilities.length > 0 ? (
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "#00bcd4", color: "#fff" }}
                      onClick={() => toggleExpand(assessment._id)}
                    >
                      {expandedId === assessment._id ? "Hide Mitigations" : "Show Mitigations"}
                    </Button>
                  ) : (
                    "N/A"
                  )}
                </StyledTableHeadCell>
                <StyledTableHeadCell>
                  {(assessment.type.toLowerCase() === "compliance" ||
                    assessment.type.toLowerCase() === "vulnerability") ? (
                    <>
                      <Button
                        variant="contained"
                        sx={{ bgcolor: "#00bcd4", color: "#fff", mr: 1 }}
                        onClick={() => handleViewDetails(assessment)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{ borderColor: "#f44336", color: "#f44336", mr: 1 }}
                        onClick={() => handleDelete(assessment._id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ bgcolor: "#4caf50", color: "#fff" }}
                        onClick={() => handleDownloadPDF(assessment)}
                      >
                        PDF
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        sx={{ bgcolor: "#00bcd4", color: "#fff", mr: 1 }}
                        onClick={() => handleViewDetails(assessment)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{ borderColor: "#f44336", color: "#f44336" }}
                        onClick={() => handleDelete(assessment._id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </StyledTableHeadCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} sx={{ p: 0 }}>
                  <Collapse in={expandedId === assessment._id} timeout="auto" unmountOnExit>
                    <Box sx={{ m: 2, bgcolor: "rgba(0,188,212,0.1)", p: 2, borderRadius: "8px" }}>
                      <Typography variant="subtitle1" sx={{ color: "#00bcd4", mb: 1 }}>
                        Mitigation Recommendations
                      </Typography>
                      {vulnerabilities.map((vuln, index) => (
                        <Paper key={index} sx={{ bgcolor: "#424242", color: "#fff", p: 1, mb: 1 }}>
                          <Typography variant="body2">
                            <strong>Framework:</strong> {vuln.framework}
                          </Typography>
                          <Typography variant="body2">
                            <strong>CVE:</strong> {vuln.CVE}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Mitigation:</strong> {vuln.mitigation || "No mitigation provided"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Attack:</strong> {vuln.attack_type}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Severity:</strong> {vuln.severity_score}
                          </Typography>
                          {vuln.fixCommand &&
                            vuln.fixCommand !== "No fix command available" && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                  Fix Command:
                                </Typography>
                                <Typography variant="body2" sx={{ fontStyle: "italic", mb: 1 }}>
                                  {vuln.fixCommand}
                                </Typography>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => {
                                    navigator.clipboard.writeText(vuln.fixCommand)
                                      .then(() => alert("Fix command copied to clipboard!"))
                                      .catch(err => console.error("Clipboard error:", err));
                                  }}
                                >
                                  Copy
                                </Button>
                              </Box>
                            )}
                        </Paper>
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
