# **🔍Trace:Media Literacy Pipeline**

A transparency tool for analyzing conflicts of interest in research, journalism, and public discourse.
Our app takes any URL — a YouTube video, news article, blog post, or research piece — and automatically reveals the hidden context behind the message. For every speaker, author, publisher, or organization mentioned, we extract:

- Who they are
- What they said
- Who they’re affiliated with
- Who funds them
- What organizations or movements they’re connected to

The goal is simple: give people the context they need to understand whether they can trust the information they’re consuming.

Instead of taking statements at face value, users get a structured breakdown of the entities behind the content and the influences that may shape their perspectives.

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
# **⚙️ Setup**

Follow these steps to run the full project locally.

---

## **🖥️ Backend Setup (Python + FastAPI)**

### **1. Navigate to the backend folder**

```
cd backend
```

### **2. Create and activate a virtual environment**

**Windows:**

```
python -m venv .venv
.venv\Scripts\activate
```

**Mac/Linux:**

```
python3 -m venv .venv
source .venv/bin/activate
```

### **3. Install dependencies**

```
pip install -r requirements.txt
```

### **4. Create a `.env` file**

Inside `backend/`, create a file named `.env`:

```
GEMINI_API_KEY=your_key_here
SERP_API_KEY=your_key_here
```

## **🌐 Frontend Setup (React)**

### **1. Navigate to the frontend folder**

```
cd frontend
```

### **2. Install dependencies**

```
npm install
```

### **3. Start the development server**

```
npm run dev
```

Frontend will be available at:

```
http://localhost:3000
```

---

## **🔗 Connecting Frontend → Backend**

The frontend sends requests to:

```
http://localhost:8000/analyze?url=YOUR_URL
```

Make sure the backend is running before using the UI.
