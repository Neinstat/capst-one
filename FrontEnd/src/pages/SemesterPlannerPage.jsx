import { useState } from "react";
import {
  CheckCircle,
  CalendarCheck,
  RotateCcw,
  Loader2,
  BookOpen,
  AlertCircle,
  BarChart3,
  FileText,
} from "lucide-react";
import PdfDropzone from "../components/shared/PdfDropzone";
import { useAuthStore } from "../store/authStore";

// Konfigurasi mengarah ke port 5000 Backend Express
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function SemesterPlannerPage() {
  const { token } = useAuthStore();
  const [step, setStep] = useState("intro"); // intro, processing, result
  const [file, setFile] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("fast");
  const [plannerData, setPlannerData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Konfigurasi visual UI untuk masing-masing plan
  const planUIConfig = {
    fast: {
      badge: "Sprint Mode",
      badgeColor: "from-amber-400 to-orange-500",
      glowColor: "amber",
    },
    balanced: {
      badge: "Balanced",
      badgeColor: "from-blue-500 to-indigo-600",
      glowColor: "blue",
    },
    experience: {
      badge: "Deep Dive",
      badgeColor: "from-violet-500 to-purple-600",
      glowColor: "violet",
    },
  };

  const glowMap = {
    amber: "ring-amber-500/50 shadow-amber-500/10 bg-slate-900/80 border-amber-500/30",
    blue: "ring-blue-500/50 shadow-blue-500/10 bg-slate-900/80 border-blue-500/30",
    violet: "ring-violet-500/50 shadow-violet-500/10 bg-slate-900/80 border-violet-500/30",
  };

  async function handleGeneratePlan() {
    if (!file) return;
    if (!token) {
      setErrorMsg("Sesi Anda habis. Silakan login kembali.");
      return;
    }

    setStep("processing");
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("transcript", file);

    try {
      const response = await fetch(`${API_URL}/planner/generate-plan`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setPlannerData(result.data);
        setSelectedPlan("fast");
        setStep("result");
      } else {
        throw new Error(result.message || "Gagal memproses rencana semester.");
      }
    } catch (error) {
      setErrorMsg(error.message);
      setStep("intro");
      setFile(null);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-scale-in">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950 text-white p-8 md:p-10 shadow-2xl border border-white/5">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold bg-white/10 backdrop-blur-md text-amber-200 border border-white/10 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              Smart Planning
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-100 to-indigo-100">
              Semester Planner
            </h1>
            <p className="text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
              AI merencanakan rute studi optimalmu berdasarkan transkrip dan
              target kelulusan. Pilih plan yang paling sesuai dengan ambisimu.
            </p>
          </div>

          {step === "result" && (
            <button
              onClick={() => {
                setStep("intro");
                setFile(null);
                setPlannerData(null);
                setErrorMsg(null);
              }}
              className="flex items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-2xl text-sm font-bold border border-white/20 hover:scale-[1.02] active:scale-95 transition-all flex-shrink-0"
            >
              <RotateCcw className="w-4 h-4" /> Upload Ulang
            </button>
          )}
        </div>
      </div>

      {/* Alert Error Component */}
      {errorMsg && (
        <div className="bg-red-950/40 backdrop-blur-md border border-red-500/20 p-4 rounded-xl flex items-start gap-3 animate-scale-in">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-red-200">
              Proses Digagalkan
            </h3>
            <p className="text-xs font-semibold text-red-400 mt-1">
              {errorMsg}
            </p>
          </div>
        </div>
      )}

      {/* Intro / Upload Step */}
      {step === "intro" && (
        <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/5 p-7 max-w-lg shadow-2xl">
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1">
            Prasyarat & Ketentuan
          </h2>
          <p className="text-xs font-semibold text-slate-300/80 mb-5 leading-relaxed">
            Sistem akan mengecek apakah kamu sudah memenuhi prasyarat untuk
            mendapat rekomendasi plan.
          </p>

          <ul className="space-y-2.5 mb-6">
            {[
              "Sudah menyelesaikan minimal 60 SKS",
              "Transkrip PDF berbasis teks (bukan scan)",
            ].map((t) => (
              <li
                key={t}
                className="flex items-start gap-2.5 text-xs text-slate-300 font-semibold"
              >
                <span className="w-4 h-4 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </span>
                {t}
              </li>
            ))}
          </ul>

          {/* Area Dropzone Dinamis */}
          {!file ? (
            <PdfDropzone onFile={setFile} label="Upload Transkrip PDF" />
          ) : (
            /* Preview Status File Ter-upload (Sudah Di-dark-mode Total) */
            <div className="p-4 rounded-xl flex items-center justify-between transition-all duration-300 border bg-slate-950/60 border-white/5 backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20 flex-shrink-0">
                  <FileText className="w-5 h-5 text-rose-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate pr-2">
                    {file.name}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                    {file.size ? `${(file.size / 1024).toFixed(0)} KB` : "526 KB"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-wider">
                  ✓ Valid
                </span>
                <button
                  onClick={() => setFile(null)}
                  className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  title="Hapus file"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {file && (
            <button
              onClick={handleGeneratePlan}
              className="mt-5 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" /> Generate Semester Plan
            </button>
          )}
        </div>
      )}

      {/* Processing Step */}
      {step === "processing" && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl">
          <Loader2 className="w-12 h-12 text-amber-400 animate-spin mb-4" />
          <h3 className="text-lg font-bold text-slate-100">
            Menganalisis Transkrip...
          </h3>
          <p className="text-sm font-semibold text-slate-400 mt-2 text-center max-w-sm px-4">
            AI sedang mengekstrak data PDF dan mencocokkannya dengan Kurikulum
            DTI. Harap tunggu sebentar.
          </p>
        </div>
      )}

      {/* Result Step — Plan Cards & Schedule Table */}
      {step === "result" && plannerData && (
        <div className="space-y-8 animate-scale-in">
          {/* Progress SKS Bar Utama */}
          <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-5 flex items-center justify-between shadow-2xl">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Progress Kelulusan
              </p>
              <p className="text-xl font-black text-slate-100 mt-1">
                {plannerData.metadata.sks_completed}{" "}
                <span className="text-sm font-semibold text-slate-400">
                  / {plannerData.metadata.target_total_sks} SKS
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Total Sisa SKS
              </p>
              <p className="text-xl font-black text-amber-400 mt-1">
                {plannerData.metadata.sks_needed} SKS
              </p>
            </div>
          </div>

          {/* DASHBOARD STATISTIK MATRIK SKS */}
          {plannerData.metadata.distribusi_sks && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-slate-400" />
                <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  Matrik Kurikulum DTI
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card Wajib */}
                <div className="p-5 border rounded-2xl bg-gradient-to-br from-blue-950/40 to-slate-900/40 border-blue-500/15 flex flex-col justify-between hover:border-blue-500/30 transition-all backdrop-blur-sm shadow-xl">
                  <div>
                    <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2">
                      Kelompok MK Wajib
                    </h4>
                    <p className="text-2xl font-black text-slate-100">
                      103{" "}
                      <span className="text-xs font-bold text-slate-400 ml-1">
                        SKS Target
                      </span>
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-white/5 flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">
                      Telah Diambil:{" "}
                      <strong className="text-blue-400 ml-1 font-bold">
                        {plannerData.metadata.distribusi_sks.wajib.diambil}
                      </strong>
                    </span>
                    <span className="text-slate-300">
                      Sisa:{" "}
                      <strong className="text-rose-400 ml-1 font-bold">
                        {plannerData.metadata.distribusi_sks.wajib.sisa}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Card WUN */}
                <div className="p-5 border rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900/40 border-emerald-500/15 flex flex-col justify-between hover:border-emerald-500/30 transition-all backdrop-blur-sm shadow-xl">
                  <div>
                    <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                      Kelompok MK WUN
                    </h4>
                    <p className="text-2xl font-black text-slate-100">
                      26{" "}
                      <span className="text-xs font-bold text-slate-400 ml-1">
                        SKS Target
                      </span>
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-white/5 flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">
                      Telah Diambil:{" "}
                      <strong className="text-emerald-400 ml-1 font-bold">
                        {plannerData.metadata.distribusi_sks.wun.diambil}
                      </strong>
                    </span>
                    <span className="text-slate-300">
                      Sisa:{" "}
                      <strong className="text-rose-400 ml-1 font-bold">
                        {plannerData.metadata.distribusi_sks.wun.sisa}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Card Pilihan */}
                <div className="p-5 border rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900/40 border-purple-500/15 flex flex-col justify-between hover:border-purple-500/30 transition-all backdrop-blur-sm shadow-xl">
                  <div>
                    <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-2">
                      Kelompok MK Pilihan
                    </h4>
                    <p className="text-2xl font-black text-slate-100">
                      15{" "}
                      <span className="text-xs font-bold text-slate-400 ml-1">
                        SKS Target
                      </span>
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-white/5 flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">
                      Telah Diambil:{" "}
                      <strong className="text-purple-400 ml-1 font-bold">
                        {plannerData.metadata.distribusi_sks.pilihan.diambil}
                      </strong>
                    </span>
                    <span className="text-slate-300">
                      Sisa:{" "}
                      <strong className="text-rose-400 ml-1 font-bold">
                        {plannerData.metadata.distribusi_sks.pilihan.sisa}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-4">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
              Pilih Plan Semester Kamu
            </h2>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Dynamic Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Object.entries(plannerData.plans).map(([planKey, plan]) => {
              const isSelected = selectedPlan === planKey;
              const uiConfig = planUIConfig[planKey];
              return (
                <button
                  key={planKey}
                  onClick={() => setSelectedPlan(planKey)}
                  className={`group relative text-left bg-slate-900/40 border backdrop-blur-md rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 ${isSelected
                    ? `border-transparent ring-2 shadow-2xl ${glowMap[uiConfig.glowColor]}`
                    : "border-white/5 hover:border-white/10 hover:bg-slate-900/60 hover:shadow-xl"
                    }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                  )}

                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white bg-gradient-to-r ${uiConfig.badgeColor} mb-4 shadow-sm`}
                  >
                    {uiConfig.badge}
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-100 leading-snug mb-2">
                    {plan.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-400 mb-4 leading-relaxed">
                    {plan.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Schedule Detail Section */}
          <div className="bg-slate-900/30 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
            <div className="bg-slate-950/40 border-b border-white/5 px-6 py-4 flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-200">
                Rincian Jadwal:{" "}
                <span className="text-indigo-400 ml-1">
                  {plannerData.plans[selectedPlan].title}
                </span>
              </h3>
            </div>

            <div className="p-6 space-y-6">
              {plannerData.plans[selectedPlan].schedule.map((semester, idx) => (
                <div
                  key={idx}
                  className="border border-white/5 bg-slate-950/20 rounded-2xl overflow-hidden"
                >
                  <div className="bg-slate-950/40 px-4 py-3 border-b border-white/5 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-black text-slate-200 uppercase tracking-wide">
                        {semester.periode}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                        {semester.fokus}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 bg-slate-900 border border-white/5 rounded-lg text-slate-300 shadow-sm">
                      Maks {semester.max_sks} SKS
                    </span>
                  </div>

                  <ul className="divide-y divide-white/5">
                    {semester.courses.length > 0 ? (
                      semester.courses.map((course, cIdx) => (
                        <li
                          key={cIdx}
                          className="px-4 py-3 flex justify-between items-center hover:bg-white/5 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-500 mb-0.5 font-mono">
                              {course.kode}
                            </span>
                            <span className="text-xs font-bold text-slate-200">
                              {course.nama}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400 mt-0.5 italic">
                              {course.kategori || "Sesuai Kurikulum"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${course.tipe === "Wajib"
                                ? "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                                : course.tipe === "Agama" || course.kode.startsWith("UG")
                                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                  : "bg-purple-500/10 border border-purple-500/20 text-purple-400"
                                }`}
                            >
                              {course.tipe}
                            </span>
                            <span className="text-xs font-black text-slate-100 w-12 text-right">
                              {course.sks} SKS
                            </span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-6 text-center text-xs font-bold text-slate-500">
                        Tidak ada jadwal kelas teori
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.97); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}