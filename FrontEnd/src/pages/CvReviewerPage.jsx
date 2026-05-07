// CV Reviewer Page
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import PdfDropzone from '../components/shared/PdfDropzone'

export default function CvReviewerPage() {
  const [file, setFile] = useState(null)
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [step, setStep] = useState('upload')

  const MOCK_RESULT = {
    score: 72,
    strengths: ['3 proyek web yang relevan dengan Backend role', 'Skill section mencantumkan Node.js, PostgreSQL, REST API'],
    improvements: ['Deskripsi proyek terlalu singkat — tambahkan angka dampak', 'Tidak ada pengalaman Docker/Kubernetes'],
    gaps: ['JD mencantumkan Kafka & message queue — belum ada di CV', 'Tidak ada kontribusi open source / GitHub aktif'],
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          CV Reviewer
        </span>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">AI CV Reviewer</h1>
        <p className="text-sm text-gray-500 mt-1">Upload CV dan dapatkan analisis mendalam sesuai role target kamu.</p>
      </div>

      {step === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Upload CV (PDF, maks 5MB)</label>
                <PdfDropzone onFile={setFile} maxMb={5} label="Upload CV PDF" hint="Pastikan PDF berbasis teks, bukan hasil scan" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Target Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Data Engineer Specialist"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Target Perusahaan (opsional)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., Huawei Indonesia"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <button
                disabled={!file || !role}
                onClick={() => setStep('result')}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                Analisis CV Sekarang
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center min-h-64 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-sm text-gray-500">Hasil analisis akan muncul di sini</p>
          </div>
        </div>
      )}

      {step === 'result' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <div className="w-24 h-24 rounded-full border-4 border-blue-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl font-bold text-blue-600">{MOCK_RESULT.score}</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">CV Score</p>
              <p className="text-xs text-gray-500 mt-0.5">untuk {role}</p>
              <button
                onClick={() => setStep('upload')}
                className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← Upload ulang
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <ResultSection title="Sudah Bagus" color="#16a34a" items={MOCK_RESULT.strengths} />
            <ResultSection title="Perlu Diperkuat" color="#ca8a04" items={MOCK_RESULT.improvements} />
            <ResultSection title="Skill Gap Terdeteksi" color="#dc2626" items={MOCK_RESULT.gaps} />
          </div>
        </div>
      )}
    </div>
  )
}

function ResultSection({ title, color, items }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <p className="text-xs font-semibold mb-3" style={{ color }}>{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-2 py-2 px-3 rounded-lg" style={{ backgroundColor: `${color}10` }}>
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: color }} />
            <p className="text-xs text-gray-700">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// 