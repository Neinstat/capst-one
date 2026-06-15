const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

exports.generateSemesterPlan = async (req, res) => {
  const filePath = req.file ? req.file.path : null;

  if (!filePath) {
    return res
      .status(400)
      .json({ message: "File transkrip PDF wajib diunggah." });
  }

  try {
    // 1. Bungkus kembali file transkrip ke FormData untuk ditembak ke AI Python
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: "application/pdf",
    });

    // 2. Tembak API Ekstraksi PDF (AI)
    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://ai-service:8000";
    const parseRes = await axios.post(
      `${aiServiceUrl}/api/academic/upload-transcript`,
      form,
      {
        headers: { ...form.getHeaders() },
      },
    );

    const extractedCourses = parseRes.data?.data?.courses;
    if (!extractedCourses) {
      return res
        .status(422)
        .json({
          message: "AI gagal mengekstrak daftar mata kuliah dari transkrip.",
        });
    }

    // 3. Tembak API Semester Planner (Rule-Based) di Python membawa hasil ekstraksi
    const plannerRes = await axios.post(
      `${aiServiceUrl}/api/semester/generate`,
      {
        extracted_courses: extractedCourses,
      },
    );

    const plannerData = plannerRes.data?.data || plannerRes.data;

    // 4. LOGIKA VALIDASI: Cek prasyarat minimal 60 SKS dari metadata hasil AI
    const sksCompleted = plannerData?.metadata?.sks_completed || 0;
    if (sksCompleted < 60) {
      return res.status(400).json({
        message: `Maaf, Anda belum memenuhi prasyarat minimal 60 SKS untuk menggunakan fitur Semester Planner. SKS Anda saat ini baru: ${sksCompleted} SKS.`,
        sks_completed: sksCompleted,
      });
    }

    // 5. Jika lolos validasi, kembalikan data sukses ke Frontend
    return res.json({
      status: "success",
      data: plannerData,
    });
  } catch (err) {
    console.error(
      "🔥 Semester Planner Error:",
      err.response?.data || err.message,
    );
    return res.status(500).json({
      message: "Gagal memproses rekomendasi rencana semester.",
      detail: err.response?.data?.detail || err.message,
    });
  } finally {
    // Bersihkan file temporary sisa upload di lokal kontainer backend agar tidak penuh
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
