// Semester Planner Page
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { CheckCircle, CalendarCheck, RotateCcw } from 'lucide-react'
import PdfDropzone from '../components/shared/PdfDropzone'

export default function SemesterPlannerPage() {
  const [step, setStep] = useState('intro')
  const [file, setFile] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const PLANS = [
    {
      id: 'fast',
      title: 'Plan A — Lulus 3.5 Tahun',
      badge: 'Sprint Mode',
      badgeColor: 'from-amber-400 to-orange-500',
      glowColor: 'amber',
      desc: 'Ambil maks SKS tiap semester, selesaikan TA di sem 7.',
      semesters: [
        'Sem 5–6: Maks SKS (22–24)',
        'Sem 7: TA + Magang singkat',
        'Sem 7.5: Sidang TA',
      ],
    },
    {
      id: 'balanced',
      title: 'Plan B — SKS + Karir',
      badge: 'Balanced',
      badgeColor: 'from-blue-500 to-indigo-600',
      glowColor: 'blue',
      desc: 'Mix SKS optimal, fokus skill industri dan magang.',
      semesters: [
        'Sem 5–6: Maks SKS + pilih MK karir',
        'Sem 7: Mix magang paruh waktu',
        'Sem 8: TA dengan portofolio kuat',
      ],
    },
    {
      id: 'experience',
      title: 'Plan C — Fokus Experience',
      badge: 'Deep Dive',
      badgeColor: 'from-violet-500 to-purple-600',
      glowColor: 'violet',
      desc: 'Selesaikan MK wajib, magang penuh 4–6 bulan.',
      semesters: [
        'Sem 5–7: Selesaikan MK wajib',
        'Sem 7–8: Magang MSIB/mandiri → konversi MBKM',
        'Sem 8: Sidang TA dari magang',
      ],
    },
  ]

  const glowMap = {
    amber: 'ring-amber-400/60 shadow-amber-500/20',
    blue: 'ring-blue-400/60 shadow-blue-500/20',
    violet: 'ring-violet-400/60 shadow-violet-500/20',
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
              onClick={() => { setStep('intro'); setFile(null); setSelectedPlan(null) }}
              className="flex items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-2xl text-sm font-bold border border-white/20 hover:scale-[1.02] active:scale-95 transition-all flex-shrink-0"
            >
              <RotateCcw className="w-4 h-4" /> Upload Ulang
            </button>
          )}
        </div>
      </div>

      {/* Intro / Upload Step */}
      {step === 'intro' && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 p-7 max-w-lg shadow-sm">
          <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">Prasyarat & Ketentuan</h2>
          <p className="text-xs font-semibold text-gray-500 mb-5 leading-relaxed">
            Sistem akan mengecek apakah kamu sudah memenuhi prasyarat untuk mendapat rekomendasi plan.
          </p>

          <ul className="space-y-2.5 mb-6">
            {[
              'Sudah menyelesaikan minimal 60 SKS',
              'Transkrip PDF berbasis teks (bukan scan)',
              'IPS minimal 2.75 untuk Plan A',
            ].map((t) => (
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
              onClick={() => setStep('result')}
              className="mt-5 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" /> Generate Semester Plan
            </button>
          )}
        </div>
      )}

      {/* Result Step — Plan Cards */}
      {step === 'result' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Pilih Plan Semester Kamu</h2>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`group relative text-left bg-white rounded-3xl border-2 p-6 transition-all duration-300 hover:-translate-y-1 ${
                    isSelected
                      ? `border-transparent ring-2 shadow-xl ${glowMap[plan.glowColor]}`
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    </div>
                  )}

                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white bg-gradient-to-r ${plan.badgeColor} mb-4 shadow-sm`}>
                    {plan.badge}
                  </div>

                  <h3 className="text-sm font-extrabold text-gray-900 leading-snug mb-2">{plan.title}</h3>
                  <p className="text-[11px] font-semibold text-gray-500 mb-4 leading-relaxed">{plan.desc}</p>

                  <div className="space-y-2 pt-3 border-t border-gray-100/80">
                    {plan.semesters.map((s) => (
                      <div key={s} className="flex items-start gap-2 text-[11px] text-gray-600 font-semibold">
                        <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 bg-gradient-to-r ${plan.badgeColor}`} />
                        {s}
                      </div>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>

          {selectedPlan && (
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl px-5 py-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-xs font-bold text-emerald-700">
                Plan <span className="uppercase">{PLANS.find(p => p.id === selectedPlan)?.id}</span> dipilih —{' '}
                {PLANS.find(p => p.id === selectedPlan)?.title}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}