import React from "react";
import { Container, Typography, Box } from "@mui/material";
import styled from "styled-components";
import { motion } from "framer-motion";
import UploadForm from "../components/UploadForm";

const AssessmentContainer = styled(Container)`
  min-height: 100vh;
  padding: 5rem 10%;
  background-color: #1a1a1a;
  color: #ffffff;
`;

const FormBox = styled.div`
  background: rgba(30, 30, 30, 0.95);
  padding: 3rem 4rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  text-align: center;
`;

const CodeAssessment = () => {
  return (
    <AssessmentContainer>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FormBox>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            style={{ fontWeight: "bold", color: "#00bcd4" }}
          >
            Code Security Assessment
          </Typography>
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            style={{ marginBottom: "2rem", color: "#cccccc" }}
          >
            Upload your code to analyze security vulnerabilities.
          </Typography>
          <UploadForm />
        </FormBox>
      </motion.div>
    </AssessmentContainer>
  );
};

export default CodeAssessment;
