// 404 Page
// ─────────────────────────────────────────────────────────────────────────────
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-sky-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-all duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-900/60 border border-blue-100 dark:border-white/5 rounded-3xl p-8 shadow-xl text-center backdrop-blur-md">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-7xl font-black text-slate-800 dark:text-white tracking-tight mb-2">404</h1>
        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-semibold">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan. Pastikan alamat URL sudah benar.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/10 hover:scale-[1.02] active:scale-95 transition-all w-full"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  )
}
  