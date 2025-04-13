// server/routes/auth.js
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const { signup, login, refreshToken, logout } = require('../controllers/authController');

//Auth-specific rate limiter (5 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5,
  message: 'Too many attempts from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Signup Route
router.post('/signup',
  authLimiter,
  [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .escape(),
    body('email')
      .isEmail().withMessage('Valid email required')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .escape()
  ],
  signup
);

// ✅ Login Route
router.post('/login',
  authLimiter,
  [
    body('email')
      .isEmail().withMessage('Valid email required')
      .normalizeEmail(),
    body('password')
      .exists().withMessage('Password is required')
      .escape()
  ],
  login
);

// ♻️ Token Refresh Route
router.post('/refresh-token', refreshToken);

// 🚪 Logout Route
router.post('/logout', logout);

module.exports = router;
