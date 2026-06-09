# Academic Mapper - SPARK DTI

Sistem kecerdasan buatan untuk membaca, membedah, dan memetakan potensi mahasiswa murni dari file PDF transkrip nilai. 

Fitur ini bertindak sebagai jembatan antara teks mentah akademik dengan visualisasi UI yang menarik, memberikan wawasan kompetensi (Skill Data) dan rekomendasi prospek karir.

---

## Alur Kerja Sistem (Flow)

Proses dari awal user *upload* transkrip hingga muncul analisis karir:

1. **PDF Parsing:** Sistem merender file PDF menjadi teks mentah (menggunakan `pdfplumber`).
2. **AI Inference & Data Extraction:** Teks mentah dikirim ke Gemini AI untuk dibongkar, mencari kode mata kuliah, nama, SKS, dan nilai mutu.
3. **Regex Safety Net:** Skrip Python ikut memindai teks mentah menggunakan Regex untuk memastikan tidak ada satupun mata kuliah yang terlewat oleh AI.
4. **Scoring & Career Matching:** AI menganalisis nilai mutu untuk menghitung *skill score* dan memetakannya ke prospek karir resmi.
5. **Memory Caching:** Hasil JSON utuh disimpan di memori RAM (*hash* MD5). Jika *file* yang sama diunggah ulang, data langsung ditarik dari *cache* tanpa memanggil API.

---

## Rahasia Dapur: Logika & Arsitektur

Bagian ini menjelaskan keputusan *engineering* di balik *Academic Mapper* agar sistem tidak mudah rusak (*break*) saat menghadapi data *real-world*.

### 1. Kenapa Pakai Hybrid (AI + Python Regex)?
**Masalah:** Format transkrip ITS menggunakan tata letak 2 kolom. Saat dikonversi ke teks, baris dari kiri dan kanan bergabung menjadi satu (contoh: `EE234101 Matkul A 2 A ET234404 Matkul B 3 B`). AI sering pusing dan "berkedip" melewatkan matkul di sebelah kanan.
**Solusi:** AI bertugas sebagai pemikir utama. Namun di belakang layar, ada Python Regex (pola: 2 Huruf + 6 Angka) yang bertindak sebagai "jaring pengaman". Jika Regex menemukan kode `ET234404` tapi AI tidak menangkapnya, Python akan memaksa mengambil matkul tersebut dan mencocokkannya dengan *Master Kurikulum*.

### 2. Bagaimana Sistem Menghitung *Skill Score*?
AI mengelompokkan matkul ke dalam 6 domain IT (Web Dev, Database, Cloud, AI/ML, Security, Networking).
- **Pembobotan Nilai:** A=100, AB=85, B=75, C=60, dst.
- **Logika Rata-rata:** Jika seorang mahasiswa mengambil 3 matkul terkait Web Dev (nilai A, B, A), AI tidak menjumlahkannya, melainkan menghitung *rata-rata*. 
> **Kenapa begini?** Agar visualisasi grafik (*chart*) di *Frontend* terlihat realistis dan valid, mencegah nilai grafik tembus angka 100 secara tidak masuk akal hanya karena banyak mengambil kelas serupa.

### 3. Batasan Mutlak Rekomendasi Karir (The 9 Roles Limit)
LLM pada dasarnya sangat liar dan suka berhalusinasi mengarang nama *role* pekerjaan yang sangat spesifik (contoh: *Senior Backend Web Framework Architect*).
> **Kenapa dibatasi?** Untuk menjaga kredibilitas dan kerapian UI. Kita memaksakan aturan (*Hard Limit*) agar sistem **HANYA** boleh memilih rekomendasi karir dari 9 daftar prospek karir resmi Departemen Teknologi Informasi ITS (misal: Software Engineer, Data Scientist, Smart City Specialist). Hasilnya lebih bersih, terstandar, dan terjamin aman untuk UI.

### 4. Zero-Temperature & Memory Caching (Optimalisasi)
Kita mematok parameter `temperature=0.0` pada API Gemini dan menyuntikkan model versi `Lite` (`gemini-3.1-flash-lite`).
- **Temperature 0.0:** Mengunci kreativitas AI agar berubah menjadi robot logis. Ini menjamin kalau dokumen yang sama dibaca dua kali, hasil ekstraksi datanya akan 100% sama presisi (tidak ada matkul yang tiba-tiba hilang).
- **Caching MD5:** Jika sidik jari (*hash*) PDF sama, sistem tidak akan menembak API Google. 
> **Kenapa begini?** Menghindari *Rate Limit Error (429)* dari Google. Mahasiswa bisa bolak-balik klik fitur ini di *browser* tanpa takut membuat *backend* meledak atau menghabiskan jatah kuota pengembang API. Sangat hemat dan efisien!