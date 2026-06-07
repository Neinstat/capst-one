const supabase = require("../config/supabase");

// 1. GET ALL OPPORTUNITIES
exports.getAllOpportunities = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .order("job_id", { ascending: false }); // Menampilkan yang terbaru di atas

    if (error) throw error;

    return res.json({
      status: "success",
      count: data.length,
      data: data,
    });
  } catch (err) {
    console.error("🔥 GET Opportunities Error:", err.message);
    return res.status(500).json({
      message: "Gagal mengambil data lowongan kerja.",
      detail: err.message,
    });
  }
};

// 2. POST NEW OPPORTUNITY (Alumni Only / Authenticated)
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

  // Validasi dasar di sisi server
  if (!title || !company) {
    return res
      .status(400)
      .json({ message: "Judul pekerjaan dan nama perusahaan wajib diisi." });
  }

  try {
    const { data, error } = await supabase
      .from("opportunities")
      .insert([
        {
          title,
          company,
          location,
          type,
          duration,
          min_sem: min_sem ? parseInt(min_sem) : null,
          tags: Array.isArray(tags) ? tags : [], // Pastikan dalam bentuk array teks
          verified: true, // Otomatis verified jika diposting alumni terautentikasi
          notes,
          apply_url,
        },
      ])
      .select();

    if (error) throw error;

    return res.status(201).json({
      status: "success",
      message: "Lowongan baru berhasil diposting.",
      data: data[0],
    });
  } catch (err) {
    console.error("🔥 POST Opportunity Error:", err.message);
    return res.status(500).json({
      message: "Gagal menyimpan postingan lowongan baru.",
      detail: err.message,
    });
  }
};
