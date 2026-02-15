import re
from urllib.parse import urlparse, parse_qs


def identify_url_type(url: str) -> str:
    """
    Identifies if a URL is a YouTube video, an article page, or neither.
    
    Args:
        url: The URL to identify
        
    Returns:
        str: "youtube_video", "article", or "other"
    """
    try:
        parsed = urlparse(url)
        domain = parsed.netloc.lower()
        path = parsed.path.lower()
        
        # Check for YouTube video
        if _is_youtube_video(domain, path, parsed.query):
            return "youtube_video"
        
        # Check for article page
        if _is_article_page(domain, path):
            return "article"
        
        return "other"
        
    except Exception:
        return "other"


def _is_youtube_video(domain: str, path: str, query: str) -> bool:
    """Check if URL is a YouTube video"""
    # YouTube domains
    youtube_domains = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be']
    
    if not any(yt in domain for yt in youtube_domains):
        return False
    
    # youtu.be short links
    if 'youtu.be' in domain and path and len(path) > 1:
        return True
    
    # youtube.com/watch?v=
    if 'youtube.com' in domain:
        if '/watch' in path and ('v=' in query or 'video_id=' in query):
            return True
        # youtube.com/v/ or youtube.com/embed/
        if '/v/' in path or '/embed/' in path:
            return True
    
    return False


def _is_article_page(domain: str, path: str) -> bool:
    """Check if URL is likely an article page"""
    # Common news/article domains
    article_domains = [
        'nytimes.com', 'washingtonpost.com', 'theguardian.com', 'bbc.com', 'cnn.com',
        'reuters.com', 'apnews.com', 'nbcnews.com', 'abcnews.com', 'cbsnews.com',
        'forbes.com', 'bloomberg.com', 'wsj.com', 'medium.com', 'substack.com',
        'techcrunch.com', 'theverge.com', 'arstechnica.com', 'wired.com',
        'wikipedia.org', 'britannica.com'
    ]
    
    # Check if it's a known article domain
    if any(article_domain in domain for article_domain in article_domains):
        return True
    
    # Check for article-like URL patterns
    article_patterns = [
        r'/article[s]?/',
        r'/blog/',
        r'/post[s]?/',
        r'/news/',
        r'/story/',
        r'/\d{4}/\d{2}/\d{2}/',  # Date pattern (2024/01/15)
        r'/\d{4}-\d{2}-\d{2}/',  # Date pattern (2024-01-15)
    ]
    
    for pattern in article_patterns:
        if re.search(pattern, path):
            return True
    
    # Check for long paths with hyphens or underscores (common in article URLs)
    if len(path) > 20 and ('-' in path or '_' in path):
        # Exclude common non-article paths
        excluded = ['/category/', '/tag/', '/author/', '/search/', '/api/']
        if not any(exc in path for exc in excluded):
            return True
    
    return False


# Example usage
if __name__ == "__main__":
    test_urls = [
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://youtu.be/dQw4w9WgXcQ",
        "https://www.nytimes.com/2024/01/15/technology/ai-article.html",
        "https://medium.com/@user/my-blog-post-about-coding-12345",
        "https://www.google.com",
        "https://github.com/user/repo",
        "https://www.theguardian.com/world/2024/jan/15/news-story",
    ]
    
    for url in test_urls:
        result = identify_url_type(url)
        print(f"{result:15} | {url}")
