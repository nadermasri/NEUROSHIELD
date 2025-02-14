// server/routes/adminContacts.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/admin/contacts - admin-only endpoint to fetch contact messages
router.get('/', verifyToken, async (req, res) => {
  // Ensure only admin users can access this endpoint
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    // Retrieve all messages sorted by newest first
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ message: 'Error fetching messages.' });
  }
});

module.exports = router;
