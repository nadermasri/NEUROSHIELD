const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['code', 'deployed', 'dataset'], required: true },
  data: { type: mongoose.Schema.Types.Mixed }, // Contains details such as libraries, file names, URLs, etc.
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
