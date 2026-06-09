from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from utils.cv_extractor import extract_text_from_cv
from services.cv_logic import analyze_cv_with_ai

router = APIRouter()

@router.post("/review")
async def review_cv_endpoint(
    file: UploadFile = File(...),
    role: str = Form(...),
    company: str = Form(default="")
):
    # 1. Validasi ekstensi file
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File harus berupa PDF.")
    
    try:
        # 2. Ekstraksi teks & Masking PII
        file_bytes = await file.read()
        raw_text = extract_text_from_cv(file_bytes)
        
        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="Tidak ada teks yang dapat dibaca dari CV ini.")
        
        # 3. Kirim ke AI Logic
        analysis_result = await analyze_cv_with_ai(raw_text, role, company)
        
        return {"data": analysis_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan di server AI: {str(e)}")