// server/routes/admin.js
const express = require('express');
const router = express.Router();
const { verifyAccessToken, verifyAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Assessment = require('../models/Assessment');

router.get('/users', verifyAccessToken, verifyAdmin, async (req, res) => {
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
    console.error('Admin users error:', error);
    res.status(500).json({ message: 'Error fetching testers.' });
  }
});

router.get('/contacts', verifyAccessToken, verifyAdmin, async (req, res) => {
  const Contact = require('../models/Contact');
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Admin contacts error:', error);
    res.status(500).json({ message: 'Error fetching contacts.' });
  }
});

module.exports = router;
