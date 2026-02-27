import json
from bson import ObjectId
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

from config.db import db
import services.urls as dirr
import services.youtube as ytube
import services.article as page
import services.research as res
import services.affiliations.context as ents


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


urls = db['urls']

class URLRequest(BaseModel):
    url: str

@app.get("/result/{id}")
def get_result(id: str):
    # Validate ObjectId
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")

    doc = urls.find_one({"_id": ObjectId(id)})

    if not doc:
        raise HTTPException(status_code=404, detail="Result not found")

    # delete ObjectId 
    del doc["_id"]

    return doc

@app.post("/fetch")
def fetch_url(req: URLRequest):
    #check if url exists in db
    result = urls.find_one({"url": req.url})
    if result:
        return { "id" : str(result["_id"]) }
    
    #extract url data
    typee = dirr.identify_url_type(req.url)
    if typee == "youtube_video":
        result = ytube.transform_youtube_url(req.url)
    elif typee == "article":
        result = page.extract_article_content(req.url)
    elif typee == "research":
        result = res.extract_paper_data(req.url)
    else:
        return {"message": "Error: That wasn't an article or youtube video"}
    
    author = result["publisher"]
    
    context = ents.extract_affiliations(result["publisher"])
    if isinstance(context, str):
        context = json.loads(context)
        
    entities = []
    for aff in context["personal_affiliations"]:
        thing = {
                "name": aff["entity"],
                "type": "Personal Affiliation",
                "role": aff["relationship"],
                "affiliations": [aff["summary"]],
                "verified": True
            }
        entities.append(thing)
    
    financial = []
    for aff in context["financial_affiliations"]:
        thing = {
                "funder": aff["entity"],
                "recipient": author,
                "amount": "?",
                "purpose": aff["summary"],
                "type": aff["relationship"],
                "date": "?",
                "verified": True
            }
        financial.append(thing)

    now = datetime.now(timezone.utc)
    time = now.isoformat(timespec='milliseconds').replace('+00:00', 'Z')

    
    result = {
        "source": {
            "title": result["title"],
            "url": req.url,
            "type": typee,
            "authors": author,
            "publisher": result["publisher"],
            "publishedDate": result["published_date"],
            "summary": "A comprehensive study examining how major tech corporations have influenced AI safety legislation through lobbying efforts, campaign contributions, and advisory board placements."
        },
        "score": 72,
        "riskLevel": "moderate",
        "analyzedAt": time,
        "entities": entities,
        "funding": financial,
        "conflicts": [ 
                {
                    "title": x["relationship"],
                    "description": x["summary"],
                    "severity": "high",
                    "entities": [
                        x["entity"]
                    ],
                    "sources": [
                        context["sources"][str(y)] for y in x["citations"]
                    ]
                } for x in context["personal_affiliations"]
            ] + [ 
                {
                    "title": x["relationship"],
                    "description": x["summary"],
                    "severity": "high",
                    "entities": [
                        x["entity"]
                    ],
                    "sources": [
                        context["sources"][str(y)] for y in x["citations"]
                    ]
                } for x in context["political_affiliations"]
            ] + [ 
                {
                    "title": x["relationship"],
                    "description": x["summary"],
                    "severity": "high",
                    "entities": [
                        x["entity"]
                    ],
                    "sources": [
                        context["sources"][str(y)] for y in x["citations"]
                    ]
                } for x in context["financial_affiliations"]
            ],
        "assessment": {
        "summary": "This paper presents a moderate conflict of interest risk. The lead author's advisory role at OpenAI — a primary subject of the study — raises significant objectivity concerns. Additionally, two of the three co-authors receive funding from corporations whose lobbying practices the paper evaluates. While government funding (NSF) provides some independence, the corporate funding connections warrant reader awareness.",
        "keyFindings": [
            "Lead author has an advisory role at OpenAI, a primary subject of the research",
            "2 of 3 authors receive funding from companies analyzed in the paper",
            "One funding source (Meta) was not disclosed in the paper's conflict statement",
            "Government funding accounts for ~60 total research support"
        ],
        "transparencyNotes": "The paper discloses the NSF and Google Research grants but omits the Meta funding connection. OpenAI advisory role is mentioned in author bios but not in the formal conflict of interest declaration.",
        "recommendation": "Readers should consider the potential influence of corporate affiliations when evaluating the paper's conclusions about specific companies' lobbying practices."
    }
    }


    
    #cache to database for future searches
    result["url"] = req.url  # Add the url to the result
    urls.insert_one(result)

    urls.update_one(
        {"url": req.url},
        {"$set": result},
        upsert=True
    )

    return { "id" : str(result["_id"]) }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)