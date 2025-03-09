const express = require("express");
const multer = require("multer");
const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const runBanditPythonScript = async (filePath) => {
    return new Promise((resolve, reject) => {
        const pythonScriptPath = path.join(__dirname, "../scripts/bandit_script.py");

        console.log("✅ Running Python Bandit Script on:", filePath);

        if (!fs.existsSync(filePath)) {
            console.error("❌ Error: File not found at", filePath);
            return resolve({
                file: path.basename(filePath),
                error: "File not found"
            });
        }

        execFile("python", [pythonScriptPath, filePath], { encoding: "utf8" }, (error, stdout, stderr) => {
            if (error || stderr) {
                console.error(`❌ Python script execution failed:`, stderr || error.message);
                return resolve({
                    file: path.basename(filePath),
                    error: {
                        error: "Python Bandit script failed",
                        details: stderr || error.message
                    }
                });
            }

            try {
                console.log("🔍 Python Script Output:", stdout);

                // Remove any unexpected output before the JSON response
                const jsonStartIndex = stdout.indexOf("{");
                if (jsonStartIndex !== -1) {
                    stdout = stdout.substring(jsonStartIndex); // Trim leading non-JSON text
                }

                const results = JSON.parse(stdout);

                if (!results.results || results.results.length === 0) {
                    console.warn("⚠️ No vulnerabilities found in:", filePath);
                    return resolve({
                        file: path.basename(filePath),
                        message: "No security issues found"
                    });
                }

                resolve({
                    file: path.basename(filePath),
                    issues: results.results
                });
            } catch (parseError) {
                console.error("❌ Failed to parse Python script output:", parseError);
                resolve({
                    file: path.basename(filePath),
                    error: {
                        error: "Failed to parse script output",
                        details: parseError.message
                    }
                });
            }
        });
    });
};

router.post("/", upload.array("files"), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
    }

    console.log("📂 Uploaded files:", req.files.map(f => f.path));

    const scanResults = await Promise.all(req.files.map(file => runBanditPythonScript(file.path)));

    res.json({
        success: true,
        results: scanResults
    });
});

module.exports = router;
