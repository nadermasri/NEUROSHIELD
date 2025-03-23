const mongoose = require("mongoose");

const ComplianceAssessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  framework: { type: String, required: true },
  responses: { type: Object, required: true },
  score: { type: Number, required: true },
  recommendations: { type: [String], default: [] },
  questions: [
    {
      id: String,
      question: String,
      expectedAnswer: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "ComplianceAssessment",
  ComplianceAssessmentSchema
);
