#serp.py
from dotenv import load_dotenv
import os
import requests
from urllib.parse import urlparse

load_dotenv()

serp_api_key = os.getenv("SERP_API_KEY")

def generate_query(entity):
    """Defines query parameters for our Gooogle search"""
    #TO-DO: customize query based on if entity is org or person
   
    queries = [
        f"{entity} ownership",
        f"{entity} executives",
        f"{entity} political bias",
        f"{entity} advertisers",
        f"{entity} shareholders",
        f"{entity} leadership",
        f"{entity} corporate structure"
    ]
    
    return queries

def serp_search(entity: str, num_results: int = 10):
    """
    Run multiple SERP queries and merge + deduplicates + filter results.
    Returns a list of {title, url, snippet}.
    """
    queries = generate_query(entity)
    merged = []

    for q in queries:

        try:

            params = {
                "engine": "google",
                "q": q,
                "api_key": serp_api_key,
                "num": num_results,
            }

            resp = requests.get("https://serpapi.com/search", params=params, timeout= 30)
            resp.raise_for_status()
            data = resp.json()

        except requests.exceptions.RequestException as e:
            print(f"SERP API error for query '{q}': {e}")
            continue 

        for item in data.get("organic_results", []):
            url = item.get("link", "")
            domain = urlparse(url).netloc.replace("www.", "")

            merged.append({
                "title": item.get("title", ""),
                "url": url,
                "snippet": item.get("snippet", ""),
                "domain": domain,
            })

    # Deduplicate by URL
    deduped = []
    seen = set()

    for r in merged:
        if r["url"] and r["url"] not in seen:
            seen.add(r["url"])
            deduped.append(r)


    return deduped


def build_serp_context(results):
    lines = []
    for i, r in enumerate(results, start=1):
        lines.append(
            f"[{i}] {r['title']}\nURL: {r['url']}\nSnippet: {r['snippet']}\n"
        )
    return "\n".join(lines)