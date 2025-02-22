// server/routes/assessment.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Import your middleware
const { verifyAccessToken } = require('../middleware/authMiddleware');

// Import your controller functions
const {
  submitCodeAssessment,
  submitDeployedAssessment,
  submitDatasetAssessment,
} = require('../controllers/assessmentController');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Put files in "uploads/" folder at project root
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Now define your routes
router.post('/code', verifyAccessToken, upload.single('codeFile'), submitCodeAssessment);

router.post('/deployed', verifyAccessToken, submitDeployedAssessment);

router.post('/dataset', verifyAccessToken, upload.single('datasetFile'), submitDatasetAssessment);

module.exports = router;
