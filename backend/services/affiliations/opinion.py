#opinion.py
from dotenv import load_dotenv
import os
from google import genai
from pydantic import BaseModel
from ..youtube import transform_youtube_url
from ..article import extract_article_content
from ..urls import identify_url_type
from ..research import extract_paper_data

load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=gemini_api_key)

class Entity(BaseModel):
    isPerson: bool
    role: str          
    opinions: list[str]

class OpinionResult(BaseModel):
    url: str
    title: str         
    date: str            
    category: str     
    entities: dict[str, Entity]

def build_prompt(data, url):
    return f"""        
            You are an entity, opinion, and metadata extraction system.

            Your goal is to identify the people or organizations responsible for producing, hosting, or distributing the message, extract the opinions expressed in the content, and extract metadata about the content itself.

            ============================================================
            WHAT COUNTS AS AN ENTITY (IMPORTANT)
            ============================================================

            An entity is someone who is responsible for the message being delivered. 
            Entities include:

            1. The speaker, host, narrator, or person expressing the opinions.
            2. The owner of the channel or platform where the content originates.
            3. The publisher or media organization behind the content.
            4. The author(s) of an article.
            5. The organization the author works for.
            6. The organization that originally produced the content, even if reposted elsewhere.

            The model must decide whether the channel/platform is meaningful:
            - If the channel/platform is a major media outlet or known creator → include it.
            - If the channel/platform is a random uploader or repost account → do NOT include it.

            NOT entities:
            - People being talked about (e.g., Biden, Trump, Musk).
            - Groups being discussed (e.g., Democrats, Republicans).
            - Countries, companies, or institutions mentioned in the story.
            - Anyone not responsible for producing or distributing the message.

            ============================================================
            WHAT COUNTS AS AN OPINION
            ============================================================

            An opinion is any statement where the speaker or author:

            - expresses approval or praise
            - expresses criticism or disapproval
            - makes a judgment or value claim
            - expresses concern, fear, or worry
            - expresses support or opposition
            - makes a belief-based prediction
            - interprets motives, intentions, or character
            - uses evaluative or emotionally charged language

            NOT opinions:
            - factual statements
            - neutral descriptions
            - quotes without commentary
            - background information
            - statistics unless framed with judgment

            ============================================================
            METADATA RULES
            ============================================================

            - "title" must be the title of the content. If not explicitly stated, infer it from the content.
            - "date" must be the publication or upload date if available, in YYYY-MM-DD format. If unavailable, use an empty string.
            - "category" must be exactly one of: "News", "Opinion", "Academic/Research", "Entertainment", "Other"
              - "News" → reporting on current events with journalistic intent
              - "Opinion" → editorials, commentary, punditry, podcasts expressing views
              - "Academic/Research" → peer-reviewed papers, research publications, scientific reports
              - "Entertainment" → movies, shows, comedy, lifestyle content
              - "Other" → anything that does not fit the above

            ============================================================
            ENTITY RULES
            ============================================================

            1. Output ONLY a valid JSON object.
            2. Do NOT output anything before or after the JSON.
            3. Do NOT invent entities or opinions not supported by the content.
            4. Do NOT use prior knowledge.
            5. For each entity:
            - "isPerson" must be true or false
            - "role" must describe the entity's role in producing this specific content.
              Valid roles: "Author", "Co-Author", "Host", "Co-Host", "Interviewer", "Publisher", "Channel", "Narrator", "Organization"
            - "opinions" must be a list of plain-text strings
            - Each string must contain exactly ONE opinion expressed by that entity
            - Keep each opinion short, clear, and neutral
            6. Only assign opinions to entities who directly express them in the content.
               Do NOT assign opinions to platforms, publishers, or organizations unless they explicitly speak.

            ============================================================
            OUTPUT FORMAT
            ============================================================

            {{
            "url": "{url}",
            "title": "",
            "date": "",
            "category": "",
            "entities": {{
                "Entity Name": {{
                    "isPerson": true or false,
                    "role": "role of this entity in the content",
                    "opinions": [
                        "one opinion expressed by this entity",
                        "another opinion expressed by this entity"
                    ]
                }}
            }}
            }}

            ============================================================
            CONTENT TO ANALYZE
            ============================================================

            {data}
        """

def extract_opinions(url):
    url_type=identify_url_type(url)
    data = None                               
    if (url_type == "youtube_video"):
        data = transform_youtube_url(url)
    elif (url_type == "article"):
        data = extract_article_content(url)
    elif(url_type == "research"):
        data = extract_paper_data(url)
    else:
        raise ValueError("Unsupported URL type")

    prompt = build_prompt(data, url)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_json_schema": OpinionResult.model_json_schema(),
            "temperature": 0
            }
    )

    return OpinionResult.model_validate_json(response.text)

if __name__ == "__main__":
    url = "https://www.youtube.com/watch?v=AUfsW8wpfWM"
    raw_output = extract_opinions(url) 
    print(raw_output)
