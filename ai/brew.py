import json
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

def call_llm(prompt):
    response = httpx.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost",
            "X-Title": "personal.cafe"
        },
        json={
            "model": "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
            "messages": [{"role": "user", "content": prompt}]
        },
        timeout=60
    )

    data = response.json()
    print("FULL RESPONSE:", data)

    if "choices" in data:
        return data["choices"][0]["message"]["content"].strip()
    elif "error" in data:
        print("ERROR FROM OPENROUTER:", data["error"])
        return None
    else:
        print("UNEXPECTED RESPONSE:", data)
        return None

def deduplicate(items):
    seen_titles = set()
    unique = []
    for item in items:
        title_lower = item["title"].lower()[:50]
        if title_lower not in seen_titles:
            seen_titles.add(title_lower)
            unique.append(item)
    return unique

def brew_digest(items):
    items_text = "\n".join([
        f"- [{item['source']}] {item['title']}: {item['summary']}"
        for item in items[:20]
    ])

    prompt = f"""You are the editor of a senior engineering newsletter read by CTOs and staff engineers.
Your writing is sharp, analytical, and direct. You never use hype words like "revolutionary", "groundbreaking", or "game-changing".
You write like a smart colleague explaining something over coffee — concise, confident, no fluff.

Given these raw stories from GitHub, ArXiv, and Hacker News today:
{items_text}

Select the three most important and interesting items and return ONLY this exact JSON structure.
No markdown. No backticks. No explanation. Just the JSON.

{{
  "generated_at": "{__import__('datetime').datetime.now().isoformat()}",
  "espresso": {{
    "headline": "one sentence. present tense. factual. no hype.",
    "body": "exactly 3 sentences. what happened, why it matters, what engineers should do about it.",
    "source_url": "url"
  }},
  "cold_brew": {{
    "title": "name of the concept, paper, or framework",
    "summary": "one paragraph. explain it like the reader is smart but hasn't seen this yet.",
    "takeaways": [
      "concrete technical insight — specific, not vague",
      "concrete technical insight — specific, not vague", 
      "concrete technical insight — specific, not vague"
    ],
    "source_url": "url"
  }},
  "pastry": {{
    "title": "repo or tool name",
    "why_it_matters": "two sentences. practical value only. what problem does it solve and for whom.",
    "link": "url"
  }}
}}"""

    raw = call_llm(prompt)

    if raw is None:
        print("ERROR: LLM returned nothing. Check your API key and model.")
        return

    try:
        # strip markdown backticks if model adds them anyway
        raw = raw.replace("```json", "").replace("```", "").strip()
        digest = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"ERROR: Could not parse JSON. Raw output was:\n{raw}")
        print(f"JSON error: {e}")
        return

    with open("data/digest.json", "w") as f:
        json.dump(digest, f, indent=2)

    print("✅ Done. digest.json saved.")
    return digest

if __name__ == "__main__":
    try:
        with open("data/raw_items.json") as f:
            items = json.load(f)
    except FileNotFoundError:
        print("ERROR: data/raw_items.json not found. Run Role 1 first.")
        exit(1)

    if not items:
        print("ERROR: raw_items.json is empty.")
        exit(1)

    unique = deduplicate(items)
    print(f"{len(items)} items → {len(unique)} after dedup")

    brew_digest(unique)