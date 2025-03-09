import subprocess
import sys
import json
import os
import shutil

def find_bandit():
    """Find the Bandit executable automatically."""
    bandit_cmd = shutil.which("bandit")
    if not bandit_cmd:
        print(json.dumps({"error": "Bandit is not installed or not in PATH. Install it using 'pip install bandit'."}))
        sys.exit(1)
    return bandit_cmd


def run_bandit(file_path):
    """Runs Bandit using its full path to avoid execution issues on Windows."""
    # bandit_path = r"C:\Users\Leenh\AppData\Local\Programs\Python\Python311\Scripts\bandit.exe"  # Change this to the correct path
    bandit_cmd = find_bandit()


    # Ensure the file exists before running Bandit
    if not os.path.exists(file_path):
        print(json.dumps({"error": f"File not found: {file_path}"}))
        return

    try:
        result = subprocess.run(
            [bandit_cmd, "-r", file_path, "--format", "json"],
            capture_output=True, text=True, encoding="utf-8"
        )

        # Handle exit codes
        if result.returncode > 1:
            print(json.dumps({"error": "Bandit encountered an error", "details": result.stderr}))
            return

        output = result.stdout.strip()

        # Ensure output is valid JSON
        try:
            findings = json.loads(output)
            print(json.dumps(findings, indent=2))
        except json.JSONDecodeError:
            print(json.dumps({"error": "Failed to parse Bandit output", "details": output}))

    except FileNotFoundError:
        print(json.dumps({"error": "Bandit executable not found", "path": bandit_path}))
    except Exception as e:
        print(json.dumps({"error": "Unexpected error occurred", "details": str(e)}))


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: python bandit_script.py <file_to_scan.py>"}))
        sys.exit(1)

    file_to_scan = sys.argv[1]
    run_bandit(file_to_scan)
