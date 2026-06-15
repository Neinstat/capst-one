import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { User, Key, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";

export default function ProfilePage() {
  // Ambil data user aktif dan token JWT langsung dari Zustand Store
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  // State untuk form ganti password
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  // State untuk visibilitas password
  const [showPasswordLama, setShowPasswordLama] = useState(false);
  const [showPasswordBaru, setShowPasswordBaru] = useState(false);
  const [showKonfirmasiPassword, setShowKonfirmasiPassword] = useState(false);

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
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6 animate-scale-in text-spark-primary">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl spark-banner p-5 md:p-8 shadow-xl border flex-shrink-0">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-blue-900 border border-amber-500/35 uppercase tracking-widest shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              User Profile
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Profil Saya
            </h1>
            <p className="text-xs text-spark-secondary max-w-xl font-medium leading-relaxed">
              Kelola informasi akun Anda, detail akademik, dan perbarui password keamanan secara berkala.
            </p>
          </div>
        </div>
      </div>

      <div className="features-blue-container space-y-6">
        {/* 1. KARTU INFORMASI IDENTITAS USER */}
        <div className="bg-spark-card border rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-black text-xl shadow-md flex-shrink-0">
            {user?.nama?.charAt(0) || "U"}
          </div>
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl font-extrabold text-spark-primary truncate">
                {user?.nama || "Nama Pengguna"}
              </h2>
              <span className="w-fit mx-auto sm:mx-0 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 border border-blue-500/25">
                {user?.role || "mahasiswa"}
              </span>
            </div>
            <p className="text-xs font-mono text-spark-secondary mt-1">
              NRP / Username: {user?.nrp || "Tidak Ada"}
            </p>
            <p className="text-xs text-spark-muted mt-1 font-semibold">
              Status Akademik: {user?.role === "alumni" ? "Alumni" : user?.role === "admin" ? "Dosen, Admin" : "Mahasiswa Aktif"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 2. PANEL DETAIL AKUN */}
          <div className="bg-spark-card border rounded-3xl p-5 shadow-md space-y-4 h-fit">
            <h3 className="text-xs font-extrabold text-spark-muted uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" /> Detail Profil
            </h3>
            <div className="space-y-3 text-xs font-semibold">
              <div>
                <span className="block text-spark-muted font-medium mb-0.5">
                  Fakultas / Departemen
                </span>
                <span className="text-spark-primary leading-relaxed">
                  Teknologi Elektro dan Informatika Cerdas (FTEIC)
                </span>
              </div>
              <div>
                <span className="block text-spark-muted font-medium mb-0.5">Institusi</span>
                <span className="text-spark-primary">
                  Institut Teknologi Sepuluh Nopember
                </span>
              </div>
            </div>
          </div>

          {/* 3. FORM GANTI PASSWORD */}
          <div className="md:col-span-2 bg-spark-card border rounded-3xl p-5 shadow-md space-y-4">
            <h3 className="text-xs font-extrabold text-spark-muted uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-500" /> Pusat Keamanan Akun
            </h3>
            <p className="text-xs text-spark-secondary leading-relaxed font-semibold">
              Demi menjaga privasi data Capstone, disarankan untuk memperbarui
              password bawaan NRP Anda secara berkala.
            </p>

            {/* Toast / Alert Notification */}
            {message.text && (
              <div
                className={`flex items-start gap-2.5 p-3.5 rounded-xl text-xs font-semibold border ${
                  message.type === "success"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-600 border-rose-500/20"
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
                <label className="block text-[10px] font-extrabold text-spark-muted uppercase mb-1">
                  Password Saat Ini
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPasswordLama ? "text" : "password"}
                    placeholder="Masukkan password lama / NRP Anda"
                    className="w-full pl-4 pr-11 py-2.5 border border-spark-border rounded-xl text-xs font-semibold bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-spark-primary"
                    value={passwordLama}
                    onChange={(e) => setPasswordLama(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordLama(!showPasswordLama)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  >
                    {showPasswordLama ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-spark-muted uppercase mb-1">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showPasswordBaru ? "text" : "password"}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-4 pr-11 py-2.5 border border-spark-border rounded-xl text-xs font-semibold bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-spark-primary"
                      value={passwordBaru}
                      onChange={(e) => setPasswordBaru(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordBaru(!showPasswordBaru)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                    >
                      {showPasswordBaru ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-spark-muted uppercase mb-1">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showKonfirmasiPassword ? "text" : "password"}
                      placeholder="Ulangi password baru"
                      className="w-full pl-4 pr-11 py-2.5 border border-spark-border rounded-xl text-xs font-semibold bg-slate-50/30 focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-spark-primary"
                      value={konfirmasiPassword}
                      onChange={(e) => setKonfirmasiPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowKonfirmasiPassword(!showKonfirmasiPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                    >
                      {showKonfirmasiPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}
