# serp.py
from dotenv import load_dotenv
import os
import aiohttp
from urllib.parse import urlparse

load_dotenv()

serp_api_key = os.getenv("SERP_API_KEY")


def generate_query(entity, role=None):
    context = f"{entity} {role}" if role else entity

    queries = [
        f"{context} ownership",
        f"{context} executives",
        f"{context} political bias",
        f"{context} advertisers",
        f"{context} shareholders",
        f"{context} leadership",
        f"{context} corporate structure"
    ]

    return queries


async def serp_search(entity: str, role: str = None, num_results: int = 5):
    """
    Run multiple SERP queries concurrently, merge, deduplicate, and return results.
    Returns a list of {title, url, snippet, domain}.
    """
    queries = generate_query(entity, role)

    async def fetch_query(session, q):
        params = {
            "engine": "google",
            "q": q,
            "api_key": serp_api_key,
            "num": num_results,
        }
        try:
            async with session.get("https://serpapi.com/search", params=params, timeout=aiohttp.ClientTimeout(total=30)) as resp:
                resp.raise_for_status()
                data = await resp.json()
                results = []
                for item in data.get("organic_results", []):
                    url = item.get("link", "")
                    domain = urlparse(url).netloc.replace("www.", "")
                    results.append({
                        "title": item.get("title", ""),
                        "url": url,
                        "snippet": item.get("snippet", ""),
                        "domain": domain,
                    })
                return results
        except Exception as e:
            print(f"SERP API error for query '{q}': {e}")
            return []

    async with aiohttp.ClientSession() as session:
        import asyncio
        all_results = await asyncio.gather(*[fetch_query(session, q) for q in queries])

    # flatten
    merged = [item for sublist in all_results for item in sublist]

    # deduplicate by URL
    deduped = []
    seen = set()
    for r in merged:
        if r["url"] and r["url"] not in seen:
            seen.add(r["url"])
            deduped.append(r)

    return deduped


def build_serp_context(results, max_results: int = 30):
    lines = []
    for i, r in enumerate(results, start=1):
        lines.append(
            f"[{i}] {r['title']}\nURL: {r['url']}\nSnippet: {r['snippet']}\n"
        )
    return "\n".join(lines)