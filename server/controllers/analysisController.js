// server/controllers/analysisController.js
const Assessment = require('../models/Assessment');
const ComplianceAssessment = require('../models/ComplianceAssessment');

const getAnalysisData = async (req, res) => {
  try {
    // Get assessments from the main Assessment collection (e.g., code, vulnerability, adversarial, etc.)
    const assessments = await Assessment.find({ user: req.user.id }).sort({ createdAt: 1 });
    // Get compliance assessments from the ComplianceAssessment collection
    const complianceAssessments = await ComplianceAssessment.find({ user: req.user.id }).sort({ createdAt: 1 });

    // Merge compliance assessments into a single array, forcing type to 'compliance'
    const allAssessments = assessments.concat(
      complianceAssessments.map(a => ({ ...a.toObject(), type: 'compliance' }))
    );

    if (allAssessments.length === 0) {
      return res.json({
        scoreData: { code: 0, compliance: 0, vulnerability: 0, attack: 0 },
        trendData: [],
        recommendations: ["No assessments found. Please complete an assessment to see your analysis."]
      });
    }

    // Arrays to accumulate scores for each assessment type
    let codeScores = [];
    let complianceScores = [];
    let vulnerabilityScores = [];
    let attackScores = [];
    let trendData = [];

    // Loop through all assessments and compute the score for each type
    allAssessments.forEach(assessment => {
      const day = assessment.createdAt.toISOString().slice(0, 10);
      const type = assessment.type.toLowerCase();

      if (type === 'code') {
        // For code assessments, use the count of vulnerabilities
        const vulnCount = assessment.data && Array.isArray(assessment.data.vulnerabilities)
          ? assessment.data.vulnerabilities.length
          : 0;
        // Example: Deduct 5 points per vulnerability from a base of 100.
        const score = Math.max(0, 100 - (vulnCount * 5));
        codeScores.push(score);
        trendData.push({ day, code: score });
      } else if (type === 'compliance') {
        // For compliance assessments, the score is stored directly in the document's "score" field.
        const score = assessment.score != null ? parseFloat(assessment.score) : 0;
        complianceScores.push(score);
        trendData.push({ day, compliance: score });
      } else if (type === 'vulnerability') {
        if (assessment.data && assessment.data.summary && assessment.data.summary.risk_score != null) {
          const riskScore = parseFloat(assessment.data.summary.risk_score);
          // Example: A higher risk score gives a lower assessment value.
          const score = Math.max(0, 100 - (riskScore * 5));
          vulnerabilityScores.push(score);
          trendData.push({ day, vulnerability: score });
        }
      } else if (type === 'adversarial') {
        if (assessment.data && assessment.data.simulationData && assessment.data.simulationData.successRate != null) {
          const successRate = parseFloat(assessment.data.simulationData.successRate);
          // Lower success rate of the adversarial attack results in a higher score.
          const score = Math.max(0, 100 - (successRate * 100));
          attackScores.push(score);
          trendData.push({ day, attack: score });
        }
      }
    });

    // Helper to compute averages
    const average = (arr) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);

    const scoreData = {
      code: average(codeScores),
      compliance: average(complianceScores),
      vulnerability: average(vulnerabilityScores),
      attack: average(attackScores)
    };

    // Merge trend data if multiple assessments fall on the same day
    const trendMap = {};
    trendData.forEach(obj => {
      const d = obj.day;
      if (!trendMap[d]) trendMap[d] = { day: d };
      if (obj.code !== undefined) trendMap[d].code = obj.code;
      if (obj.compliance !== undefined) trendMap[d].compliance = obj.compliance;
      if (obj.vulnerability !== undefined) trendMap[d].vulnerability = obj.vulnerability;
      if (obj.attack !== undefined) trendMap[d].attack = obj.attack;
    });
    const mergedTrendData = Object.values(trendMap).sort((a, b) => new Date(a.day) - new Date(b.day));

    // Build recommendations based on average scores (adjust thresholds as needed)
    let recommendations = [];
    if (scoreData.code < 60)
      recommendations.push("Improve code security by performing regular audits and using advanced static analysis.");
    if (scoreData.compliance < 70)
      recommendations.push("Review and update your compliance procedures.");
    if (scoreData.vulnerability < 60)
      recommendations.push("Address identified vulnerabilities immediately.");
    if (scoreData.attack < 50)
      recommendations.push("Enhance model robustness against adversarial attacks.");

    return res.json({
      scoreData,
      trendData: mergedTrendData,
      recommendations
    });
  } catch (err) {
    console.error("Error in getAnalysisData:", err);
    res.status(500).json({ error: "Failed to compute analysis data." });
  }
};

module.exports = { getAnalysisData };
