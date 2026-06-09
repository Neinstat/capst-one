"""
MBKM Chatbot Logic
Handles SKS conversion calculation, activity detection, and AI response generation
"""

import os
import re
from typing import Dict, Any, Tuple, Optional
from google import genai
from google.genai import types
from utils.prompts import SYSTEM_PROMPT_MBKM_ASSISTANT
from services.rag_agent_logic import retrieve_mbkm_knowledge
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini Client
client = None
if os.getenv("GEMINI_API_KEY"):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


# ─────────────────────────────────────────────────────────────────────────────
# SKS CONVERSION RULES
# ─────────────────────────────────────────────────────────────────────────────

SKS_RULES = {
    "magang": {
        "base_sks_per_4_weeks": 6,
        "max_sks": 20,
        "documents": ["LoA", "PKS", "Form AK01", "Form Matching"],
    },
    "lomba": {
        "base_sks_per_4_weeks": 6,
        "max_sks": 20,
        "documents": ["LoA", "Surat Penilaian", "Form AK01", "Form Matching"],
    },
    "studi_independen": {
        "base_sks_per_4_weeks": 6,
        "max_sks": 20,
        "documents": ["LoA", "Makalah/Laporan", "Form AK01", "Form Matching"],
    },
    "pertukaran_pelajar": {
        "base_sks_per_4_weeks": 6,
        "max_sks": 20,
        "documents": ["LoA", "Transkrip Nilai", "Form AK01", "Form Matching"],
    },
}

DEFAULT_DOCUMENTS = ["LoA", "PKS", "Form AK01", "Form Matching"]


# ─────────────────────────────────────────────────────────────────────────────
# HELPER: Parse Duration & Activity
# ─────────────────────────────────────────────────────────────────────────────

def parse_duration_to_weeks(message: str) -> Optional[int]:
    """Parse message to extract duration and convert to weeks."""
    message_lower = message.lower()
    
    month_pattern = r'(\d+)\s*(?:bulan|bln|bln\.)'
    month_match = re.search(month_pattern, message_lower)
    if month_match:
        return int(month_match.group(1)) * 4
    
    week_pattern = r'(\d+)\s*(?:minggu|mgg|mgg\.)'
    week_match = re.search(week_pattern, message_lower)
    if week_match:
        return int(week_match.group(1))
    
    return None


def detect_activity_type(message: str) -> str:
    """Detect activity type from message."""
    message_lower = message.lower()
    
    activities = {
        "magang": [r'\bmagang\b', r'\bintern\b', r'\bpraktik\b'],
        "lomba": [r'\blomba\b', r'\bkompetisi\b', r'\bjuara\b', r'\bpertandingan\b'],
        "studi_independen": [r'\bstudi independen\b', r'\bstudi\s+independen\b', r'\bpkm\b'],
        "pertukaran_pelajar": [r'\bpertukaran\s+pelajar\b', r'\bexchange\b', r'\bstudi\s+abroad\b'],
    }
    
    for activity_type, patterns in activities.items():
        for pattern in patterns:
            if re.search(pattern, message_lower):
                return activity_type
    
    return "unknown"


# ─────────────────────────────────────────────────────────────────────────────
# CORE LOGIC: Modular Functions
# ─────────────────────────────────────────────────────────────────────────────

def detect_intent(message: str) -> str:
    """
    Detect user intent from message.
    Intents: sks_calculation, document_requirement, mbkm_information, general_question
    """
    message_lower = message.lower()
    
    # Intent 1: SKS Calculation (contains duration + activity)
    duration_pattern = r'(\d+)\s*(?:bulan|bln|minggu|mgg)'
    has_duration = bool(re.search(duration_pattern, message_lower))
    activity = detect_activity_type(message)
    
    if has_duration and activity != "unknown":
        return "sks_calculation"
        
    # Intent 2: Document Requirement
    doc_keywords = ['dokumen', 'syarat', 'berkas', 'form', 'loa', 'persyaratan', 'butuh apa']
    if any(keyword in message_lower for keyword in doc_keywords):
        return "document_requirement"
        
    # Intent 3: MBKM Information
    info_keywords = ['apa itu', 'perbedaan', 'beda', 'bagaimana', 'konversi', 'sks', 'aturan']
    if any(keyword in message_lower for keyword in info_keywords):
        return "mbkm_information"
        
    # Default Intent
    return "general_question"


def calculate_sks(duration_weeks: int, activity_type: str) -> int:
    """Calculate estimated SKS based on duration and activity type."""
    max_sks = SKS_RULES.get(activity_type, {}).get("max_sks", 20)
    sks = (duration_weeks // 4) * 6
    
    if sks == 0 and duration_weeks > 0:
        sks = 3
        
    return min(sks, max_sks)


def get_documents(activity_type: str) -> list[str]:
    """Get list of required documents for activity type."""
    return SKS_RULES.get(activity_type, {}).get("documents", DEFAULT_DOCUMENTS)


def generate_mbkm_context(
    intent: str, 
    activity_type: str, 
    duration_weeks: Optional[int], 
    estimated_sks: Optional[int], 
    documents: list[str],
    message: str = ""
) -> str:
    """Generate system context based on intent and extracted data."""
    if intent == "sks_calculation":
        return (
            f"[Konteks Sistem]\n"
            f"User menanyakan estimasi SKS untuk aktivitas MBKM.\n"
            f"- Aktivitas: {activity_type}\n"
            f"- Durasi: {duration_weeks} minggu\n"
            f"- Estimasi SKS yang didapat: {estimated_sks} SKS\n"
            f"- Dokumen Wajib: {', '.join(documents)}\n"
        )
    elif intent == "document_requirement":
        if activity_type != "unknown":
            return f"[Konteks Sistem]\nUser menanyakan dokumen untuk {activity_type}.\nDokumen Wajib: {', '.join(documents)}\n"
        return f"[Konteks Sistem]\nUser menanyakan dokumen MBKM secara umum.\nDokumen Umum MBKM: {', '.join(DEFAULT_DOCUMENTS)}\n"
    elif intent == "mbkm_information":
        rag_info = retrieve_mbkm_knowledge(message)
        return f"[Konteks Sistem]\nUser menanyakan informasi MBKM. Referensi:\n{rag_info}\nJelaskan secara edukatif dan ringkas.\n"
    else:
        return "[Konteks Sistem]\nUser memberikan sapaan atau pertanyaan umum. Jawablah dengan ramah.\n"


async def generate_ai_response(message: str, context: str) -> str:
    """Use Gemini Flash Lite to generate natural language response."""
    if not client:
        return _generate_fallback_response(context)
        
    try:
        print("Memanggil Gemini...")
        prompt_content = f"{context}\n\nPertanyaan User: \"{message}\""
        
        response = await client.aio.models.generate_content(
            model='gemini-3.1-flash-lite',
            contents=prompt_content,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT_MBKM_ASSISTANT,
                temperature=0.7,
                max_output_tokens=500
            )
        )
        print("Gemini berhasil")
        return response.text.strip()
    except Exception as e:
        print("Gemini gagal:", e)
        return _generate_fallback_response(context)


def _generate_fallback_response(context: str) -> str:
    """Fallback if AI generation fails."""
    return f"Sistem AI saat ini sedang sibuk, namun berikut adalah informasi sistem:\n\n{context}"


# ─────────────────────────────────────────────────────────────────────────────
# MAIN: Process Chat Message
# ─────────────────────────────────────────────────────────────────────────────

async def process_mbkm_chat(message: str) -> Dict[str, Any]:
    """Process user message and generate chatbot response."""
    
    # 1. Intent Detection
    intent = detect_intent(message)
    print("Intent:", intent)
    
    # 2. Information Extraction
    activity_type = detect_activity_type(message)
    duration_weeks = None
    estimated_sks = None
    documents = []
    
    if intent in ["sks_calculation", "document_requirement"]:
        duration_weeks = parse_duration_to_weeks(message)
        documents = get_documents(activity_type)
        
        if intent == "sks_calculation":
            if duration_weeks is None:
                duration_weeks = 12 # Default 3 bulan jika durasi eksplisit tidak ada tapi intent terdeteksi
            estimated_sks = calculate_sks(duration_weeks, activity_type)
            
    # 3. Knowledge/Context Generation
    context = generate_mbkm_context(
        intent=intent,
        activity_type=activity_type,
        duration_weeks=duration_weeks,
        estimated_sks=estimated_sks,
        documents=documents,
        message=message
    )
    
    # 4. AI Response Generation
    reply = await generate_ai_response(message, context)
    
    # Return structured response
    return {
        "reply": reply,
        "data": {
            "intent": intent,
            "activity_type": activity_type,
            "duration_weeks": duration_weeks,
            "estimated_sks": estimated_sks,
            "documents": documents
        }
    }
