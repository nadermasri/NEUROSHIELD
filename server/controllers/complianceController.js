const ComplianceAssessment = require("../models/ComplianceAssessment");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

function getCsvFilePath(framework) {
  if (framework.toLowerCase().includes("differential privacy")) {
    return path.join(
      __dirname,
      "..",
      "data",
      "Questionnaires for NIST DP Frameworks.csv"
    );
  }
  return path.join(
    __dirname,
    "..",
    "data",
    "Questionnaires for NIST Frameworks.csv"
  );
}

function getGroupFromActionID(actionId) {
  if (!actionId) return "Other";
  actionId = actionId.replace(/^\ufeff/, "").trim();
  const prefix = actionId.substring(0, 2).toUpperCase();
  if (prefix === "GV") return "Govern";
  if (prefix === "MP") return "Map";
  if (prefix === "MS") return "Measure";
  if (prefix === "MG") return "Manage";
  return "Other";
}

function loadQuestions(framework) {
  return new Promise((resolve, reject) => {
    const questions = [];
    const csvFile = getCsvFilePath(framework);
    fs.createReadStream(csvFile)
      .pipe(csv())
      .on("data", (row) => {
        const actionIdKey = Object.keys(row).find(
          (key) => key.trim().toLowerCase() === "action id"
        );
        const questionKey = Object.keys(row).find(
          (key) => key.trim().toLowerCase() === "question"
        );
        const categoryKey = Object.keys(row).find(
          (key) => key.trim().toLowerCase() === "category/subcategory"
        );
        const expectedKey = Object.keys(row).find(
          (key) => key.trim().toLowerCase() === "expected answer"
        );

        const actionId =
          actionIdKey && row[actionIdKey]
            ? String(row[actionIdKey])
                .replace(/^\ufeff/, "")
                .trim()
            : "";
        const questionText =
          questionKey && row[questionKey] ? row[questionKey].trim() : "";
        const expectedAnswer =
          expectedKey && row[expectedKey]
            ? row[expectedKey].trim().toLowerCase()
            : "";
        const group = getGroupFromActionID(actionId);
        const questionObj = {
          id: actionId,
          question: questionText,
          category:
            categoryKey && row[categoryKey] ? row[categoryKey].trim() : "",
          group,
          expectedAnswer,
        };
        console.log("Parsed Action ID:", actionId, "Group:", group);
        questions.push(questionObj);
      })
      .on("end", () => {
        console.log(
          `Loaded ${questions.length} questions for framework: ${framework}`
        );
        resolve(questions);
      })
      .on("error", (err) => reject(err));
  });
}

exports.getQuestions = async (req, res) => {
  const framework = req.query.framework;
  if (!framework) {
    return res.status(400).json({ message: "Framework is required." });
  }
  try {
    const questions = await loadQuestions(framework);
    console.log("Sending questions to client, count:", questions.length);
    res.json({ framework, questions });
  } catch (error) {
    console.error("Error loading questions:", error);
    res.status(500).json({ message: "Error loading questions." });
  }
};

exports.submitComplianceAssessment = async (req, res) => {
  const {
    framework,
    responses,
    questions: submittedQuestions,
    selectedGroups,
  } = req.body; // New: selectedGroups sent from frontend (for NIST AI RMF)
  if (!framework || !responses) {
    return res
      .status(400)
      .json({ message: "Framework and responses are required." });
  }
  try {
    let questions = await loadQuestions(framework);
    // If NIST AI RMF and selectedGroups exists, filter the questions to only those groups.
    if (
      framework === "NIST AI RMF" &&
      Array.isArray(selectedGroups) &&
      selectedGroups.length > 0
    ) {
      questions = questions.filter((q) => selectedGroups.includes(q.group));
    }

    // Scoring mapping
    const scoringMapping = {
      "fully implemented": 1,
      "substantially implemented": 0.6,
      "partially implemented": 0.3,
      "not implemented": 0,
    };

    let obtainedScore = 0;
    let totalCounted = 0; // count questions that are not "n/a"

    questions.forEach((q) => {
      const userAnswer = (responses[q.id] || "").trim().toLowerCase();
      if (userAnswer === "n/a") return;
      totalCounted += 1;
      const points =
        scoringMapping[userAnswer] !== undefined
          ? scoringMapping[userAnswer]
          : 0;
      obtainedScore += points;
    });

    const percentage =
      totalCounted > 0 ? (obtainedScore / totalCounted) * 100 : 0;

    const complianceAssessment = new ComplianceAssessment({
      user: req.user.id,
      framework,
      responses,
      questions: submittedQuestions || [],
      score: percentage,
      recommendations: [],
      type: "compliance",
    });

    const savedAssessment = await complianceAssessment.save();
    res.status(200).json({
      message: "Compliance assessment submitted successfully.",
      assessment: savedAssessment,
    });
  } catch (error) {
    console.error("Error submitting compliance assessment:", error);
    res
      .status(500)
      .json({ message: "Error submitting compliance assessment." });
  }
};
