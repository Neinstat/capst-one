# routers/planner_router.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.planner_logic import generate_blueprint_plans

# Berikan tag yang rapi untuk dokumentasi Swagger UI
router = APIRouter()

# Schema Pydantic untuk memvalidasi payload JSON yang dikirim oleh Frontend
class PlannerInputRequest(BaseModel):
    extracted_courses: list

@router.post("/generate")
async def api_generate_semester_plan(payload: PlannerInputRequest):
    try:
        # Validasi awal jika array kosong
        if not payload.extracted_courses:
            raise HTTPException(status_code=400, detail="Data mata kuliah historis kosong.")
            
        # Jalankan core engine diffing & distribusi
        result = generate_blueprint_plans(payload.extracted_courses)
        
        # Jika hasil komputasi mengembalikan error validasi (misal SKS < 60)
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message"))
            
        return result
        
    except HTTPException as http_err:
        # Teruskan HTTP Exception yang sengaja kita buat
        raise http_err
    except Exception as e:
        # Tangkap jika ada bugs internal code lainnya
        raise HTTPException(status_code=500, detail=f"Internal Server Error di Planner Engine: {str(e)}")