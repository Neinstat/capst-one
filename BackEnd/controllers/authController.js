const supabase = require("../config/supabase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ========================================================
// 1. ENDPOINT REGISTRASI (DINAMIS & AMAN UNTUK DOSEN/ADMIN)
// ========================================================
exports.register = async (req, res) => {
  // Menampung full_name serta fallback dari properti "nama" jika dikirim via Postman
  const { nrp, password, full_name, nama, role } = req.body;
  const finalName = full_name || nama;

  // Validasi input utama
  if (!nrp || !password || !finalName) {
    return res.status(400).json({
      status: "error",
      message: "NRP/Username, Password, dan Nama Lengkap wajib diisi.",
    });
  }

  // Harmonisasi string role ke huruf kecil agar cocok dengan Enum database Supabase
  const targetRole = role ? role.toLowerCase().trim() : "mahasiswa";

  try {
    // 🚨 PERBAIKAN 1: Gunakan .maybeSingle() agar tidak crash jika data belum ada di database
    const { data: userExist, error: checkError } = await supabase
      .from("users")
      .select("nrp")
      .eq("nrp", nrp)
      .maybeSingle();

    if (checkError) throw checkError;

    if (userExist) {
      return res.status(400).json({
        status: "error",
        message:
          "NRP atau Username Admin tersebut sudah terdaftar di dalam sistem.",
      });
    }

    // Enkripsi password menggunakan bcrypt sebelum disimpan ke database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Menyimpan data akun ke tabel master 'users'
    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert([
        {
          nrp,
          password_hash: hashedPassword,
          role: targetRole, // Menyimpan role 'mahasiswa', 'alumni', atau 'admin'
        },
      ])
      .select()
      .single();

    // Penanganan Error jika Enum PostgreSQL menolak nilai string role
    if (userError) {
      if (userError.code === "22P02") {
        return res.status(422).json({
          status: "error",
          message: `Gagal menyimpan ke database. Nilai role '${role}' ditolak oleh Enum 'user_role'.`,
          hint: "Pastikan Anda sudah menjalankan 'ALTER TYPE user_role ADD VALUE 'alumni';' di SQL Editor Supabase.",
        });
      }
      throw userError;
    }

    // 🚨 PERBAIKAN 2: Proteksi Relasi Profil Dosen/Admin
    // Hanya buat baris data di 'student_profiles' jika user yang mendaftar BUKAN admin/dosen
    if (newUser.role !== "admin") {
      const { error: profileError } = await supabase
        .from("student_profiles")
        .insert([
          {
            user_id: newUser.user_id,
            full_name: finalName,
            nrp,
            current_semester: 6, // Default semester pengerjaan Capstone mahasiswa aktif
          },
        ]);

      if (profileError) throw profileError;
    }

    return res.status(201).json({
      status: "success",
      message: "Registrasi akun baru berhasil dilakukan.",
      user: {
        nrp: newUser.nrp,
        full_name: finalName,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("🔥 Detailed Register Error:", err.message);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan internal pada server saat registrasi.",
      detail: err.message,
    });
  }
};

// ========================================================
// 2. ENDPOINT LOGIN (SINKRONISASI PAYLOAD JWT & STORE)
// ========================================================
exports.login = async (req, res) => {
  const { nrp, password } = req.body;

  try {
    // Menarik data user master beserta join profil jika dia mahasiswa
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select(
        `
        user_id, nrp, password_hash, role,
        student_profiles (full_name, current_semester)
      `,
      )
      .eq("nrp", nrp)
      .maybeSingle();

    if (!user || fetchError) {
      return res.status(401).json({
        status: "error",
        message: "NRP atau password salah.",
      });
    }

    // Verifikasi kecocokan password plaintext dengan hash bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "NRP atau password salah.",
      });
    }

    // Memasukkan properti 'role' ke dalam token JWT agar bisa divalidasi oleh auth & admin Middleware
    const token = jwt.sign(
      { id: user.user_id, nrp: user.nrp, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // Antisipasi handling data array hasil join tables Supabase
    const profile = Array.isArray(user.student_profiles)
      ? user.student_profiles[0]
      : user.student_profiles;

    return res.json({
      status: "success",
      message: "Login sukses",
      token,
      user: {
        nrp: user.nrp,
        nama:
          user.role === "admin"
            ? "Bapak/Ibu Dosen (Admin)"
            : profile?.full_name || "Civitas DTI",
        semester: profile?.current_semester || null,
        role: user.role, // Disimpan ke local Zustand store untuk sinkronisasi sidebar UI Frontend
      },
    });
  } catch (err) {
    console.error("🔥 Detailed Login Error:", err.message);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan internal pada server saat melakukan login.",
      detail: err.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  const { passwordLama, passwordBaru } = req.body;

  // req.user.id didapatkan secara otomatis setelah lolos dari authMiddleware JWT
  const userId = req.user?.id;

  if (!passwordLama || !passwordBaru) {
    return res.status(400).json({
      status: "error",
      message: "Password lama dan password baru wajib diisi.",
    });
  }

  try {
    // 1. Ambil hash password asli milik user yang sedang login dari database
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("password_hash")
      .eq("user_id", userId)
      .maybeSingle();

    if (!user || fetchError) {
      return res
        .status(404)
        .json({ status: "error", message: "Data pengguna tidak ditemukan." });
    }

    // 2. Validasi: Apakah password lama yang diketik user sudah cocok dengan hash di DB?
    const isMatch = await bcrypt.compare(passwordLama, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Password lama yang Anda masukkan salah.",
      });
    }

    // 3. Enkripsi password baru menggunakan Bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(passwordBaru, salt);

    // 4. Update password_hash baru ke database Supabase
    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: hashedNewPassword })
      .eq("user_id", userId);

    if (updateError) throw updateError;

    return res.status(200).json({
      status: "success",
      message:
        "Password Anda berhasil diperbarui. Silakan gunakan password baru pada login berikutnya.",
    });
  } catch (err) {
    console.error("🔥 Change Password Error:", err.message);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server saat mengganti password.",
      detail: err.message,
    });
  }
};
