// server/routes/contact.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');

router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name, email, phone, subject, message } = req.body;
  try {
    const newMessage = new Contact({ name, email, phone, subject, message });
    await newMessage.save();
    res.status(200).json({ message: 'Thank you for contacting NeuroShield. We will get back to you soon.' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ message: 'Error processing your request. Please try again later.' });
  }
});

module.exports = router;
