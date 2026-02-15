import requests
import re
from typing import Dict, Any, List, Optional
from urllib.parse import urlparse


def extract_paper_data(paper_url: str) -> Dict[str, Any]:
    """
    Extracts data from a research paper URL.
    
    Args:
        paper_url: URL of the research paper
        
    Returns:
        dict: Paper metadata including title, authors, abstract, etc.
    """
    # Try different extraction methods based on the URL
    
    # Method 1: Try arXiv
    if 'arxiv.org' in paper_url:
        return extract_from_arxiv(paper_url)
    
    # Method 2: Try DOI
    doi = extract_doi(paper_url)
    if doi:
        return extract_from_doi(doi)
    
    # Method 3: Try PubMed
    if 'pubmed' in paper_url:
        return extract_from_pubmed(paper_url)


def extract_from_arxiv(url: str) -> Dict[str, Any]:
    """Extract paper data from arXiv using their API"""
    # Extract arXiv ID from URL
    match = re.search(r'(\d{4}\.\d{4,5})', url)
    if not match:
        return {"error": "Could not extract arXiv ID"}
    
    arxiv_id = match.group(1)
    api_url = f"http://export.arxiv.org/api/query?id_list={arxiv_id}"
    
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        
        # Parse XML response (simple extraction)
        text = response.text
        
        # Extract fields using regex (simple approach)
        title = re.search(r'<title>(.*?)</title>', text, re.DOTALL)
        title = title.group(1).strip() if title else None
        
        summary = re.search(r'<summary>(.*?)</summary>', text, re.DOTALL)
        summary = summary.group(1).strip() if summary else None
        
        # Extract authors
        authors = re.findall(r'<name>(.*?)</name>', text)
        
        # Extract published date
        published = re.search(r'<published>(.*?)</published>', text)
        published = published.group(1)[:10] if published else None
        
        # Extract categories
        categories = re.findall(r'term="([^"]+)"', text)
        
        return {
            "title": title,
            "authors": authors,
            "abstract": summary,
            "published_date": published,
            "categories": categories[:3] if categories else [],
            "url": url,
            "source": "arXiv",
            "arxiv_id": arxiv_id
        }
        
    except Exception as e:
        return {"error": str(e)}


def extract_doi(url: str) -> Optional[str]:
    """Extract DOI from URL"""
    # DOI pattern: 10.xxxx/xxxxx
    match = re.search(r'10\.\d{4,}/[^\s/]+', url)
    return match.group(0) if match else None


def extract_from_doi(doi: str) -> Dict[str, Any]:
    """Extract paper data using DOI via CrossRef API"""
    api_url = f"https://api.crossref.org/works/{doi}"
    
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        
        data = response.json()
        message = data.get("message", {})
        
        # Extract authors
        authors = []
        for author in message.get("author", []):
            name = f"{author.get('given', '')} {author.get('family', '')}".strip()
            if name:
                authors.append(name)
        
        # Extract published date
        pub_date = message.get("published", {}).get("date-parts", [[]])[0]
        published_date = "-".join(map(str, pub_date)) if pub_date else None
        
        return {
            "title": message.get("title", [""])[0],
            "authors": authors,
            "abstract": message.get("abstract"),
            "published_date": published_date,
            "journal": message.get("container-title", [""])[0],
            "publisher": message.get("publisher"),
            "doi": doi,
            "url": message.get("URL"),
            "source": "CrossRef"
        }
        
    except Exception as e:
        return {"error": str(e)}


def extract_from_pubmed(url: str) -> Dict[str, Any]:
    """Extract paper data from PubMed"""
    # Extract PubMed ID
    match = re.search(r'/(\d{8})/?', url)
    if not match:
        return {"error": "Could not extract PubMed ID"}
    
    pmid = match.group(1)
    
    # Use PubMed E-utilities API
    api_url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id={pmid}&retmode=json"
    
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        
        data = response.json()
        result = data.get("result", {}).get(pmid, {})
        
        # Extract authors
        authors = []
        for author in result.get("authors", []):
            authors.append(author.get("name", ""))
        
        return {
            "title": result.get("title"),
            "authors": authors,
            "abstract": None,  # Need another API call for abstract
            "published_date": result.get("pubdate"),
            "journal": result.get("fulljournalname"),
            "pmid": pmid,
            "url": url,
            "source": "PubMed"
        }
        
    except Exception as e:
        return {"error": str(e)}



def extract_authors_from_text(text: str) -> List[str]:
    """Try to extract author names from text"""
    # Look for common author patterns
    authors = []
    
    # Pattern: "Authors: Name1, Name2"
    match = re.search(r'(?:Authors?|By)[:\s]+([^\.]+)', text, re.IGNORECASE)
    if match:
        author_text = match.group(1)
        authors = [a.strip() for a in author_text.split(',')]
    
    return authors[:10]  # Limit to 10 authors


def extract_abstract_from_text(text: str) -> Optional[str]:
    """Try to extract abstract from text"""
    # Look for abstract section
    match = re.search(r'(?:Abstract|ABSTRACT)[:\s]+(.*?)(?:\n\n|\n[A-Z])', text, re.DOTALL)
    if match:
        return match.group(1).strip()[:500]  # First 500 chars
    return None
