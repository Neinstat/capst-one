// Semester Planner Page - SPARK DTI
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { CheckCircle, CalendarCheck, RotateCcw, Loader2, BookOpen, AlertCircle, BarChart3 } from 'lucide-react'
import PdfDropzone from '../components/shared/PdfDropzone'

// Konfigurasi API
const API_URL = 'http://localhost:8000/api';

export default function SemesterPlannerPage() {
  const [step, setStep] = useState('intro') // intro, processing, result
  const [file, setFile] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState('fast')
  const [plannerData, setPlannerData] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  // Konfigurasi visual UI untuk masing-masing plan
  const planUIConfig = {
    fast: { badge: 'Sprint Mode', badgeColor: 'from-amber-400 to-orange-500', glowColor: 'amber' },
    balanced: { badge: 'Balanced', badgeColor: 'from-blue-500 to-indigo-600', glowColor: 'blue' },
    experience: { badge: 'Deep Dive', badgeColor: 'from-violet-500 to-purple-600', glowColor: 'violet' }
  }

  const glowMap = {
    amber: 'ring-amber-400/60 shadow-amber-500/20',
    blue: 'ring-blue-400/60 shadow-blue-500/20',
    violet: 'ring-violet-400/60 shadow-violet-500/20',
  }

  // ==========================================
  // LOGIKA UTAMA: FETCHING 2 API BERURUTAN
  // ==========================================
  async function handleGeneratePlan() {
    if (!file) return;
    setStep('processing');
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. PANGGIL API EKSTRAKSI PDF (AI)
      const parseRes = await fetch(`${API_URL}/academic/upload-transcript`, {
        method: "POST",
        body: formData,
      });
      
      if (!parseRes.ok && parseRes.headers.get("content-type")?.indexOf("application/json") === -1) {
          throw new Error("Gagal terhubung ke Backend (API Upload). Pastikan server menyala di port 8000.");
      }

      const parseResult = await parseRes.json();
      if (!parseRes.ok) throw new Error(parseResult.detail || "Gagal mengekstrak PDF Transkrip");

      const extractedCourses = parseResult.data.courses;

      // 2. PANGGIL API SEMESTER PLANNER (Rule-Based)
      const plannerRes = await fetch(`${API_URL}/semester/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extracted_courses: extractedCourses }),
      });
      
      if (!plannerRes.ok && plannerRes.headers.get("content-type")?.indexOf("application/json") === -1) {
          throw new Error("Gagal terhubung ke Backend (API Planner). Pastikan server menyala di port 8000.");
      }

      const plannerResult = await plannerRes.json();
      if (!plannerRes.ok) throw new Error(plannerResult.detail || "Gagal generate rute studi");

      // Simpan data sukses ke state
      setPlannerData(plannerResult.data || plannerResult);
      setSelectedPlan('fast'); // Default ke Plan A
      setStep('result');
      
    } catch (error) {
      setErrorMsg(error.message);
      setStep('intro');
      setFile(null);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
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
              AI merencanakan rute studi optimalmu berdasarkan transkrip dan target kelulusan. Pilih plan yang paling sesuai dengan ambisimu.
            </p>
          </div>

          {step === 'result' && (
            <button
              onClick={() => { setStep('intro'); setFile(null); setPlannerData(null); }}
              className="flex items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-2xl text-sm font-bold border border-white/20 hover:scale-[1.02] active:scale-95 transition-all flex-shrink-0"
            >
              <RotateCcw className="w-4 h-4" /> Upload Ulang
            </button>
          )}
        </div>
      </div>

      {/* Alert Error Component */}
      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-red-800">Proses Digagalkan</h3>
            <p className="text-xs font-semibold text-red-600 mt-1">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Intro / Upload Step */}
      {step === 'intro' && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 p-7 max-w-lg shadow-sm">
          <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">Prasyarat & Ketentuan</h2>
          <p className="text-xs font-semibold text-gray-500 mb-5 leading-relaxed">
            Sistem akan mengecek apakah kamu sudah memenuhi prasyarat untuk mendapat rekomendasi plan.
          </p>

          <ul className="space-y-2.5 mb-6">
            {['Sudah menyelesaikan minimal 60 SKS', 'Transkrip PDF berbasis teks (bukan scan)'].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-xs text-gray-700 font-semibold">
                <span className="w-4 h-4 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                </span>
                {t}
              </li>
            ))}
          </ul>

          <PdfDropzone onFile={setFile} label="Upload Transkrip PDF" />

          {file && (
            <button
              onClick={handleGeneratePlan}
              className="mt-5 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" /> Generate Semester Plan
            </button>
          )}
        </div>
      )}

      {/* Processing Step */}
      {step === 'processing' && (
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
          <h3 className="text-lg font-bold text-gray-800">Menganalisis Transkrip...</h3>
          <p className="text-sm font-semibold text-gray-500 mt-2 text-center max-w-sm">
            AI sedang mengekstrak data PDF dan mencocokkannya dengan Kurikulum DTI. Harap tunggu sebentar.
          </p>
        </div>
      )}

      {/* Result Step — Plan Cards & Schedule Table */}
      {step === 'result' && plannerData && (
        <div className="space-y-8">
          
          {/* Progress SKS Bar Utama */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Progress Kelulusan</p>
              <p className="text-lg font-black text-gray-800">
                {plannerData.metadata.sks_completed} <span className="text-sm font-semibold text-gray-500">/ {plannerData.metadata.target_total_sks} SKS</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase">Total Sisa SKS</p>
              <p className="text-lg font-black text-amber-600">{plannerData.metadata.sks_needed} SKS</p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* DASHBOARD STATISTIK MATRIK SKS (WAJIB, WUN, PILIHAN)      */}
          {/* ========================================================= */}
          {plannerData.metadata.distribusi_sks && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                <h2 className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Matrik Kurikulum DTI</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card Wajib */}
                <div className="p-4 border rounded-xl bg-blue-50/50 border-blue-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Kelompok MK Wajib</h4>
                    <p className="text-2xl font-black text-gray-800">103 <span className="text-xs font-bold text-gray-400">SKS Target</span></p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-blue-100/50 flex justify-between text-xs font-semibold">
                    <span className="text-gray-500">Telah Diambil: <strong className="text-blue-700 ml-1">{plannerData.metadata.distribusi_sks.wajib.diambil}</strong></span>
                    <span className="text-gray-500">Sisa: <strong className="text-red-500 ml-1">{plannerData.metadata.distribusi_sks.wajib.sisa}</strong></span>
                  </div>
                </div>

                {/* Card WUN */}
                <div className="p-4 border rounded-xl bg-emerald-50/50 border-emerald-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Kelompok MK WUN</h4>
                    <p className="text-2xl font-black text-gray-800">26 <span className="text-xs font-bold text-gray-400">SKS Target</span></p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-emerald-100/50 flex justify-between text-xs font-semibold">
                    <span className="text-gray-500">Telah Diambil: <strong className="text-emerald-700 ml-1">{plannerData.metadata.distribusi_sks.wun.diambil}</strong></span>
                    <span className="text-gray-500">Sisa: <strong className="text-red-500 ml-1">{plannerData.metadata.distribusi_sks.wun.sisa}</strong></span>
                  </div>
                </div>

                {/* Card Pilihan */}
                <div className="p-4 border rounded-xl bg-purple-50/50 border-purple-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <h4 className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">Kelompok MK Pilihan</h4>
                    <p className="text-2xl font-black text-gray-800">15 <span className="text-xs font-bold text-gray-400">SKS Target</span></p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-purple-100/50 flex justify-between text-xs font-semibold">
                    <span className="text-gray-500">Telah Diambil: <strong className="text-purple-700 ml-1">{plannerData.metadata.distribusi_sks.pilihan.diambil}</strong></span>
                    <span className="text-gray-500">Sisa: <strong className="text-red-500 ml-1">{plannerData.metadata.distribusi_sks.pilihan.sisa}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-4">
            <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Pilih Plan Semester Kamu</h2>
            <div className="flex-1 h-px bg-gray-100" />
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
                  className={`group relative text-left bg-white rounded-3xl border-2 p-6 transition-all duration-300 hover:-translate-y-1 ${
                    isSelected
                      ? `border-transparent ring-2 shadow-xl ${glowMap[uiConfig.glowColor]}`
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    </div>
                  )}

                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white bg-gradient-to-r ${uiConfig.badgeColor} mb-4 shadow-sm`}>
                    {uiConfig.badge}
                  </div>

                  <h3 className="text-sm font-extrabold text-gray-900 leading-snug mb-2">{plan.title}</h3>
                  <p className="text-[11px] font-semibold text-gray-500 mb-4 leading-relaxed">{plan.desc}</p>
                </button>
              )
            })}
          </div>

          {/* Schedule Detail Section */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-gray-100 px-6 py-4 flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-bold text-gray-800">
                Rincian Jadwal: <span className="text-indigo-600">{plannerData.plans[selectedPlan].title}</span>
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              {plannerData.plans[selectedPlan].schedule.map((semester, idx) => (
                <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-black text-gray-800 uppercase">{semester.periode}</h4>
                      <p className="text-[10px] font-bold text-gray-500 mt-0.5">{semester.fokus}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-gray-600 shadow-sm">
                      Maks {semester.max_sks} SKS
                    </span>
                  </div>
                  
                  <ul className="divide-y divide-gray-50">
                    {semester.courses.length > 0 ? (
                      semester.courses.map((course, cIdx) => (
                        <li key={cIdx} className="px-4 py-3 flex justify-between items-center hover:bg-slate-50 transition-colors">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 mb-0.5">{course.kode}</span>
                            <span className="text-xs font-bold text-gray-700">{course.nama}</span>
                            <span className="text-[10px] font-medium text-slate-400 mt-0.5 italic">{course.kategori || 'Sesuai Kurikulum'}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${course.tipe === 'Wajib' ? 'bg-blue-50 text-blue-600' : (course.tipe === 'Agama' || course.kode.startsWith('UG') ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600')}`}>
                              {course.tipe}
                            </span>
                            <span className="text-xs font-black text-gray-800 w-12 text-right">{course.sks} SKS</span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-6 text-center text-xs font-bold text-gray-400">Tidak ada jadwal kelas teori</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}