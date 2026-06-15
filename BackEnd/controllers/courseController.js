const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const supabase = require("../config/supabase");

exports.analyzeTranscript = async (req, res) => {
  const filePath = req.file ? req.file.path : null;
  const userId = req.user.id;

  if (!filePath) {
    return res.status(400).json({ message: "File transkrip tidak ditemukan" });
  }

  try {
    // 1. Ambil Identitas asli user dari Database (ITS Student Data)
    const { data: profile, error: profileError } = await supabase
      .from("student_profiles")
      .select("full_name, nrp")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile) {
      throw new Error("Profil mahasiswa tidak ditemukan di database.");
    }

    // 2. Siapkan data untuk dikirim ke FastAPI AI Service
    const form = new FormData();

    /**
     * PERBAIKAN KRUSIAL:
     * Menambahkan opsi { filename, contentType } agar FastAPI tidak
     * mendeteksi file sebagai 'application/octet-stream'.
     */
    form.append("file", fs.createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: "application/pdf",
    });

    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://ai-service:8000";
    const aiResponse = await axios.post(
      `${aiServiceUrl}/api/academic/upload-transcript`,
      form,
      {
        headers: {
          ...form.getHeaders(), // Mengirim boundary multipart/form-data yang benar
        },
      },
    );

    /**
     * 3. Ambil data dari FastAPI
     * FastAPI membungkus respons utama di dalam properti 'data'
     */
    const aiResult = aiResponse.data.data;

    // Ambil teks mentah hasil ekstraksi AI
    const rawText = aiResult.raw_text || "";

    // Ekstrak GPA (IPK) dari teks transkrip menggunakan Regex
    const gpaMatch = rawText.match(
      /(?:GPA|Indeks Prestasi|IPK)\s*:\s*(\d+\.\d+)/i,
    );
    const extractedGpa = gpaMatch ? parseFloat(gpaMatch[1]) : 0.0;

    /**
     * 4. Kirim respons final ke Frontend Spark DTI
     * Menggabungkan data identitas (DB) dan data akademik (AI)
     */
    return res.json({
      message: "Analisis Berhasil",
      studentName: profile.full_name,
      nrp: profile.nrp,
      gpa: extractedGpa,
      extractedData: aiResult.courses || [],
      skillData: aiResult.skill_data || [],
      careerMatches: aiResult.career_matches || [],
    });
  } catch (err) {
    // Logging detail error untuk mempermudah debugging di terminal
    console.error("🔥 Error Detail:", err.response?.data || err.message);

    return res.status(500).json({
      message: "Gagal memproses data transkrip",
      detail: err.response?.data?.detail || err.message,
    });
  } finally {
    // Selalu hapus file sementara di folder /uploads setelah proses selesai
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
