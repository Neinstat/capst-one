import { useState } from "react";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const [nrp, setNrp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuthStore();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nrp, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login({
          user: data.user,
          token: data.token,
        });
        // Hard navigation to /home to avoid React Router conflict
        window.location.href = "/home";
      } else {
        setErrorMsg(data.message || "Login Gagal.");
      }
    } catch (error) {
      setErrorMsg("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans bg-gradient-to-r from-[rgb(209,243,254)] to-[rgb(243,251,255)]"
    >
      {/* Decorative Blur Background Gradients */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-blue-200/40 rounded-full blur-[100px] pointer-events-none z-0 animate-pulse-glow" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-sky-200/30 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Greeting */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 w-56 h-auto flex items-center justify-center">
            <img
              src="/Logo Spark DTI.png"
              alt="Logo SPARK DTI"
              className="w-full h-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-black text-[#102452] tracking-tight">
            Masuk ke SPARK DTI
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1.5 uppercase tracking-widest">
            Gunakan NRP dan password akun DTI kamu
          </p>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 border border-slate-100 rounded-3xl p-8 space-y-5 shadow-2xl relative backdrop-blur-xl"
        >
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-xs text-red-600 font-bold text-center">
                {errorMsg}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest">
              NRP Mahasiswa
            </label>
            <input
              type="text"
              value={nrp}
              onChange={(e) => setNrp(e.target.value)}
              placeholder="e.g. 5027231000"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/10 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Memverifikasi...</span>
              </>
            ) : (
              <span style={{ color: '#ffffff' }}>Masuk ke Dashboard</span>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">atau</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Back to Landing — inside card so easy to reach */}
          <button
            type="button"
            onClick={() => { window.location.href = "/"; }}
            className="w-full py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-600 hover:text-blue-700 text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Kembali ke Beranda
          </button>
        </form>
      </div>
    </div>
  );
}