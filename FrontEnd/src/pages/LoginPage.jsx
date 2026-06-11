import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const [nrp, setNrp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuthStore();
  const navigate = useNavigate();

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
        navigate("/academic-mapper");
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
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans bg-slate-950"
      style={{
        backgroundImage: "url('/tower-2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay with slight blur */}
      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm pointer-events-none" />

      {/* Ambient Glow Lingkaran Efek Khas Tema Dashboard ITS & TI */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Greeting */}
        <div className="text-center mb-8">

          {/* PERBAIKAN UKURAN LOGO (Lebih Lebar dan Proporsional) */}
          <div className="mx-auto mb-3 w-56 h-auto flex items-center justify-center drop-shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <img
              src="/Logo Spark DTI.png"
              alt="Logo SPARK DTI"
              className="w-full h-auto object-contain"
            />
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">
            Masuk ke SPARK DTI
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1.5 uppercase tracking-widest">
            Gunakan NRP dan password akun DTI kamu
          </p>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="glass-panel rounded-3xl p-8 space-y-5 shadow-2xl relative border border-white/10 bg-slate-900/30 backdrop-blur-xl"
        >
          {errorMsg && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-xs text-red-400 font-bold text-center">
                {errorMsg}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-300 uppercase tracking-widest">
              NRP Mahasiswa
            </label>
            <input
              type="text"
              value={nrp}
              onChange={(e) => setNrp(e.target.value)}
              placeholder="e.g. 5027231000"
              className="w-full px-4 py-3 rounded-xl border border-white/5 bg-slate-950/40 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all font-semibold"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-white/5 bg-slate-950/40 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all font-semibold"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
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
              "Masuk ke Dashboard"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}