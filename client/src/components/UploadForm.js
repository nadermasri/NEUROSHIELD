import React, { useState, useEffect } from "react";
import { Button, Typography, Box, CircularProgress, Paper, Container } from "@mui/material";
import styled from "styled-components";
import UploadIcon from "@mui/icons-material/Upload";
import axios from "axios";

const AssessmentContainer = styled(Container)`
  min-height: 100vh;
  padding: 5rem 10%;
  background-color: #1a1a1a;
  color: #ffffff;
  text-align: center;
`;

const FormBox = styled.div`
  background: rgba(30, 30, 30, 0.95);
  padding: 3rem 4rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
`;

const UploadSection = styled(Box)`
  margin-top: 3rem;
  text-align: center;
`;

const UploadForm = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/csrf-token", { withCredentials: true })
      .then((res) => setCsrfToken(res.data.csrfToken))
      .catch((err) => console.error("Error fetching CSRF token:", err));
  }, []);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFiles) {
      setError("Please select files to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/scan", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-csrf-token": csrfToken,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setResult(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Upload Error:", err);
      setError("File upload failed. Check the console for details.");
      setLoading(false);
    }
  };

  return (
    <AssessmentContainer>
      <FormBox>
        <Typography variant="h6" align="center" style={{ marginBottom: "1rem", color: "#cccccc" }}>
          Upload your Python code to analyze security vulnerabilities.
        </Typography>

        <form onSubmit={handleUpload}>
          <UploadSection>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
              sx={{
                backgroundColor: "#00bcd4",
                color: "#ffffff",
                fontWeight: "bold",
                padding: "0.8rem 2rem",
              }}
            >
              {selectedFiles ? "Change Files" : "Upload Files"}
              <input type="file" multiple hidden onChange={handleFileChange} accept=".py, .zip" />
            </Button>
            {selectedFiles && (
              <Typography variant="body1" sx={{ marginTop: "1rem" }}>
                Selected Files: {Array.from(selectedFiles).map((file) => file.name).join(", ")}
              </Typography>
            )}
          </UploadSection>

          <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#00bcd4",
                color: "#ffffff",
                fontWeight: "bold",
                padding: "0.8rem 2rem",
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Upload & Scan"}
            </Button>
          </Box>
        </form>

        {error && (
          <Typography color="error" sx={{ marginTop: "1rem" }}>
            {error}
          </Typography>
        )}

        {result && (
          <Box mt={3}>
            <Typography variant="h5" style={{ color: "#00bcd4", fontWeight: "bold", marginBottom: "1rem" }}>
              Scan Results:
            </Typography>
            {result.results.map((fileResult, index) => (
              <Paper
                key={index}
                elevation={3}
                style={{ padding: "1rem", margin: "1rem 0", backgroundColor: "#2a2a2a" }}
              >
                <Typography variant="h6" style={{ color: "#00bcd4", fontWeight: "bold" }}>
                  📂 File: {fileResult.file}
                </Typography>
                {Array.isArray(fileResult.issues) ? (
                  fileResult.issues.map((issue, idx) => (
                    <Box
                      key={idx}
                      textAlign="left"
                      p={1}
                      mt={2}
                      style={{
                        backgroundColor: "#333",
                        padding: "1rem",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography style={{ color: "#ffffff" }}>
                        🔴 <strong>Issue:</strong> {issue.issue_text}
                      </Typography>
                      <Typography style={{ color: "#ffffff" }}>
                        ⚠️ <strong>Severity:</strong> {issue.issue_severity} | 🔍 <strong>Confidence:</strong> {issue.issue_confidence}
                      </Typography>
                      <Typography style={{ color: "#ffffff" }}>
                        📌 <strong>Line:</strong> {issue.line_number}
                      </Typography>
                      <Typography>
                        🔗{" "}
                        <a
                          href={issue.more_info}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#00bcd4" }}
                        >
                          More Info
                        </a>
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography style={{ color: "#00bcd4", fontWeight: "bold" }}>
                    {fileResult.issues}
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        )}
      </FormBox>
    </AssessmentContainer>
  );
};

export default UploadForm;
