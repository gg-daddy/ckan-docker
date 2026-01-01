#!/usr/bin/env python3
"""
Fix notebook cell source format - convert list to single string with newlines.
"""

import json
import os

NOTEBOOKS_DIR = "/Users/chenyanbin/codebase/keyrus/ckan-docker/portaljs/content/notebooks"

def fix_notebook(filepath):
    with open(filepath, 'r') as f:
        nb = json.load(f)
    
    for cell in nb.get("cells", []):
        source = cell.get("source", [])
        if isinstance(source, list):
            # Join list items with newlines
            cell["source"] = "\n".join(source)
    
    with open(filepath, 'w') as f:
        json.dump(nb, f, indent=2)

def main():
    for filename in os.listdir(NOTEBOOKS_DIR):
        if filename.endswith('.ipynb') and filename != 'example-dataset.ipynb':
            filepath = os.path.join(NOTEBOOKS_DIR, filename)
            fix_notebook(filepath)
            print(f"Fixed: {filename}")

if __name__ == "__main__":
    main()
