# services/transcript_logic.py
import json
import os
import re
import hashlib
from google import genai
from google.genai import types
from utils.prompts import SYSTEM_PROMPT_TRANSCRIPT
from utils.curriculum_data import MASTER_KURIKULUM
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

TRANSCRIPT_CACHE = {}

async def analyze_transcript_with_ai(raw_text: str) -> dict:
    # 1. Buat sidik jari (Hash) unik dari teks PDF
    text_hash = hashlib.md5(raw_text.encode('utf-8')).hexdigest()
    
    # 2. Jika PDF ini sudah pernah diproses, langsung kembalikan dari Cache!
    if text_hash in TRANSCRIPT_CACHE:
        print("DEBUG: Mengambil data dari Cache (Hemat Kuota API!)")
        return TRANSCRIPT_CACHE[text_hash]

    try:
        response = await client.aio.models.generate_content(
            model='gemini-3.1-flash-lite',
            contents=f"Ini teks mentah transkripnya:\n\n{raw_text}",
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT_TRANSCRIPT,
                response_mime_type="application/json",
                # SUHU = 0.0 ADALAH KRUSIAL! Mematikan imajinasi AI agar 100% konsisten.
                temperature=0.0 
            )
        )

        ai_result = response.text
        parsed_json = json.loads(ai_result)
        
        data_payload = parsed_json.get("data", parsed_json)
        
        raw_courses = data_payload.get("courses", [])
        raw_skills = data_payload.get("skill_data", [])
        raw_careers = data_payload.get("career_matches", [])
        
        unique_courses = {}
        for course in raw_courses:
            kode_mk = str(course.get("kode", "")).strip().upper()
            if kode_mk:
                unique_courses[kode_mk] = course
                
        # Pola Regex: 2 Huruf Kapital + 6 Angka (Standar ITS)
        found_codes = set(re.findall(r'\b[A-Z]{2}\d{6}\b', raw_text.upper()))
        
        for kode in found_codes:
            if kode not in unique_courses:
                # Jika AI kelewatan matkul ini, Python akan menyelamatkannya
                print(f"DEBUG: AI melewatkan {kode}. Python mengambil alih!")
                sks_fallback = 2 # Default aman
                nama_fallback = f"Matkul {kode} (Recovered)"
                
                # Cocokkan SKS dan Nama dengan Master Kurikulum DTI
                for mk in MASTER_KURIKULUM:
                    if mk["kode"].upper() == kode:
                        sks_fallback = int(mk.get("sks", 2))
                        nama_fallback = mk.get("nama", nama_fallback)
                        break
                        
                # Suntikkan paksa ke dalam hasil AI
                unique_courses[kode] = {
                    "kode": kode, 
                    "nama": nama_fallback, 
                    "sks": sks_fallback, 
                    "nilai": "B" # Asumsi passing grade untuk hitungan skill
                }
                
        cleaned_courses = list(unique_courses.values())
        
        final_json = {
            "courses": cleaned_courses,
            "skill_data": raw_skills,
            "career_matches": raw_careers
        }
        
        # 4. Simpan hasil sempurna ini ke dalam Cache
        TRANSCRIPT_CACHE[text_hash] = final_json
        
        return final_json
        
    except Exception as e:
        raise Exception(f"Gagal memproses dengan Gemini AI: {str(e)}")