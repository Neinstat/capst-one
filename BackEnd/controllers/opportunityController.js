const supabase = require("../config/supabase");
const { checkIsAlumniOrAdmin } = require("../utils/authHelper");

/**
 * 1. GET ALL OPPORTUNITIES
 */
exports.getAllOpportunities = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .order("job_id", { ascending: false });

    if (error) throw error;

    return res.json({
      status: "success",
      count: data.length,
      data: data,
    });
  } catch (err) {
    console.error("🔥 GET Opportunities Error:", err.message);
    return res.status(500).json({
      status: "error",
      message: "Gagal mengambil data lowongan kerja dari database.",
      detail: err.message,
    });
  }
};

/**
 * 2. POST NEW OPPORTUNITY
 */
exports.createOpportunity = async (req, res) => {
  const {
    title,
    company,
    location,
    type,
    duration,
    min_sem,
    tags,
    notes,
    apply_url,
  } = req.body;

  // 🚨 PROTEKSI BACKEND BARU: Ambil properti 'role' langsung dari token JWT user yang login
  const userRole = req.user?.role;

  // Validasi berdasarkan role database
  if (!checkIsAlumniOrAdmin(userRole)) {
    return res.status(403).json({
      status: "error",
      message:
        "Akses ditolak. Hanya akun dengan role 'alumni' atau 'admin' yang diperbolehkan memposting lowongan.",
    });
  }

  if (!title || !company) {
    return res.status(400).json({
      status: "error",
      message:
        "Judul pekerjaan (title) dan nama perusahaan (company) wajib diisi.",
    });
  }

  try {
    const { data, error } = await supabase
      .from("opportunities")
      .insert([
        {
          title,
          company,
          location: location || null,
          type: type || "Internship",
          duration: duration || null,
          min_sem: min_sem ? parseInt(min_sem, 10) : null,
          tags: Array.isArray(tags) ? tags : [],
          verified: true,
          notes: notes || null,
          apply_url: apply_url || null,
        },
      ])
      .select();

    if (error) throw error;

    return res.status(201).json({
      status: "success",
      message: "Lowongan pekerjaan baru berhasil disimpan ke database.",
      data: data[0],
    });
  } catch (err) {
    console.error("🔥 POST Opportunity Error:", err.message);
    return res.status(500).json({
      status: "error",
      message: "Gagal menyimpan postingan lowongan kerja baru.",
      detail: err.message,
    });
  }
};
