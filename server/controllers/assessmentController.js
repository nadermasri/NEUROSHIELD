const Assessment = require('../models/Assessment');
const { exec } = require('child_process');
const path = require('path');

// CODE Assessment (Snyk code scan)
exports.submitCodeAssessment = async (req, res) => {
  try {
    const { libraries } = req.body;
    const codeFile = req.file; // from multer

    // Create an Assessment document for code analysis
    let assessment = new Assessment({
      user: req.user.id, // coming from the auth middleware
      type: 'code',
      data: {
        libraries: libraries ? JSON.parse(libraries) : [],
        codeFile: codeFile ? codeFile.filename : null,
        vulnerabilities: [],
      },
    });

    assessment = await assessment.save();

    if (!codeFile) {
      return res.status(400).json({ message: 'No code file uploaded.' });
    }

    // Construct full file path for the uploaded code file
    const filePath = path.join(__dirname, '..', 'uploads', codeFile.filename);

    // Run Snyk CLI static code analysis
    const snykCmd = `snyk code test --file="${filePath}" --json`;

    exec(snykCmd, async (err, stdout, stderr) => {
      if (err) {
        console.error('Snyk scan error:', err);
        // Save the error in the assessment document
        await Assessment.findByIdAndUpdate(assessment._id, {
          $set: { 'data.snykError': stderr || err.message },
        });
        return res.status(200).json({
          message: 'Code Assessment saved, but Snyk scan failed.',
          error: err.message,
        });
      }

      // Try parsing the Snyk JSON output
      let snykResult;
      try {
        snykResult = JSON.parse(stdout);
      } catch (parseErr) {
        console.error('Failed to parse Snyk JSON:', parseErr);
        await Assessment.findByIdAndUpdate(assessment._id, {
          $set: { 'data.snykError': 'Invalid JSON from Snyk CLI' },
        });
        return res.status(200).json({
          message: 'Code Assessment saved, but Snyk results could not be parsed.',
        });
      }

      // Extract vulnerabilities (issues) from the result and update document
      const issues = snykResult.analysisResults?.issues || [];
      const updatedAssessment = await Assessment.findByIdAndUpdate(
        assessment._id,
        { $set: { 'data.vulnerabilities': issues } },
        { new: true }
      );

      return res.status(200).json({
        message: 'Code Assessment submitted successfully.',
        vulnerabilitiesFound: issues.length,
        assessment: updatedAssessment,
      });
    });
  } catch (error) {
    console.error('Error in submitCodeAssessment:', error);
    res.status(500).json({ message: 'Error submitting code assessment.' });
  }
};

// Deployed Model Assessment
exports.submitDeployedAssessment = async (req, res) => {
  try {
    const { modelUrl } = req.body;
    const assessment = new Assessment({
      user: req.user.id,
      type: 'deployed',
      data: { modelUrl },
    });
    await assessment.save();
    res.status(200).json({ message: 'Deployed Model Assessment submitted successfully.' });
  } catch (error) {
    console.error('Error in submitDeployedAssessment:', error);
    res.status(500).json({ message: 'Error submitting deployed assessment.' });
  }
};

// Dataset Assessment
exports.submitDatasetAssessment = async (req, res) => {
  try {
    const datasetFile = req.file;
    const assessment = new Assessment({
      user: req.user.id,
      type: 'dataset',
      data: { datasetFile: datasetFile ? datasetFile.filename : null },
    });
    await assessment.save();
    res.status(200).json({ message: 'Dataset Assessment submitted successfully.' });
  } catch (error) {
    console.error('Error in submitDatasetAssessment:', error);
    res.status(500).json({ message: 'Error submitting dataset assessment.' });
  }
};

// Get all assessments for the logged in user
exports.getUserAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(assessments);
  } catch (error) {
    console.error('Error fetching user assessments:', error);
    res.status(500).json({ message: 'Error fetching assessments.' });
  }
};

// NEW: Delete an assessment by id (only if it belongs to the user)
exports.deleteAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await Assessment.findOneAndDelete({ _id: id, user: req.user.id });
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found or unauthorized' });
    }
    res.status(200).json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ message: 'Error deleting assessment' });
  }
};
