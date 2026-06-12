import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Map,
  CalendarDays,
  Briefcase,
  FileText,
  MessageSquare,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  Send,
  Check,
  Sparkles,
  Bot,
  TrendingUp,
  GraduationCap,
  ShieldCheck,
  Star
} from 'lucide-react'

const FEATURE_ITEMS = [
  {
    key: 'academic-mapper',
    title: 'Academic Mapper',
    desc: 'Unggah transkrip nilai Anda untuk memetakan kekuatan kompetensi secara visual, mendeteksi kesenjangan skill, dan mendapatkan rekomendasi karir digital yang presisi.',
    path: '/academic-mapper',
    icon: Map,
    color: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-600',
      iconBg: 'bg-emerald-500/10',
      accent: 'emerald'
    }
  },
  {
    key: 'semester-planner',
    title: 'Semester Planner',
    desc: 'Rancang rencana studi semester Anda secara personal. Dapatkan 3 skenario rencana otomatis yang disesuaikan dengan prasyarat mata kuliah dan target kelulusan Anda.',
    path: '/semester-planner',
    icon: CalendarDays,
    color: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-600',
      iconBg: 'bg-amber-500/10',
      accent: 'amber'
    }
  },
  {
    key: 'opportunity-board',
    title: 'Opportunity Board',
    desc: 'Temukan lowongan magang, beasiswa, dan kompetensi lomba yang telah terverifikasi secara resmi oleh Departemen. Aktifkan pengingat deadline agar tidak terlewat.',
    path: '/opportunity-board',
    icon: Briefcase,
    color: {
      bg: 'bg-pink-50',
      border: 'border-pink-100',
      text: 'text-pink-600',
      iconBg: 'bg-pink-500/10',
      accent: 'pink'
    }
  },
  {
    key: 'cv-reviewer',
    title: 'AI CV Reviewer',
    desc: 'Unggah CV Anda dan dapatkan penilaian skor kelayakan instan serta saran perbaikan kata kunci industri berbasis AI yang disesuaikan untuk target role pilihan Anda.',
    path: '/cv-reviewer',
    icon: FileText,
    color: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-600',
      iconBg: 'bg-blue-500/10',
      accent: 'blue'
    }
  },
  {
    key: 'sks-chatbot',
    title: 'Konversi SKS Agent',
    desc: 'Konsultasi estimasi konversi SKS mata kuliah dari jalur magang industri MSIB maupun prestasi lomba dengan asisten virtual AI cerdas khusus kurikulum TI ITS.',
    path: '/sks-chatbot',
    icon: MessageSquare,
    color: {
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      text: 'text-rose-600',
      iconBg: 'bg-rose-500/10',
      accent: 'rose'
    }
  }
];

export default function LandingPage() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Enforce light theme when visiting the landing page
  useEffect(() => {
    const originalTheme = document.documentElement.getAttribute("data-theme") || "dark";
    document.documentElement.setAttribute("data-theme", "light");
    return () => {
      document.documentElement.setAttribute("data-theme", originalTheme);
    }
  }, [])

  const scrollToSection = (id) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full h-screen overflow-y-auto bg-gradient-to-r from-[rgb(209,243,254)] to-[rgb(243,251,255)] text-[#0f172a] font-sans scroll-smooth relative selection:bg-blue-600/10 selection:text-blue-600">

      {/* Decorative Blur Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-blue-50/70 via-sky-50/30 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-10 w-[600px] h-[600px] bg-sky-100/30 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ──────────────────────────────────────────────────────────
         HEADER NAVIGATION
      ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <img
              src="/Logo Spark DTI.png"
              alt="Logo SPARK DTI"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition-colors">Fitur Utama</button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-blue-600 transition-colors">Testimoni</button>
            <button onClick={() => scrollToSection('showcase')} className="hover:text-blue-600 transition-colors">Demonstrasi</button>
            <a href="https://www.its.ac.id/it/id/departemen-teknologi-informasi/" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">Tentang DTI</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate('/auth')}
              className="px-5 py-2.5 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-bold transition-all active:scale-95"
            >
              Masuk
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-slate-800" /> : <Menu className="w-6 h-6 text-slate-800" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 py-6 px-6 shadow-xl animate-fade-in flex flex-col gap-4">
            <button onClick={() => scrollToSection('features')} className="text-left py-2 text-slate-600 font-semibold hover:text-blue-600">Fitur Utama</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-left py-2 text-slate-600 font-semibold hover:text-blue-600">Testimoni</button>
            <button onClick={() => scrollToSection('showcase')} className="text-left py-2 text-slate-600 font-semibold hover:text-blue-600">Demonstrasi</button>
            <a href="https://dti.its.ac.id" target="_blank" rel="noreferrer" className="text-left py-2 text-slate-600 font-semibold hover:text-blue-600">Tentang DTI</a>
            <hr className="border-slate-100 my-2" />
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/auth')}
                className="flex-1 py-3 text-center border border-blue-600 text-blue-600 font-bold rounded-xl text-sm"
              >
                Masuk
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ──────────────────────────────────────────────────────────
         HERO SECTION
      ────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Text */}
        <div className="lg:col-span-7 text-left space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-extrabold text-blue-600 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            SPARK DTI ITS
          </div>

          <h1 className="text-4xl md:text-[54px] font-extrabold text-[#102452] tracking-tight leading-[1.15]">
            Bingung semester ini ngambil berapa sks?
          </h1>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl font-normal">
            Sistem Perencanaan Akademik dan Rute Karir Departemen Teknologi Informasi ITS. Petakan capaian akademik Anda secara visual, rencanakan kurikulum semester, tinjau CV berbasis AI, serta konversi SKS MSIB & prestasi Anda dalam satu platform terpadu untuk civitas Teknologi Informasi ITS.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1d4ed8] hover:bg-blue-700 font-semibold shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              {/* Menggunakan inline style untuk memaksa warna putih murni */}
              <span style={{ color: '#ffffff' }}>Masuk ke Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: '#ffffff' }} />
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
            >
              Pelajari Fitur
            </button>
          </div>
        </div>

        {/* Right Column (CSS Dashboard Mockup - No images needed!) */}
        <div className="lg:col-span-5 relative w-full flex justify-center">
          {/* Main Mockup Card Container */}
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 relative overflow-hidden backdrop-blur-xl animate-scale-in">
            {/* Window bar */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-50">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider">dashboard.spark-dti.its</span>
              <div className="w-3 h-3" />
            </div>

            {/* Simulated Academic Header Widget */}
            <div className="flex items-center justify-between mb-6 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-sm font-black text-white">
                  NA
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">Nabiel Anwari</h4>
                  <p className="text-[10px] font-semibold text-slate-400">Teknologi Informasi (2023)</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600">
                  <Check className="w-2.5 h-2.5" /> Aktif
                </span>
                <p className="text-[9px] font-bold text-slate-400 mt-1">SKS Terlaksana: 112</p>
              </div>
            </div>

            {/* Skill Visualizer Chart Widget (Tailwind Graph representation) */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                  IPK Kumulatif (Target: Lulus 3.5 Tahun)
                </span>
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">3.82</span>
              </div>

              {/* Graphic Chart bar representation */}
              <div className="h-32 flex items-end justify-between gap-4 px-2 pt-6 border-b border-slate-100">

                {/* Semester 1 (Cukup Tinggi) */}
                <div className="flex-1 flex flex-col justify-end items-center h-full group relative">
                  <span className="text-[9px] font-bold text-blue-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    3.65
                  </span>
                  <div className="w-full bg-blue-100 group-hover:bg-blue-300 transition-colors rounded-t-md h-[75%]" />
                  <span className="text-[9px] font-bold text-slate-400 mt-2 block h-4">Sem 1</span>
                </div>

                {/* Semester 2 (Anjlok Drastis) */}
                <div className="flex-1 flex flex-col justify-end items-center h-full group relative">
                  <span className="text-[9px] font-bold text-blue-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    3.15
                  </span>
                  <div className="w-full bg-blue-100 group-hover:bg-blue-200 transition-colors rounded-t-md h-[38%]" />
                  <span className="text-[9px] font-bold text-slate-400 mt-2 block h-4">Sem 2</span>
                </div>

                {/* Semester 3 (Mulai Bangkit Tipis) */}
                <div className="flex-1 flex flex-col justify-end items-center h-full group relative">
                  <span className="text-[9px] font-bold text-blue-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    3.30
                  </span>
                  <div className="w-full bg-blue-100 group-hover:bg-blue-200 transition-colors rounded-t-md h-[48%]" />
                  <span className="text-[9px] font-bold text-slate-400 mt-2 block h-4">Sem 3</span>
                </div>

                {/* Semester 4 (Melonjak Sangat Tinggi) */}
                <div className="flex-1 flex flex-col justify-end items-center h-full group relative">
                  <span className="text-[9px] font-bold text-blue-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    3.82
                  </span>
                  <div className="w-full bg-blue-100 group-hover:bg-blue-200 transition-colors rounded-t-md h-[92%]" />
                  <span className="text-[9px] font-bold text-slate-400 mt-2 block h-4">Sem 4</span>
                </div>

              </div>
            </div>

            {/* AI Reviewer Recommendation Widget */}
            <div className="bg-slate-50/50 border border-slate-100 p-3.5 rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                Rekomendasi Karir AI
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[9px] font-bold bg-white text-slate-700 px-2.5 py-1 rounded-full border border-slate-100 shadow-sm">
                  Frontend Developer (94%)
                </span>
                <span className="text-[9px] font-bold bg-white text-slate-700 px-2.5 py-1 rounded-full border border-slate-100 shadow-sm">
                  UI/UX Engineer (88%)
                </span>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
         TESTIMONIAL SECTION
      ────────────────────────────────────────────────────────── */}
      <section id="testimonials" className="bg-white border-y border-slate-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left testimonial card */}
          <div className="lg:col-span-6">
            <div className="bg-[#ecfdf5] border border-emerald-100 rounded-[32px] p-8 md:p-12 relative flex flex-col justify-between shadow-sm text-left max-w-xl mx-auto">
              {/* Giant quote mark mark */}
              <span className="absolute right-8 top-6 text-emerald-200/80 font-serif text-[120px] select-none pointer-events-none leading-none">
                “
              </span>

              <div className="space-y-6">
                <p className="text-slate-800 text-base md:text-lg font-semibold leading-relaxed relative z-10">
                  "SPARK DTI sangat memudahkan saya dalam memetakan kurikulum kelulusan dan memetakan konversi SKS MSIB. Ditambah lagi, AI CV Reviewer-nya sangat akurat dalam memberikan rekomendasi kata kunci industri sehingga saya berhasil lolos sebagai Software Engineer Intern."
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-extrabold text-sm border border-white shadow-md">
                    AF
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-slate-900">Anna Franklin</h5>
                    <p className="text-xs text-slate-500 font-semibold">Alumni Teknologi Informasi ITS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right text info */}
          <div className="lg:col-span-6 text-left space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Dipercaya oleh ratusan mahasiswa Teknologi Informasi ITS.
            </h2>
            <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed">
              SPARK DTI hadir sebagai wadah inovasi digital di dalam lingkungan departemen Teknologi Informasi ITS. Kami menyatukan instrumen akademik dan kecerdasan buatan untuk mengeliminasi hambatan konversi studi serta mendorong karir teknologi mahasiswa secara maksimal.
            </p>
            <div className="pt-2">
              <button
                onClick={() => scrollToSection('features')}
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 group"
              >
                Pelajari kemudahan fitur kami
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
         FEATURES GRID SECTION (Everything You Need. Built In)
      ────────────────────────────────────────────────────────── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
        {/* Header Title */}
        <div className="space-y-4 max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-[40px] font-black text-slate-900 tracking-tight">
            Semua yang Anda Butuhkan. Terintegrasi.
          </h2>
          <p className="text-slate-500 text-sm md:text-base font-semibold leading-relaxed">
            Kelola perkembangan nilai transkrip, rencana studi, beasiswa karir, hingga asisten chatbot akademik dalam satu tempat tanpa kendala.
          </p>
        </div>

        {/* Feature Cards Grid (3 Columns + 2 Columns Layout) */}
        <div className="space-y-6">
          {/* Row 1 (3 items) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURE_ITEMS.slice(0, 3).map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.key}
                  className="bg-white border border-slate-100 shadow-sm rounded-3xl p-8 hover:shadow-md hover:-translate-y-1 transition-all text-left flex flex-col justify-between h-[300px] group cursor-pointer"
                  onClick={() => navigate(f.path)}
                >
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-2xl ${f.color.iconBg} flex items-center justify-center border ${f.color.border} transition-transform group-hover:scale-105`}>
                      <Icon className={`w-6 h-6 ${f.color.text}`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                        {f.title}
                      </h4>
                      <p className="text-slate-500 text-xs font-semibold leading-relaxed mt-2">
                        {f.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-50 mt-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-slate-600 transition-colors">
                      Pelajari Fitur
                    </span>
                    <span className={`w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-xs font-black transition-all group-hover:bg-blue-600 group-hover:text-white`}>
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Row 2 (2 items) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {FEATURE_ITEMS.slice(3, 5).map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.key}
                  className="bg-white border border-slate-100 shadow-sm rounded-3xl p-8 hover:shadow-md hover:-translate-y-1 transition-all text-left flex flex-col justify-between h-[300px] group cursor-pointer"
                  onClick={() => navigate(f.path)}
                >
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-2xl ${f.color.iconBg} flex items-center justify-center border ${f.color.border} transition-transform group-hover:scale-105`}>
                      <Icon className={`w-6 h-6 ${f.color.text}`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                        {f.title}
                      </h4>
                      <p className="text-slate-500 text-xs font-semibold leading-relaxed mt-2">
                        {f.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-50 mt-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-slate-600 transition-colors">
                      Pelajari Fitur
                    </span>
                    <span className={`w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-xs font-black transition-all group-hover:bg-blue-600 group-hover:text-white`}>
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
         SHOWCASE SECTION (Make Better Business Decisions With Paidin)
      ────────────────────────────────────────────────────────── */}
      <section id="showcase" className="max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Text Info */}
        <div className="lg:col-span-6 text-left space-y-6">
          <h2 className="text-3xl md:text-[40px] font-black text-slate-900 tracking-tight leading-tight">
            Ambil keputusan akademik terbaik bersama SPARK DTI.
          </h2>
          <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed">
            Dapatkan transparansi data konversi SKS, pelacakan mata kuliah prasyarat, serta pencarian beasiswa dalam hitungan detik. AI Chatbot kami siap membimbing Anda mencocokkan silabus departemen dengan profil magang industri Anda.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/auth')}
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 group"
            >
              Mulai Konsultasi SKS Sekarang
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column (Chatbot Simulator Mockup) */}
        <div className="lg:col-span-6 relative w-full flex justify-center">
          {/* Circular shape behind */}
          <div className="w-[340px] h-[340px] bg-blue-600/10 rounded-full blur-3xl absolute top-10 left-10 pointer-events-none -z-10" />

          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl p-5 relative overflow-hidden backdrop-blur-xl">
            {/* Header chat mockup */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white relative">
                  <Bot className="w-4 h-4" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">SPARK Chatbot Agent</h4>
                  <p className="text-[9px] font-semibold text-slate-400">Asisten Konversi Akademik</p>
                </div>
              </div>
              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">AI Active</span>
            </div>

            {/* Conversational bubble simulator */}
            <div className="space-y-4 mb-4 min-h-[190px] text-xs">
              {/* 1. Pesan Andre Pertama: Digeser ke Kanan */}
              <div className="flex flex-col items-end gap-1">
                <span className="text-[9px] font-bold text-slate-400 mr-1">Andre (Mahasiswa)</span>
                <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tr-none p-3 max-w-[85%] text-left font-medium">
                  Apakah program Magang MSIB Software Engineer mandiri saya bisa dikonversi ke SKS Pilihan dan Kerja Praktik?
                </div>
              </div>

              {/* 2. Pesan SPARK Agent AI: Digeser ke Kiri & Paksa Teks Warna Putih */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-[9px] font-bold text-blue-600 ml-1">SPARK Agent AI</span>
                <div
                  className="bg-blue-600 rounded-2xl rounded-tl-none p-3 max-w-[85%] text-left font-medium shadow-md shadow-blue-500/10"
                  style={{ color: '#ffffff' }}
                >
                  Tentu, Andre! Untuk MSIB Software Engineer, Anda berpeluang mengonversi maksimal 20 SKS, termasuk matakuliah Kerja Praktik (3 SKS), Pemrograman Web Lanjut (3 SKS), dan Keamanan Informasi (3 SKS) sesuai kurikulum departemen.
                </div>
              </div>

              {/* 3. Pesan Andre Kedua: Digeser ke Kanan */}
              <div className="flex flex-col items-end gap-1">
                <span className="text-[9px] font-bold text-slate-400 mr-1">Andre (Mahasiswa)</span>
                <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tr-none p-2 max-w-[85%] text-left font-medium">
                  Luar biasa, sangat jelas! Terima kasih 👍
                </div>
              </div>
            </div>

            {/* Simulated chat input bar */}
            <div className="flex items-center gap-2 border-t border-slate-50 pt-3">
              <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2 text-left text-[10px] text-slate-400 font-semibold">
                Tulis pertanyaan tentang konversi SKS...
              </div>
              <button
                onClick={() => navigate('/auth')}
                className="bg-blue-600 rounded-xl p-2.5 hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm"
                aria-label="Send message"
              >
                {/* Menggunakan ikon Send dari Lucide dengan inline style warna putih */}
                <Send className="w-3.5 h-3.5" style={{ color: '#ffffff' }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
         FOOTER
      ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-semibold">
          <div className="flex items-center gap-3">
            <img
              src="/Logo Spark DTI.png"
              alt="Logo SPARK DTI Light"
              className="h-8 w-auto filter brightness-0 invert opacity-60"
            />
            <span className="text-slate-500">|</span>
            <span>© 2026 SPARK DTI Teknologi Informasi ITS.</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Fitur</button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-white transition-colors">Testimoni</button>
            <a href="https://portal.its.ac.id/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Portal ITS</a>
            <button onClick={() => navigate('/auth')} className="text-blue-400 hover:text-blue-300">Dashboard</button>
          </div>
        </div>
      </footer>

    </div>
  )
}