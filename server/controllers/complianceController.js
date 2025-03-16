const ComplianceAssessment = require('../models/ComplianceAssessment');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Helper: load questions from CSV file for a given framework
function loadQuestions(framework) {
  return new Promise((resolve, reject) => {
    const questions = [];
    fs.createReadStream(path.join(__dirname, '..', 'data', 'compliance_questions.csv'))
      .pipe(csv())
      .on('data', (row) => {
        if (row.framework && row.framework.trim().toLowerCase() === framework.trim().toLowerCase()) {
          row.weight = Number(row.weight) || 0;
          row.expectedAnswer = (row.expectedAnswer || "").trim().toLowerCase();
          // Ensure id is a string
          row.id = String(row.id).trim();
          // Set a default recommendation if not provided
          row.recommendation = row.recommendation ? row.recommendation.trim() : "";
          questions.push(row);
        }
      })
      .on('end', () => {
        console.log(`Loaded ${questions.length} questions for framework: ${framework}`);
        resolve(questions);
      })
      .on('error', (err) => reject(err));
  });
}

exports.getQuestions = async (req, res) => {
  const framework = req.query.framework;
  if (!framework) {
    return res.status(400).json({ message: 'Framework is required.' });
  }
  try {
    const questions = await loadQuestions(framework);
    res.json({ framework, questions });
  } catch (error) {
    console.error('Error loading questions:', error);
    res.status(500).json({ message: 'Error loading questions.' });
  }
};

exports.submitComplianceAssessment = async (req, res) => {
  const { framework, responses } = req.body; // responses: { "q1": "yes", "q2": "no", ... }
  if (!framework || !responses) {
    return res.status(400).json({ message: 'Framework and responses are required.' });
  }
  try {
    const questions = await loadQuestions(framework);
    let totalScore = 0;
    let maxScore = 0;
    let recommendations = [];
    
    questions.forEach(q => {
      maxScore += q.weight;
      // Normalize user answer and expected answer for comparison
      const userAnswer = (responses[String(q.id)] || "").trim().toLowerCase();
      const expected = q.expectedAnswer;
      console.log(`Question ${q.id}: expected="${expected}", userAnswer="${userAnswer}"`);
      if (userAnswer === expected) {
        totalScore += q.weight;
      } else {
        if (q.recommendation) {
          recommendations.push(q.recommendation);
        }
      }
    });
    
    const percentage = maxScore ? (totalScore / maxScore) * 100 : 0;
    
    // IMPORTANT: Set type explicitly to "compliance" so the dashboard can filter it correctly.
    const complianceAssessment = new ComplianceAssessment({
      user: req.user.id,
      framework,
      responses,
      score: percentage,
      recommendations,
      type: "compliance"
    });
    
    const savedAssessment = await complianceAssessment.save();
    res.status(200).json({
      message: 'Compliance assessment submitted successfully.',
      assessment: savedAssessment
    });
  } catch (error) {
    console.error('Error submitting compliance assessment:', error);
    res.status(500).json({ message: 'Error submitting compliance assessment.' });
  }
};
