// server/routes/analysis.js
const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../middleware/authMiddleware');
const { getAnalysisData } = require('../controllers/analysisController');

router.get('/', verifyAccessToken, getAnalysisData);

module.exports = router;
