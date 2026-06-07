const supabase = require("../config/supabase");
const bcrypt = require("bcrypt");

// ========================================================
// 1. GET ALL USERS (Solusi Ampuh Fix Error 400 Bad Request)
// ========================================================
exports.getAllUsers = async (req, res) => {
  try {
    // Langkah A: Ambil data master akun dari tabel 'users' secara independen
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("user_id, nrp, email, role, created_at");

    if (userError) {
      console.error("🔥 Supabase Master Users Error:", userError.message);
      return res.status(400).json({
        status: "error",
        message: userError.message,
      });
    }

    // Langkah B: Ambil seluruh data nama dari tabel 'student_profiles'
    const { data: profiles, error: profileError } = await supabase
      .from("student_profiles")
      .select("user_id, full_name");

    // Langkah C: Buat struktur mapping penampung ID di memori Node.js
    const profileMap = {};
    if (!profileError && profiles) {
      profiles.forEach((p) => {
        if (p.user_id) profileMap[p.user_id] = p.full_name;
      });
    } else if (profileError) {
      console.warn(
        "⚠️ Warning: Gagal memuat tabel student_profiles:",
        profileError.message,
      );
    }

    // Langkah D: Satukan data secara dinamis untuk dikirimkan ke Frontend Admin Panel
    const formattedUsers = users.map((u) => {
      const namaTerdaftar = profileMap[u.user_id];

      return {
        user_id: u.user_id,
        nrp: u.nrp,
        email: u.email,
        role: u.role,
        created_at: u.created_at,
        nama:
          u.role === "admin"
            ? "Bapak/Ibu Dosen (Admin)"
            : namaTerdaftar || "Civitas DTI Tanpa Profil",
      };
    });

    return res.status(200).json({
      status: "success",
      data: formattedUsers,
    });
  } catch (err) {
    console.error("🔥 Internal Admin Get Users Crash:", err.message);
    return res.status(500).json({
      status: "error",
      message:
        "Terjadi kesalahan internal pada server sewaktu memproses data pengguna.",
      detail: err.message,
    });
  }
};

// ========================================================
// 2. CREATE USER (Aman untuk Kredensial Non-Angka Dosen)
// ========================================================
exports.createUser = async (req, res) => {
  const { nrp, password, full_name, nama, role, email } = req.body;
  const finalName = full_name || nama;

  if (!nrp || !password || !finalName) {
    return res.status(400).json({
      status: "error",
      message: "NRP/Username, Password, dan Nama Lengkap wajib diisi.",
    });
  }

  const targetRole = role ? role.toLowerCase().trim() : "mahasiswa";

  try {
    // Validasi pencegahan duplikasi data akun
    const { data: userExist } = await supabase
      .from("users")
      .select("nrp")
      .eq("nrp", nrp)
      .maybeSingle();

    if (userExist) {
      return res.status(400).json({
        status: "error",
        message: "NRP atau Username tersebut sudah terdaftar di sistem.",
      });
    }

    // Amankan password bawaan menggunakan enkripsi salt bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Memasukkan data murni ke tabel kredensial 'users'
    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert([
        {
          nrp,
          password_hash: hashedPassword,
          role: targetRole,
          email: email || null,
        },
      ])
      .select()
      .single();

    if (userError) throw userError;

    // Isikan detail identitas ke 'student_profiles' khusus jika tipenya BUKAN admin/dosen
    if (newUser.role !== "admin") {
      const { error: profileError } = await supabase
        .from("student_profiles")
        .insert([
          {
            user_id: newUser.user_id,
            full_name: finalName,
            nrp,
            current_semester: 6, // Default acuan pengerjaan Capstone
          },
        ]);

      if (profileError) throw profileError;
    }

    return res.status(201).json({
      status: "success",
      message: "Berhasil membuat user baru lewat Admin Panel.",
      data: {
        user_id: newUser.user_id,
        nrp: newUser.nrp,
        nama: finalName,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("🔥 Admin Create User Error:", err.message);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan internal saat membuat user baru.",
      detail: err.message,
    });
  }
};

// ========================================================
// 3. UPDATE USER (Mengatasi Crash Argument Handler Baris 13)
// ========================================================
exports.updateUser = async (req, res) => {
  const { nrp } = req.params;
  const { full_name, nama, role, email, password } = req.body;
  const finalName = full_name || nama;

  try {
    // Cari data user target di tabel utama
    const { data: targetUser, error: findError } = await supabase
      .from("users")
      .select("user_id, role")
      .eq("nrp", nrp)
      .maybeSingle();

    if (findError || !targetUser) {
      return res
        .status(404)
        .json({ status: "error", message: "User tidak ditemukan." });
    }

    // Susun payload modifikasi data tabel master 'users'
    const userUpdateData = {};
    if (role) userUpdateData.role = role.toLowerCase().trim();
    if (email) userUpdateData.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      userUpdateData.password_hash = await bcrypt.hash(password, salt);
    }

    if (Object.keys(userUpdateData).length > 0) {
      const { error: userError } = await supabase
        .from("users")
        .update(userUpdateData)
        .eq("nrp", nrp);

      if (userError) throw userError;
    }

    // Sinkronisasi pembaruan nama di tabel detail 'student_profiles'
    if (finalName && role !== "admin" && targetUser.role !== "admin") {
      const { error: profileError } = await supabase
        .from("student_profiles")
        .update({ full_name: finalName })
        .eq("user_id", targetUser.user_id);

      if (profileError) throw profileError;
    }

    return res.status(200).json({
      status: "success",
      message: `Data user dengan NRP ${nrp} berhasil diperbarui secara berkala.`,
    });
  } catch (err) {
    console.error("🔥 Admin Update User Error:", err.message);
    return res.status(500).json({
      status: "error",
      message: "Gagal memperbarui data pengguna ke database.",
    });
  }
};

// ========================================================
// 4. DELETE USER (Mengatasi Crash Argument Handler Baris 14)
// ========================================================
exports.deleteUser = async (req, res) => {
  const { nrp } = req.params;

  try {
    // Tarik data user_id objek target untuk membersihkan relasi tabel detail
    const { data: targetUser } = await supabase
      .from("users")
      .select("user_id, role")
      .eq("nrp", nrp)
      .maybeSingle();

    if (!targetUser) {
      return res
        .status(404)
        .json({ status: "error", message: "User tidak ditemukan." });
    }

    // Bersihkan data record di tabel anak 'student_profiles' terlebih dahulu (mencegah foreign key lock)
    if (targetUser.role !== "admin") {
      await supabase
        .from("student_profiles")
        .delete()
        .eq("user_id", targetUser.user_id);
    }

    // Bersihkan data akun utama di tabel master 'users'
    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("nrp", nrp);

    if (deleteError) throw deleteError;

    return res.status(200).json({
      status: "success",
      message: `User dengan NRP ${nrp} berhasil dihapus permanen dari sistem.`,
    });
  } catch (err) {
    console.error("🔥 Admin Delete User Error:", err.message);
    return res.status(500).json({
      status: "error",
      message: "Gagal mengeksekusi penghapusan pengguna dari server.",
    });
  }
};
