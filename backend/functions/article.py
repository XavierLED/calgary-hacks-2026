from newspaper import Article
from typing import Dict, Any, List


def extract_article_content(article_url: str) -> Dict[str, Any]:
    """
    Extracts article content using Newspaper3k library (no API needed).
    
    Args:
        article_url: The URL of the article to extract
        
    Returns:
        dict: Extracted article information
    """
    article = Article(article_url)
    article.config.browser_user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    article.download()
    article.parse()
    
    # Optional: extract keywords and summary (requires NLP)
    try:
        article.nlp()
        keywords = article.keywords
        summary = article.summary
    except:
        keywords = []
        summary = ""
    
    return {
        "title": article.title,
        "authors": article.authors,
        "publish_date": str(article.publish_date) if article.publish_date else None,
        "text": article.text,
        "top_image": article.top_image,
        "images": list(article.images),
        "videos": article.movies,
        "keywords": keywords,
        "summary": summary,
        "url": article.url
    }