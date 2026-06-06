from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/digest")
def get_digest():
    path = "data/digest.json"
    fallback = "data/digest.mock.json"
    
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    else:
        with open(fallback) as f:
            return json.load(f)

@app.get("/health")
def health():
    return {"status": "ok"}

# run with: uvicorn backend.main:app --reload