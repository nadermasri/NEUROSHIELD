const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Assessment = require('../models/Assessment');

// Admin-only endpoint to get testers and their assessment counts
router.get('/users', authMiddleware.verifyToken, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const testers = await User.find({ role: 'tester' }).select('-password');
    const testerMetrics = await Promise.all(
      testers.map(async (tester) => {
        const count = await Assessment.countDocuments({ user: tester._id });
        return { tester, assessmentCount: count };
      })
    );
    res.status(200).json(testerMetrics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching testers.' });
  }
});

module.exports = router;
