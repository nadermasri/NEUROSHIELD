const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get current user profile
router.get('/profile', authMiddleware.verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile.' });
  }
});

// Update profile (name and/or password)
router.put('/profile', authMiddleware.verifyToken, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = { name, email };
    if (password) {
      updateData.password = await bcrypt.hash(password, 8);
    }
    const user = await User.findByIdAndUpdate(req.userId, updateData, { new: true }).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile.' });
  }
});

module.exports = router;
