import json
import os
import re
import sys
import io
from datetime import datetime

# Force UTF-8 output encoding for Windows terminals
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass
from dotenv import load_dotenv
from typing import List, Optional
from pydantic import BaseModel, Field

# Load environment variables
load_dotenv()

# We want scikit-learn for deduplication. Since it might not be installed yet or fails,
# let's write a safe import/fallback for TF-IDF + cosine similarity.
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

# Define Pydantic schema for strict validation
class EspressoDigest(BaseModel):
    headline: str = Field(description="One punchy sentence summarising the biggest story")
    body: str = Field(description="Three sentences max. Sharp, analytical, no hype.")
    source_url: str = Field(description="Source link URL")

class ColdBrewDigest(BaseModel):
    title: str = Field(description="Name of the concept or paper")
    summary: str = Field(description="One clear paragraph explaining it simply")
    takeaways: List[str] = Field(description="Exactly three key insights")
    source_url: str = Field(description="Source link URL")

class PastryDigest(BaseModel):
    title: str = Field(description="Name of the repo or tool")
    why_it_matters: str = Field(description="Two sentences on why engineers should care")
    link: str = Field(description="Link to the repository or tool")

class DailyDigest(BaseModel):
    generated_at: str = Field(description="ISO-8601 Timestamp of generation")
    espresso: EspressoDigest
    cold_brew: ColdBrewDigest
    pastry: PastryDigest

def deduplicate_items(items, threshold=0.5):
    """
    Remove duplicate stories using TF-IDF + Cosine Similarity.
    If scikit-learn is not installed, it falls back to title matching.
    """
    if not items:
        return []
    
    print(f"Deduplicating {len(items)} items...")
    
    if not HAS_SKLEARN:
        print("⚠️ scikit-learn not available. Falling back to basic title deduplication.")
        seen_titles = set()
        unique_items = []
        for item in items:
            title_norm = item.get("title", "").strip().lower()
            if title_norm not in seen_titles:
                seen_titles.add(title_norm)
                unique_items.append(item)
        return unique_items

    # Combine title and summary for matching
    texts = []
    for item in items:
        title = item.get("title", "")
        summary = item.get("summary", "") or ""
        texts.append(f"{title} {summary}")

    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(texts)
    sim_matrix = cosine_similarity(tfidf_matrix)

    keep_indices = []
    skipped = set()

    for i in range(len(items)):
        if i in skipped:
            continue
        keep_indices.append(i)
        for j in range(i + 1, len(items)):
            if sim_matrix[i, j] > threshold:
                skipped.add(j)

    unique_items = [items[idx] for idx in keep_indices]
    print(f"Deduplication finished. Kept {len(unique_items)} of {len(items)} items.")
    return unique_items

def clean_llm_response(text):
    """
    Clean codeblock formatting (e.g. ```json ... ```) from LLM response
    """
    text = text.strip()
    # Remove markdown code blocks if present
    match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text

def call_anthropic(prompt, api_key):
    """
    Call Anthropic Claude API directly
    """
    import anthropic
    client = anthropic.Anthropic(api_key=api_key)
    print("Calling Anthropic Claude API (claude-3-5-sonnet)...")
    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=2000,
        temperature=0.2,
        system="You are the personal.cafe AI barista. You compile the raw tech articles into a structured, highly analytical daily digest. Output ONLY raw JSON matching the requested schema.",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return message.content[0].text

def call_openrouter(prompt, api_key):
    """
    Call OpenRouter API (supports Anthropic Claude or alternative models)
    """
    import httpx
    print("Calling OpenRouter API (anthropic/claude-3.5-sonnet)...")
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://personal.cafe",
        "X-Title": "personal.cafe"
    }
    payload = {
        "model": "anthropic/claude-3.5-sonnet",
        "messages": [
            {
                "role": "system",
                "content": "You are the personal.cafe AI barista. You compile the raw tech articles into a structured daily digest. Output ONLY raw JSON."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.2
    }
    response = httpx.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=headers,
        json=payload,
        timeout=60.0
    )
    response.raise_for_status()
    result = response.json()
    return result['choices'][0]['message']['content']

def generate_offline_fallback():
    """
    Fallback digest generation if API keys are missing or calls fail.
    """
    print("⚠️ API keys missing or LLM call failed. Generating fallback digest.")
    mock_path = "data/digest.mock.json"
    if os.path.exists(mock_path):
        with open(mock_path, 'r', encoding='utf-8') as f:
            digest = json.load(f)
        digest["generated_at"] = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        return digest
    else:
        return {
            "generated_at": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            "espresso": {
                "headline": "personal.cafe Daily Digest Pipeline Online",
                "body": "The personal.cafe data ingestion and backend pipeline is running successfully. AI synthesis is operating in preview mode with custom fallback logic.",
                "source_url": "https://github.com"
            },
            "cold_brew": {
                "title": "Self-Healing Automated Architectures",
                "summary": "Building fault-tolerant automated pipelines ensures high availability. When external LLM API endpoints or database connections fail, fallback caches keep serving the client without downtime.",
                "takeaways": [
                    "Graceful degradation prevents frontend blank screens",
                    "Local caching of previous digests ensures reliable demo presentations",
                    "Separation of concerns allows easy debugging of database schemas"
                ],
                "source_url": "https://github.com"
            },
            "pastry": {
                "title": "personal-barista-pipeline",
                "why_it_matters": "A clean, automated tech news digest system built with FastAPI, Next.js, and Supabase. Brewed with precision.",
                "link": "https://github.com"
            }
        }

def main():
    print("--- Starting AI Brew Synthesis ---")
    
    raw_path = "data/raw_items.json"
    if not os.path.exists(raw_path):
        print(f"❌ Error: Raw items file not found at {raw_path}")
        sys.exit(1)
        
    with open(raw_path, 'r', encoding='utf-8') as f:
        raw_items = json.load(f)
        
    if not raw_items:
        print("⚠️ Warning: raw_items.json is empty!")
        digest = generate_offline_fallback()
        write_digest(digest)
        return

    # Deduplicate raw items
    filtered_items = deduplicate_items(raw_items)
    
    # Check for keys
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    
    if not anthropic_key and not openrouter_key:
        digest = generate_offline_fallback()
        write_digest(digest)
        return
        
    # Build prompt
    prompt = f"""You are the personal.cafe AI barista. Your job is to brew a daily digest from the following raw items fetched from the internet.

Input items (already deduplicated):
{json.dumps(filtered_items[:15], indent=2)}

Your output must be a single JSON object matching this schema:
{{
  "espresso": {{
    "headline": "One punchy sentence summarising the biggest story",
    "body": "Three sentences max. Sharp, analytical, no hype.",
    "source_url": "Source link URL of the biggest story"
  }},
  "cold_brew": {{
    "title": "Name of the concept, framework, or paper of the day (different from espresso)",
    "summary": "One clear paragraph explaining it simply",
    "takeaways": [
      "Key insight number one",
      "Key insight number two",
      "Key insight number three"
    ],
    "source_url": "Source link URL"
  }},
  "pastry": {{
    "title": "Name of the open-source repo or UI tool (different from espresso and cold_brew)",
    "why_it_matters": "Two sentences on why engineers should care",
    "link": "Link to the repository or tool"
  }}
}}

Guidelines:
1. "espresso": Focus on the single most significant engineering/AI news from the last 24 hours. The headline must be punchy. The body must be maximum 3 sentences, highly analytical, objective, and contain no clickbait.
2. "cold_brew": Focus on a deep concept, new framework, or research paper. Explain it simply so an engineer can learn it today. The takeaways array must have exactly three items.
3. "pastry": Highlight an outstanding open-source repository or tool. The link must be a valid GitHub or tool URL from the items.
4. Ensure there is no overlap in topics between the Espresso, Cold Brew, and Pastry sections.
5. All source URLs must be taken from the input items. Do not invent links.
6. Return ONLY the raw JSON object. Do not include markdown code block syntax (like ```json).
"""

    response_text = None
    success = False
    
    # Try calling the API (up to 2 retries)
    for attempt in range(2):
        try:
            if openrouter_key:
                response_text = call_openrouter(prompt, openrouter_key)
            elif anthropic_key:
                response_text = call_anthropic(prompt, anthropic_key)
                
            if response_text:
                cleaned = clean_llm_response(response_text)
                digest_dict = json.loads(cleaned)
                
                # Validate with Pydantic
                # Add timestamp
                digest_dict["generated_at"] = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
                validated = DailyDigest(**digest_dict)
                
                # Write output
                write_digest(validated.model_dump())
                success = True
                print("✅ Successfully generated and validated digest via LLM!")
                break
        except Exception as e:
            print(f"⚠️ Attempt {attempt+1} failed: {e}")
            if attempt == 0:
                print("Retrying...")
                
    if not success:
        print("❌ LLM synthesis failed or was invalid.")
        digest = generate_offline_fallback()
        write_digest(digest)

def write_digest(digest_dict):
    output_path = "data/digest.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(digest_dict, f, indent=2)
    print(f"Saved output to {output_path}")

if __name__ == "__main__":
    main()