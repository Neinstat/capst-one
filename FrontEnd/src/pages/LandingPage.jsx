import { useNavigate } from 'react-router-dom'
import { FEATURE_COLORS } from '../lib/utils'

const FEATURES = [
  {
    key: 'academic-mapper',
    title: 'Academic Mapper',
    desc: 'Upload transkrip untuk memetakan kekuatan skill dan rekomendasi karir.',
    path: '/academic-mapper',
  },
  {
    key: 'semester-planner',
    title: 'Semester Planner',
    desc: 'Rekomendasi 3 plan studi sesuai prasyarat dan targetmu.',
    path: '/semester-planner',
  },
  {
    key: 'opportunity-board',
    title: 'Opportunity Board',
    desc: 'Cari magang/lomba terverifikasi dan aktifkan reminder.',
    path: '/opportunity-board',
  },
  {
    key: 'cv-reviewer',
    title: 'AI CV Reviewer',
    desc: 'Skor & feedback CV sesuai target role kamu.',
    path: '/cv-reviewer',
  },
  {
    key: 'sks-chatbot',
    title: 'Konversi SKS Agent',
    desc: 'Chatbot untuk estimasi konversi SKS jalur magang/prestasi.',
    path: '/sks-chatbot',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-sans bg-slate-950"
      style={{
        backgroundImage: "url('/tower-2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] pointer-events-none" />

      {/* Ambient Glow Lingkaran Efek Laboratorium / TI ITS */}
      <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-6xl w-full mx-auto px-4 py-12 relative z-10">

        {/* Top Info Header */}
        <div className="flex items-start justify-between gap-6 flex-wrap pb-8 border-b border-white/10">
          <div>
            {/* Badge Atas diubah ke Biru Resmi ITS */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 backdrop-blur-md text-xs font-black text-blue-400 border border-blue-500/20 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              SPARK DTI ITS
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mt-4 tracking-tight leading-none">
              Perencanaan Akademik <br />
              {/* Gradien Judul diubah menjadi Blue-Cyan Elektrik khas TI */}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-300 drop-shadow-sm">
                & Rute Karir Digital
              </span>
            </h1>

            <p className="text-slate-400 mt-3 max-w-2xl text-sm font-semibold leading-relaxed">
              Platform cerdas bertenaga AI untuk memetakan capaian akademik Anda, menavigasi konversi SKS, meninjau CV, serta merencanakan semester perkuliahan di Departemen Teknologi Informasi.
            </p>
          </div>

          {/* Tombol Utama diubah ke Gradien Biru ITS ke Cyan TI */}
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
          >
            Masuk Ke Dashboard
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {FEATURES.map((f) => {
            const c = FEATURE_COLORS[f.key] || {
              bg: "rgba(139, 92, 246, 0.1)",
              border: "rgba(139, 92, 246, 0.2)",
              accent: "#8b5cf6",
              text: "#ffffff"
            };

            return (
              <button
                key={f.key}
                onClick={() => navigate(f.path)}
                className="text-left glass-card rounded-3xl p-6 hover:border-white/20 transition-all flex flex-col justify-between group h-64 border border-white/5 bg-slate-900/30 backdrop-blur-xl hover:bg-slate-900/40"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all shadow-md group-hover:scale-105"
                      style={{
                        backgroundColor: c.accent + "20",
                        borderColor: c.accent + "40",
                        boxShadow: `0 4px 12px ${c.accent}15`
                      }}
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.accent }} />
                    </span>
                    {/* Hover text diubah dari rose-300 ke cyan-300 agar klop dengan tema */}
                    <p className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                      {f.title}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">{f.desc}</p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-slate-200 transition-colors">
                    Pelajari Fitur
                  </span>
                  <span className="text-xs font-black transition-transform group-hover:translate-x-1" style={{ color: c.accent }}>
                    Buka →
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}