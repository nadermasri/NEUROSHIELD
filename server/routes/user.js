// server/routes/user.js
const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../middleware/authMiddleware');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.get('/profile', verifyAccessToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile.' });
  }
});

router.put('/profile', verifyAccessToken, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = { name, email };
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }
    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile.' });
  }
});

module.exports = router;
