FROM python:3.9-slim

WORKDIR /app

# Install dependensi sistem yang diperlukan
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Pastikan google-genai ada di dalam daftar instalasi langsung ini
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    python-multipart \
    pypdf2 \
    pdfplumber \
    axios \
    groq \
    python-dotenv \
    google-genai

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]