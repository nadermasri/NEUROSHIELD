// server/routes/scanRoute.js
const express = require("express");
const multer = require("multer");
const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
const { verifyAccessToken } = require("../middleware/authMiddleware");
const Assessment = require("../models/Assessment");

const router = express.Router();

// Configure multer to store files with original extensions
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get the file extension
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Extract ZIP file
const extractZip = async (zipPath, extractTo) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractTo }))
      .on("close", resolve)
      .on("error", reject);
  });
};

// Find all Python files inside a folder
const findPythonFiles = (dir) => {
  let pyFiles = [];
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      pyFiles = pyFiles.concat(findPythonFiles(fullPath));
    } else if (file.endsWith(".py")) {
      pyFiles.push(fullPath);
    }
  });
  return pyFiles;
};

// Run Bandit security scan on a Python file
const runBanditPythonScript = async (filePath) => {
  return new Promise((resolve) => {
    const pythonScriptPath = path.join(
      __dirname,
      "../scripts/bandit_script.py"
    );

    console.log("✅ Running Python Bandit Script on:", filePath);

    if (!fs.existsSync(filePath)) {
      console.error("❌ Error: File not found at", filePath);
      return resolve({
        file: path.basename(filePath),
        error: "File not found",
      });
    }

    execFile(
      "python",
      [pythonScriptPath, filePath],
      { encoding: "utf8" },
      (error, stdout, stderr) => {
        if (error || stderr) {
          console.error(
            "❌ Python script execution failed:",
            stderr || error.message
          );
          return resolve({
            file: path.basename(filePath),
            error: {
              error: "Python Bandit script failed",
              details: stderr || error.message,
            },
          });
        }

        try {
          console.log("🔍 Bandit Output:", stdout);
          const jsonStartIndex = stdout.indexOf("{");
          if (jsonStartIndex !== -1) {
            stdout = stdout.substring(jsonStartIndex);
          }
          const results = JSON.parse(stdout);
          resolve({
            file: path.basename(filePath),
            issues:
              results.results && results.results.length
                ? results.results
                : "No security issues found",
          });
        } catch (parseError) {
          console.error("❌ Error parsing Bandit output:", parseError);
          resolve({
            file: path.basename(filePath),
            error: "Failed to parse script output",
            details: parseError.message,
          });
        }
      }
    );
  });
};

// POST route now requires authentication and will save an Assessment document
router.post("/", verifyAccessToken, upload.array("files"), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  console.log(
    "📂 Uploaded files:",
    req.files.map((f) => f.filename)
  );

  let scanResults = [];

  for (const file of req.files) {
    const ext = path.extname(file.originalname).toLowerCase();
    const filePath = path.join("uploads", file.filename);

    if (ext === ".zip") {
      console.log("📦 Extracting ZIP:", filePath);
      const extractPath = filePath.replace(".zip", "");
      try {
        await extractZip(filePath, extractPath);
        const pythonFiles = findPythonFiles(extractPath);
        console.log(`🔍 Found ${pythonFiles.length} Python files in ZIP`);

        if (pythonFiles.length === 0) {
          scanResults.push({
            file: file.originalname,
            message: "No Python files found in ZIP",
          });
        } else {
          const zipResults = await Promise.all(
            pythonFiles.map(runBanditPythonScript)
          );
          scanResults.push(...zipResults);
        }
        fs.rmSync(extractPath, { recursive: true, force: true });
      } catch (error) {
        console.error("❌ Error extracting ZIP:", error);
        scanResults.push({
          file: file.originalname,
          error: "Failed to extract ZIP",
        });
      }
    } else if (ext === ".py") {
      console.log("🐍 Scanning single Python file:", filePath);
      const result = await runBanditPythonScript(filePath);
      scanResults.push(result);
    } else {
      console.warn("⚠️ Unsupported file type:", file.originalname);
      scanResults.push({
        file: file.originalname,
        error: "Unsupported file format",
      });
    }

    // Cleanup: Delete the uploaded file if it exists
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn("Error deleting file:", filePath, err.message);
      }
    } else {
      console.warn("File already deleted, skipping:", filePath);
    }
  }

  // Aggregate vulnerabilities from all scan results
  let totalVulnerabilities = 0;
  scanResults.forEach((result) => {
    if (Array.isArray(result.issues)) {
      totalVulnerabilities += result.issues.length;
    }
  });

  // For simplicity, we compute a risk level based on the total vulnerabilities found
  const riskLevel =
    totalVulnerabilities === 0
      ? "Low"
      : totalVulnerabilities < 5
      ? "Moderate"
      : "High";
  const summary = {
    totalFilesScanned: req.files.length,
    totalVulnerabilities,
    riskLevel,
  };

  // Create and save the Assessment document
  try {
    const assessment = new Assessment({
      user: req.user.id,
      type: "code",
      data: {
        // Store the scan results under "vulnerabilities" to match what the dashboard expects
        vulnerabilities: scanResults,
        summary,
      },
    });
    const savedAssessment = await assessment.save();
    return res.status(200).json({
      message: "Code Assessment submitted and saved successfully.",
      assessmentId: savedAssessment._id,
      summary,
      results: scanResults,
    });
  } catch (err) {
    console.error("Error saving code assessment:", err);
    return res.status(500).json({ message: "Error saving code assessment." });
  }
});

const axios = require("axios");
const os = require("os");

router.post("/github", verifyAccessToken, async (req, res) => {
  const { repoUrl } = req.body;
  if (!repoUrl || !repoUrl.startsWith("https://github.com/")) {
    return res.status(400).json({ error: "Invalid GitHub URL" });
  }

  try {
    // Convert repo URL to ZIP download link
    let zipUrl = repoUrl;
    if (zipUrl.endsWith("/")) zipUrl = zipUrl.slice(0, -1);
    if (zipUrl.endsWith(".git")) zipUrl = zipUrl.slice(0, -4);
    zipUrl += "/archive/refs/heads/main.zip";

    const tmpZipPath = path.join(os.tmpdir(), `repo-${Date.now()}.zip`);
    const writer = fs.createWriteStream(tmpZipPath);

    // Download ZIP
    const response = await axios({
      url: zipUrl,
      method: "GET",
      responseType: "stream",
    });

    await new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // Extract and scan
    const extractPath = tmpZipPath.replace(".zip", "");
    await extractZip(tmpZipPath, extractPath);

    const pythonFiles = findPythonFiles(extractPath);
    console.log(`📁 Found ${pythonFiles.length} Python files in GitHub repo`);

    let scanResults = [];
    if (pythonFiles.length > 0) {
      const results = await Promise.all(pythonFiles.map(runBanditPythonScript));
      scanResults.push(...results);
    }

    fs.rmSync(tmpZipPath, { force: true });
    fs.rmSync(extractPath, { recursive: true, force: true });

    const totalVulnerabilities = scanResults.reduce((acc, result) => {
      return acc + (Array.isArray(result.issues) ? result.issues.length : 0);
    }, 0);

    const riskLevel =
      totalVulnerabilities === 0
        ? "Low"
        : totalVulnerabilities < 5
        ? "Moderate"
        : "High";

    const summary = {
      totalFilesScanned: pythonFiles.length,
      totalVulnerabilities,
      riskLevel,
    };

    const assessment = new Assessment({
      user: req.user.id,
      type: "code",
      data: {
        vulnerabilities: scanResults,
        summary,
        repo: repoUrl,
      },
    });

    const savedAssessment = await assessment.save();

    return res.status(200).json({
      message: "GitHub repo scanned successfully.",
      assessmentId: savedAssessment._id,
      summary,
      results: scanResults,
    });
  } catch (err) {
    console.error("❌ GitHub scan failed:", err.message);
    return res.status(500).json({ error: "Failed to scan GitHub repo." });
  }
});

module.exports = router;
