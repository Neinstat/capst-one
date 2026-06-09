import pdfplumber
import io
import re

# Pre-compile regex pattern untuk efisiensi
# 1. Pola standar untuk email
EMAIL_PATTERN = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b')
# 2. Pola untuk nomor telepon Indonesia/Global (08xx, 628xx, +628xx)
PHONE_PATTERN = re.compile(r'(\+62|62|0)8[0-9]{7,11}')
# 3. Pola untuk URL Profil LinkedIn (Mencegah bias AI dari nama)
LINKEDIN_PATTERN = re.compile(r'(https?://)?(www\.)?linkedin\.com/in/[A-Za-z0-9_-]+/?', re.IGNORECASE)

def mask_cv_sensitive_data(text: str) -> str:
    """Menyensor data pribadi dari teks CV sebelum dikirim ke AI."""
    text = EMAIL_PATTERN.sub('[EMAIL_DISEMBUNYIKAN]', text)
    text = PHONE_PATTERN.sub('[PHONE_DISEMBUNYIKAN]', text)
    text = LINKEDIN_PATTERN.sub('[LINKEDIN_DISEMBUNYIKAN]', text)
    return text

def extract_text_from_cv(file_bytes: bytes) -> str:
    """
    Mengekstrak teks dari file PDF CV dalam format bytes.
    Dioptimalkan untuk format ATS dan penghematan token LLM.
    """
    text_content = []
    
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            # layout=True memastikan teks yang terbagi di header (misal kiri Keterangan, kanan Tanggal) tidak menyatu
            page_text = page.extract_text(layout=True)
            if page_text:
                text_content.append(page_text)

    full_text = "\n".join(text_content)
    
    # OPTIMASI: Hapus baris kosong ganda yang dihasilkan layout=True. Ini sangat menghemat Token API Gemini!
    full_text = re.sub(r'\n\s*\n', '\n', full_text)

    # Amankan data privasi
    safe_text = mask_cv_sensitive_data(full_text)
    
    return safe_text