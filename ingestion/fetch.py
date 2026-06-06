import httpx
import feedparser
import json
import asyncio
from datetime import datetime

async def fetch_github_trending():
    items = []
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.github.com/search/repositories",
            params={"q": "created:>2024-01-01", "sort": "stars", "order": "desc", "per_page": 10},
            headers={"Accept": "application/vnd.github.v3+json"}
        )
        for repo in response.json().get("items", []):
            items.append({
                "title": repo["full_name"],
                "summary": repo["description"] or "No description",
                "url": repo["html_url"],
                "source": "github"
            })
    return items

async def fetch_arxiv():
    items = []
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "http://export.arxiv.org/api/query",
            params={"search_query": "cat:cs.AI", "max_results": 10, "sortBy": "submittedDate"}
        )
        feed = feedparser.parse(response.text)
        for entry in feed.entries:
            items.append({
                "title": entry.title,
                "summary": entry.summary[:300],
                "url": entry.link,
                "source": "arxiv"
            })
    return items

async def fetch_hackernews():
    items = []
    async with httpx.AsyncClient() as client:
        top = await client.get("https://hacker-news.firebaseio.com/v0/topstories.json")
        ids = top.json()[:10]
        for id in ids:
            story = await client.get(f"https://hacker-news.firebaseio.com/v0/item/{id}.json")
            data = story.json()
            if data.get("title"):
                items.append({
                    "title": data["title"],
                    "summary": data.get("text", "No summary")[:300],
                    "url": data.get("url", f"https://news.ycombinator.com/item?id={id}"),
                    "source": "hackernews"
                })
    return items

async def main():
    print("Fetching data...")
    github, arxiv, hn = await asyncio.gather(
        fetch_github_trending(),
        fetch_arxiv(),
        fetch_hackernews()
    )
    all_items = github + arxiv + hn
    with open("data/raw_items.json", "w") as f:
        json.dump(all_items, f, indent=2)
    print(f"Done. Saved {len(all_items)} items to data/raw_items.json")

if __name__ == "__main__":
    asyncio.run(main())