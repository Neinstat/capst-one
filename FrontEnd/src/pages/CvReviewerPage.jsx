// CV Reviewer Page
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { FileText, Sparkles, RotateCcw, TrendingUp, Wrench, AlertCircle } from 'lucide-react'
import PdfDropzone from '../components/shared/PdfDropzone'

export default function CvReviewerPage() {
  const [file, setFile] = useState(null)
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [step, setStep] = useState('upload')

  const MOCK_RESULT = {
    score: 72,
    strengths: [
      '3 proyek web yang relevan dengan Backend role',
      'Skill section mencantumkan Node.js, PostgreSQL, REST API',
    ],
    improvements: [
      'Deskripsi proyek terlalu singkat — tambahkan angka dampak',
      'Tidak ada pengalaman Docker/Kubernetes',
    ],
    gaps: [
      'JD mencantumkan Kafka & message queue — belum ada di CV',
      'Tidak ada kontribusi open source / GitHub aktif',
    ],
  }

  const scoreColor =
    MOCK_RESULT.score >= 80 ? '#10b981' : MOCK_RESULT.score >= 60 ? '#f59e0b' : '#ef4444'

  // SVG circle progress for score
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const progress = (MOCK_RESULT.score / 100) * circumference

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
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
              Upload CV dan dapatkan analisis mendalam sesuai role target kamu — dari kekuatan, area perbaikan, hingga skill gap yang perlu diisi.
            </p>
          </div>

          {step === 'result' && (
            <button
              onClick={() => setStep('upload')}
              className="flex items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-2xl text-sm font-bold border border-white/20 hover:scale-[1.02] active:scale-95 transition-all flex-shrink-0"
            >
              <RotateCcw className="w-4 h-4" /> Upload Ulang
            </button>
          )}
        </div>
      </div>

      {/* Upload Step */}
      {step === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 p-7 shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">
                Upload CV (PDF, maks 5MB)
              </label>
              <PdfDropzone onFile={setFile} maxMb={5} label="Upload CV PDF" hint="Pastikan PDF berbasis teks, bukan hasil scan" />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">
                Target Role <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Data Engineer Specialist"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">
                Target Perusahaan <span className="text-gray-400 font-semibold normal-case tracking-normal">(opsional)</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Huawei Indonesia"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-semibold"
              />
            </div>

            <button
              disabled={!file || !role}
              onClick={() => setStep('result')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Analisis CV Sekarang
            </button>
          </div>

          {/* Placeholder panel */}
          <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/40 rounded-3xl border border-blue-100/60 flex flex-col items-center justify-center min-h-64 text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-100/60 border border-blue-200/40 flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-blue-500" />
            </div>
            <p className="text-sm font-extrabold text-blue-900 mb-1">Siap Menganalisis</p>
            <p className="text-xs font-semibold text-blue-500 leading-relaxed max-w-xs">
              Hasil analisis kesesuaian CV dengan role target akan tampil di sini setelah upload.
            </p>
          </div>
        </div>
      )}

      {/* Result Step */}
      {step === 'result' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 p-7 shadow-sm text-center">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-5">CV Score</p>
              <div className="flex items-center justify-center mb-4">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r={radius}
                    fill="none"
                    stroke={scoreColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${progress} ${circumference}`}
                    strokeDashoffset={circumference / 4}
                    style={{ transition: 'stroke-dasharray 1s ease' }}
                  />
                  <text x="50" y="55" textAnchor="middle" className="font-black" fontSize="20" fontWeight="900" fill={scoreColor}>
                    {MOCK_RESULT.score}
                  </text>
                </svg>
              </div>
              <p className="text-sm font-extrabold text-gray-900">Skor Kesesuaian</p>
              <p className="text-xs font-semibold text-gray-400 mt-1">untuk <span className="text-blue-600">{role}</span></p>
              {company && (
                <p className="text-[10px] font-bold text-gray-400 mt-0.5">@ {company}</p>
              )}
            </div>
          </div>

          {/* Analysis Panels */}
          <div className="lg:col-span-2 space-y-4">
            <ResultSection
              title="Sudah Bagus"
              icon={TrendingUp}
              items={MOCK_RESULT.strengths}
              color="emerald"
            />
            <ResultSection
              title="Perlu Diperkuat"
              icon={Wrench}
              items={MOCK_RESULT.improvements}
              color="amber"
            />
            <ResultSection
              title="Skill Gap Terdeteksi"
              icon={AlertCircle}
              items={MOCK_RESULT.gaps}
              color="rose"
            />
          </div>
        </div>
      )}
    </div>
  )
}

const colorConfig = {
  emerald: {
    bg: 'from-emerald-50/60 to-emerald-50/20',
    border: 'border-emerald-100/60',
    label: 'text-emerald-700',
    dot: 'bg-emerald-500',
    icon: 'text-emerald-600 bg-emerald-50',
    item: 'bg-emerald-50/60 border-emerald-100/40',
  },
  amber: {
    bg: 'from-amber-50/60 to-amber-50/20',
    border: 'border-amber-100/60',
    label: 'text-amber-700',
    dot: 'bg-amber-500',
    icon: 'text-amber-600 bg-amber-50',
    item: 'bg-amber-50/60 border-amber-100/40',
  },
  rose: {
    bg: 'from-rose-50/60 to-rose-50/20',
    border: 'border-rose-100/60',
    label: 'text-rose-700',
    dot: 'bg-rose-500',
    icon: 'text-rose-600 bg-rose-50',
    item: 'bg-rose-50/60 border-rose-100/40',
  },
}

function ResultSection({ title, icon: Icon, items, color }) {
  const c = colorConfig[color]
  return (
    <div className={`bg-gradient-to-br ${c.bg} rounded-3xl border ${c.border} p-6`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${c.icon}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <p className={`text-xs font-extrabold uppercase tracking-widest ${c.label}`}>{title}</p>
      </div>
      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item} className={`flex items-start gap-2.5 py-2.5 px-3.5 rounded-xl border ${c.item}`}>
            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${c.dot}`} />
            <p className="text-xs text-gray-700 font-semibold leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}