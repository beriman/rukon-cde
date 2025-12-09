import os
import sys
from pathlib import Path

def check_directory_exists(path):
    if not os.path.exists(path):
        print(f"[FAIL] Directory not found: {path}")
        return False
    print(f"[PASS] Directory exists: {path}")
    return True

def check_file_exists(path):
    if not os.path.exists(path):
        print(f"[FAIL] File not found: {path}")
        return False
    print(f"[PASS] File exists: {path}")
    return True

def main():
    root_dir = os.getcwd()
    print(f"Running Project Health Check in: {root_dir}")
    print("-" * 40)

    # 1. Check DOE Structure
    doe_dirs = ["directives", "execution"]
    structure_ok = True
    for d in doe_dirs:
        if not check_directory_exists(os.path.join(root_dir, d)):
            structure_ok = False
    
    # 2. Check Key Files
    key_files = ["GEMINI.md", "directives/project_management.md", "directives/architecture.md"]
    files_ok = True
    for f in key_files:
        if not check_file_exists(os.path.join(root_dir, f)):
            files_ok = False

    print("-" * 40)
    if structure_ok and files_ok:
        print("✅ PROJECT HEALTH: GREEN")
        sys.exit(0)
    else:
        print("❌ PROJECT HEALTH: RED - Fix missing DOE components.")
        sys.exit(1)

if __name__ == "__main__":
    main()
