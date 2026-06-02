import { useState } from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Info, Upload, Sparkles, RefreshCw } from 'lucide-react'
import PdfDropzone from '../components/shared/PdfDropzone'
import { useAuthStore } from '../store/authStore'

const PROCESSING_STEPS = [
  'Upload file',
  'AI Parsing transkrip',
  'Mapping ke domain skill',
  'Generate rekomendasi karir',
]

export default function AcademicMapperPage() {
  const { token } = useAuthStore()
  const [step, setStep] = useState('upload')
  const [processingStep, setProcessingStep] = useState(0)
  const [file, setFile] = useState(null)

  const [resultData, setResultData] = useState({
    studentName: '',
    nrp: '',
    gpa: 0,
    skillData: [],
    careerMatches: [],
    extractedData: [],
  })

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  async function handleUpload() {
    if (!file) return
    if (!token) {
      alert('Sesi berakhir, silakan login kembali.')
      return
    }

    setStep('processing')
    const formData = new FormData()
    formData.append('transcript', file)

    try {
      const interval = setInterval(() => {
        setProcessingStep((prev) => (prev < 3 ? prev + 1 : prev))
      }, 1000)

      const response = await fetch(`${API_URL}/courses/analyze`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      })

      const result = await response.json()

      if (response.ok) {
        clearInterval(interval)
        setResultData({
          studentName: result.studentName,
          nrp: result.nrp,
          gpa: result.gpa,
          skillData: result.skillData,
          careerMatches: result.careerMatches,
          extractedData: result.extractedData,
        })
        setTimeout(() => setStep('result'), 800)
      } else {
        clearInterval(interval)
        alert(result.message || 'Gagal memproses transkrip')
        setStep('upload')
      }
    } catch (error) {
      alert('Gagal terhubung ke server.')
      setStep('upload')
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 text-white p-8 md:p-10 shadow-2xl border border-white/5">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold bg-white/10 backdrop-blur-md text-emerald-200 border border-white/10 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              AI-Powered Analysis
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-indigo-100">
              Academic Mapper
            </h1>
            <p className="text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
              Upload transkrip nilaimu, dan biarkan AI memetakan skill akademikmu ke jalur karir yang paling relevan di industri teknologi.
            </p>
          </div>

          {step === 'result' && (
            <button
              onClick={() => { setStep('upload'); setFile(null); setProcessingStep(0) }}
              className="flex items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-2xl text-sm font-bold border border-white/20 hover:scale-[1.02] active:scale-95 transition-all flex-shrink-0"
            >
              <RefreshCw className="w-4 h-4" /> Analisis Ulang
            </button>
          )}
        </div>
      </div>

      {/* Upload Step */}
      {step === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 p-7 shadow-sm">
            <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-5">Upload Transkrip Nilai</h2>
            <PdfDropzone onFile={setFile} label="Upload Transkrip PDF" />
            {file && (
              <button
                onClick={handleUpload}
                className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Mulai Analisis AI
              </button>
            )}
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-emerald-50/50 border border-indigo-100/60 rounded-3xl p-7">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Info className="w-4 h-4 text-indigo-600" />
              </div>
              <h2 className="text-sm font-extrabold text-indigo-900">Panduan Transkrip</h2>
            </div>
            <p className="text-xs font-semibold text-indigo-600 mb-5 leading-relaxed">
              Mohon gunakan transkrip yang sesuai agar hasil analisis akurat.
            </p>
            <div className="space-y-3">
              {[
                'Buka siakad myITS',
                'Masuk ke modul Laporan',
                'Pilih Transkrip Sementara',
                'Download dengan format Horizontal (.pdf)',
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-xs text-indigo-700 font-semibold">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 border border-indigo-200/60 flex items-center justify-center text-[11px] font-black text-indigo-700">
                    {i + 1}
                  </span>
                  {s}
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-indigo-100">
              <p className="text-[11px] text-indigo-400 italic leading-relaxed">
                * Sistem menyamarkan data sensitif sebelum diproses AI untuk keamanan Anda.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Processing Step */}
      {step === 'processing' && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 p-12 text-center max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
            <div className="w-8 h-8 rounded-full border-3 border-white border-t-transparent animate-spin" style={{ borderWidth: 3 }} />
          </div>
          <h3 className="text-base font-extrabold text-gray-900 mb-2">Sedang Memproses...</h3>
          <p className="text-sm font-semibold text-emerald-600 mb-8">{PROCESSING_STEPS[processingStep]}</p>
          <div className="flex items-center justify-center gap-2">
            {PROCESSING_STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  i < processingStep ? 'bg-emerald-500' : i === processingStep ? 'bg-emerald-400 animate-pulse scale-125' : 'bg-gray-200'
                }`} />
                {i < PROCESSING_STEPS.length - 1 && (
                  <div className={`w-6 h-0.5 rounded-full transition-all duration-500 ${i < processingStep ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">
            Step {processingStep + 1} / {PROCESSING_STEPS.length}
          </p>
        </div>
      )}

      {/* Result Step */}
      {step === 'result' && (
        <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard label="Nama Mahasiswa" value={resultData.studentName} color="indigo" />
            <StatsCard label="NRP" value={resultData.nrp} color="purple" />
            <StatsCard label="GPA Transkrip" value={resultData.gpa} color="emerald" isGpa />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 p-7 shadow-sm">
              <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-6">Skills Assessment</h2>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={resultData.skillData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 600 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                  <Radar name="Skor" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Career Matches */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 p-7 shadow-sm">
              <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-6">Rekomendasi Jalur Karir</h2>
              <div className="space-y-5">
                {resultData.careerMatches.map((career, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-extrabold text-gray-900">{career.role}</span>
                      <span className="text-xs font-black px-2.5 py-1 rounded-lg" style={{ color: career.color, backgroundColor: `${career.color}18` }}>
                        {career.match}% Match
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${career.match}%`, backgroundColor: career.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
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
      `}</style>
    </div>
  )
}

function StatsCard({ label, value, isGpa, color }) {
  const colorMap = {
    indigo: 'from-indigo-50 to-indigo-100/50 border-indigo-100/60 text-indigo-600',
    purple: 'from-purple-50 to-purple-100/50 border-purple-100/60 text-purple-600',
    emerald: 'from-emerald-50 to-emerald-100/50 border-emerald-100/60 text-emerald-600',
  }
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} rounded-3xl border p-6 shadow-sm`}>
      <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className={`text-3xl font-black mt-3 ${isGpa ? 'text-emerald-600' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  )
}
