FROM python:3.9-slim

WORKDIR /app

# Install dependensi sistem terbaru yang mendukung pemrosesan grafis/PDF
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Instalasi library Python langsung
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    python-multipart \
    pypdf2 \
    pdfplumber \
    axios \
    groq \
    python-dotenv

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]