
// Opportunity Board Page
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import { useAuthStore, useReminderStore } from '../store/authStore'
import { checkIsAlumni } from '../lib/utils'
import {
  Briefcase,
  MapPin,
  Clock,
  GraduationCap,
  Bell,
  Search,
  X,
  Server,
  Laptop,
  Cloud
} from 'lucide-react'

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
  const isAlumni = checkIsAlumni(user?.nrp)

  const [toast, setToast] = useState(null)
  const [selectedTag, setSelectedTag] = useState('Semua')

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

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

  const getCompanyGradient = (company) => {
    if (!company) return 'from-pink-500 to-violet-600 text-white'
    const first = company.charAt(0).toUpperCase()
    if ('A' <= first && first <= 'F') return 'from-blue-500 to-indigo-600 text-white'
    if ('G' <= first && first <= 'L') return 'from-emerald-400 to-teal-600 text-white'
    if ('M' <= first && first <= 'R') return 'from-orange-400 to-rose-600 text-white'
    return 'from-pink-500 to-violet-600 text-white'
  }

  const getCategoryIcon = (tags, title) => {
    const allTags = (tags || []).map(t => t.toLowerCase())
    const titleLower = (title || '').toLowerCase()

    if (allTags.includes('backend') || titleLower.includes('backend') || allTags.includes('api')) {
      return <Server className="w-5 h-5 text-indigo-600" />
    }
    if (allTags.includes('it support') || allTags.includes('troubleshooting') || titleLower.includes('support') || titleLower.includes('onsite it')) {
      return <Laptop className="w-5 h-5 text-blue-600" />
    }
    if (allTags.includes('aws') || allTags.includes('docker') || allTags.includes('cloud') || allTags.includes('devops')) {
      return <Cloud className="w-5 h-5 text-sky-600" />
    }
    return <Briefcase className="w-5 h-5 text-pink-600" />
  }

  const getCategoryBg = (tags, title) => {
    const allTags = (tags || []).map(t => t.toLowerCase())
    const titleLower = (title || '').toLowerCase()

    if (allTags.includes('backend') || titleLower.includes('backend') || allTags.includes('api')) {
      return 'bg-indigo-50 border border-indigo-100/60'
    }
    if (allTags.includes('it support') || allTags.includes('troubleshooting') || titleLower.includes('support') || titleLower.includes('onsite it')) {
      return 'bg-blue-50 border border-blue-100/60'
    }
    if (allTags.includes('aws') || allTags.includes('docker') || allTags.includes('cloud') || allTags.includes('devops')) {
      return 'bg-sky-50 border border-sky-100/60'
    }
    return 'bg-pink-50 border border-pink-100/60'
  }

  const filtered = opportunities.filter((o) => {
    const matchesSearch =
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.company.toLowerCase().includes(search.toLowerCase())
    const matchesTag =
      selectedTag === 'Semua' ||
      o.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
    return matchesSearch && matchesTag
  })

  const handleAddJob = (e) => {
    e.preventDefault()
    const job = {
      ...newJob,
      id: Date.now(),
      tags: newJob.tags.split(',').map(t => t.trim()).filter(Boolean),
      verified: true
    }
    setOpportunities([job, ...opportunities])
    setIsPosting(false)
    setNewJob({ title: '', company: '', location: '', type: 'Internship', duration: '', minSem: 1, tags: '', notes: '' })
  }

  const handleSaveNotification = (e) => {
    e.preventDefault()
    if (!globalReminder.email) return
    setToast({
      message: `Notifikasi aktif untuk role: ${globalReminder.role || 'Semua'}`,
      type: 'success'
    })
    setIsGlobalReminderOpen(false)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Premium Hero Banner with Glowing Mesh Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-pink-950 text-white p-8 md:p-10 shadow-2xl border border-white/5">
        {/* Animated glowing mesh gradients */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-pink-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute -bottom-24 -left-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[12000ms]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold bg-white/10 backdrop-blur-md text-pink-200 border border-white/10 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
              Portal Karir DTI
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-indigo-100">
              Opportunity Board
            </h1>
            <p className="text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
              {isAlumni
                ? 'Bagikan informasi lowongan terverifikasi untuk membantu adik-adik tingkat Anda memulai karir profesional mereka.'
                : 'Temukan program magang dan lowongan pekerjaan terbaik dari alumni DTI untuk masa depan karir Anda.'}
            </p>
          </div>

          {isAlumni && (
            <button
              onClick={() => setIsPosting(true)}
              className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 hover:scale-[1.02] active:scale-95 transition-all flex-shrink-0"
            >
              <span className="text-lg font-bold">+</span> Posting Lowongan
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          {/* Custom Search Input */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari posisi, perusahaan atau kota..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all font-medium placeholder-gray-400"
            />
          </div>

          {/* Quick Notification Button */}
          <button
            onClick={() => setIsGlobalReminderOpen(true)}
            className="px-5 py-2.5 bg-pink-50 text-pink-700 hover:bg-pink-100/80 rounded-xl text-sm font-bold border border-pink-100/50 hover:border-pink-200 transition-all flex items-center justify-center gap-2"
          >
            <Bell className="w-4 h-4 text-pink-600" /> Ingatkan Lowongan Baru
          </button>
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex flex-wrap items-center gap-2 py-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Top Kategori:</span>
          {['Semua', 'Backend', 'Frontend', 'DevOps', 'AWS', 'Database', 'IT Support'].map((tag) => {
            const isActive = selectedTag === tag
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isActive
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-500/20'
                  : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200/80 hover:border-gray-300'
                  }`}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((opp) => (
          <div
            key={opp.id}
            onClick={() => setSelectedId(opp.id)}
            className="group text-left bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 p-6 hover:border-pink-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-pink-100/40 cursor-pointer transition-all duration-300 relative flex flex-col justify-between"
          >
            <div>
              {/* Header inside card */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${getCategoryBg(opp.tags, opp.title)} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {getCategoryIcon(opp.tags, opp.title)}
                </div>

                {opp.verified && (
                  <span className="text-[9px] px-2.5 py-1 rounded-full font-bold bg-green-50 text-green-600 border border-green-100/60 uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Verified
                  </span>
                )}
              </div>

              {/* Title & Company */}
              <h3 className="text-base font-extrabold text-gray-900 group-hover:text-pink-600 transition-colors duration-200 line-clamp-1">
                {opp.title}
              </h3>
              <p className="text-xs font-bold text-gray-400 mt-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-gray-400" /> {opp.company}
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-2 mt-5 text-[11px] font-semibold text-gray-500">
                <div className="flex items-center gap-1.5 bg-gray-50/50 rounded-xl p-2 border border-gray-100/50">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" /> <span className="truncate">{opp.location}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50/50 rounded-xl p-2 border border-gray-100/50">
                  <Clock className="w-3.5 h-3.5 text-gray-400" /> <span className="truncate">{opp.duration}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50/50 rounded-xl p-2 border border-gray-100/50 col-span-2">
                  <GraduationCap className="w-3.5 h-3.5 text-gray-400" /> <span>Minimal Semester {opp.minSem}+</span>
                </div>
              </div>
            </div>

            {/* Tags and CTA */}
            <div className="mt-6 pt-4 border-t border-gray-100/60 flex items-center justify-between">
              <div className="flex flex-wrap gap-1 max-w-[70%]">
                {opp.tags.slice(0, 2).map((t) => (
                  <span key={t} className="text-[10px] px-2 py-1 rounded-lg bg-gray-50 text-gray-500 font-bold border border-gray-100/80">
                    {t}
                  </span>
                ))}
                {opp.tags.length > 2 && (
                  <span className="text-[10px] px-2 py-1 rounded-lg bg-pink-50 text-pink-600 font-extrabold border border-pink-100/40">
                    +{opp.tags.length - 2}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-pink-600 group-hover:translate-x-1.5 transition-transform duration-200 flex items-center gap-0.5">
                Detail →
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto space-y-3">
          <Search className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-extrabold text-gray-900">Tidak ada lowongan ditemukan</h3>
          <p className="text-xs font-semibold text-gray-400">Coba ubah kata kunci pencarian atau kategori filter Anda.</p>
        </div>
      )}

      {/* Modal Posting Baru (Alumni Only) */}
      {isPosting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300" onClick={() => setIsPosting(false)} />
          <form
            onSubmit={handleAddJob}
            className="relative w-full max-w-lg bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 p-8 overflow-y-auto max-h-[90vh] animate-modal-scale-in flex flex-col justify-between"
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-t-3xl" />

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Posting Lowongan Baru</h2>
                <p className="text-[11px] font-bold text-pink-500 uppercase tracking-wider mt-0.5">Kontribusi Alumni</p>
              </div>
              <button type="button" onClick={() => setIsPosting(false)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 border border-gray-200/50 hover:bg-gray-100 transition-colors">✕</button>
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-extrabold text-gray-600 mb-1.5 uppercase tracking-widest">Role / Jabatan</label>
                <input
                  required
                  placeholder="e.g. Backend Engineer Intern"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-4 focus:ring-pink-100 focus:border-pink-500 focus:outline-none transition-all font-semibold"
                  value={newJob.title}
                  onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-600 mb-1.5 uppercase tracking-widest">Perusahaan</label>
                  <input
                    required
                    placeholder="e.g. Tokopedia"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-4 focus:ring-pink-100 focus:border-pink-500 focus:outline-none transition-all font-semibold"
                    value={newJob.company}
                    onChange={e => setNewJob({ ...newJob, company: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-600 mb-1.5 uppercase tracking-widest">Lokasi</label>
                  <input
                    required
                    placeholder="e.g. Jakarta / Remote"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-4 focus:ring-pink-100 focus:border-pink-500 focus:outline-none transition-all font-semibold"
                    value={newJob.location}
                    onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-600 mb-1.5 uppercase tracking-widest">Tipe</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-4 focus:ring-pink-100 focus:border-pink-500 focus:outline-none transition-all font-semibold bg-white cursor-pointer"
                    value={newJob.type}
                    onChange={e => setNewJob({ ...newJob, type: e.target.value })}
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-600 mb-1.5 uppercase tracking-widest">Min. Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-4 focus:ring-pink-100 focus:border-pink-500 focus:outline-none transition-all font-semibold"
                    value={newJob.minSem}
                    onChange={e => setNewJob({ ...newJob, minSem: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-600 mb-1.5 uppercase tracking-widest">Durasi Pekerjaan</label>
                <input
                  placeholder="e.g. 3 - 6 Bulan"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-4 focus:ring-pink-100 focus:border-pink-500 focus:outline-none transition-all font-semibold"
                  value={newJob.duration}
                  onChange={e => setNewJob({ ...newJob, duration: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-600 mb-1.5 uppercase tracking-widest">Skills / Tags (pisahkan dengan koma)</label>
                <input
                  placeholder="e.g. React, Node.js, SQL"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-4 focus:ring-pink-100 focus:border-pink-500 focus:outline-none transition-all font-semibold"
                  value={newJob.tags}
                  onChange={e => setNewJob({ ...newJob, tags: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-600 mb-1.5 uppercase tracking-widest">Deskripsi / Catatan Tambahan</label>
                <textarea
                  rows="3"
                  placeholder="Ceritakan kualifikasi, tugas utama, atau link pendaftaran..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-4 focus:ring-pink-100 focus:border-pink-500 focus:outline-none transition-all font-semibold resize-none"
                  value={newJob.notes}
                  onChange={e => setNewJob({ ...newJob, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setIsPosting(false)}
                className="flex-1 py-3.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white text-sm font-bold shadow-lg shadow-pink-500/20 hover:scale-[1.01] active:scale-95 transition-all"
              >
                Posting Lowongan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Detail Lowongan */}
      {selectedOpp && (
        // 1. UBAH DI SINI: Gunakan 'fixed inset-0' murni untuk container utama agar menutup layar penuh
        <div className="fixed inset-0 z-[200] overflow-y-auto">

          {/* 2. BACKDROP BLUR: Dibuat terpisah & fixed agar background hitam blur mengunci seluruh layar */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setSelectedId(null)}
          />

          {/* Container Posisi Modal */}
          <div className="flex min-h-full items-end sm:items-center justify-center p-4">
            {/* Ditambahkan class 'overflow-hidden' agar element absolute di dalam tidak bocor/offset keluar dari border rounded */}
            <div className="relative w-full sm:max-w-xl bg-white/95 backdrop-blur-lg rounded-t-3xl sm:rounded-3xl border border-gray-200 shadow-2xl p-8 mx-auto my-auto animate-modal-scale-in overflow-hidden">

              {/* Top decorative gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />

              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${getCategoryBg(selectedOpp.tags, selectedOpp.title)} flex items-center justify-center shadow-md`}>
                    {getCategoryIcon(selectedOpp.tags, selectedOpp.title)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black text-gray-900 tracking-tight">{selectedOpp.title}</h2>
                      {selectedOpp.verified && (
                        <span className="text-[9px] px-2.5 py-1 rounded-full font-bold bg-green-50 text-green-600 border border-green-100/60 uppercase tracking-widest shadow-sm flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-pink-600 mt-1 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-pink-500" /> {selectedOpp.company} · <MapPin className="w-4 h-4 text-pink-500" /> {selectedOpp.location}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 border border-gray-200/50 hover:bg-gray-100 transition-colors flex-shrink-0"
                  aria-label="Close detail"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-3.5 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tipe</p>
                  <p className="text-sm font-extrabold text-gray-800 mt-1">{selectedOpp.type}</p>
                </div>
                <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-3.5 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Durasi</p>
                  <p className="text-sm font-extrabold text-gray-800 mt-1">{selectedOpp.duration}</p>
                </div>
                <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-3.5 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kualifikasi</p>
                  <p className="text-sm font-extrabold text-gray-800 mt-1">Sem {selectedOpp.minSem}+</p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Detail Pekerjaan</h4>
                <div className="rounded-2xl border border-gray-100 bg-gray-50/40 p-5 shadow-inner">
                  <p className="text-sm font-semibold text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedOpp.notes || 'Belum ada detail deskripsi untuk lowongan ini.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Skills / Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedOpp.tags.map((t) => (
                    <span key={t} className="text-xs px-3.5 py-1.5 rounded-xl bg-pink-50/50 text-pink-700 font-bold border border-pink-100/30">
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
                  className="flex-1 py-3.5 rounded-xl border border-pink-200 text-pink-700 text-sm font-bold hover:bg-pink-50 transition-all active:scale-95 animate-pulse-subtle"
                >
                  🔔 Ingatkan Role Serupa
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="flex-1 py-3.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10 active:scale-95"
                >
                  Tutup
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal Notifikasi Global */}
      {isGlobalReminderOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300" onClick={() => setIsGlobalReminderOpen(false)} />
          <form
            onSubmit={handleSaveNotification}
            className="relative w-full max-w-sm bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 p-8 animate-modal-scale-in overflow-hidden"
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />

            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Aktifkan Notifikasi</h2>
              <button type="button" onClick={() => setIsGlobalReminderOpen(false)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 border border-gray-200/50 hover:bg-gray-100 transition-colors flex-shrink-0">✕</button>
            </div>
            <p className="text-xs font-semibold text-gray-400 mt-1 mb-6">Kami akan mengirimi Anda email jika ada lowongan baru yang sesuai.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-gray-600 mb-1.5 uppercase tracking-widest">Role yang dicari</label>
                <input
                  type="text"
                  placeholder="e.g. Backend Engineer"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-4 focus:ring-pink-100 focus:border-pink-500 focus:outline-none transition-all font-semibold"
                  value={globalReminder.role}
                  onChange={e => setGlobalReminder({ ...globalReminder, role: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-gray-600 mb-1.5 uppercase tracking-widest">Email Penerima</label>
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-4 focus:ring-pink-100 focus:border-pink-500 focus:outline-none transition-all font-semibold"
                  value={globalReminder.email}
                  onChange={e => setGlobalReminder({ ...globalReminder, email: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white text-sm font-bold shadow-lg shadow-pink-500/20 active:scale-95 transition-all"
              >
                Simpan Preferensi
              </button>
              <button
                type="button"
                onClick={() => setIsGlobalReminderOpen(false)}
                className="w-full py-3.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[100] animate-toast-slide-in flex items-center gap-3 bg-white/95 backdrop-blur-md border border-pink-100 rounded-2xl shadow-xl px-5 py-4 max-w-sm">
          <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0 border border-pink-200">
            <span className="text-pink-600 text-sm font-bold">✓</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">Sukses</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5 leading-snug">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Custom Styles for Toast and Modal animations */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes pulseBorder {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-toast-slide-in {
          animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-modal-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-pulse-subtle {
          animation: pulseBorder 2.5s ease-in-out infinite;
        }
      `}</style>
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
