from supabase import create_client
import json
import os
import sys
import io
from dotenv import load_dotenv

# Force UTF-8 output encoding for Windows terminals
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase = None

if supabase_url and supabase_key:
    try:
        supabase = create_client(supabase_url, supabase_key)
        print("✅ Supabase client initialized for save.")
    except Exception as e:
        print(f"⚠️ Failed to initialize Supabase client: {e}")
else:
    print("⚠️ Supabase credentials missing. Running save.py in offline/dry-run mode.")

def save_digest():
    try:
        digest_path = "data/digest.json"
        if not os.path.exists(digest_path):
            print(f"❌ Error: digest file not found at {digest_path}")
            return False

        with open(digest_path, encoding='utf-8') as f:
            digest = json.load(f)

        if not supabase:
            print("⚠️ Skipped Supabase insert (offline mode). Digest fields verified locally:")
            print(f"  Espresso: {digest.get('espresso', {}).get('headline', 'N/A')[:50]}...")
            print(f"  Cold Brew: {digest.get('cold_brew', {}).get('title', 'N/A')}")
            print(f"  Pastry: {digest.get('pastry', {}).get('title', 'N/A')}")
            return True

        # Check if digest has generated_at, fallback to now if not
        payload = {
            "espresso": digest["espresso"],
            "cold_brew": digest["cold_brew"],
            "pastry":    digest["pastry"]
        }
        if "generated_at" in digest:
            payload["generated_at"] = digest["generated_at"]

        result = supabase.table("digests").insert(payload).execute()

        if result.data:
            print(f"✅ Saved to Supabase. ID: {result.data[0].get('id', 'N/A')}")
        else:
            print("⚠️ Supabase insert executed, but returned no data.")
        return True

    except Exception as e:
        print(f"❌ Supabase save failed: {e}")
        return False

if __name__ == "__main__":
    success = save_digest()
    if not success:
        sys.exit(1)