// server/routes/assessment.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyAccessToken } = require('../middleware/authMiddleware');
const {
  submitCodeAssessment,
  submitDeployedAssessment,
  submitDatasetAssessment
} = require('../controllers/assessmentController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['text/plain', 'application/javascript', 'application/json', 'text/x-python'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  }
});

router.post('/code', verifyAccessToken, upload.single('codeFile'), submitCodeAssessment);
router.post('/deployed', verifyAccessToken, submitDeployedAssessment);
router.post('/dataset', verifyAccessToken, upload.single('datasetFile'), submitDatasetAssessment);

module.exports = router;
