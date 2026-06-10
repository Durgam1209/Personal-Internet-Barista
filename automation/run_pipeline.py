import subprocess
import sys
import io
import json
import os
from datetime import datetime

# Force UTF-8 output encoding for Windows terminals
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

LOG_FILE = "data/pipeline_log.json"

def load_log():
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE) as f:
            return json.load(f)
    return []

def save_log(log):
    with open(LOG_FILE, "w") as f:
        json.dump(log, f, indent=2)

def run_step(name, script_path):
    print(f"\n{'='*40}")
    print(f"RUNNING: {name}")
    print(f"{'='*40}")
    start = datetime.now()
    result = subprocess.run([sys.executable, script_path])
    duration = (datetime.now() - start).seconds
    if result.returncode != 0:
        print(f"❌ FAILED: {name}")
        return False, duration
    print(f"✅ DONE: {name} ({duration}s)")
    return True, duration

if __name__ == "__main__":
    started_at = datetime.now()
    print(f"\n☕ Pipeline started at {started_at.strftime('%H:%M:%S')}")

    steps = [
        ("Step 1 — Fetch Data",       "ingestion/fetch.py"),
        ("Step 2 — AI Synthesis",     "ai/brew.py"),
        ("Step 3 — Save to Supabase", "backend/save.py"),
    ]

    results = []
    all_passed = True

    for name, path in steps:
        passed, duration = run_step(name, path)
        results.append({"step": name, "passed": passed, "duration_s": duration})
        if not passed:
            all_passed = False
            break

    finished_at = datetime.now()
    total = (finished_at - started_at).seconds

    # save log
    log = load_log()
    log.append({
        "run_at": started_at.isoformat(),
        "total_duration_s": total,
        "success": all_passed,
        "steps": results
    })
    save_log(log[-30:])  # keep last 30 runs only

    if all_passed:
        print(f"\n✅ All done in {total}s")
        print("digest.json is ready · Supabase updated · log saved")
    else:
        print(f"\n❌ Pipeline failed. Check errors above.")
        sys.exit(1)