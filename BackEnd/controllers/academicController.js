const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

exports.analyzeTranscript = async (req, res) => {
  const filePath = req.file ? req.file.path : null;

  if (!filePath) {
    return res.status(400).json({
      status: "error",
      message: "File transkrip PDF wajib diunggah.",
    });
  }

  try {
    // 1. Bungkus kembali file PDF ke FormData untuk dikirim via internal Docker network
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: "application/pdf",
    });

    // 2. Tembak endpoint internal AI Python (ai-service port 8000)
    // Jalur endpoint disesuaikan dengan milik tim AI kamu: /api/academic/upload-transcript
    const aiResponse = await axios.post(
      "http://ai-service:8000/api/academic/upload-transcript",
      form,
      {
        headers: { ...form.getHeaders() },
      },
    );

    // 3. Ambil data hasil ekstraksi & analisis kurikulum dari kontainer AI
    const aiData = aiResponse.data?.data || aiResponse.data;

    if (!aiData) {
      return res.status(422).json({
        status: "error",
        message: "AI Service gagal melakukan parsing kurikulum transkrip.",
      });
    }

    // 4. Kembalikan data dengan struktur lengkap yang dinantikan oleh Frontend
    // Kita petakan agar propertinya cocok dengan state 'resultData' di AcademicMapperPage.jsx
    return res.json({
      status: "success",
      studentName: aiData.student_name || req.user?.name || "Mahasiswa DTI",
      nrp: aiData.nrp || req.user?.nrp || "5027231000",
      gpa: aiData.gpa || aiData.ipk || 0,
      skillData: aiData.skill_data || aiData.skills || [], // Array objek [{ subject: 'Data', score: 85 }]
      careerMatches: aiData.career_matches || aiData.careers || [], // Array objek [{ role: 'Backend', match: 90, color: '#3b82f6' }]
      extractedData: aiData.extracted_data || aiData.courses || [], // Array semua mata kuliah ter-extract
    });
  } catch (err) {
    console.error(
      "🔥 Academic Mapper Express Error:",
      err.response?.data || err.message,
    );
    return res.status(500).json({
      status: "error",
      message: "Gagal menganalisis transkrip melalui AI Server.",
      detail: err.response?.data?.detail || err.message,
    });
  } finally {
    // 🚨 CLEANUP: Hapus file temporary di folder 'uploads/' backend agar storage kontainer tidak bengkak
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
