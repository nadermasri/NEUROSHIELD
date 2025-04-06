#server/scripts/bandit_script.py
import subprocess
import sys
import json
import os
import shutil

def run_bandit(file_path):
    """Runs Bandit using its full path to avoid execution issues on Windows."""
    # Try to find bandit in PATH first
    bandit_path = shutil.which("bandit")
    
    # If not found in PATH, try to find it in common locations
    if not bandit_path:
        # Try to find Python executable
        python_path = shutil.which("python") or shutil.which("py")
        
        if python_path:
            # Try to find bandit in the same directory as Python
            python_dir = os.path.dirname(python_path)
            potential_paths = [
                os.path.join(python_dir, "Scripts", "bandit.exe"),  # Windows
                os.path.join(python_dir, "bin", "bandit"),          # Unix
                os.path.join(os.path.dirname(python_dir), "Scripts", "bandit.exe"),  # Windows venv
                os.path.join(os.path.dirname(python_dir), "bin", "bandit"),          # Unix venv
            ]
            
            for path in potential_paths:
                if os.path.exists(path):
                    bandit_path = path
                    break
    
    # If still not found, try to use the hardcoded path as a fallback
    if not bandit_path:
        project_root = os.path.abspath(os.path.join(os.getcwd(), ".."))  # Moves to project root
        bandit_path = os.path.join(project_root, "venv", "Scripts", "bandit.exe")
    
    # Ensure the file exists before running Bandit
    if not os.path.exists(file_path):
        print(json.dumps({"error": f"File not found: {file_path}"}))
        return

    # If bandit is still not found, report an error
    if not bandit_path or not os.path.exists(bandit_path):
        print(json.dumps({"error": "Bandit executable not found. Please install Bandit using 'pip install bandit'"}))
        return

    try:
        result = subprocess.run(
            [bandit_path, "-r", file_path, "--format", "json"],
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