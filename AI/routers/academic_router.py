import os
from fastapi import APIRouter, UploadFile, File, HTTPException

from utils.pdf_extractor import extract_text_from_pdf
from services.transcript_logic import analyze_transcript_with_ai

router = APIRouter()

@router.post("/upload-transcript")
async def process_transcript(file: UploadFile = File(...)):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File harus berupa PDF.")
    
    try:
        file_bytes = await file.read()
        raw_text = extract_text_from_pdf(file_bytes)
        
        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="Tidak ada teks yang dapat diekstrak dari PDF.")

        llm_output = await analyze_transcript_with_ai(raw_text)
        
        return {
            "data": {
                "raw_text": raw_text,
                "courses": llm_output.get("courses", []),
                "skill_data": llm_output.get("skill_data", []),
                "career_matches": llm_output.get("career_matches", [])
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan pada AI Service: {str(e)}")