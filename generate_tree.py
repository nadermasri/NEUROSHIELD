import os

# Excluded folders and exact filenames
EXCLUDED_DIRS = {'node_modules', 'env', '__pycache__', '.git'}
EXCLUDED_FILES = {'.env', '.env.local', 'package-lock.json'}

def should_exclude_dir(path):
    parts = path.split(os.sep)
    if 'client' in parts and 'node_modules' in parts:
        return True
    if 'server' in parts and 'env' in parts:
        return True
    if any(part in EXCLUDED_DIRS for part in parts):
        return True
    return False

def should_exclude_file(file_name):
    return file_name in EXCLUDED_FILES

def generate_tree(start_path, prefix=""):
    tree_str = ""
    try:
        entries = sorted(os.listdir(start_path))
    except Exception:
        return tree_str  # skip folders we can't access

    entries = [e for e in entries if not should_exclude_file(e)]

    for idx, entry in enumerate(entries):
        path = os.path.join(start_path, entry)
        if os.path.isdir(path):
            if should_exclude_dir(path):
                continue
        connector = "└── " if idx == len(entries) - 1 else "├── "
        tree_str += prefix + connector + entry + "\n"
        if os.path.isdir(path):
            extension = "    " if idx == len(entries) - 1 else "│   "
            tree_str += generate_tree(path, prefix + extension)
    return tree_str

# Write to file
with open("project_tree.txt", "w", encoding="utf-8") as f:
    f.write(".\n")
    f.write(generate_tree("."))

import os

# Excluded folders and exact filenames
EXCLUDED_DIRS = {'node_modules', 'env', '__pycache__', '.git'}
EXCLUDED_FILES = {'.env', '.env.local', 'package-lock.json'}

def should_exclude_dir(path):
    parts = path.split(os.sep)
    if 'client' in parts and 'node_modules' in parts:
        return True
    if 'server' in parts and 'env' in parts:
        return True
    if any(part in EXCLUDED_DIRS for part in parts):
        return True
    return False

def should_exclude_file(file_name):
    return file_name in EXCLUDED_FILES

def generate_tree(start_path, prefix=""):
    tree_str = ""
    try:
        entries = sorted(os.listdir(start_path))
    except Exception:
        return tree_str  # skip folders we can't access

    entries = [e for e in entries if not should_exclude_file(e)]

    for idx, entry in enumerate(entries):
        path = os.path.join(start_path, entry)
        if os.path.isdir(path):
            if should_exclude_dir(path):
                continue
        connector = "└── " if idx == len(entries) - 1 else "├── "
        tree_str += prefix + connector + entry + "\n"
        if os.path.isdir(path):
            extension = "    " if idx == len(entries) - 1 else "│   "
            tree_str += generate_tree(path, prefix + extension)
    return tree_str

# Write to file
with open("project_tree.txt", "w", encoding="utf-8") as f:
    f.write(".\n")
    f.write(generate_tree("."))