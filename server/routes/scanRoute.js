const express = require("express");
const multer = require("multer");
const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");

const router = express.Router();

// 🔹 Configure multer to store files with original extensions
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get the file extension (.zip)
    cb(null, `${file.fieldname}-${Date.now()}${ext}`); // Preserve .zip extension
  },
});

const upload = multer({ storage: storage });

// 🔹 Extract ZIP file
const extractZip = async (zipPath, extractTo) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractTo }))
      .on("close", resolve)
      .on("error", reject);
  });
};

// 🔹 Find all Python files inside a folder
const findPythonFiles = (dir) => {
  let pyFiles = [];
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      pyFiles = pyFiles.concat(findPythonFiles(fullPath)); // Recursive search
    } else if (file.endsWith(".py")) {
      pyFiles.push(fullPath);
    }
  });
  return pyFiles;
};

// 🔹 Run Bandit security scan on Python files
const runBanditPythonScript = async (filePath) => {
  return new Promise((resolve, reject) => {
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
            `❌ Python script execution failed:`,
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
          issues: results.results.length ? results.results : "No security issues found",
        });
      } catch (parseError) {
        console.error("❌ Error parsing Bandit output:", parseError);
        resolve({
          file: path.basename(filePath),
          error: "Failed to parse script output",
          details: parseError.message,
        });
      }
    });
  });
};

// 🔹 Handle File Uploads (ZIPs and Individual Python Files)
router.post("/", upload.array("files"), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  console.log("📂 Uploaded files:", req.files.map((f) => f.filename));

  let scanResults = [];

  for (const file of req.files) {
    const ext = path.extname(file.originalname).toLowerCase();
    const filePath = path.join("uploads", file.filename);

    if (ext === ".zip") {
      console.log("📦 Extracting ZIP:", filePath);
      const extractPath = filePath.replace(".zip", ""); // Ensure it extracts to a proper folder

      try {
        await extractZip(filePath, extractPath);
        const pythonFiles = findPythonFiles(extractPath);
        console.log(`🔍 Found ${pythonFiles.length} Python files in ZIP`);

        if (pythonFiles.length === 0) {
          scanResults.push({ file: file.originalname, message: "No Python files found in ZIP" });
        } else {
          const zipResults = await Promise.all(pythonFiles.map(runBanditPythonScript));
          scanResults.push(...zipResults);
        }

        fs.rmSync(extractPath, { recursive: true, force: true });
      } catch (error) {
        console.error("❌ Error extracting ZIP:", error);
        scanResults.push({ file: file.originalname, error: "Failed to extract ZIP" });
      }
    } else if (ext === ".py") {
      console.log("🐍 Scanning single Python file:", filePath);
      const result = await runBanditPythonScript(filePath);
      scanResults.push(result);
    } else {
      console.warn("⚠️ Unsupported file type:", file.originalname);
      scanResults.push({ file: file.originalname, error: "Unsupported file format" });
    }

    fs.unlinkSync(filePath); // Cleanup uploaded files
  }

  res.json({ success: true, results: scanResults });
});

module.exports = router;
