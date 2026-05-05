import json
import os
from groq import AsyncGroq
from utils.prompts import SYSTEM_PROMPT_TRANSCRIPT
from dotenv import load_dotenv

load_dotenv()

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

async def analyze_transcript_with_ai(raw_text: str) -> dict:
    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile", 
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT_TRANSCRIPT},
                {"role": "user", "content": f"Ini teks mentah transkripnya:\n\n{raw_text}"}
            ],
            temperature=0.1, 
            response_format={"type": "json_object"} 
        )

        ai_result = response.choices[0].message.content
        parsed_json = json.loads(ai_result)
        
        data_payload = parsed_json.get("data", parsed_json)
        
        raw_courses = data_payload.get("courses", [])
        raw_skills = data_payload.get("skill_data", [])
        raw_careers = data_payload.get("career_matches", [])
        
        unique_courses = {}
        for course in raw_courses:
            kode_mk = str(course.get("kode", "")).strip()

            if kode_mk and kode_mk not in unique_courses:
                unique_courses[kode_mk] = course
                
        cleaned_courses = list(unique_courses.values())
        
        final_json = {
            "courses": cleaned_courses,
            "skill_data": raw_skills,
            "career_matches": raw_careers
        }
        return final_json
        
    except Exception as e:
        raise Exception(f"Gagal memproses dengan AI Groq: {str(e)}")