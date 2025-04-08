// server/routes/assessment.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyAccessToken } = require('../middleware/authMiddleware');
const {
  submitCodeAssessment,
  submitDeployedAssessment,
  submitAdversarialAssessment,  // NEW: Add the adversarial submission function
  getUserAssessments,
  deleteAssessment,
} = require('../controllers/assessmentController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Define assessment routes
router.post('/code', verifyAccessToken, upload.single('codeFile'), submitCodeAssessment);
router.post('/deployed', verifyAccessToken, submitDeployedAssessment);
router.post('/adversarial', verifyAccessToken, submitAdversarialAssessment);  // NEW route for adversarial assessment
router.get('/my-assessments', verifyAccessToken, getUserAssessments);
router.delete('/:id', verifyAccessToken, deleteAssessment);

module.exports = router;
