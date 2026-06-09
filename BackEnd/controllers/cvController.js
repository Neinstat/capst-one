const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

exports.reviewCV = async (req, res) => {
  const filePath = req.file ? req.file.path : null;
  const { role, company } = req.body;

  if (!filePath) {
    return res.status(400).json({
      status: "error",
      message: "File berkas CV PDF wajib diunggah.",
    });
  }

  if (!role) {
    return res.status(400).json({
      status: "error",
      message: "Target posisi pekerjaan (role) wajib diisi.",
    });
  }

  try {
    // 1. Bungkus kembali file CV ke FormData untuk dikirim ke internal AI Python
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: "application/pdf",
    });
    // Tambahkan field teks context ke dalam form-data
    form.append("role", role);
    form.append("company", company || "");

    // 2. Tembak endpoint internal AI Python menggunakan DNS Docker 'ai-service'
    // Jalur endpoint disesuaikan dengan kurikulum AI Agent timmu (misal: /api/cv/review)
    const aiResponse = await axios.post(
      "http://ai-service:8000/api/cv/review",
      form,
      {
        headers: { ...form.getHeaders() },
      },
    );

    const aiResult = aiResponse.data?.data || aiResponse.data;

    if (!aiResult) {
      return res.status(422).json({
        status: "error",
        message: "AI Service gagal menganalisis dokumen CV Anda.",
      });
    }

    // 3. Kembalikan data analisis riil dari AI LLM ke Frontend
    return res.json({
      status: "success",
      score: aiResult.score || 0,
      strengths: aiResult.strengths || [],
      improvements: aiResult.improvements || [],
      gaps: aiResult.gaps || [],
    });
  } catch (err) {
    console.error(
      "🔥 CV Reviewer Express Error:",
      err.response?.data || err.message,
    );
    return res.status(500).json({
      status: "error",
      message: "Gagal memproses penilaian CV melalui AI Server.",
      detail: err.response?.data?.detail || err.message,
    });
  } finally {
    // 🚨 CLEANUP: Hapus file temporary CV di lokal kontainer backend agar storage bersih
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
