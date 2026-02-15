import requests
from typing import Dict, Any, List
from urllib.parse import urlparse, parse_qs
import os
from dotenv import load_dotenv
import re

# Load .env file
load_dotenv()

# Access variables
serp_api_key = os.getenv("SERP_API_KEY")


def transform_youtube_url(url: str):
    #get video id
    v_id = get_youtube_video_id(url)

    #get text from transcript
    transcript = get_transcript_text(v_id, serp_api_key)

    #get info from video api
    video_info = get_youtube_video_info(v_id, serp_api_key)
    description = video_info["description"]["content"]
    channel = video_info["channel"]["name"]
    title = video_info["title"]
    sources = extract_non_youtube_links(video_info)

    data = {
        "title" : title,
        "transcript": transcript,
        "description": description,
        "channel": channel,
        "sources": sources
    }

    return data


def get_youtube_video_id(url: str) -> str | None:
    """
    Extracts the video ID from a YouTube URL.
    
    Args:
        url: YouTube URL
        
    Returns:
        str: Video ID if found, None otherwise
        
    Examples:
        >>> get_youtube_video_id("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
        'dQw4w9WgXcQ'
        >>> get_youtube_video_id("https://youtu.be/dQw4w9WgXcQ")
        'dQw4w9WgXcQ'
    """
    try:
        parsed = urlparse(url)
        domain = parsed.netloc.lower()
        
        # youtu.be short links
        if 'youtu.be' in domain:
            # Video ID is in the path: /VIDEO_ID
            video_id = parsed.path.strip('/')
            if video_id:
                return video_id
        
        # youtube.com URLs
        if 'youtube.com' in domain:
            # Standard watch URL: youtube.com/watch?v=VIDEO_ID
            if '/watch' in parsed.path:
                params = parse_qs(parsed.query)
                if 'v' in params:
                    return params['v'][0]
            
            # Embed URL: youtube.com/embed/VIDEO_ID
            if '/embed/' in parsed.path:
                video_id = parsed.path.split('/embed/')[-1].split('/')[0].split('?')[0]
                if video_id:
                    return video_id
            
            # Short URL: youtube.com/v/VIDEO_ID
            if '/v/' in parsed.path:
                video_id = parsed.path.split('/v/')[-1].split('/')[0].split('?')[0]
                if video_id:
                    return video_id
        
        return None
        
    except Exception:
        return None
    
def get_youtube_video_info(video_id: str, api_key: str) -> Dict[str, Any]:
    """
    Fetches YouTube video information using the SerpAPI YouTube video API.
    
    Args:
        video_id: YouTube video ID (e.g., 'dQw4w9WgXcQ')
        api_key: Your SerpAPI API key
        
    Returns:
        dict: JSON response from SerpAPI containing video information
        
    Raises:
        requests.exceptions.RequestException: If the API call fails
    """
    url = "https://serpapi.com/search"
    
    params = {
        "engine": "youtube_video",
        "v": video_id,
        "type": "asr",
        "api_key": api_key
    }
    
    response = requests.get(url, params=params)
    
    return response.json()

def get_transcript_text(video_id: str, api_key: str, lang: str = "en") -> str:
    """
    Fetches YouTube transcript and returns it as plain text.
    
    Args:
        video_id: YouTube video ID
        api_key: Your SerpAPI API key
        lang: Language code for transcript (default: 'en')
        
    Returns:
        str: Full transcript as a single string
    """
    result = get_youtube_transcript(video_id, api_key, lang)
    
    # Extract transcript segments
    transcript = result["transcript"]

    transcript_segments = []
    n = len(transcript)
    for i in range(n):
        transcript_segments.append(transcript[i]["snippet"])
        
    
    # Combine all text segments
    full_text = " ".join(transcript_segments)
    
    return full_text


def get_youtube_transcript(video_id: str, api_key: str, lang: str = "en") -> Dict[str, Any]:
    """
    Fetches YouTube video transcript using the SerpAPI YouTube transcript API.
    
    Args:
        video_id: YouTube video ID (e.g., 'dQw4w9WgXcQ')
        api_key: Your SerpAPI API key
        lang: Language code for transcript (default: 'en' for English)
        
    Returns:
        dict: JSON response from SerpAPI containing transcript data
        
    Raises:
        requests.exceptions.RequestException: If the API call fails
    """
    url = "https://serpapi.com/search"
    
    params = {
        "engine": "youtube_video_transcript",
        "v": video_id,
        "type": "asr",
        "api_key": api_key
    }
    
    response = requests.get(url, params=params)
    
    return response.json()

def extract_non_youtube_links(video_api_response: Dict[str, Any]) -> List[str]:
    """
    Extracts all non-YouTube links from the video description.
    
    Args:
        video_api_response: The JSON response from SerpAPI YouTube video API
        
    Returns:
        list: List of URLs that are not YouTube links
    """
    # Get description from the API response
    if "links" not in video_api_response["description"].keys():
        return []
    
    links = video_api_response["description"]["links"]
    
    # Find all URLs in the description
    all_urls = []

    n = len(links)
    for i in range(n):
        all_urls.append(links[i]["url"])
    
    # Filter out YouTube URLs
    non_youtube_urls = []
    youtube_domains = ['youtube.com', 'youtu.be', 'm.youtube.com']
    
    for url in all_urls:
        # Check if URL contains any YouTube domain
        if not any(yt_domain in url.lower() for yt_domain in youtube_domains):
            non_youtube_urls.append(url)
    
    return non_youtube_urls
