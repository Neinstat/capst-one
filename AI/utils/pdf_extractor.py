import pdfplumber
import io
import re

# Pre-compile regex pattern di luar fungsi untuk efisiensi
NRP_PATTERN = re.compile(r'\b\d{10}\b')
NAMA_PATTERN = re.compile(r'(Nama / Name\s*:\s*)([^\n]+)')
TTL_PATTERN = re.compile(r'(Place, Date of Birth\s*)([^\n]+)')

def mask_sensitive_data(text: str) -> str:
    # 1. Sensor NRP
    text = NRP_PATTERN.sub('[NRP_DISEMBUNYIKAN]', text)
    
    # 2. Sensor Nama
    text = NAMA_PATTERN.sub(r'\1[NAMA_DISEMBUNYIKAN]', text)
    
    # 3. Sensor TTL
    text = TTL_PATTERN.sub(r'\1[TTL_DISEMBUNYIKAN]', text)
    
    return text

def extract_text_from_pdf(file_bytes: bytes) -> str:
    text_content = []
    
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text(layout=True) 
            if page_text:
                text_content.append(page_text)

    full_text = "\n".join(text_content)

    safe_text = mask_sensitive_data(full_text)
    
    return safe_text