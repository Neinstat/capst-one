# 🚀 SPARK DTI 🚀
## Sistem Perencanaan Akademik & Rute Karir Departemen Teknologi Informasi

---

## 📌 Tentang

**SPARK DTI** adalah sistem perencanaan akademik dan rute karir untuk Departemen Teknologi Informasi (DTI) di Institut Teknologi Sepuluh Nopember Surabaya. Sistem ini dirancang untuk membantu mahasiswa merencanakan jalur akademik dan karir mereka dengan lebih efektif dan terstruktur.

---

## 🎯 Capstone Project A - Kelompok 1

**Departemen:** Teknologi Informasi  
**Universitas:** Institut Teknologi Sepuluh Nopember Surabaya

---

## 👥 Tim Pengembang

| No. | Nama | NRP | Role |
|:---:|------|-----|------|
| 1 | Fikri Aulia As Sa'adi | 5027231026 | Backend & Database |
| 2 | M. Andrean Rizq Prasetio | 5027231052 | Frontend & UI |
| 3 | Randist Prawandha Putera | 5027231059 | AI/ML Engineer |
| 4 | Hasan | 5027231073 | Project Manager & QA |
| 5 | Nabiel Nizar Anwari | 5027231087 | AI/ML Engineer |

---
---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Zustand
- Axios

### Backend
- Node.js
- Express.js
- JWT Authentication
- Supabase

### AI Service
- Python
- FastAPI
- Uvicorn

### DevOps & Deployment
- Docker
- Docker Compose

---

# 📂 Struktur Project

```bash
SPARKDTI/
├── FrontEnd/          # React Frontend
├── BackEnd/           # Express Backend
├── AI/                # AI Service FastAPI
├── docker-compose.yml
└── README.md
```

---

# ⚙️ Instalasi & Menjalankan Project

## 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd SPARKDTI
```

---

## 2️⃣ Setup Environment Variables

### Backend `.env`

```env
PORT=5000
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Frontend `.env`

```env
VITE_API_URL=http://backend:5000/api
```

---

## 3️⃣ Jalankan Menggunakan Docker

```bash
docker compose up --build
```

---

# 🌐 Service Ports

| Service | Port |
|---------|------|
| Frontend | 5173 |
| Backend | 5000 |
| AI Service | 8000 |

---

# 🔐 Fitur Utama

- Login & Authentication
- Academic Path Recommendation
- Career Route Planning
- AI-Based Academic Mapping
- Dashboard Mahasiswa
- Rekomendasi Jalur Akademik
- Integrasi AI Service
- REST API Backend

---

# 🧠 AI Features

SPARK DTI menggunakan layanan AI untuk:

- Analisis jalur akademik mahasiswa
- Rekomendasi roadmap karir
- Mapping mata kuliah terhadap bidang karir
- Personalisasi rekomendasi akademik

---

# 📸 Tampilan Sistem

Tambahkan screenshot sistem di sini.

```md
![Login Page](./docs/login.png)
![Dashboard](./docs/dashboard.png)
```

---

# 🚧 Status Project

Project ini masih dalam tahap pengembangan dan dapat terus mengalami perubahan fitur maupun peningkatan performa.

---

# 📄 License

Project ini dibuat untuk kebutuhan akademik Capstone Project Departemen Teknologi Informasi ITS.
