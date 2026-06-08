import { useState } from "react";
import {
  FileText,
  Sparkles,
  RotateCcw,
  TrendingUp,
  Wrench,
  AlertCircle,
  Loader2,
} from "lucide-react";
import PdfDropzone from "../components/shared/PdfDropzone";
import { useAuthStore } from "../store/authStore"; // Mengambil token login mahasiswa

// Konfigurasi mengarah ke port 5000 Backend Express
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function CvReviewerPage() {
  const { token } = useAuthStore(); // Ambil Bearer Token
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [step, setStep] = useState("upload"); // upload, processing, result
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // State baru untuk menampung hasil analisis riil dari AI
  const [analysisResult, setAnalysisResult] = useState({
    score: 0,
    strengths: [],
    improvements: [],
    gaps: [],
  });

  // LOGIKA UTAMA: MENGIRIM CV DAN CONTEXT TARGET KE EXPRESS
  async function handleAnalyzeCv() {
    if (!file || !role) return;
    if (!token) {
      setErrorMsg("Sesi Anda habis, silakan login kembali.");
      return;
    }

    setStep("processing");
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("cv_file", file); // Key berkas disesuaikan dengan rute upload.single("cv_file")
    formData.append("role", role);
    formData.append("company", company);

    try {
      const response = await fetch(`${API_URL}/cv/review`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setAnalysisResult({
          score: result.score || 0,
          strengths: result.strengths || [],
          improvements: result.improvements || [],
          gaps: result.gaps || [],
        });
        setStep("result");
      } else {
        throw new Error(result.message || "Gagal menganalisis CV.");
      }
    } catch (error) {
      console.error("CV Analyze Error:", error);
      setErrorMsg(error.message);
      setStep("upload");
    } finally {
      setLoading(false);
    }
  }

  const scoreColor =
    analysisResult.score >= 80
      ? "#10b981"
      : analysisResult.score >= 60
        ? "#f59e0b"
        : "#ef4444";

  // Hitung lingkaran SVG progress score dinamis
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (analysisResult.score / 100) * circumference;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-scale-in">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white p-8 md:p-10 shadow-2xl border border-white/5">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold bg-white/10 backdrop-blur-md text-blue-200 border border-white/10 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              AI CV Review
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-indigo-100">
              AI CV Reviewer
            </h1>
            <p className="text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
              Upload CV dan dapatkan analisis mendalam sesuai role target kamu —
              dari kekuatan, area perbaikan, hingga skill gap yang perlu diisi.
            </p>
          </div>

          {step === "result" && (
            <button
              onClick={() => {
                setStep("upload");
                setFile(null);
                setRole("");
                setCompany("");
              }}
              className="flex items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-2xl text-sm font-bold border border-white/20 hover:scale-[1.02] active:scale-95 transition-all flex-shrink-0 shadow-xl"
            >
              <RotateCcw className="w-4 h-4" /> Upload Ulang
            </button>
          )}
        </div>
      </div>

      {/* Alert Error Component */}
      {errorMsg && (
        <div className="bg-red-950/40 backdrop-blur-md border border-red-500/20 p-4 rounded-xl flex items-start gap-3 max-w-md animate-scale-in">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs font-bold text-red-200">{errorMsg}</p>
        </div>
      )}

      {/* Upload Step */}
      {step === "upload" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/5 p-7 shadow-2xl space-y-5">
            <div>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">
                Upload CV (PDF, maks 5MB)
              </label>
              <PdfDropzone
                onFile={setFile}
                maxMb={5}
                label="Upload CV PDF"
                hint="Pastikan PDF berbasis teks, bukan hasil scan"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                Target Role <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Data Engineer Specialist"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 text-sm text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none transition-all font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                Target Perusahaan{" "}
                <span className="text-slate-500 font-semibold normal-case tracking-normal">
                  (opsional)
                </span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Huawei Indonesia"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 text-sm text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none transition-all font-semibold"
              />
            </div>

            <button
              disabled={!file || !role || loading}
              onClick={handleAnalyzeCv}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Analisis CV Sekarang
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-950/30 to-indigo-950/10 rounded-3xl border border-blue-500/10 flex flex-col items-center justify-center min-h-64 text-center p-8 shadow-2xl backdrop-blur-sm">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-blue-400" />
            </div>
            <p className="text-sm font-extrabold text-blue-300 mb-1">
              Siap Menganalisis
            </p>
            <p className="text-xs font-semibold text-slate-400 leading-relaxed max-w-xs">
              Hasil analisis kesesuaian CV dengan role target akan tampil di
              sini setelah upload.
            </p>
          </div>
        </div>
      )}

      {/* Processing Step */}
      {step === "processing" && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/5 mx-auto max-w-xl shadow-2xl">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
          <h3 className="text-lg font-bold text-slate-100">
            Menilai Kesesuaian CV...
          </h3>
          <p className="text-sm font-semibold text-slate-400 mt-2 text-center max-w-sm px-4">
            AI Agent sedang membaca kualifikasi CV Anda dan mencocokkannya
            dengan beban kerja standar industri. Harap tunggu sejenak.
          </p>
        </div>
      )}

      {/* Result Step */}
      {step === "result" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-scale-in">
          {/* Score Panel */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/5 p-7 shadow-2xl text-center">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-5">
                CV Score
              </p>
              <div className="flex items-center justify-center mb-4">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#0f172a"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={scoreColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${progress} ${circumference}`}
                    strokeDashoffset={circumference / 4}
                    style={{ transition: "stroke-dasharray 1s ease" }}
                  />
                  <text
                    x="50"
                    y="55"
                    textAnchor="middle"
                    className="font-black"
                    fontSize="20"
                    fontWeight="900"
                    fill={scoreColor}
                  >
                    {analysisResult.score}
                  </text>
                </svg>
              </div>
              <p className="text-sm font-extrabold text-slate-100">
                Skor Kesesuaian
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-1">
                untuk <span className="text-blue-400 font-bold">{role}</span>
              </p>
              {company && (
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                  @ {company}
                </p>
              )}
            </div>
          </div>

          {/* Analysis Panels */}
          <div className="lg:col-span-2 space-y-4">
            <ResultSection
              title="Sudah Bagus"
              icon={TrendingUp}
              items={analysisResult.strengths}
              color="emerald"
            />
            <ResultSection
              title="Perlu Diperkuat"
              icon={Wrench}
              items={analysisResult.improvements}
              color="amber"
            />
            <ResultSection
              title="Skill Gap Terdeteksi"
              icon={AlertCircle}
              items={analysisResult.gaps}
              color="rose"
            />
          </div>
        </div>
      )}
    </div>
  );
}

const colorConfig = {
  emerald: {
    bg: "from-emerald-950/20 to-emerald-950/5",
    border: "border-emerald-500/10",
    label: "text-emerald-400",
    dot: "bg-emerald-400",
    icon: "text-emerald-400 bg-emerald-500/10",
    item: "bg-slate-950/40 border-emerald-500/5",
  },
  amber: {
    bg: "from-amber-950/20 to-amber-950/5",
    border: "border-amber-500/10",
    label: "text-amber-400",
    dot: "bg-amber-400",
    icon: "text-amber-400 bg-amber-500/10",
    item: "bg-slate-950/40 border-amber-500/5",
  },
  rose: {
    bg: "from-rose-950/20 to-rose-950/5",
    border: "border-rose-500/10",
    label: "text-rose-400",
    dot: "bg-rose-400",
    icon: "text-rose-400 bg-rose-500/10",
    item: "bg-slate-950/40 border-rose-500/5",
  },
};

function ResultSection({ title, icon: Icon, items, color }) {
  const c = colorConfig[color];
  return (
    <div
      className={`bg-gradient-to-br ${c.bg} rounded-3xl border ${c.border} p-6 shadow-xl backdrop-blur-md`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-7 h-7 rounded-xl flex items-center justify-center ${c.icon}`}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <p
          className={`text-xs font-extrabold uppercase tracking-widest ${c.label}`}
        >
          {title}
        </p>
      </div>
      <div className="space-y-2.5">
        {items && items.length > 0 ? (
          items.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 py-2.5 px-3.5 rounded-xl border ${c.item}`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${c.dot}`}
              />
              <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                {item}
              </p>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500 italic font-medium px-2">
            Tidak ada poin analisis untuk bagian ini.
          </p>
        )}
      </div>
    </div>
  );
}