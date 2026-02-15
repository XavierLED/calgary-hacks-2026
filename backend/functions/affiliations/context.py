#context.py
from validate import load_and_validate
from dotenv import load_dotenv
import os
from google import genai
from serp import build_serp_context, serp_search
import json

load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=gemini_api_key)

def build_prompt(entity_name, serp_context):
    return f"""
        You are an affiliation‑extraction system.

        You will be given a list of sources (with citation numbers), each containing:
        - title
        - URL
        - snippet or summary

        Your job is to extract affiliations for the entity below using ONLY the provided sources.
        You MUST NOT use prior knowledge.
        You MUST NOT perform your own search.
        You MUST NOT invent facts.

        ============================================================
        STRUCTURE RULES (CRITICAL — MUST FOLLOW EXACTLY)
        ============================================================

        1. You MUST output a SINGLE valid JSON object.
        2. You MUST NOT output anything before or after the JSON object.
        3. You MUST NOT repeat any object keys. Every key must appear exactly once.
        4. You MUST NOT duplicate any source entries. Each source ID must appear once.
        5. You MUST NOT merge multiple objects into one key.
        6. You MUST NOT invent new keys or repeat existing ones.
        7. You MUST NOT include comments, explanations, or markdown.
        8. You MUST NOT include trailing commas.
        9. You MUST NOT output text outside of quotes inside a JSON string.
        10. You MUST NOT output the same citation block twice.
        11. You MUST NOT hallucinate new citation numbers.

        ============================================================
        CITATION RULES
        ============================================================

        - Use the citation numbers EXACTLY as they appear in the provided sources.
        - Do NOT renumber citations.
        - Do NOT skip or reorder citation numbers.
        - Do NOT create new citation numbers.
        - Every citation used MUST correspond to an existing source key.
        - Every source key MUST be used at least once.
        - If a source URL is truncated (contains "..."), you MUST still include it exactly as given.

        ============================================================
        AFFILIATION CATEGORIES
        ============================================================

        Extract affiliations in THREE categories:

        1. personal_affiliations:
        - employment, education, memberships, roles, leadership positions
        - associations with people or organizations

        2. political_affiliations:
        - political party, ideological alignment, editorial stance
        - political influence, political classification, bias ratings

        3. financial_affiliations:
        - ownership, parent company, subsidiaries
        - donors, funding sources, advertisers, institutional shareholders

        ============================================================
        EXTRACTION RULES
        ============================================================

        - Identify ALL affiliations supported by the sources.
        - Rank them by strength of support:
        1. number of citations
        2. credibility of sources
        3. clarity and directness
        - Select AT MOST 10 affiliations per category.
        - If fewer than 10 exist, return only the supported ones.
        - Do NOT merge affiliations.
        - Do NOT paraphrase beyond what is necessary for clarity.
        - Every affiliation MUST include:
        {{
            "relationship": "",
            "entity": "",
            "summary": "",
            "citations": []
        }}

        ============================================================
        SORTING RULES
        ============================================================

        - Sort affiliations alphabetically by the "entity" field.
        - Sort citation IDs inside each affiliation in ascending order.
        - Sort the "sources" section by citation ID in ascending order.

        ============================================================
        OUTPUT FORMAT (MANDATORY)
        ============================================================

        Return ONLY a JSON object in the following structure:

        {{
        "personal_affiliations": [],
        "political_affiliations": [],
        "financial_affiliations": [],
        "sources": {{
            "1": {{ "title": "", "url": "", "summary": "" }}
        }}
        }}

        If you are unsure, choose the simpler JSON structure.
        If a field cannot be filled, use an empty list or an empty string.

        ============================================================
        ENTITY TO ANALYZE
        ============================================================

        Entity: "{entity_name}"

        ============================================================
        SOURCES (USE EXACTLY AS PROVIDED)
        ============================================================

        {serp_context}
        """

def extract_affiliations(entity):
    serp_results = serp_search(entity)
    serp_context = build_serp_context(serp_results)
    prompt = build_prompt(entity, serp_context)

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt
    )

    return response.text

if __name__ == "__main__":
    entity = "Fox News"
    raw_output = extract_affiliations(entity)
    data = json.dumps(load_and_validate(raw_output))

    print(data)