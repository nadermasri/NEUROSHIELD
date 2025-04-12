// server/controllers/analysisController.js
const Assessment = require('../models/Assessment');

exports.getAnalysisData = async (req, res) => {
  try {
    // Get all assessments for the logged-in user sorted by creation date
    const userAssessments = await Assessment.find({ user: req.user.id }).sort({ createdAt: 1 });
    
    // If no assessments exist, return default values
    if (userAssessments.length === 0) {
      return res.json({
        scoreData: { code: 0, compliance: 0, vulnerability: 0, attack: 0 },
        trendData: [],
        recommendations: ["No assessments found. Please complete an assessment to see your analysis."]
      });
    }

    // Accumulators for different assessment types
    let codeTotal = 0, codeCount = 0;
    let complianceTotal = 0, complianceCount = 0;
    let vulnerabilityTotal = 0, vulnerabilityCount = 0;
    let attackTotal = 0, attackCount = 0;

    // For trend data, create an array of objects for each assessment date
    let trendData = [];
    
    userAssessments.forEach(assessment => {
      const day = assessment.createdAt.toISOString().slice(0,10); // e.g., "2025-04-12"

      // For Code assessments, use the averageSeverity (if available) transformed to a score
      if (assessment.type.toLowerCase() === "code") {
        if (assessment.data && assessment.data.summary && assessment.data.summary.averageSeverity) {
          const avgSeverity = parseFloat(assessment.data.summary.averageSeverity);
          // Transform: lower severity yields a higher score. If severity can be up to 3, do:
          const score = Math.max(0, Math.round(100 - ((avgSeverity / 3) * 100)));
          codeTotal += score;
          codeCount++;
          trendData.push({ day, code: score });
        }
      }
      // For Compliance assessments, use the numeric score stored in assessment.data.score
      else if (assessment.type.toLowerCase() === "compliance") {
        if (assessment.data && assessment.score != null) {
          const score = parseFloat(assessment.score);
          complianceTotal += score;
          complianceCount++;
          trendData.push({ day, compliance: score });
        }
      }
      // For Vulnerability assessments, assume assessment.data.summary.risk_score exists.
      // Here, a lower risk score means better security. We invert it: score = 100 - (risk_score * factor)
      else if (assessment.type.toLowerCase() === "vulnerability") {
        if (assessment.data && assessment.data.summary && assessment.data.summary.risk_score) {
          const riskScore = parseFloat(assessment.data.summary.risk_score);
          // Use a factor (e.g., multiply risk score by 5) to transform into percentage
          const score = Math.max(0, 100 - riskScore * 5);
          vulnerabilityTotal += score;
          vulnerabilityCount++;
          trendData.push({ day, vulnerability: score });
        }
      }
      // For Adversarial assessments, if simulationData.successRate exists (between 0 and 1, where lower is better)
      else if (assessment.type.toLowerCase() === "adversarial") {
        if (assessment.data && assessment.data.simulationData && assessment.data.simulationData.successRate != null) {
          const successRate = parseFloat(assessment.data.simulationData.successRate);
          const score = Math.max(0, 100 - (successRate * 100)); // higher success rate means lower score
          attackTotal += score;
          attackCount++;
          trendData.push({ day, attack: score });
        }
      }
    });

    // Compute average scores by type
    const averageCode = codeCount > 0 ? Math.round(codeTotal / codeCount) : 0;
    const averageCompliance = complianceCount > 0 ? Math.round(complianceTotal / complianceCount) : 0;
    const averageVulnerability = vulnerabilityCount > 0 ? Math.round(vulnerabilityTotal / vulnerabilityCount) : 0;
    const averageAttack = attackCount > 0 ? Math.round(attackTotal / attackCount) : 0;
    
    const scoreData = {
      code: averageCode,
      compliance: averageCompliance,
      vulnerability: averageVulnerability,
      attack: averageAttack
    };

    // Merge trendData for dates (if there are multiple entries for a day, combine them)
    const trendMap = {};
    trendData.forEach(obj => {
      const day = obj.day;
      if (!trendMap[day]) trendMap[day] = { day };
      if (obj.code != null) trendMap[day].code = obj.code;
      if (obj.compliance != null) trendMap[day].compliance = obj.compliance;
      if (obj.vulnerability != null) trendMap[day].vulnerability = obj.vulnerability;
      if (obj.attack != null) trendMap[day].attack = obj.attack;
    });
    const mergedTrendData = Object.values(trendMap).sort((a, b) => new Date(a.day) - new Date(b.day));

    // Build recommendations based on scores
    let recommendations = [];
    if (averageCode < 60) recommendations.push("Improve code security via regular audits and updated Snyk scans.");
    if (averageCompliance < 70) recommendations.push("Review and update compliance policies.");
    if (averageVulnerability < 60) recommendations.push("Address identified vulnerabilities immediately.");
    if (averageAttack < 50) recommendations.push("Enhance model robustness against adversarial attacks.");

    return res.json({
      scoreData,
      trendData: mergedTrendData,
      recommendations
    });
  } catch (err) {
    console.error("Error in analysisController:", err);
    res.status(500).json({ error: "Failed to compute analysis data." });
  }
};
