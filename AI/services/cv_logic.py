import json
import os
from google import genai
from google.genai import types
from utils.prompts import SYSTEM_PROMPT_CV_REVIEWER
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

async def analyze_cv_with_ai(raw_text: str, role: str, company: str) -> dict:
    prompt_context = f"Target Role: {role}\nTarget Perusahaan: {company}\n\n=== TEKS CV KANDIDAT ===\n{raw_text}"
    
    try:
        response = await client.aio.models.generate_content(
            model='gemini-3.1-flash-lite',
            contents=prompt_context,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT_CV_REVIEWER,
                response_mime_type="application/json",
                temperature=0.2 # Sedikit ruang kreativitas untuk memberikan saran yang lebih luwes
            )
        )
        
        return json.loads(response.text)
    except Exception as e:
        raise Exception(f"Gagal memproses analisis CV dengan Gemini AI: {str(e)}")