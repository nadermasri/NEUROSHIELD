const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Updated enum to include 'vulnerability'
  type: { type: String, enum: ['code', 'deployed', 'dataset', 'vulnerability'], required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
