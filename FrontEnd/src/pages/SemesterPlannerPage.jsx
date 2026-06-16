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
      badgeColor: "from-amber-500 to-orange-500",
      glowColor: "amber",
      suitability: "Mahasiswa akademisi berorientasi studi lanjut (S2/Fast Track) atau yang ingin segera masuk ke dunia kerja secara penuh tanpa jeda magang formal.",
      targetProfile: "Cocok untuk mahasiswa dengan motivasi belajar tinggi, siap memikul SKS padat (24 SKS) di Semester 6 & 7, dan mengincar kelulusan cepat 3.5 tahun.",
      reasons: [
        "Lulus cepat (3.5 tahun) menghemat biaya operasional kuliah.",
        "Sangat tepat jika Anda tidak berencana mengambil magang MBKM luar kota yang berdurasi panjang.",
        "Fokus menyelesaikan Tugas Akhir (TA) lebih awal di Semester 7."
      ]
    },
    balanced: {
      badge: "Balanced",
      badgeColor: "from-blue-500 to-indigo-600",
      glowColor: "blue",
      suitability: "Mahasiswa yang ingin menyeimbangkan performa akademik (IPK) dan persiapan karir secara bertahap.",
      targetProfile: "Cocok untuk mahasiswa yang aktif berorganisasi, melakukan riset bersama dosen, atau mengikuti sertifikasi paralel dengan perkuliahan biasa.",
      reasons: [
        "Beban mata kuliah tersebar lebih merata hingga Semester 8 (tidak melelahkan).",
        "Memberikan waktu luang ekstra untuk mempersiapkan CV, portofolio, dan lamaran kerja.",
        "Sidang Tugas Akhir dijadwalkan di Semester 8 secara matang."
      ]
    },
    experience: {
      badge: "Deep Dive",
      badgeColor: "from-violet-500 to-purple-600",
      glowColor: "violet",
      suitability: "Mahasiswa yang menargetkan pengalaman industri nyata secara penuh sebelum kelulusan melalui skema konversi MBKM.",
      targetProfile: "Cocok untuk mahasiswa yang ingin mengambil Magang Industri bersertifikat (MSIB/MBKM mandiri) skala penuh di Semester 7.",
      reasons: [
        "Materi kuliah teori wajib diselesaikan seluruhnya di Semester 6 agar Semester 7 bebas dari kelas teori.",
        "Konversi penuh 20 SKS magang langsung diakui secara akademis.",
        "Meningkatkan peluang penawaran kerja langsung (return offer) dari mitra magang setelah lulus."
      ]
    },
  };

  const glowMap = {
    amber: "ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/5 bg-spark-card border-amber-500/30",
    blue: "ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/5 bg-spark-card border-blue-500/30",
    violet: "ring-2 ring-violet-500/50 shadow-lg shadow-violet-500/5 bg-spark-card border-violet-500/30",
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
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 md:space-y-8 pb-10 md:pb-6 animate-scale-in text-spark-primary">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl spark-banner p-6 md:p-10 shadow-xl border">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-blue-900 border border-amber-500/35 uppercase tracking-widest shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              Smart Planning
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Semester Planner
            </h1>
            <p className="text-sm text-spark-secondary max-w-xl font-medium leading-relaxed">
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
              className="flex items-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/15 hover:scale-[1.02] active:scale-95 transition-all flex-shrink-0"
            >
              <RotateCcw className="w-4 h-4" /> Upload Ulang
            </button>
          )}
        </div>
      </div>

      {/* Alert Error Component */}
      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/10 p-4 rounded-xl flex items-start gap-3 animate-scale-in">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-red-700 dark:text-red-300">
              Proses Digagalkan
            </h3>
            <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1">
              {errorMsg}
            </p>
          </div>
        </div>
      )}

      <div className="features-blue-container">
        {/* Intro / Upload Step */}
        {step === "intro" && (
          <div className="bg-spark-card rounded-3xl border p-7 max-w-lg shadow-lg">
            <h2 className="text-xs font-extrabold text-spark-muted uppercase tracking-widest mb-1">
              Prasyarat & Ketentuan
            </h2>
            <p className="text-xs font-semibold text-spark-secondary mb-5 leading-relaxed">
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
                  className="flex items-start gap-2.5 text-xs text-spark-secondary font-semibold"
                >
                  <span className="w-4 h-4 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            {/* Area Dropzone Dinamis */}
            {!file ? (
              <PdfDropzone onFile={setFile} label="Upload Transkrip PDF" />
            ) : (
              /* Preview Status File Ter-upload */
              <div className="p-4 rounded-xl flex items-center justify-between transition-all duration-300 border bg-spark-card border-spark-border shadow-md">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 flex-shrink-0">
                    <FileText className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-spark-primary truncate pr-2">
                      {file.name}
                    </p>
                    <p className="text-[10px] font-medium text-spark-muted mt-0.5">
                      {file.size ? `${(file.size / 1024).toFixed(0)} KB` : "526 KB"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-wider">
                    ✓ Valid
                  </span>
                  <button
                    onClick={() => setFile(null)}
                    className="text-spark-muted hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
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
                className="mt-5 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/10 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-4 h-4" /> Generate Semester Plan
              </button>
            )}
          </div>
        )}

        {/* Processing Step */}
        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-20 bg-spark-card rounded-3xl border border-spark-border shadow-lg">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <h3 className="text-lg font-bold text-spark-primary">
              Menganalisis Transkrip...
            </h3>
            <p className="text-sm font-semibold text-spark-secondary mt-2 text-center max-w-sm px-4">
              AI sedang mengekstrak data PDF dan mencocokkannya dengan Kurikulum
              DTI. Harap tunggu sebentar.
            </p>
          </div>
        )}

        {/* Result Step — Plan Cards & Schedule Table */}
        {step === "result" && plannerData && (
          <div className="space-y-8 animate-scale-in">
            {/* Progress SKS Bar Utama */}
            <div className="bg-spark-card rounded-2xl border p-5 flex items-center justify-between shadow-lg">
              <div>
                <p className="text-xs font-bold text-spark-muted uppercase tracking-wide">
                  Progress Kelulusan
                </p>
                <p className="text-xl font-black text-spark-primary mt-1">
                  {plannerData.metadata.sks_completed}{" "}
                  <span className="text-sm font-semibold text-spark-muted">
                    / {plannerData.metadata.target_total_sks} SKS
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-spark-muted uppercase tracking-wide">
                  Total Sisa SKS
                </p>
                <p className="text-xl font-black text-amber-500 mt-1">
                  {plannerData.metadata.sks_needed} SKS
                </p>
              </div>
            </div>

            {/* DASHBOARD STATISTIK MATRIK SKS */}
            {plannerData.metadata.distribusi_sks && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-spark-muted" />
                  <h2 className="text-xs font-extrabold text-spark-muted uppercase tracking-widest">
                    Matrik Kurikulum DTI
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card Wajib */}
                  <div className="p-5 border rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/20 dark:from-blue-950/20 dark:to-slate-900/40 border-blue-500/15 flex flex-col justify-between shadow-md">
                    <div>
                      <h4 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">
                        Kelompok MK Wajib
                      </h4>
                      <p className="text-[10px] font-semibold text-spark-secondary mb-2">
                        Mata Kuliah Wajib Departemen
                      </p>
                      <p className="text-2xl font-black text-spark-primary">
                        103{" "}
                        <span className="text-xs font-bold text-spark-muted ml-1">
                          SKS Target
                        </span>
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-spark-border flex justify-between text-xs font-semibold">
                      <span className="text-spark-secondary">
                        Telah Diambil:{" "}
                        <strong className="text-blue-600 dark:text-blue-400 ml-1 font-bold">
                          {plannerData.metadata.distribusi_sks.wajib.diambil}
                        </strong>
                      </span>
                      <span className="text-spark-secondary">
                        Sisa:{" "}
                        <strong className="text-red-500 dark:text-red-400 ml-1 font-bold">
                          {plannerData.metadata.distribusi_sks.wajib.sisa}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Card WUN */}
                  <div className="p-5 border rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/20 dark:from-emerald-950/20 dark:to-slate-900/40 border-emerald-500/15 flex flex-col justify-between shadow-md">
                    <div>
                      <h4 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-0.5">
                        Kelompok MK WUN
                      </h4>
                      <p className="text-[10px] font-semibold text-spark-secondary mb-2">
                        Mata Kuliah Wajib Umum Nasional
                      </p>
                      <p className="text-2xl font-black text-spark-primary">
                        26{" "}
                        <span className="text-xs font-bold text-spark-muted ml-1">
                          SKS Target
                        </span>
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-spark-border flex justify-between text-xs font-semibold">
                      <span className="text-spark-secondary">
                        Telah Diambil:{" "}
                        <strong className="text-emerald-600 dark:text-emerald-400 ml-1 font-bold">
                          {plannerData.metadata.distribusi_sks.wun.diambil}
                        </strong>
                      </span>
                      <span className="text-spark-secondary">
                        Sisa:{" "}
                        <strong className="text-red-500 dark:text-red-400 ml-1 font-bold">
                          {plannerData.metadata.distribusi_sks.wun.sisa}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Card Pilihan */}
                  <div className="p-5 border rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/20 dark:from-purple-950/20 dark:to-slate-900/40 border-purple-500/15 flex flex-col justify-between shadow-md">
                    <div>
                      <h4 className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-0.5">
                        Kelompok MK Pilihan
                      </h4>
                      <p className="text-[10px] font-semibold text-spark-secondary mb-2">
                        Mata Kuliah Pilihan
                      </p>
                      <p className="text-2xl font-black text-spark-primary">
                        15{" "}
                        <span className="text-xs font-bold text-spark-muted ml-1">
                          SKS Target
                        </span>
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-spark-border flex justify-between text-xs font-semibold">
                      <span className="text-spark-secondary">
                        Telah Diambil:{" "}
                        <strong className="text-purple-600 dark:text-purple-400 ml-1 font-bold">
                          {plannerData.metadata.distribusi_sks.pilihan.diambil}
                        </strong>
                      </span>
                      <span className="text-spark-secondary">
                        Sisa:{" "}
                        <strong className="text-red-500 dark:text-red-400 ml-1 font-bold">
                          {plannerData.metadata.distribusi_sks.pilihan.sisa}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-4">
              <h2 className="text-xs font-extrabold text-spark-muted uppercase tracking-widest">
                Pilih Plan Semester Kamu
              </h2>
              <div className="flex-1 h-px bg-spark-border" />
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
                    className={`group relative text-left bg-spark-card border rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 ${isSelected
                      ? `${glowMap[uiConfig.glowColor]}`
                      : "border-spark-border hover:border-blue-500/30 hover:bg-slate-50/50 hover:shadow-lg"
                      }`}
                  >
                    {isSelected && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      </div>
                    )}

                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black text-white bg-gradient-to-r ${uiConfig.badgeColor} mb-4 shadow-sm`}
                    >
                      {uiConfig.badge}
                    </div>

                    <h3 className="text-sm font-extrabold text-spark-primary leading-snug mb-2">
                      {plan.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-spark-secondary mb-4 leading-relaxed">
                      {plan.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Analisis Kesesuaian Plan */}
            {(() => {
              const activePlanConfig = planUIConfig[selectedPlan];
              return (
                <div className="bg-spark-card rounded-3xl border border-spark-border p-6 shadow-lg space-y-4 animate-scale-in text-spark-primary">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-2xl flex items-center justify-center bg-gradient-to-br ${activePlanConfig.badgeColor} text-white font-bold text-sm shadow-sm flex-shrink-0 flex-grow-0`}>
                      💡
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-spark-primary">
                        Analisis Kesesuaian: <span className="font-extrabold text-blue-600 dark:text-blue-400">{plannerData.plans[selectedPlan].title}</span>
                      </h3>
                      <p className="text-[10px] font-semibold text-spark-secondary">
                        Siapa yang cocok memilih plan ini?
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-spark-border/60">
                        <h4 className="text-[10px] font-black text-spark-muted uppercase tracking-wider mb-1">
                          Karakteristik & Profil Mahasiswa
                        </h4>
                        <p className="text-xs font-semibold text-spark-secondary leading-relaxed">
                          {activePlanConfig.suitability}
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-spark-border/60">
                        <h4 className="text-[10px] font-black text-spark-muted uppercase tracking-wider mb-1">
                          Kesesuaian Beban Studi
                        </h4>
                        <p className="text-xs font-semibold text-spark-secondary leading-relaxed">
                          {activePlanConfig.targetProfile}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-spark-border/60 space-y-3">
                      <h4 className="text-[10px] font-black text-spark-muted uppercase tracking-wider">
                        Alasan Rekomendasi
                      </h4>
                      <ul className="space-y-2.5">
                        {activePlanConfig.reasons.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-spark-secondary font-semibold">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            </span>
                            <span className="leading-snug">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Schedule Detail Section */}
            <div className="bg-spark-card rounded-3xl border shadow-lg overflow-hidden border-spark-border">
              <div className="bg-slate-50/50 dark:bg-slate-950/40 border-b border-spark-border px-6 py-4 flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-spark-primary">
                  Rincian Jadwal:{" "}
                  <span className="text-blue-600 ml-1 font-black">
                    {plannerData.plans[selectedPlan].title}
                  </span>
                </h3>
              </div>

              <div className="p-6 space-y-6">
                {plannerData.plans[selectedPlan].schedule.map((semester, idx) => {
                  const totalPlannedSks = semester.courses.reduce((acc, c) => acc + (c.sks || 0), 0);
                  return (
                    <div
                      key={idx}
                      className="border border-spark-border bg-slate-50/30 dark:bg-slate-950/20 rounded-2xl overflow-hidden"
                    >
                      <div className="bg-slate-50/60 dark:bg-slate-950/40 px-4 py-3 border-b border-spark-border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div>
                          <h4 className="text-xs font-black text-spark-primary uppercase tracking-wide">
                            {semester.periode}
                          </h4>
                          <p className="text-[10px] font-bold text-spark-secondary mt-0.5">
                            {semester.fokus}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-extrabold px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg shadow-sm">
                            Planned: {totalPlannedSks} SKS
                          </span>
                          <span className="text-[10px] font-extrabold px-2.5 py-1 bg-spark-card border rounded-lg text-spark-secondary shadow-sm">
                            Maks: {semester.max_sks} SKS
                          </span>
                        </div>
                      </div>

                      <ul className="divide-y divide-spark-border">
                        {semester.courses.length > 0 ? (
                          semester.courses.map((course, cIdx) => (
                            <li
                              key={cIdx}
                              className="px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                            >
                              <div className="flex flex-col min-w-0">
                                <span className="text-[10px] font-bold text-spark-muted mb-0.5 font-mono">
                                  {course.kode}
                                </span>
                                <span className="text-xs font-bold text-spark-primary break-words">
                                  {course.nama}
                                </span>
                                <span className="text-[10px] font-medium text-spark-muted mt-0.5 italic">
                                  {course.kategori || "Sesuai Kurikulum"}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                                <span
                                  className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${course.tipe === "Wajib"
                                    ? "bg-blue-500/10 border border-blue-500/20 text-blue-600"
                                    : course.tipe === "Agama" || course.kode.startsWith("UG")
                                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600"
                                      : "bg-purple-500/10 border border-purple-500/20 text-purple-600"
                                    }`}
                                >
                                  {course.tipe}
                                </span>
                                <span className="text-xs font-black text-spark-primary w-12 text-right">
                                  {course.sks} SKS
                                </span>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-6 text-center text-xs font-bold text-spark-muted">
                            Tidak ada jadwal kelas teori
                          </li>
                        )}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
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