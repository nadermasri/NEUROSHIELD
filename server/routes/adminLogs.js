const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

// GET all logs (limit 100 recent logs)
router.get('/', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
});

module.exports = router;
