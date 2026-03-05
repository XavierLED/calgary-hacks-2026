# conflicts.py
from dotenv import load_dotenv
import os
from google import genai
from pydantic import BaseModel
from typing import Literal

from .context import AffiliationResult
from .opinion import OpinionResult

load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=gemini_api_key)


class ConflictFlag(BaseModel):
    entity: str
    opinion: str
    affiliation: str
    affiliation_type: Literal["personal", "political", "financial"]
    severity: Literal["direct", "indirect", "past"]
    explanation: str


class ConflictResult(BaseModel):
    conflicts: list[ConflictFlag]


def build_context(
    opinion_result: OpinionResult,
    entity_affiliations: dict[str, AffiliationResult]
) -> str:
    lines = []

    for entity_name, entity_data in opinion_result.entities.items():
        lines.append(f"ENTITY: {entity_name}")
        lines.append(f"Role: {entity_data.role}")
        lines.append(f"Is Person: {entity_data.isPerson}")

        if entity_data.opinions:
            lines.append("Opinions:")
            for opinion in entity_data.opinions:
                lines.append(f"  - {opinion}")
        else:
            lines.append("Opinions: none")

        affiliations = entity_affiliations.get(entity_name)
        if affiliations:
            if affiliations.personal_affiliations:
                lines.append("Personal Affiliations:")
                for aff in affiliations.personal_affiliations:
                    lines.append(f"  - [{aff.severity}] {aff.relationship} with {aff.entity}: {aff.summary}")

            if affiliations.political_affiliations:
                lines.append("Political Affiliations:")
                for aff in affiliations.political_affiliations:
                    lines.append(f"  - [{aff.severity}] {aff.relationship} with {aff.entity}: {aff.summary}")

            if affiliations.financial_affiliations:
                lines.append("Financial Affiliations:")
                for aff in affiliations.financial_affiliations:
                    lines.append(f"  - [{aff.severity}] {aff.relationship} with {aff.entity}: {aff.summary}")
        else:
            lines.append("Affiliations: none found")

        lines.append("")

    return "\n".join(lines)


def build_prompt(context: str) -> str:
    return f"""
        You are a conflict-of-interest detection system.

        You will be given a list of entities from a piece of media content.
        For each entity you will see:
        - Their role in the content
        - The opinions they expressed in the content
        - Their known affiliations (personal, political, financial) with severity levels

        Your job is to identify genuine conflicts of interest.

        ============================================================
        WHAT IS A CONFLICT OF INTEREST
        ============================================================

        A conflict of interest exists when an entity expresses an opinion that:
        - Directly promotes, defends, or protects a specific financial affiliate
        - Directly advocates for the interests of a specific political affiliate
        - Defends or justifies their own organization's actions or reputation in a self-serving way
        - Dismisses or downplays criticism that would harm a specific affiliate

        A conflict of interest does NOT exist when:
        - An entity simply has affiliations (everyone has affiliations)
        - An opinion is a general statement about technology, society, science, or the future
        - The person works in an industry and expresses a general view about that industry
        - An opinion is factual or neutral
        - The connection between the opinion and the affiliation is thematic or indirect
        - The opinion would likely be expressed by any neutral expert in the same field

        ============================================================
        THREE-PART TEST — ALL THREE MUST BE TRUE TO FLAG A CONFLICT
        ============================================================

        Before flagging any conflict, verify ALL of the following:

        1. SPECIFIC BENEFIT: Which specific affiliate directly benefits from this opinion?
           The benefit must be concrete and traceable — not just thematic.
           "They work in AI and talked about AI" is NOT a specific benefit.

        2. NEUTRAL ALTERNATIVE: Would a neutral observer with no affiliations
           likely express a meaningfully different opinion on this topic?
           If a reasonable neutral expert would say the same thing, do NOT flag it.

        3. DIRECT LINK: Is there a clear, direct line between what was said
           and the affiliate's specific interests?
           Vague or general alignment is NOT enough.

        If you cannot answer all three clearly and specifically, do NOT flag it.

        ============================================================
        RULES
        ============================================================

        1. Only flag conflicts that pass the three-part test above.
        2. Every conflict MUST reference a specific opinion and a specific affiliation.
        3. Use the entity name EXACTLY as it appears in the input.
        4. Use the opinion text EXACTLY as it appears in the input.
        5. Use the affiliation text EXACTLY as it appears in the input.
        6. "affiliation_type" must be exactly one of: "personal", "political", "financial"
        7. "severity" must match the severity of the affiliation involved: "direct", "indirect", or "past"
        8. "explanation" must be a single, formal, academic sentence explaining why this is a conflict.
        9. If no genuine conflicts exist for any entity, return an empty list.
        10. Do NOT invent conflicts. Do NOT use prior knowledge.
        11. Err on the side of NOT flagging — a smaller set of high-confidence conflicts
            is far more valuable than a large set of weak ones.

        ============================================================
        CONTENT TO ANALYZE
        ============================================================

        {context}
    """


async def analyze_conflicts(
    opinion_result: OpinionResult,
    entity_affiliations: dict[str, AffiliationResult]
) -> ConflictResult:
    context = build_context(opinion_result, entity_affiliations)
    prompt = build_prompt(context)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_json_schema": ConflictResult.model_json_schema(),
            "temperature": 0
        }
    )

    return ConflictResult.model_validate_json(response.text)