const mongoose = require('mongoose');

const ComplianceAssessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  framework: { type: String, required: true },
  responses: { type: Object, required: true }, // e.g. { q1: "yes", q2: "no", ... }
  score: { type: Number, required: true },     // computed percentage score
  recommendations: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ComplianceAssessment', ComplianceAssessmentSchema);
