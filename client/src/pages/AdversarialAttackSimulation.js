// client/src/pages/AdversarialAttackSimulation.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  TextField,
  Paper
} from "@mui/material";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";

const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: "linear-gradient(135deg, #232526, #414345)",
  minHeight: "100vh",
  color: "#e0e0e0",
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  backgroundColor: "#2c2c2c",
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #00bcd4, #00838f)",
  color: "#ffffff",
  fontWeight: "bold",
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.shape.borderRadius,
  textTransform: "none",
  "&:hover": {
    background: "linear-gradient(45deg, #00838f, #006064)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& label": {
    color: "#e0e0e0",
  },
  "& input": {
    color: "#e0e0e0",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#555",
    },
    "&:hover fieldset": {
      borderColor: "#00bcd4",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#00bcd4",
    },
  },
}));

// Helper function to fetch a file from the API and convert it to a base64 string.
const fetchArtifactAsBase64 = async (url, artifactType) => {
  try {
    const response = await axios.get(url, { responseType: "blob" });
    const blob = response.data;
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // The result is in the form "data:<mime-type>;base64,<data>"
        const base64data = reader.result.split(",")[1];
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`Error fetching ${artifactType}:`, error);
    return null;
  }
};

const AdversarialAttackSimulation = () => {
  const [modelFile, setModelFile] = useState(null);
  const [modelArch, setModelArch] = useState("resnet18");
  const [imageFiles, setImageFiles] = useState([]);
  const [attackType, setAttackType] = useState("fgsm");
  const [epsilon, setEpsilon] = useState(0.01);
  const [inputShape, setInputShape] = useState("(3, 224, 224)");
  const [numClasses, setNumClasses] = useState(1000);
  const [useSampleImage, setUseSampleImage] = useState(true);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  // Fetch CSRF token from the Express server (port 5000)
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/csrf-token", { withCredentials: true })
      .then((res) => setCsrfToken(res.data.csrfToken))
      .catch((err) => console.error("Error fetching CSRF token:", err));
  }, []);

  const handleSubmit = async () => {
    if (!modelFile) {
      alert("Please upload a model file.");
      return;
    }
    const formData = new FormData();
    formData.append("model", modelFile);
    formData.append("model_architecture", modelArch);
    formData.append("attack", attackType);
    formData.append("epsilon", epsilon);
    formData.append("input_shape", inputShape);
    formData.append("num_classes", numClasses);
    formData.append("use_sample_image", useSampleImage);
    if (!useSampleImage) {
      imageFiles.forEach((file) => formData.append("images", file));
    }

    setLoading(true);
    try {
      // Call the Flask API to run the adversarial simulation.
      const res = await axios.post(
        `${process.env.REACT_APP_FLASK_API}/custom-attack`,
        formData,
        { headers: { "x-csrf-token": csrfToken }, withCredentials: true }
      );
      console.log("Server response:", res.data);
      if (res.data?.error) {
        alert("Server Error: " + res.data.error);
      }
      // Check for PDF and ZIP artifacts in the response; if missing, fetch them from the API endpoints.
      let pdfArtifact = res.data.pdfArtifact;
      let zipArtifact = res.data.zipArtifact;
      if (!pdfArtifact) {
        pdfArtifact = await fetchArtifactAsBase64(
          `${process.env.REACT_APP_FLASK_API}/download-pdf`,
          "PDF"
        );
      }
      if (!zipArtifact) {
        zipArtifact = await fetchArtifactAsBase64(
          `${process.env.REACT_APP_FLASK_API}/download-zip`,
          "Archive"
        );
      }
      setResults(res.data);
      // Save the adversarial assessment along with artifacts to the dashboard.
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/assessments/adversarial",
        { 
          simulationData: res.data, 
          pdfArtifact, 
          zipArtifact 
        },
        { headers: { "x-csrf-token": csrfToken, Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      alert("Simulation completed and assessment saved successfully.");
    } catch (err) {
      alert("Attack simulation failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 4, color: "#ffffff" }}
        >
          Adversarial Attack Simulation
        </Typography>

        <SectionPaper>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, color: "#ffffff" }}>
            Model & Attack Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <StyledButton component="label" fullWidth>
                Upload Model File
                <input
                  type="file"
                  hidden
                  onChange={(e) => setModelFile(e.target.files[0])}
                />
              </StyledButton>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ color: "#e0e0e0" }}>
                  Model Architecture
                </InputLabel>
                <Select
                  value={modelArch}
                  onChange={(e) => setModelArch(e.target.value)}
                  label="Model Architecture"
                  sx={{ color: "#e0e0e0" }}
                >
                  <MenuItem value="resnet18">ResNet18</MenuItem>
                  <MenuItem value="vgg16">VGG16</MenuItem>
                  <MenuItem value="mobilenet_v2">MobileNetV2</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ color: "#e0e0e0" }}>Attack Type</InputLabel>
                <Select
                  value={attackType}
                  onChange={(e) => setAttackType(e.target.value)}
                  label="Attack Type"
                  sx={{ color: "#e0e0e0" }}
                >
                  <MenuItem value="fgsm">FGSM</MenuItem>
                  <MenuItem value="pgd">PGD</MenuItem>
                  <MenuItem value="cw">CW</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {attackType !== "cw" && (
              <Grid item xs={12} sm={6} md={4}>
                <Typography gutterBottom sx={{ color: "#e0e0e0" }}>
                  Attack Strength (Epsilon): {epsilon}
                </Typography>
                <Slider
                  min={0}
                  max={0.2}
                  step={0.005}
                  value={epsilon}
                  onChange={(e, val) => setEpsilon(val)}
                  sx={{
                    color: "#00bcd4",
                    "& .MuiSlider-thumb": { border: "2px solid #fff" }
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6} md={4}>
              <StyledTextField
                label="Input Shape"
                fullWidth
                value={inputShape}
                onChange={(e) => setInputShape(e.target.value)}
                placeholder="(3, 224, 224)"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <StyledTextField
                label="Number of Classes"
                type="number"
                fullWidth
                value={numClasses}
                onChange={(e) => setNumClasses(e.target.value)}
                placeholder="e.g. 1000"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </SectionPaper>

        <SectionPaper>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, color: "#ffffff" }}>
            Image Selection
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={useSampleImage}
                      onChange={() => setUseSampleImage(!useSampleImage)}
                      sx={{ color: "#00bcd4" }}
                    />
                  }
                  label="Use Default Sample Image"
                  sx={{ color: "#e0e0e0" }}
                />
              </FormGroup>
            </Grid>
            {!useSampleImage && (
              <Grid item xs={12} sm={6}>
                <StyledButton component="label" fullWidth>
                  Upload Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) => setImageFiles(Array.from(e.target.files))}
                  />
                </StyledButton>
              </Grid>
            )}
          </Grid>
        </SectionPaper>

        <Box sx={{ textAlign: "center", mb: 4 }}>
          <StyledButton onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Execute Simulation"
            )}
          </StyledButton>
        </Box>

        {results && (
          <Box mt={5}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Simulation Report
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Total Images Processed: {results.report.length}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Attack Success Rate:{" "}
              {(
                (results.report.filter(
                  (r) => r.original_label !== r.adversarial_label
                ).length /
                  results.report.length) *
                100
              ).toFixed(2)}
              %
            </Typography>
            <Box my={2}>
              <StyledButton
                sx={{ mr: 2 }}
                onClick={() =>
                  window.open(`${process.env.REACT_APP_FLASK_API}/download-pdf`, "_blank")
                }
              >
                Download PDF Report
              </StyledButton>
              <StyledButton
                onClick={() =>
                  window.open(`${process.env.REACT_APP_FLASK_API}/download-zip`, "_blank")
                }
              >
                Download Images Archive
              </StyledButton>
            </Box>
            <Grid container spacing={4} mt={2}>
              {results.report.map((r, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      backgroundColor: "#2c2c2c",
                      color: "#e0e0e0",
                      borderRadius: 2,
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {r.filename}
                      </Typography>
                      <Box display="flex" gap={1} mt={1}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={`data:image/png;base64,${r.original_image_base64}`}
                          alt="Original"
                        />
                        <CardMedia
                          component="img"
                          height="140"
                          image={`data:image/png;base64,${r.adversarial_image_base64}`}
                          alt="Adversarial"
                        />
                        <CardMedia
                          component="img"
                          height="140"
                          image={`data:image/png;base64,${r.heatmap_base64}`}
                          alt="Heatmap"
                        />
                      </Box>
                      <Typography variant="body2" mt={2}>
                        Original: {r.original_label_name} ({r.original_confidence})
                      </Typography>
                      <Typography variant="body2">
                        Adversarial: {r.adversarial_label_name} ({r.adversarial_confidence})
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default AdversarialAttackSimulation;
