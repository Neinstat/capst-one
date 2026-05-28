"""
MBKM Chatbot Logic
Handles SKS conversion calculation, activity detection, and AI response generation
"""

import os
import re
import requests
from typing import Dict, Any, Tuple


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
# HELPER: Parse Duration
# ─────────────────────────────────────────────────────────────────────────────

def parse_duration_to_weeks(message: str) -> int | None:
    """
    Parse message to extract duration and convert to weeks.
    
    Supports:
    - "6 bulan" -> 24 weeks
    - "3 minggu" -> 3 weeks
    - "12 minggu" -> 12 weeks
    - "16 minggu" -> 16 weeks
    
    Returns: weeks (int) or None if not found
    """
    message_lower = message.lower()
    
    # Check for months (bulan)
    month_pattern = r'(\d+)\s*(?:bulan|bln|bln\.)'
    month_match = re.search(month_pattern, message_lower)
    if month_match:
        months = int(month_match.group(1))
        weeks = months * 4  # 1 bulan = 4 minggu
        return weeks
    
    # Check for weeks (minggu)
    week_pattern = r'(\d+)\s*(?:minggu|mgg|mgg\.)'
    week_match = re.search(week_pattern, message_lower)
    if week_match:
        weeks = int(week_match.group(1))
        return weeks
    
    return None


# ─────────────────────────────────────────────────────────────────────────────
# HELPER: Detect Activity Type
# ─────────────────────────────────────────────────────────────────────────────

def detect_activity_type(message: str) -> str:
    """
    Detect activity type from message.
    
    Returns: activity_type (str) - one of: magang, lomba, studi_independen, 
             pertukaran_pelajar, unknown
    """
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
# HELPER: Calculate SKS
# ─────────────────────────────────────────────────────────────────────────────

def calculate_sks(duration_weeks: int, activity_type: str) -> int:
    """
    Calculate estimated SKS based on duration and activity type.
    
    Formula:
    - 1-4 weeks = 3 SKS
    - 5-8 weeks = 6 SKS
    - 9-12 weeks = 9 SKS
    - 13-16 weeks = 12 SKS
    - 17-20 weeks = 15 SKS
    - 21+ weeks = 20 SKS (capped at max)
    """
    
    # Get max SKS for activity type
    max_sks = SKS_RULES.get(activity_type, {}).get("max_sks", 20)
    
    # Calculate based on duration
    # Every 4 weeks = 6 SKS
    sks = (duration_weeks // 4) * 6
    
    # Ensure minimum 3 SKS for any duration > 0
    if sks == 0 and duration_weeks > 0:
        sks = 3
    
    # Cap at maximum
    sks = min(sks, max_sks)
    
    return sks


# ─────────────────────────────────────────────────────────────────────────────
# HELPER: Get Required Documents
# ─────────────────────────────────────────────────────────────────────────────

def get_required_documents(activity_type: str) -> list[str]:
    """
    Get list of required documents for activity type.
    """
    return SKS_RULES.get(activity_type, {}).get("documents", DEFAULT_DOCUMENTS)


# ─────────────────────────────────────────────────────────────────────────────
# GROQ API: Generate Natural Response
# ─────────────────────────────────────────────────────────────────────────────

async def generate_groq_response(
    message: str,
    activity_type: str,
    duration_weeks: int,
    estimated_sks: int,
    documents: list[str]
) -> str:
    """
    Use Groq API to generate natural language response.
    Falls back to manual response if API fails.
    
    Model: llama3-70b-8192
    """
    
    groq_api_key = os.getenv("GROQ_API_KEY")
    
    if not groq_api_key:
        # Fallback: No API key available
        return generate_fallback_response(activity_type, duration_weeks, estimated_sks, documents)
    
    try:
        # Prepare prompt for Groq
        prompt = f"""
Kamu adalah asisten AI untuk menghitung konversi SKS MBKM di universitas. 
User menginformasikan kegiatan MBKM mereka: "{message}"

Aktivitas: {activity_type}
Durasi: {duration_weeks} minggu
Estimasi SKS: {estimated_sks} SKS
Dokumen yang diperlukan: {', '.join(documents)}

Berikan respons natural yang:
1. Menyebutkan estimasi SKS
2. Menjelaskan perhitungan (durasi + aturan)
3. Menyebutkan dokumen yang diperlukan
4. Memberikan motivasi singkat

Respons dalam bahasa Indonesia, ringkas (2-3 kalimat).
        """.strip()
        
        # Call Groq API
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {groq_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama3-70b-8192",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.7,
                "max_tokens": 300,
            },
            timeout=10
        )
        
        response.raise_for_status()
        
        # Extract response
        result = response.json()
        if "choices" in result and len(result["choices"]) > 0:
            return result["choices"][0]["message"]["content"].strip()
        
    except Exception as e:
        print(f"Groq API error: {str(e)}")
        # Fallback to manual response
    
    return generate_fallback_response(activity_type, duration_weeks, estimated_sks, documents)


# ─────────────────────────────────────────────────────────────────────────────
# FALLBACK: Generate Manual Response
# ─────────────────────────────────────────────────────────────────────────────

def generate_fallback_response(
    activity_type: str,
    duration_weeks: int,
    estimated_sks: int,
    documents: list[str]
) -> str:
    """
    Generate manual response when Groq API is unavailable.
    """
    
    activity_label = {
        "magang": "magang",
        "lomba": "kompetisi",
        "studi_independen": "studi independen",
        "pertukaran_pelajar": "pertukaran pelajar",
        "unknown": "kegiatan MBKM"
    }.get(activity_type, "kegiatan")
    
    return f"Estimasi konversi SKS untuk {activity_label} selama {duration_weeks} minggu adalah **{estimated_sks} SKS**. Dokumen yang diperlukan: {', '.join(documents)}. Silakan hubungi akademik untuk proses pendaftaran lebih lanjut."


# ─────────────────────────────────────────────────────────────────────────────
# MAIN: Process Chat Message
# ─────────────────────────────────────────────────────────────────────────────

async def process_mbkm_chat(message: str) -> Dict[str, Any]:
    """
    Process user message and generate chatbot response.
    
    Returns:
    {
        "reply": "Natural language response from AI",
        "data": {
            "activity_type": "magang|lomba|studi_independen|pertukaran_pelajar|unknown",
            "duration_weeks": int,
            "estimated_sks": int,
            "documents": list[str]
        }
    }
    """
    
    # Step 1: Detect activity type
    activity_type = detect_activity_type(message)
    
    # Step 2: Parse duration
    duration_weeks = parse_duration_to_weeks(message)
    
    # If no duration found, default to 12 weeks (3 months)
    if duration_weeks is None:
        duration_weeks = 12
    
    # Step 3: Calculate SKS
    estimated_sks = calculate_sks(duration_weeks, activity_type)
    
    # Step 4: Get required documents
    documents = get_required_documents(activity_type)
    
    # Step 5: Generate AI response
    reply = await generate_groq_response(
        message,
        activity_type,
        duration_weeks,
        estimated_sks,
        documents
    )
    
    return {
        "reply": reply,
        "data": {
            "activity_type": activity_type,
            "duration_weeks": duration_weeks,
            "estimated_sks": estimated_sks,
            "documents": documents
        }
    }
