import os
import sys
from utils.cv_extractor import mask_cv_sensitive_data, extract_text_from_cv

def test_masking_logic():
    print("=== 1. TESTING SENSOR DATA PRIVASI (PII) ===")
    sample_cv_text = """
    NAMA: Budi Santoso
    EMAIL: budi.santoso@student.its.ac.id
    PHONE: +6281234567890 / 081298765432
    LINKEDIN: https://www.linkedin.com/in/budisantoso123/
    PORTFOLIO: github.com/budisantoso
    
    PENGALAMAN KERJA:
    - Backend Engineer Intern at Gojek (Jan 2023 - Present)
    - Mengembangkan API menggunakan Express.js
    """
    
    print("[ORIGINAL TEXT]")
    print(sample_cv_text)
    
    print("\n[MASKED TEXT (Yang akan dikirim ke AI)]")
    masked_text = mask_cv_sensitive_data(sample_cv_text)
    print(masked_text)
    
    # Validasi sederhana
    assert "budi.santoso@student.its.ac.id" not in masked_text, "Email gagal disensor!"
    assert "+6281234567890" not in masked_text, "Nomor HP gagal disensor!"
    
    print("✅ Uji coba Regex Sensor Privasi BERHASIL!\n")

def test_real_pdf(pdf_path):
    print(f"=== 2. TESTING EKSTRAKSI PDF: {pdf_path} ===")
    if not os.path.exists(pdf_path):
        print(f"❌ File {pdf_path} tidak ditemukan. Pastikan path file benar.")
        return
        
    with open(pdf_path, "rb") as f:
        file_bytes = f.read()
        
    extracted_text = extract_text_from_cv(file_bytes)
    print("[HASIL EKSTRAKSI & SENSOR]")
    print(extracted_text)
    print("\n✅ Ekstraksi PDF BERHASIL!")

if __name__ == "__main__":
    test_masking_logic()
    
    if len(sys.argv) > 1:
        test_real_pdf(sys.argv[1])