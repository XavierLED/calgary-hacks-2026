import json
from jsonschema import validate, ValidationError

AFFILIATION_SCHEMA = {
    "type": "object",
    "properties": {
        "personal_affiliations": {"type": "array"},
        "political_affiliations": {"type": "array"},
        "financial_affiliations": {"type": "array"},
        "sources": {"type": "object"},
    },
    "required": [
        "personal_affiliations",
        "political_affiliations",
        "financial_affiliations",
        "sources",
    ]
}

def extract_json_block(text: str) -> str:
    """
    Extracts the JSON object by trimming everything before the first '{'
    and after the last '}'.
    """
    text = text.strip()
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("No JSON object found in model output.")
    return text[start:end + 1]

def load_and_validate(raw_text: str) -> dict:
    """
    Extract > parse > validate > return dict.
    """
    json_block = extract_json_block(raw_text)

    try:
        data = json.loads(json_block)
    except json.JSONDecodeError as e:
        raise ValueError(f"JSON parsing failed: {e}")

    try:
        validate(instance=data, schema=AFFILIATION_SCHEMA)
    except ValidationError as e:
        raise ValueError(f"Schema validation failed: {e}")

    return data