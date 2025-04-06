// client/src/pages/AdversarialAssessment.js
import React, { useState } from "react";
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

const AdversarialAssessment = () => {
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

  const handleSubmit = async () => {
    if (!modelFile) return alert("Upload a model file first.");
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
      const res = await axios.post(
        `${process.env.REACT_APP_FLASK_API}/custom-attack`,
        formData
      );
      console.log("Server response:", res.data);
      if (res.data?.error) alert("Server Error: " + res.data.error);
      setResults(res.data);
    } catch (err) {
      alert("Attack failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = async (type) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_FLASK_API}/download-${type}`, {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", type === "pdf" ? "adversarial_report.pdf" : "adversarial_images.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Download failed.");
      console.error(error);
    }
  };


  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        🧪 Adversarial Attack Assessment
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          📁 Model & Attack Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Button variant="contained" component="label">
              📥 Upload PyTorch/TensorFlow Model
              <input type="file" hidden onChange={(e) => setModelFile(e.target.files[0])} />
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Model Architecture</InputLabel>
              <Select value={modelArch} onChange={(e) => setModelArch(e.target.value)} label="Model Architecture">
                <MenuItem value="resnet18">ResNet18</MenuItem>
                <MenuItem value="vgg16">VGG16</MenuItem>
                <MenuItem value="mobilenet_v2">MobileNetV2</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Attack Type</InputLabel>
              <Select value={attackType} onChange={(e) => setAttackType(e.target.value)} label="Attack Type">
                <MenuItem value="fgsm">FGSM</MenuItem>
                <MenuItem value="pgd">PGD</MenuItem>
                <MenuItem value="cw">CW</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {attackType !== "cw" && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography gutterBottom>Epsilon: {epsilon}</Typography>
              <Slider
                min={0}
                max={0.2}
                step={0.005}
                value={epsilon}
                onChange={(e, val) => setEpsilon(val)}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Input Shape"
              fullWidth
              value={inputShape}
              onChange={(e) => setInputShape(e.target.value)}
              placeholder="(3, 224, 224)"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Number of Classes"
              type="number"
              fullWidth
              value={numClasses}
              onChange={(e) => setNumClasses(e.target.value)}
              placeholder="e.g. 1000"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          🖼️ Image Selection
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={useSampleImage} onChange={() => setUseSampleImage(!useSampleImage)} />}
                label="Use Sample Image"
              />
            </FormGroup>
          </Grid>

          {!useSampleImage && (
            <Grid item xs={12} sm={6}>
              <Button variant="outlined" component="label">
                Upload Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => setImageFiles(Array.from(e.target.files))}
                />
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Box textAlign="center" mb={4}>
        <Button variant="contained" onClick={handleSubmit} disabled={loading} size="large">
          {loading ? <CircularProgress size={24} /> : "Run Attack"}
        </Button>
      </Box>

      {results && (
        <Box mt={5}>
          <Typography variant="h5">📊 Batch Report</Typography>
          <Typography variant="body1">
            Total Images: {results.report.length}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Attack Success Rate: {
              (
                results.report.filter(r => r.original_label !== r.adversarial_label).length /
                results.report.length * 100
              ).toFixed(2)
            }%
          </Typography>
          <Box my={2}>
            <Button variant="outlined" sx={{ mr: 2 }} onClick={() => handleDownload("pdf")}>
                📄 Download PDF Report
            </Button>
            <Button variant="outlined" onClick={() => handleDownload("zip")}>
                🗂️ Download Adversarial Images (.zip)
            </Button>
            </Box>

          <Grid container spacing={4} mt={2}>
            {results.report.map((r, idx) => (
              <Grid item key={idx} xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>{r.filename}</Typography>
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
    </Box>
  );
};

export default AdversarialAssessment;
