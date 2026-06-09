import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { User, Key, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ProfilePage() {
  // Ambil data user aktif dan token JWT langsung dari Zustand Store
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  // State untuk form ganti password
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  // State untuk UI feedback
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validasi internal Frontend sebelum menembak API
    if (passwordBaru !== konfirmasiPassword) {
      return setMessage({
        type: "error",
        text: "Konfirmasi password baru tidak cocok.",
      });
    }

    if (passwordBaru.length < 6) {
      return setMessage({
        type: "error",
        text: "Password baru minimal harus terdiri dari 6 karakter.",
      });
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Mengirim kredensial token JWT
        },
        body: JSON.stringify({ passwordLama, passwordBaru }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: result.message });
        // Kosongkan form jika berhasil
        setPasswordLama("");
        setPasswordBaru("");
        setKonfirmasiPassword("");
      } else {
        setMessage({
          type: "error",
          text: result.message || "Gagal memperbarui password.",
        });
      }
    } catch (error) {
      console.error("🔥 Error Frontend Change Password:", error);
      setMessage({
        type: "error",
        text: "Tidak dapat terhubung ke server backend.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* 1. KARTU INFORMASI IDENTITAS USER */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-inner flex-shrink-0">
          {user?.nama?.charAt(0) || "U"}
        </div>
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900 truncate">
              {user?.nama || "Nama Pengguna"}
            </h2>
            <span className="w-fit mx-auto sm:mx-0 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
              {user?.role || "mahasiswa"}
            </span>
          </div>
          <p className="text-sm font-mono text-gray-500 mt-0.5">
            NRP / Username: {user?.nrp || "Tidak Ada"}
          </p>
          {user?.semester && (
            <p className="text-xs text-gray-400 mt-1">
              Status Akademik: Mahasiswa Aktif (Semester {user.semester})
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 2. PANEL DETAIL AKUN */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4 h-fit">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" /> Detail Profil
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="block text-gray-400 font-medium">
                Fakultas / Departemen
              </span>
              <span className="font-semibold text-gray-800">
                Teknologi Elektro dan Informatika Cerdas (FTEIC)
              </span>
            </div>
            <div>
              <span className="block text-gray-400 font-medium">Institusi</span>
              <span className="font-semibold text-gray-800">
                Institut Teknologi Sepuluh Nopember
              </span>
            </div>
          </div>
        </div>

        {/* 3. FORM GANTI PASSWORD */}
        <div className="md:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-gray-400" /> Pusat Keamanan Akun
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Demi menjaga privasi data Capstone, disarankan untuk memperbarui
            password bawaan NRP Anda secara berkala.
          </p>

          {/* Toast / Alert Notification */}
          {message.text && (
            <div
              className={`flex items-start gap-2.5 p-3.5 rounded-xl text-xs font-semibold ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-red-50 text-red-700 border border-red-100"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">
                Password Saat Ini
              </label>
              <input
                required
                type="password"
                placeholder="Masukkan password lama / NRP Anda"
                className="w-full px-3 py-2 border rounded-xl text-xs font-semibold bg-gray-50/30 focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                value={passwordLama}
                onChange={(e) => setPasswordLama(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">
                  Password Baru
                </label>
                <input
                  required
                  type="password"
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3 py-2 border rounded-xl text-xs font-semibold bg-gray-50/30 focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  value={passwordBaru}
                  onChange={(e) => setPasswordBaru(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">
                  Konfirmasi Password Baru
                </label>
                <input
                  required
                  type="password"
                  placeholder="Ulangi password baru"
                  className="w-full px-3 py-2 border rounded-xl text-xs font-semibold bg-gray-50/30 focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  value={konfirmasiPassword}
                  onChange={(e) => setKonfirmasiPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Memperbarui...
                </>
              ) : (
                "Perbarui Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
