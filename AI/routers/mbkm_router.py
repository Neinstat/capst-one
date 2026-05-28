"""
MBKM Chatbot Router
FastAPI endpoint for MBKM SKS conversion chatbot
"""

from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from services.mbkm_logic import process_mbkm_chat


# ─────────────────────────────────────────────────────────────────────────────
# PYDANTIC MODELS
# ─────────────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    """Request body for chat endpoint"""
    message: str


class ChatResponse(BaseModel):
    """Response body for chat endpoint"""
    reply: str
    data: dict


# ─────────────────────────────────────────────────────────────────────────────
# ROUTER SETUP
# ─────────────────────────────────────────────────────────────────────────────

router = APIRouter()


# ─────────────────────────────────────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/chat")
async def mbkm_chat(request: ChatRequest = Body(...)) -> ChatResponse:
    """
    MBKM Chatbot Endpoint
    
    Receives user message about MBKM activity and returns:
    - Natural language response
    - Estimated SKS conversion
    - Activity type detection
    - Required documents
    
    Request:
    {
        "message": "magang 6 bulan di startup"
    }
    
    Response:
    {
        "reply": "Estimasi konversi SKS adalah 20 SKS...",
        "data": {
            "activity_type": "magang",
            "duration_weeks": 24,
            "estimated_sks": 20,
            "documents": ["LoA", "PKS", "Form AK01", "Form Matching"]
        }
    }
    """
    
    try:
        # Validate message
        if not request.message or not request.message.strip():
            raise HTTPException(
                status_code=400,
                detail="Pesan tidak boleh kosong"
            )
        
        # Process message
        result = await process_mbkm_chat(request.message)
        
        return ChatResponse(
            reply=result["reply"],
            data=result["data"]
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Terjadi kesalahan pada AI Service: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "mbkm_chatbot",
        "message": "MBKM Chatbot service is running"
    }
