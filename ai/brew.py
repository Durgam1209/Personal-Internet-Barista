from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
import json
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = FastAPI(title="personal.cafe API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

def load_fallback():
    for path in ["data/digest.json", "data/digest.mock.json"]:
        if os.path.exists(path):
            with open(path) as f:
                return json.load(f)
    return {"error": "No digest available"}

@app.get("/digest")
def get_digest():
    """Get today's latest digest"""
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

# run with: uvicorn backend.main:app --reload --port 8000