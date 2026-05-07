
// Opportunity Board Page
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { useAuthStore, useReminderStore } from '../store/authStore'

const INITIAL_OPPORTUNITIES = [
  {
    id: 1,
    title: 'Onsite IT Intern (HQ)',
    company: 'SLB Indonesia',
    location: 'Jakarta',
    type: 'Internship',
    duration: '4–6 bulan',
    minSem: 5,
    tags: ['IT Support', 'Troubleshooting', 'Office Ops'],
    verified: true,
    notes:
      'Internya jadi Onsite IT Intern di HQ Office SLB Indonesia yang ada di Jakarta. Rolenya buat support user-user local & expat yang ada di office, dan handle tugas-tugas daily operational IT.',
  },
  {
    id: 2,
    title: 'Backend Engineer Intern',
    company: 'Tokopedia',
    location: 'Jakarta',
    type: 'Internship',
    duration: '3 bulan',
    minSem: 5,
    tags: ['Backend', 'API', 'Database'],
    verified: true,
    notes:
      'Role Backend pada Tokopedia umumnya berfokus pada pengembangan layanan (service) dan API, integrasi database, menjaga reliability/performance, serta kolaborasi dengan product/mobile/web untuk kebutuhan fitur.',
  },
  {
    id: 3,
    title: 'Cloud DevOps Intern',
    company: 'Telkom Indonesia',
    location: 'Surabaya',
    type: 'Internship',
    duration: '6 bulan',
    minSem: 4,
    tags: ['AWS', 'Docker', 'CI/CD'],
    verified: true,
    notes:
      'Fokus pada operational cloud dan automation: deploy, monitoring, dan membantu tim menjalankan pipeline CI/CD serta praktik DevOps harian.',
  },
]

export default function OpportunityBoardPage() {
  const { user } = useAuthStore()
  const [isDemoAlumni, setIsDemoAlumni] = useState(false)

  // Mode demo: jika semester > 8, string 'Lulus', atau switcher aktif
  const isAlumni = user?.semester > 8 || user?.semester === 'Lulus' || user?.nrp?.startsWith('ALUMNI') || isDemoAlumni

  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [isPosting, setIsPosting] = useState(false)

  // State form lowongan baru
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Internship',
    duration: '',
    minSem: 1,
    tags: '',
    notes: ''
  })

  const [isGlobalReminderOpen, setIsGlobalReminderOpen] = useState(false)
  const [globalReminder, setGlobalReminder] = useState({ role: '', email: '' })

  const selectedOpp = selectedId ? opportunities.find((o) => o.id === selectedId) : null

  const filtered = opportunities.filter(
    (o) =>
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.company.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddJob = (e) => {
    e.preventDefault()
    const job = {
      ...newJob,
      id: Date.now(),
      tags: newJob.tags.split(',').map(t => t.trim()),
      verified: true
    }
    setOpportunities([job, ...opportunities])
    setIsPosting(false)
    setNewJob({ title: '', company: '', location: '', type: 'Internship', duration: '', minSem: 1, tags: '', notes: '' })
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Demo Switcher - Hanya untuk testing tampilan */}
      <div className="mb-4 p-3 bg-gray-100 rounded-xl flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Demo Mode (Role Switcher)</p>
        <button
          onClick={() => setIsDemoAlumni(!isDemoAlumni)}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${isDemoAlumni ? 'bg-pink-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
        >
          {isDemoAlumni ? 'Mode: Alumni (Bisa Post)' : 'Mode: Mahasiswa (Lihat Saja)'}
        </button>
      </div>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-pink-50 text-pink-700 border border-pink-200">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            Opportunity Board
          </span>
          <h1 className="text-2xl font-semibold text-gray-900 mt-2">Opportunity Board</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isAlumni ? 'Halo Alumni! Anda bisa berkontribusi membagikan lowongan di sini.' : 'Lowongan magang dan pekerjaan terverifikasi dari alumni DTI.'}
          </p>
        </div>

        {isAlumni && (
          <button
            onClick={() => setIsPosting(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all shadow-md active:scale-95"
          >
            <span>+</span> Posting Baru
          </button>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari role atau perusahaan..."
          className="flex-1 max-w-sm px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <button
          onClick={() => setIsGlobalReminderOpen(true)}
          className="px-4 py-2 bg-pink-50 text-pink-600 rounded-xl text-sm font-bold border border-pink-100 hover:bg-pink-100 transition-all flex items-center gap-2"
        >
          <span>🔔</span> Notifikasi Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((opp) => (
          <button
            key={opp.id}
            type="button"
            onClick={() => setSelectedId(opp.id)}
            className="text-left bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-pink-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">{opp.company.charAt(0)}</span>
              </div>
              {opp.verified && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                  Verified ✓
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-gray-900">{opp.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{opp.company} · {opp.location}</p>
            <p className="text-xs text-gray-400 mt-0.5">{opp.type} · {opp.duration}</p>

            <div className="flex flex-wrap gap-1 mt-3">
              {opp.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">{t}</span>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-400">
                Klik untuk lihat detail
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Modal Posting Baru (Alumni Only) */}
      {isPosting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsPosting(false)} />
          <form
            onSubmit={handleAddJob}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Posting Lowongan Baru</h2>
              <button type="button" onClick={() => setIsPosting(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Role / Jabatan</label>
                <input
                  required
                  placeholder="e.g. Backend Engineer Intern"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-pink-300 focus:outline-none"
                  value={newJob.title}
                  onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Perusahaan</label>
                  <input
                    required
                    placeholder="e.g. Tokopedia"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-pink-300 focus:outline-none"
                    value={newJob.company}
                    onChange={e => setNewJob({ ...newJob, company: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Lokasi</label>
                  <input
                    required
                    placeholder="e.g. Jakarta / Remote"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-pink-300 focus:outline-none"
                    value={newJob.location}
                    onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Tipe</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-pink-300 focus:outline-none bg-white"
                    value={newJob.type}
                    onChange={e => setNewJob({ ...newJob, type: e.target.value })}
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Min. Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-pink-300 focus:outline-none"
                    value={newJob.minSem}
                    onChange={e => setNewJob({ ...newJob, minSem: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Durasi</label>
                <input
                  placeholder="e.g. 3 - 6 Bulan"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-pink-300 focus:outline-none"
                  value={newJob.duration}
                  onChange={e => setNewJob({ ...newJob, duration: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Skills (pisahkan dengan koma)</label>
                <input
                  placeholder="e.g. React, Node.js, SQL"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-pink-300 focus:outline-none"
                  value={newJob.tags}
                  onChange={e => setNewJob({ ...newJob, tags: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Deskripsi / Notes</label>
                <textarea
                  rows="3"
                  placeholder="Ceritakan detail tugas atau kualifikasi..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-pink-300 focus:outline-none resize-none"
                  value={newJob.notes}
                  onChange={e => setNewJob({ ...newJob, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setIsPosting(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-pink-600 text-white text-sm font-bold hover:bg-pink-700 shadow-lg shadow-pink-200"
              >
                Posting Lowongan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Detail Lowongan */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedId(null)}
          />
          <div className="relative w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl border border-gray-100 shadow-2xl p-6 mx-auto overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-gray-900">{selectedOpp.title}</p>
                  {selectedOpp.verified && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                      Verified ✓
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedOpp.company} · {selectedOpp.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Close detail"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
              <InfoCard label="Tipe" value={selectedOpp.type} />
              <InfoCard label="Durasi" value={selectedOpp.duration} />
              <InfoCard label="Min. Semester" value={`Sem ${selectedOpp.minSem}+`} />
            </div>

            <div className="mt-5">
              <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Detail Pekerjaan</p>
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedOpp.notes || 'Belum ada detail deskripsi untuk lowongan ini.'}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Skills / Tags</p>
              <div className="flex flex-wrap gap-2">
                {selectedOpp.tags.map((t) => (
                  <span key={t} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedId(null)
                  setIsGlobalReminderOpen(true)
                  setGlobalReminder({ ...globalReminder, role: selectedOpp.title })
                }}
                className="flex-1 py-3 rounded-xl border border-pink-200 text-pink-700 text-sm font-bold hover:bg-pink-50 transition-all"
              >
                🔔 Ingatkan Role Serupa
              </button>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="flex-1 py-3 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-all shadow-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Notifikasi Global */}
      {isGlobalReminderOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsGlobalReminderOpen(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Aktifkan Notifikasi</h2>
            <p className="text-sm text-gray-500 mb-6">Kami akan mengirimi Anda email jika ada lowongan baru yang sesuai.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Role yang dicari</label>
                <input
                  type="text"
                  placeholder="e.g. Backend Engineer"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-pink-300 focus:outline-none"
                  value={globalReminder.role}
                  onChange={e => setGlobalReminder({ ...globalReminder, role: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email Notifikasi</label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-pink-300 focus:outline-none"
                  value={globalReminder.email}
                  onChange={e => setGlobalReminder({ ...globalReminder, email: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={() => {
                  alert(`Notifikasi diaktifkan untuk role: ${globalReminder.role}`)
                  setIsGlobalReminderOpen(false)
                }}
                className="w-full py-3 rounded-xl bg-pink-600 text-white text-sm font-bold hover:bg-pink-700 shadow-lg shadow-pink-200"
              >
                Simpan Preferensi
              </button>
              <button
                onClick={() => setIsGlobalReminderOpen(false)}
                className="w-full py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-400 hover:bg-gray-50"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className="border border-gray-200 rounded-xl p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  )
}

// 
