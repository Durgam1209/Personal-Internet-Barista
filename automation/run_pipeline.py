import subprocess
import sys
import os
from datetime import datetime

def run_step(name, script_path):
    print(f"\n{'='*40}")
    print(f"RUNNING: {name}")
    print(f"{'='*40}")
    
    result = subprocess.run(
        [sys.executable, script_path],
        capture_output=False
    )
    
    if result.returncode != 0:
        print(f"FAILED: {name}")
        sys.exit(1)
    
    print(f"DONE: {name}")

if __name__ == "__main__":
    print(f"\n☕ personal.cafe pipeline started at {datetime.now().strftime('%H:%M:%S')}")
    
    run_step("Step 1 — Data Ingestion",  "ingestion/fetch.py")
    run_step("Step 2 — AI Synthesis",    "ai/brew.py")
    run_step("Step 3 — Save to Backend", "backend/save.py")
    
    print(f"\n✅ Pipeline complete at {datetime.now().strftime('%H:%M:%S')}")
    print("digest.json is ready in /data")