# app/services/resume_service.py

import fitz  # PyMuPDF
import os
import httpx
import logging
import json
import time

from app.models.resume import ResumeParsed
from app.db.database import supabase  
from app.db.database import create_tables

logging.basicConfig(level=logging.DEBUG)

# IMPORTANT: Move API key to .env in production
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = "llama-3.3-70b-versatile"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


# --------------------------------------------------------------------------------------
#  PARSE RESUME FUNCTION
# --------------------------------------------------------------------------------------
async def parse_resume(file):
    logging.info(f"Starting resume parsing using Groq model: {GROQ_MODEL}")

    if not GROQ_API_KEY:
        logging.critical("❌ GROQ_API_KEY environment variable is missing")
        return {"error": "GROQ API Key missing. Set GROQ_API_KEY in .env"}

    # Read PDF file
    try:
        file_bytes = await file.read()
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = "\n".join([page.get_text() for page in doc]).strip()
        doc.close()
        logging.debug(f"Extracted text length: {len(text)}")
    except Exception as e:
        logging.error(f"Failed to read PDF: {e}")
        return {"error": f"Failed to read PDF: {e}"}

    # LLM prompt
    system_prompt = """
You are an expert resume parser. Extract structured information into a single, valid, minified JSON object (no markdown). Include these fields:
- "name": string (null if missing)
- "email": string (null if missing)
- "phone": string (null if missing)
- "skills": list of strings (empty list if missing)
- "education": list of strings (empty list if missing)
- "experience": list of objects (empty list if missing)
- "projects": list of objects (empty list if missing)

Ensure consistency in field names and return all available data exactly as in the resume. If any section is missing, include the field with its default value (null or empty list).

"""

    user_message = f"""
Resume Text:
{text}

Extract into valid JSON:
{{
    "name": str,
    "email": str,
    "phone": str,
    "skills": list[str],
    "education": list[str],
    "experience": list[str],
    "projects": list[str]
}}
"""

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GROQ_API_KEY}"
    }

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.0,
        "max_tokens": 8000,
        "response_format": {"type": "json_object"}
    }

    # Call Groq API
    start_time = time.time()

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(GROQ_API_URL, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            end_time = time.time()
    except httpx.RequestError as e:
        logging.error(f"Groq API request error: {e}")
        return {"error": f"Groq API request error: {e}", "raw_text": text}
    except httpx.HTTPStatusError as e:
        logging.error(f"Groq API returned error: {e}")
        return {"error": f"Groq API error: {response.text}", "raw_text": text}

    logging.info(f"Groq API call took: {end_time - start_time:.2f} sec")

    # Parse JSON response
    try:
        content_text = data["choices"][0]["message"]["content"].strip()
        parsed_json = json.loads(content_text)

        total_tokens = data.get("usage", {}).get("total_tokens")
        if total_tokens:
            logging.info(f"Total tokens used: {total_tokens}")

    except Exception as e:
        logging.error(f"Failed to parse Groq output: {e}")
        parsed_json = {
            "error": f"Failed to parse json: {e}",
            "model_output_raw": content_text
        }

    parsed_json["raw_text"] = text
    return parsed_json


# --------------------------------------------------------------------------------------
#  SAVE PARSED RESUME TO SUPABASE
# --------------------------------------------------------------------------------------
# Remove file_bytes if not needed
async def save_resume_to_db(parsed: dict, user_id: str):

    try:
        data = {
      "user_id": user_id,
        "name": parsed.get("name"),
        "email": parsed.get("email"),
        "phone": parsed.get("phone"),
        "skills": parsed.get("skills") or [],
        "education": parsed.get("education") or [],
        "experience": parsed.get("experience") or [],
        "projects": parsed.get("projects") or [],
        "raw_text": parsed.get("raw_text")
        }

        result = supabase.table("resume_data").insert(data).execute()
        if result.data and len(result.data) > 0:
            saved_record = result.data[0]
            resume_id = saved_record.get('id') 
            # print(f"✅ Resume saved successfully. ID: {resume_id}")
            
            # Return the full record so you can use the ID in your API response
            return saved_record
            
        else:
            raise Exception("Insert successful but no data returned from Supabase.")

    except Exception as e:
        print(f"❌ Failed saving resume: {e}")
        return {"error": str(e)}
