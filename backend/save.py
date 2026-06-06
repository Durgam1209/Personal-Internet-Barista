from supabase import create_client
import json
import os
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

def save_digest():
    try:
        with open("data/digest.json") as f:
            digest = json.load(f)

        result = supabase.table("digests").insert({
            "espresso": digest["espresso"],
            "cold_brew": digest["cold_brew"],
            "pastry":    digest["pastry"]
        }).execute()

        print(f"✅ Saved to Supabase. ID: {result.data[0]['id']}")

    except Exception as e:
        print(f"❌ Supabase save failed: {e}")

if __name__ == "__main__":
    save_digest()