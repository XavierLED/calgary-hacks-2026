from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from config.db import db
import services.urls as dirr
import services.youtube as ytube
import services.article as page
import services.research as res


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

@app.post("/fetch")
def fetch_url(req: URLRequest):
    #check if url exists in db
    result = urls.find_one({"url": req.url})
    if result:
        del result["_id"]  # Remove ObjectId before returning
        return result
    
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
    
    #cache to database for future searches
    result["url"] = req.url  # Add the url to the result
    urls.insert_one(result)
    
    # Remove the _id that was added by insert_one
    if "_id" in result:
        del result["_id"]

    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)