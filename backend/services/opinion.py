from dotenv import load_dotenv
import os
from google import genai
from youtube import transform_youtube_url
from article import extract_article_content
import json
from urls import identify_url_type
from affiliations.validate import load_and_validate

load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=gemini_api_key)

def build_prompt(data, url):
    return f"""        
            You are an entity and opinion extraction system.

            Your goal is to identify the people or organizations responsible for producing, hosting, or distributing the message, and extract the opinions expressed in the content.

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
            RULES
            ============================================================

            1. Output ONLY a valid JSON object.
            2. Do NOT output anything before or after the JSON.
            3. Do NOT invent entities or opinions not supported by the content.
            4. Do NOT use prior knowledge.
            5. For each entity:
            - "isPerson" must be true or false
            - "opinions" must be a list of plain-text strings
            - Each string must contain exactly ONE opinion expressed by that entity
            - Keep each opinion short, clear, and neutral

            ============================================================
            OUTPUT FORMAT
            ============================================================

            {{
            "url": "{url}",
            "entities": {{
                /* Each key must be the name of an entity responsible for producing or distributing the message.
                Example keys (do NOT include literally): "Fox News", "Tucker Carlson", "The Atlantic".
                Each value must follow this structure:

                "Entity Name": {{
                    "isPerson": true or false,
                    "opinions": [
                    "one opinion expressed by this entity",
                    "another opinion expressed by this entity"
                    ]
                }}
                */
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
    if (url_type == "youtube"):
        data = transform_youtube_url(url)
    elif (url_type == "article"):
        data = extract_article_content(url)
    else:
        raise ValueError("Unsupported URL type")

    prompt = build_prompt(data, url)

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt
    )

    return response.text

if __name__ == "__main__":
    url = "https://www.youtube.com/watch?v=v2lDJd54vOQ" 
    raw_output = extract_opinions(url) 
    data = load_and_validate(raw_output) 
    print(json.dumps(data, indent=2))
