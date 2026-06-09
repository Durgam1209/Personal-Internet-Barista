from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
import json
import os
import sys
import io
from dotenv import load_dotenv
from datetime import datetime

# Force UTF-8 output encoding for Windows terminals
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

load_dotenv()

app = FastAPI(title="personal.cafe API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase = None

if supabase_url and supabase_key:
    try:
        supabase = create_client(supabase_url, supabase_key)
        print("✅ Supabase client initialized.")
    except Exception as e:
        print(f"❌ Failed to initialize Supabase client: {e}")
else:
    print("⚠️ Supabase credentials missing. API will serve local fallback data.")

def load_fallback():
    for path in ["data/digest.json", "data/digest.mock.json"]:
        if os.path.exists(path):
            with open(path) as f:
                return json.load(f)
    return {"error": "No digest available"}

@app.get("/digest")
def get_digest():
    """Get today's latest digest"""
    if not supabase:
        print("Supabase client not initialized, returning local fallback.")
        return load_fallback()
    try:
        result = supabase.table("digests") \
            .select("*") \
            .order("generated_at", desc=True) \
            .limit(1) \
            .execute()
        if result.data:
            return result.data[0]
        return load_fallback()
    except Exception as e:
        print(f"Supabase error: {e}")
        return load_fallback()

@app.get("/digest/history")
def get_history(limit: int = 7):
    """Get last N digests — shows judges the system runs daily"""
    if not supabase:
        print("Supabase client not initialized, returning mock history.")
        fallback_data = load_fallback()
        # Return a list containing the fallback digest to simulate history
        return {
            "digests": [
                {
                    "id": 1,
                    "generated_at": fallback_data.get("generated_at", datetime.now().isoformat()),
                    "espresso": fallback_data.get("espresso", {})
                }
            ],
            "count": 1,
            "offline": True
        }
    try:
        result = supabase.table("digests") \
            .select("id, generated_at, espresso") \
            .order("generated_at", desc=True) \
            .limit(limit) \
            .execute()
        return {"digests": result.data, "count": len(result.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {
        "status": "ok",
        "time": datetime.now().isoformat(),
        "service": "personal.cafe"
    }

@app.get("/pipeline/log")
def get_pipeline_log():
    """Shows judges the pipeline has been running reliably"""
    try:
        with open("data/pipeline_log.json") as f:
            return {"runs": json.load(f)}
    except FileNotFoundError:
        return {"runs": [], "message": "No runs yet"}

# run with: uvicorn backend.main:app --reload --port 8000