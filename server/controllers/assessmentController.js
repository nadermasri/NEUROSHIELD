const Assessment = require('../models/Assessment');
const { exec } = require('child_process');
const path = require('path');

// CODE Assessment (Snyk code scan)
exports.submitCodeAssessment = async (req, res) => {
  try {
    const { libraries } = req.body;
    const codeFile = req.file; // from multer

    // Create an Assessment
    let assessment = new Assessment({
      user: req.user.id, // from auth
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

    // Full path to the uploaded file
    const filePath = path.join(__dirname, '..', 'uploads', codeFile.filename);

    // Run Snyk code test for static code analysis
    const snykCmd = `snyk code test --file="${filePath}" --json`;

    exec(snykCmd, async (err, stdout, stderr) => {
      if (err) {
        console.error('Snyk scan error:', err);
        // Store the error in assessment doc
        await Assessment.findByIdAndUpdate(assessment._id, {
          $set: { 'data.snykError': stderr || err.message },
        });
        return res.status(200).json({
          message: 'Code Assessment saved, but Snyk scan failed.',
          error: err.message,
        });
      }

      // Parse the JSON from Snyk
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

      // Extract issues
      const issues = snykResult.analysisResults?.issues || [];

      // Update the doc with vulnerabilities
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

// DEPLOYED Model Assessment
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
    console.error(error);
    res.status(500).json({ message: 'Error submitting deployed assessment.' });
  }
};

// DATASET Assessment
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
    console.error(error);
    res.status(500).json({ message: 'Error submitting dataset assessment.' });
  }
};
