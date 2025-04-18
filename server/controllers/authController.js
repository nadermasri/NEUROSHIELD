const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Log = require('../models/Log'); // ✅ Audit logging model

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

// ✅ SIGNUP
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await Log.create({
      eventType: 'signup',
      email: req.body.email || '',
      success: false,
      message: 'Validation failed',
      ip: req.ip,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await Log.create({
        eventType: 'signup',
        email,
        success: false,
        message: 'User already exists',
        ip: req.ip,
      });
      return res.status(400).json({ message: 'User already exists.' });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({ name, email, password: hashedPassword, role: 'tester' });
    await user.save();

    await Log.create({
      eventType: 'signup',
      email,
      success: true,
      message: 'User signed up successfully',
      ip: req.ip,
    });

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error('Signup error:', error);
    await Log.create({
      eventType: 'signup',
      email,
      success: false,
      message: error.message,
      ip: req.ip,
    });
    res.status(500).json({ message: 'Error signing up.' });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await Log.create({
      eventType: 'login',
      email: req.body.email || '',
      success: false,
      message: 'Validation failed',
      ip: req.ip,
    });
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, role } = req.body;

  try {
    if (typeof email !== 'string' || typeof role !== 'string') {
      return res.status(400).json({ message: 'Invalid input types.' });
    }

    const user = await User.findOne({
      email: { $eq: email },
      role: { $eq: role },
    });

    if (!user) {
      await Log.create({
        eventType: 'login',
        email,
        success: false,
        message: 'User not found',
        ip: req.ip,
      });
      return res.status(404).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await Log.create({
        eventType: 'login',
        email,
        success: false,
        message: 'Invalid password',
        ip: req.ip,
      });
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await Log.create({
      eventType: 'login',
      email,
      success: true,
      message: 'User logged in successfully',
      ip: req.ip,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Login error:', error);
    await Log.create({
      eventType: 'login',
      email,
      success: false,
      message: error.message,
      ip: req.ip,
    });
    res.status(500).json({ message: 'Error logging in.' });
  }
};

// ✅ REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token)
    return res.status(401).json({ message: 'No refresh token provided.' });

  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(404).json({ message: 'User not found.' });

    const accessToken = generateAccessToken(user);
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token.' });
  }
};

// ✅ LOGOUT
exports.logout = async (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully.' });
};
