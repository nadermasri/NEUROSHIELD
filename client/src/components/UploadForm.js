import React, { useState } from "react";
import axios from "axios";
import { Button, Typography, Box, CircularProgress, Paper } from "@mui/material";

const UploadForm = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  // Handle file upload
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
      const response = await axios.post("http://localhost:5000/api/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
    <Box textAlign="center" p={3}>
      <Typography variant="h4" color="primary" gutterBottom>
        Upload Your Python Files for Security Assessment
      </Typography>

      <form onSubmit={handleUpload}>
        <input type="file" multiple onChange={handleFileChange} />
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={loading}
          style={{ marginLeft: "1rem" }}
        >
          {loading ? <CircularProgress size={24} /> : "Upload & Scan"}
        </Button>
      </form>

      {error && <Typography color="error">{error}</Typography>}

      {result && (
        <Box mt={3}>
          <Typography variant="h5" color="primary">
            Scan Results:
          </Typography>
          {result.results.map((fileResult, index) => (
            <Paper key={index} elevation={3} style={{ padding: "1rem", margin: "1rem 0" }}>
              <Typography variant="h6" color="secondary">
                📂 File: {fileResult.file}
              </Typography>
              {fileResult.issues ? (
                fileResult.issues.map((issue, idx) => (
                  <Box key={idx} textAlign="left" p={1} mt={2} border={1} borderRadius={2}>
                    <Typography>
                      🔴 <strong>Issue:</strong> {issue.issue_text}
                    </Typography>
                    <Typography>
                      ⚠️ <strong>Severity:</strong> {issue.issue_severity} | 
                      🔍 <strong>Confidence:</strong> {issue.issue_confidence}
                    </Typography>
                    <Typography>
                      📌 <strong>Line:</strong> {issue.line_number}
                    </Typography>
                    <Typography>
                      🔗 <a href={issue.more_info} target="_blank" rel="noopener noreferrer">
                        More Info
                      </a>
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography color="success">✅ No security issues found!</Typography>
              )}
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UploadForm;
