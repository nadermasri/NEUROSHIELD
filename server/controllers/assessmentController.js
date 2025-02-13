const Assessment = require('../models/Assessment');

exports.submitCodeAssessment = async (req, res) => {
  try {
    const { libraries } = req.body;
    const codeFile = req.file; // Provided by multer
    const assessment = new Assessment({
      user: req.userId,
      type: 'code',
      data: { libraries, codeFile: codeFile ? codeFile.filename : null }
    });
    await assessment.save();
    res.status(200).json({ message: 'Code Assessment submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting code assessment' });
  }
};

exports.submitDeployedAssessment = async (req, res) => {
  try {
    const { modelUrl } = req.body;
    const assessment = new Assessment({
      user: req.userId,
      type: 'deployed',
      data: { modelUrl }
    });
    await assessment.save();
    res.status(200).json({ message: 'Deployed Model Assessment submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting deployed assessment' });
  }
};

exports.submitDatasetAssessment = async (req, res) => {
  try {
    const datasetFile = req.file;
    const assessment = new Assessment({
      user: req.userId,
      type: 'dataset',
      data: { datasetFile: datasetFile ? datasetFile.filename : null }
    });
    await assessment.save();
    res.status(200).json({ message: 'Dataset Assessment submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting dataset assessment' });
  }
};
