const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  eventType: { type: String, required: true }, // e.g., login, signup, logout
  email: { type: String, required: true },
  success: { type: Boolean, required: true },
  message: { type: String },
  timestamp: { type: Date, default: Date.now },
  ip: { type: String }, // optional
});

module.exports = mongoose.model('Log', logSchema);
