// SKS Chatbot Page
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { SKS_JALUR } from '../lib/utils'

export default function SksChatbotPage() {
  const [step, setStep] = useState('jalur')
  const [jalur, setJalur] = useState(null)
  const [subJalur, setSubJalur] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const CONVERSION_TABLE = [
    { type: 'Magang 3–6 minggu', sks: '3 SKS' },
    { type: 'Magang 16–24 minggu', sks: '20 SKS' },
    { type: 'Juara 1/2/3 Belmawa (< 5 anggota)', sks: '20 SKS' },
    { type: 'Juara 1/2/3 Belmawa (≥ 5 anggota)', sks: '10 SKS' },
    { type: 'PKM Lolos Pendanaan', sks: '6 SKS' },
  ]

  async function handleSend() {
    if (!input.trim() || loading) return
    
    const userMsg = { role: 'user', text: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      const data = await response.json()
      const botMsg = {
        role: 'bot',
        text: data.reply || 'Maaf, terjadi error. Coba lagi.',
        data: data.data
      }
      setMessages((m) => [...m, botMsg])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMsg = {
        role: 'bot',
        text: 'Maaf, terjadi error saat menghubungi server. Pastikan backend berjalan di http://localhost:5000'
      }
      setMessages((m) => [...m, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Konversi SKS
        </span>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">MBKM AI Agent</h1>
        <p className="text-sm text-gray-500 mt-1">Chatbot untuk estimasi konversi SKS jalur prestasi dan magang.</p>
      </div>

      {step === 'jalur' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-lg">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Pilih Jalur Konversi</h2>
          <div className="space-y-3">
            {Object.values(SKS_JALUR).map((j) => (
              <button
                key={j.id}
                onClick={() => setJalur(j)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all
                  ${jalur?.id === j.id ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: jalur?.id === j.id ? '#dc2626' : '#d1d5db' }} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{j.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{j.description}</p>
                  {jalur?.id === j.id && (
                    <div className="flex gap-2 mt-2">
                      {j.sub.map((s) => (
                        <button
                          key={s}
                          onClick={(e) => { e.stopPropagation(); setSubJalur(s) }}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-colors
                            ${subJalur === s ? 'bg-red-500 border-red-500 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'}
                          `}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          <button
            disabled={!jalur || !subJalur}
            onClick={() => {
              setStep('chat')
              setMessages([{ role: 'bot', text: `Halo! Saya akan membantu kamu menghitung estimasi konversi SKS untuk jalur ${jalur.label} — ${subJalur}. Ceritakan kegiatan kamu: nama perusahaan/kompetisi, durasi, dan jobdesc/prestasi yang diraih.` }])
            }}
            className="mt-4 w-full py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-all"
          >
            Lanjut ke Chat
          </button>
        </div>
      )}

      {step === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tabel konversi referensi */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-xs font-semibold text-gray-700 mb-3">Tabel Konversi Resmi DTI</p>
              <div className="space-y-2">
                {CONVERSION_TABLE.map(({ type, sks }) => (
                  <div key={type} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <p className="text-xs text-gray-600">{type}</p>
                    <span className="text-xs font-semibold text-red-600">{sks}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep('jalur')} className="mt-4 text-xs text-gray-400 hover:text-gray-600 w-full text-center">
                ← Ganti jalur
              </button>
            </div>
          </div>

          {/* Chat interface */}
          <div className="lg:col-span-2 flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden" style={{ minHeight: 480 }}>
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <p className="text-xs font-semibold text-gray-700">MBKM AI Agent</p>
              <span className="text-xs text-gray-400">— {jalur?.label} · {subJalur}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed
                      ${msg.role === 'user'
                        ? 'bg-red-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
                placeholder="Ketik detail kegiatan MBKM kamu..."
                disabled={loading}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 disabled:bg-gray-50"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '...' : 'Kirim'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 