# score.py
import asyncio
import json
from .opinion import extract_opinions, OpinionResult
from .context import extract_affiliations, AffiliationResult
from .conflicts import analyze_conflicts, ConflictFlag, ConflictResult

CONFLICT_WEIGHTS = {
    "financial": {"direct": 3.0, "indirect": 1.5, "past": 0.75},
    "political": {"direct": 2.0, "indirect": 1.0, "past": 0.50},
    "personal":  {"direct": 1.0, "indirect": 0.5, "past": 0.25},
}

MAX_CONFLICT_SCORE = 10 * 3.0  # 10 conflicts all at highest weight = 30


def compute_entity_score(conflicts: list[ConflictFlag]) -> tuple[int, str]:
    if not conflicts:
        return 0, "low"

    raw = 0.0
    for flag in conflicts:
        raw += CONFLICT_WEIGHTS[flag.affiliation_type].get(flag.severity, 0.0)

    score = min(round((raw / MAX_CONFLICT_SCORE) * 100), 100)

    if score < 35:
        risk_level = "low"
    elif score < 65:
        risk_level = "moderate"
    else:
        risk_level = "high"

    return score, risk_level


def compute_overall_score(entity_scores: dict[str, int]) -> tuple[int, str]:
    if not entity_scores:
        return 0, "low"

    score = round(sum(entity_scores.values()) / len(entity_scores))

    if score < 35:
        risk_level = "low"
    elif score < 65:
        risk_level = "moderate"
    else:
        risk_level = "high"

    return score, risk_level


async def fetch_affiliation(entity_name: str, role: str) -> tuple[str, AffiliationResult | None]:
    """Fetch affiliations for a single entity, returning (name, result) or (name, None) on failure."""
    try:
        result = await extract_affiliations(entity_name, role=role)
        return entity_name, result
    except Exception as e:
        print(f"Affiliation extraction failed for '{entity_name}': {e}")
        return entity_name, None


async def run_pipeline(url: str) -> dict:
    # Step 1: extract opinions
    print("Extracting opinions...")
    opinion_result: OpinionResult = extract_opinions(url)

    # Step 2: extract affiliations for all entities concurrently
    print("Extracting affiliations...")
    tasks = [
        fetch_affiliation(entity_name, opinion_result.entities[entity_name].role)
        for entity_name in opinion_result.entities
    ]
    results = await asyncio.gather(*tasks)

    entity_affiliations: dict[str, AffiliationResult] = {
        name: result
        for name, result in results
        if result is not None
    }

    # Step 3: analyze conflicts across all entities in one Gemini call
    print("Analyzing conflicts...")
    conflict_result: ConflictResult = await analyze_conflicts(opinion_result, entity_affiliations)

    # Step 4: group conflict flags by entity
    conflicts_by_entity: dict[str, list[ConflictFlag]] = {
        entity_name: [] for entity_name in opinion_result.entities
    }
    for flag in conflict_result.conflicts:
        if flag.entity in conflicts_by_entity:
            conflicts_by_entity[flag.entity].append(flag)

    # Step 5: compute per-entity scores
    entity_scores: dict[str, int] = {}
    entity_risk_levels: dict[str, str] = {}
    for entity_name, flags in conflicts_by_entity.items():
        score, risk_level = compute_entity_score(flags)
        entity_scores[entity_name] = score
        entity_risk_levels[entity_name] = risk_level

    # Step 6: compute overall score
    overall_score, overall_risk = compute_overall_score(entity_scores)

    # Step 7: build final combined structure
    combined_entities = {}
    for entity_name, entity_data in opinion_result.entities.items():
        combined_entities[entity_name] = {
            "isPerson": entity_data.isPerson,
            "role": entity_data.role,
            "opinions": entity_data.opinions,
            "score": entity_scores.get(entity_name, 0),
            "riskLevel": entity_risk_levels.get(entity_name, "low"),
            "conflicts": [
                {
                    "opinion": flag.opinion,
                    "affiliation": flag.affiliation,
                    "affiliationType": flag.affiliation_type,
                    "severity": flag.severity,
                    "explanation": flag.explanation,
                }
                for flag in conflicts_by_entity.get(entity_name, [])
            ],
        }

    return {
        "url": url,
        "title": opinion_result.title,
        "date": opinion_result.date,
        "category": opinion_result.category,
        "score": overall_score,
        "riskLevel": overall_risk,
        "entities": combined_entities,
    }


if __name__ == "__main__":
    async def main():
        url = "https://www.youtube.com/watch?v=AUfsW8wpfWM"
        result = await run_pipeline(url)
        print(json.dumps(result, indent=2))

    asyncio.run(main())