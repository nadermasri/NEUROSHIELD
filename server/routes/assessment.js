const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Import the authentication middleware
const { verifyAccessToken } = require('../middleware/authMiddleware');

// Import controller functions including the new deleteAssessment
const {
  submitCodeAssessment,
  submitDeployedAssessment,
  submitDatasetAssessment,
  getUserAssessments,
  deleteAssessment,
} = require('../controllers/assessmentController');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Files are saved in the "uploads" folder at project root
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Create a unique filename using timestamp and random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Define the assessment routes
router.post('/code', verifyAccessToken, upload.single('codeFile'), submitCodeAssessment);
router.post('/deployed', verifyAccessToken, submitDeployedAssessment);
router.post('/dataset', verifyAccessToken, upload.single('datasetFile'), submitDatasetAssessment);

// NEW: Endpoint for testers to get their own assessments history
router.get('/my-assessments', verifyAccessToken, getUserAssessments);

// NEW: Endpoint to delete an assessment by id
router.delete('/:id', verifyAccessToken, deleteAssessment);

module.exports = router;
