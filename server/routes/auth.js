// server/routes/auth.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { signup, login, refreshToken, logout } = require('../controllers/authController');

router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], signup);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').exists().withMessage('Password is required')
], login);

router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

module.exports = router;
