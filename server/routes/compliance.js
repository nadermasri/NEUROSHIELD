const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../middleware/authMiddleware');
const { getQuestions, submitComplianceAssessment } = require('../controllers/complianceController');

router.get('/questions', verifyAccessToken, getQuestions);
router.post('/', verifyAccessToken, submitComplianceAssessment);

module.exports = router;
