# Semester Planner - SPARK DTI

Sistem otomatisator penyusun Rencana Studi Mahasiswa (Semester Planner) berdasarkan data riwayat transkrip nilai. 

Fitur ini didesain khusus menyesuaikan **Tabel 12 Matrik Organisasi Kurikulum Departemen Teknologi Informasi ITS**, memastikan setiap rekomendasi jadwal 100% valid secara aturan akademik.

---

## Alur Kerja Sistem (Flow)

Proses dari awal user upload PDF sampai jadwal muncul di layar:

1. **Ekstraksi AI (Data Ingestion):** PDF Transkrip dibaca oleh Google Gemini Flash, lalu diubah menjadi format JSON berisi daftar mata kuliah yang sudah lulus beserta total SKS-nya.
2. **Rekonsiliasi Kurikulum:** Sistem membandingkan data lulusan tersebut dengan *Master Kurikulum DTI*. Sistem langsung memisahkan mana matkul yang "Sudah Diambil" dan mana "Sisa Matkul" yang belum diambil.
3. **Kalkulasi Matrik SKS:** Sistem menghitung progress target kelulusan (144 SKS) dengan membaginya ke dalam 3 keranjang:
   - **Wajib:** Target 103 SKS
   - **WUN (MKWK & Penciri ITS):** Target 26 SKS
   - **Pilihan:** Maksimal 15 SKS
4. **Distribusi Jadwal (Core Engine):** Sisa matkul dilempar ke dalam algoritma pengatur jadwal untuk dibagi ke 3 Skenario Plan (Plan A, Plan B, Plan C).

---

## Logika Algoritma (Smart Bucket Fill + Graduation Lock)

Ini adalah "otak" kenapa jadwal yang dihasilkan bisa masuk akal dan tidak acak-acakan. Algoritma ini berjalan dalam 4 tahapan utama:

### Fase 0: *Graduation Lock* (Isolasi TA & Pra-TA)
Sebelum jadwal lain dibagi, sistem mencari matkul **Tugas Akhir (TA)** dan **Pra-TA / Metodologi**. 
- **TA** langsung dipaku (di-lock) di semester paling ujung (tergantung Plan-nya, bisa Sem 7 atau 8).
- **Pra-TA** langsung dipaku tepat 1 semester sebelum TA.
> **Kenapa begini?** Karena TA adalah syarat mutlak kelulusan. Kalau tidak dikunci di awal, algoritma bisa saja menaruh TA di tengah-tengah atau Pra-TA berbarengan dengan TA, yang mana itu melanggar rantai prasyarat akademik (Pra-TA harus lulus dulu sebelum TA).

### Fase 1: Alokasi WUN (MKWK & Penciri ITS)
Matkul berawalan kode `UG` (seperti Agama, Pancasila, dll) ditarik dan diprioritaskan masuk ke keranjang **Semester 6** atau **Semester 7** saja.
> **Kenapa begini?** Menyesuaikan aturan baku dari matrik organisasi ITS di mana matkul Universitas (WUN) disarankan dihabiskan di semester atas agar semester bawah fokus ke matkul fundamental departemen.

### Fase 2: Alokasi Wajib Departemen
Sistem mengurutkan sisa matkul Wajib berdasarkan letak semester *default*-nya. Algoritma kemudian memasukkan matkul ini ke dalam "keranjang" semester secara berurutan. Kalau limit maksimal SKS di semester tersebut (misal max 24 SKS) sudah penuh, matkul sisanya akan dilempar ke keranjang semester depannya.

### Fase 3: Auto-Fill SKS Pilihan (Limit 15 SKS)
Sistem mengecek berapa SKS Pilihan yang sudah pernah diambil mahasiswa di masa lalu. Jika masih kurang dari target 15 SKS, sistem akan secara otomatis menarik Matkul Pilihan secara acak dari pool database dan menyisipkannya ke semester yang "keranjang" SKS-nya masih longgar.
> **Kenapa begini?** Supaya total akhirnya pas **144 SKS**. Sistem menggunakan *limit breaker* yang otomatis berhenti menarik matkul pilihan kalau kuota 15 SKS-nya sudah terpenuhi, sehingga mencegah jadwal terisi oleh SKS Pilihan yang berlebihan.

---

## Tiga Skenario Plan (Blueprints)

Sistem merender 3 jadwal berbeda secara bersamaan menggunakan *blueprint constraint* (batas kapasitas SKS per semester) berikut:

1. **Plan A (Lulus 3.5 Tahun / Sprint Mode)**
   - Semester 6: Maks 24 SKS
   - Semester 7: Maks 24 SKS (Termasuk TA ditaruh di sini)
   - Semester 8: 0 SKS (Dikunci secara paksa agar mesin memampatkan jadwal di Sem 6 & 7).
2. **Plan B (Balanced / 4 Tahun Optimal)**
   - Semester 6: Maks 20 SKS
   - Semester 7: Maks 20 SKS (Fokus Pra-TA)
   - Semester 8: Maks 24 SKS (Fokus eksekusi Tugas Akhir & sisa matkul akhir).
3. **Plan C (Experience / Magang)**
   - Semester 6: Maks 22 SKS (Ngebut matkul teori).
   - Semester 7: Maks 20 SKS (Disisakan longgar untuk konversi SKS Magang MBKM secara penuh).
   - Semester 8: Maks 24 SKS (Laporan magang dan Tugas Akhir).