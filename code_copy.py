import os

# Folders to skip
EXCLUDED_DIRS = {'node_modules', 'env', '__pycache__', '.git', 'ml_service'}

# Files to skip (including server/package-lock.json)
EXCLUDED_FILES = {'.env', '.env.local', 'package-lock.json'}

# Allowed code file extensions
INCLUDE_EXTENSIONS = ('.js', '.jsx', '.ts', '.tsx', '.py', '.html', '.css', '.json')

def should_exclude(path):
    parts = path.split(os.sep)

    # Exclude specific folders
    for i in range(len(parts)):
        if parts[i] in EXCLUDED_DIRS:
            # Only exclude 'env' if it's inside 'server'
            if parts[i] == 'env' and not ('server' in parts[:i]):
                continue
            return True

    # Exclude specific files
    if os.path.basename(path) in EXCLUDED_FILES:
        return True

    return False

with open("all_code.txt", "w", encoding="utf-8") as out:
    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS or (d == 'env' and not root.endswith('server'))]

        for file in files:
            full_path = os.path.join(root, file)
            if should_exclude(full_path):
                continue
            if file.endswith(INCLUDE_EXTENSIONS):
                out.write(f"\n\n--- {full_path} ---\n")
                try:
                    with open(full_path, encoding="utf-8") as f:
                        out.write(f.read())
                except Exception as e:
                    out.write(f"[ERROR READING FILE: {e}]\n")