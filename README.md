# **🔍Trace:_ Media Literacy Pipeline_**

Our project is a media‑literacy analysis tool that takes any URL — YouTube videos or online articles — and automatically breaks down who is speaking, what they’re saying, and what affiliations they have.

- **Entities**  
- **Opinions expressed by each entity**  
- **Affiliations** (via SERP → Gemini → strict JSON validation)

This system provides a structured, machine‑readable breakdown of *who is speaking*, *what they’re saying*, and *what affiliations they have*, forming the foundation for deeper media‑literacy analysis.

---

## **🚀 What the System Does**

Given a URL, the pipeline:

1. **Fetches and parses the content**  
   - YouTube transcripts  
   - Article text  
2. **Extracts entities and their opinions**  
3. **Runs SERP searches for each entity**  
4. **Builds a structured context for Gemini**  
5. **Extracts affiliations using a strict JSON schema**  
6. **Validates the output**  
7. **Returns a clean JSON object combining opinions + affiliations**

This is a fully automated, end‑to‑end extraction system.

---

## **📁 Project Structure**

```
backend/
  services/
    affiliations/
      context.py        # SERP → Gemini → affiliation extraction
      serp.py           # SERP API wrapper
      validate.py       # JSON schema validation
      __init__.py
    article.py          # Article text extraction
    opinion.py          # Entity + opinion extraction
    score.py            # Pipeline orchestrator (URL → final JSON)
    urls.py             # URL helpers
    youtube.py          # YouTube transcript extraction
```

---

## **🧠 Pipeline Flow**

### **1. Opinion Extraction (`opinion.py`)**

Takes a URL and returns:

```json
{
  "url": "...",
  "entities": {
    "Speaker Name": {
      "isPerson": true,
      "opinions": ["...", "..."]
    },
    "Platform Name": {
      "isPerson": false,
      "opinions": []
    }
  }
}
```

---

### **2. Affiliation Extraction (`affiliations/context.py`)**

For each entity:

- Performs a SERP search  
- Builds a structured context  
- Sends it to Gemini  
- Enforces a strict JSON schema  
- Validates the output  

Returns:

```json
{
  "personal_affiliations": [...],
  "political_affiliations": [...],
  "financial_affiliations": [...],
  "sources": {...}
}
```

---

### **3. Pipeline Orchestration (`score.py`)**

`score.py` ties everything together:

- Takes a URL  
- Extracts opinions  
- Extracts affiliations for each entity  
- Validates all JSON  
- Returns the final combined result  

Run it with:

```
cd backend
python services/score.py
```

Or import it:

```python
from services.score import run_pipeline
result = run_pipeline("https://www.youtube.com/watch?v=...")
```

---

## **🧪 Example Output**

```json
{
  "url": "...",
  "entities": {
    "Speaker": {
      "isPerson": true,
      "opinions": ["..."],
      "affiliations": {
        "personal_affiliations": [...],
        "political_affiliations": [...],
        "financial_affiliations": [...],
        "sources": {...}
      }
    },
    "Platform": {
      "isPerson": false,
      "opinions": [],
      "affiliations": {...}
    }
  }
}
```

---

## **⚙️ Setup**

### **1. Install dependencies**

```
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### **2. Create `.env`**

```
GEMINI_API_KEY=your_key_here
SERP_API_KEY=your_key_here
```

---
