const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  submitCodeAssessment,
  submitDeployedAssessment,
  submitDatasetAssessment
} = require('../controllers/assessmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Assessment endpoints (all protected)
router.post('/code', authMiddleware.verifyToken, upload.single('codeFile'), submitCodeAssessment);
router.post('/deployed', authMiddleware.verifyToken, submitDeployedAssessment);
router.post('/dataset', authMiddleware.verifyToken, upload.single('datasetFile'), submitDatasetAssessment);

module.exports = router;
