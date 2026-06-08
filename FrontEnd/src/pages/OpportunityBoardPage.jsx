import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { checkIsAlumniOrAdmin } from "../lib/utils"; // Menggunakan fungsi utilitas baru berbasis role
import {
  Briefcase,
  MapPin,
  Clock,
  GraduationCap,
  Bell,
  Search,
  Server,
  Laptop,
  Cloud,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function OpportunityBoardPage() {
  const { user, token } = useAuthStore();

  // Sinkronisasi hak akses tombol berdasarkan kolom role dari database Supabase
  const isAlumni = checkIsAlumniOrAdmin(user?.role);

  // State Manajemen Data Dinamis dari Backend
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [toast, setToast] = useState(null);
  const [selectedTag, setSelectedTag] = useState("Semua");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  // State Form Lowongan Baru
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "Internship",
    duration: "",
    minSem: 1,
    tags: "",
    notes: "",
    apply_url: "",
  });

  const [isGlobalReminderOpen, setIsGlobalReminderOpen] = useState(false);
  const [globalReminder, setGlobalReminder] = useState({ role: "", email: "" });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const selectedOpp = selectedId
    ? opportunities.find((o) => o.job_id === selectedId)
    : null;

  // 1. FETCH DATA LOWONGAN DARI BACKEND
  async function fetchOpportunities() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`${API_URL}/opportunities`);
      const result = await response.json();

      if (response.ok) {
        setOpportunities(result.data || []);
      } else {
        setErrorMsg(result.message || "Gagal membuat lowongan.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMsg("Gagal terhubung ke server Express.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOpportunities();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 2. LOGIKA UTAMA POSTING LOWONGAN KE BACKEND
  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Sesi Anda habis, silakan login kembali.");
      return;
    }

    try {
      const processedTags = newJob.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const response = await fetch(`${API_URL}/opportunities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newJob.title,
          company: newJob.company,
          location: newJob.location,
          type: newJob.type,
          duration: newJob.duration,
          min_sem: newJob.minSem,
          tags: processedTags,
          notes: newJob.notes,
          apply_url: newJob.apply_url,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setToast({
          message: "Lowongan baru berhasil diposting!",
          type: "success",
        });
        setIsPosting(false);
        setNewJob({
          title: "",
          company: "",
          location: "",
          type: "Internship",
          duration: "",
          minSem: 1,
          tags: "",
          notes: "",
          apply_url: "",
        });
        fetchOpportunities();
      } else {
        alert(result.message || "Gagal memposting lowongan.");
      }
    } catch (error) {
      console.error("Post job error:", error);
      alert("Terjadi kesalahan jaringan saat memposting.");
    }
  };

  // ── LOGIKA FILTER & SEARCH YANG SUDAH DISERDEHANAKAN ──────────────────
  const filtered = opportunities.filter((opp) => {
    // 1. Pencarian Kata Kunci Teks (Judul & Perusahaan)
    const matchesSearch =
      opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.company.toLowerCase().includes(search.toLowerCase());

    const oppTags = (opp.tags || []).map((t) => t.toLowerCase());
    const titleLower = (opp.title || "").toLowerCase();

    // 2. Logika Klaster Tombol Baru
    let matchesTag = false;

    if (selectedTag === "Semua") {
      matchesTag = true;
    } else if (selectedTag === "Web Developer") {
      // Menggabungkan rumpun Frontend & Backend
      matchesTag =
        titleLower.includes("web") ||
        titleLower.includes("backend") ||
        titleLower.includes("frontend") ||
        titleLower.includes("developer") ||
        oppTags.includes("backend") ||
        oppTags.includes("frontend") ||
        oppTags.includes("nextjs") ||
        oppTags.includes("react") ||
        oppTags.includes("api");
    } else if (selectedTag === "Data") {
      // Menggabungkan rumpun Database, Data Engineer, Science, SQL, dsb.
      matchesTag =
        titleLower.includes("data") ||
        titleLower.includes("database") ||
        oppTags.includes("database") ||
        oppTags.includes("dbms") ||
        oppTags.includes("big data") ||
        oppTags.includes("sql") ||
        oppTags.includes("postgresql");
    } else if (selectedTag === "Cloud & DevOps") {
      // Menggabungkan DevOps, AWS, SysAdmin, Infrastructure
      matchesTag =
        titleLower.includes("devops") ||
        titleLower.includes("cloud") ||
        titleLower.includes("infrastructure") ||
        titleLower.includes("network") ||
        oppTags.includes("aws") ||
        oppTags.includes("docker") ||
        oppTags.includes("devops") ||
        oppTags.includes("cloud");
    } else if (selectedTag === "IT Support") {
      matchesTag =
        titleLower.includes("support") ||
        titleLower.includes("helpdesk") ||
        titleLower.includes("onsite it") ||
        titleLower.includes("hardware") ||
        oppTags.includes("it support") ||
        oppTags.includes("troubleshooting");
    } else {
      matchesTag = oppTags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
    }

    return matchesSearch && matchesTag;
  });

  // ── FILTER VISUAL IKON KARTU ───────────────────────────────────────────
  const getCategoryIcon = (tags, title) => {
    const allTags = (tags || []).map((t) => t.toLowerCase());
    const titleLower = (title || "").toLowerCase();

    // 1. Data (Database & Analisis)
    if (titleLower.includes("data") || titleLower.includes("database") || allTags.includes("database") || allTags.includes("sql") || allTags.includes("big data")) {
      return (
        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
        </svg>
      );
    }
    // 2. Web Developer (Frontend / Backend)
    if (allTags.includes("backend") || allTags.includes("frontend") || titleLower.includes("backend") || titleLower.includes("frontend") || titleLower.includes("web") || titleLower.includes("developer")) {
      return <Server className="w-5 h-5 text-indigo-400" />;
    }
    // 3. Cloud & DevOps
    if (allTags.includes("aws") || allTags.includes("docker") || allTags.includes("cloud") || allTags.includes("devops") || titleLower.includes("devops") || titleLower.includes("cloud") || titleLower.includes("infrastructure")) {
      return <Cloud className="w-5 h-5 text-sky-400" />;
    }
    // 4. IT Support
    if (allTags.includes("it support") || titleLower.includes("support") || titleLower.includes("helpdesk")) {
      return <Laptop className="w-5 h-5 text-blue-400" />;
    }

    return <Briefcase className="w-5 h-5 text-pink-400" />;
  };

  // ── FILTER WARNA BACKGROUND KARTU ────────────────────────────────────────
  const getCategoryBg = (tags, title) => {
    const allTags = (tags || []).map((t) => t.toLowerCase());
    const titleLower = (title || "").toLowerCase();

    if (titleLower.includes("data") || titleLower.includes("database") || allTags.includes("database") || allTags.includes("sql") || allTags.includes("big data")) {
      return "bg-emerald-950/40 border border-emerald-500/20";
    }
    if (allTags.includes("backend") || allTags.includes("frontend") || titleLower.includes("backend") || titleLower.includes("frontend") || titleLower.includes("web") || titleLower.includes("developer")) {
      return "bg-indigo-950/40 border border-indigo-500/20";
    }
    if (allTags.includes("aws") || allTags.includes("docker") || allTags.includes("cloud") || allTags.includes("devops") || titleLower.includes("devops") || titleLower.includes("cloud") || titleLower.includes("infrastructure")) {
      return "bg-sky-950/40 border border-sky-500/20";
    }
    if (allTags.includes("it support") || titleLower.includes("support") || titleLower.includes("helpdesk")) {
      return "bg-blue-950/40 border border-blue-500/20";
    }

    return "bg-pink-950/40 border border-pink-500/20";
  };

  const handleSaveNotification = (e) => {
    e.preventDefault();
    if (!globalReminder.email) return;
    setToast({
      message: `Notifikasi aktif untuk role: ${globalReminder.role || "Semua"}`,
      type: "success",
    });
    setIsGlobalReminderOpen(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-scale-in">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-pink-950 text-white p-8 md:p-10 shadow-2xl border border-white/5">
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
                ? "Bagikan informasi lowongan terverifikasi untuk membantu adik-adik tingkat Anda memulai karir profesional mereka."
                : "Temukan program magang dan lowongan pekerjaan terbaik dari alumni DTI untuk masa depan karir Anda."}
            </p>
          </div>

          {isAlumni && (
            <button
              onClick={() => setIsPosting(true)}
              className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-pink-500/25 hover:scale-[1.02] active:scale-95 transition-all flex-shrink-0"
            >
              <span className="text-lg font-bold">+</span> Posting Lowongan
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-2xl">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari posisi, perusahaan atau kota..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/50 border border-white/5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all font-semibold"
            />
          </div>

          <button
            onClick={() => setIsGlobalReminderOpen(true)}
            className="px-5 py-2.5 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 rounded-xl text-sm font-bold border border-pink-500/20 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Bell className="w-4 h-4" /> Ingatkan Lowongan Baru
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 py-1">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mr-2">
            Top Kategori:
          </span>
          {/* Ganti baris mapping array lama dengan struktur ringkas ini */}
          {["Semua", "Web Developer", "Data", "Cloud & DevOps", "IT Support"].map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isActive
                    ? "bg-pink-600 text-white shadow-lg shadow-pink-500/20 border-transparent"
                    : "bg-slate-900/40 hover:bg-slate-900/80 text-slate-300 border-white/5"
                  }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="bg-red-950/40 backdrop-blur-md border border-red-500/20 p-4 rounded-xl flex items-start gap-3 max-w-md animate-scale-in">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs font-bold text-red-200">{errorMsg}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-white/5 shadow-2xl">
          <Loader2 className="w-10 h-10 text-pink-400 animate-spin mb-3" />
          <p className="text-xs font-bold text-slate-400">
            Memuat Lowongan dari Database...
          </p>
        </div>
      ) : (
        /* Opportunities Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((opp) => (
            <div
              key={opp.job_id}
              onClick={() => setSelectedId(opp.job_id)}
              className="group text-left bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/5 p-6 hover:border-pink-500/30 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-pink-500/5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${getCategoryBg(opp.tags, opp.title)} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  >
                    {getCategoryIcon(opp.tags, opp.title)}
                  </div>
                  {opp.verified && (
                    <span className="text-[9px] px-2.5 py-1 rounded-full font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Verified
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-slate-100 group-hover:text-pink-400 transition-colors duration-200 line-clamp-1">
                  {opp.title}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />{" "}
                  {opp.company}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-5 text-[11px] font-semibold text-slate-300">
                  <div className="flex items-center gap-1.5 bg-slate-950/40 rounded-xl p-2 border border-white/5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />{" "}
                    <span className="truncate">{opp.location || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-950/40 rounded-xl p-2 border border-white/5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />{" "}
                    <span className="truncate">{opp.duration || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-950/40 rounded-xl p-2 border border-white/5 col-span-2">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500" />{" "}
                    <span>Minimal Semester {opp.min_sem || 1}+</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-wrap gap-1 max-w-[70%]">
                  {opp.tags &&
                    opp.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-1 rounded-lg bg-slate-950 text-slate-400 font-bold border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  {opp.tags && opp.tags.length > 2 && (
                    <span className="text-[10px] px-2 py-1 rounded-lg bg-pink-500/10 text-pink-400 font-extrabold border border-pink-500/20">
                      +{opp.tags.length - 2}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-pink-400 group-hover:translate-x-1.5 transition-transform duration-200 flex items-center gap-0.5">
                  Detail →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/5 p-12 text-center max-w-md mx-auto space-y-3 shadow-2xl">
          <Search className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-extrabold text-slate-100">
            Tidak ada lowongan ditemukan
          </h3>
          <p className="text-xs font-semibold text-slate-400">
            Coba ubah kata kunci pencarian atau kategori filter Anda.
          </p>
        </div>
      )}

      {/* Modal Posting Baru (Alumni & Admin Only) */}
      {isPosting && (
        <div className="fixed inset-0 z-[200] overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsPosting(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <form
              onSubmit={handleAddJob}
              className="relative w-full max-w-lg bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 overflow-y-auto max-h-[90vh] flex flex-col justify-between overflow-hidden text-slate-100 animate-scale-in"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-100">
                    Posting Lowongan Baru
                  </h2>
                  <p className="text-[11px] font-bold text-pink-400 uppercase tracking-wider mt-0.5">
                    Kontribusi Akses Internal
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPosting(false)}
                  className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-slate-400 hover:text-slate-200 border border-white/5 hover:bg-slate-900 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 mb-1.5 uppercase tracking-widest">
                    Role / Jabatan
                  </label>
                  <input
                    required
                    placeholder="e.g. Backend Engineer Intern"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 text-sm text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:outline-none transition-all font-semibold"
                    value={newJob.title}
                    onChange={(e) =>
                      setNewJob({ ...newJob, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 mb-1.5 uppercase tracking-widest">
                      Perusahaan
                    </label>
                    <input
                      required
                      placeholder="e.g. Tokopedia"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 text-sm text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:outline-none transition-all font-semibold"
                      value={newJob.company}
                      onChange={(e) =>
                        setNewJob({ ...newJob, company: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 mb-1.5 uppercase tracking-widest">
                      Lokasi
                    </label>
                    <input
                      required
                      placeholder="e.g. Jakarta / Remote"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 text-sm text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:outline-none transition-all font-semibold"
                      value={newJob.location}
                      onChange={(e) =>
                        setNewJob({ ...newJob, location: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 mb-1.5 uppercase tracking-widest">
                      Tipe
                    </label>
                    <select
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 text-sm text-slate-100 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:outline-none transition-all font-semibold cursor-pointer"
                      value={newJob.type}
                      onChange={(e) =>
                        setNewJob({ ...newJob, type: e.target.value })
                      }
                    >
                      <option value="Internship" className="bg-slate-900">Internship</option>
                      <option value="Full-time" className="bg-slate-900">Full-time</option>
                      <option value="Contract" className="bg-slate-900">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 mb-1.5 uppercase tracking-widest">
                      Min. Semester
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 text-sm text-slate-100 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:outline-none transition-all font-semibold"
                      value={newJob.minSem}
                      onChange={(e) =>
                        setNewJob({
                          ...newJob,
                          minSem: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 mb-1.5 uppercase tracking-widest">
                    Durasi Pekerjaan
                  </label>
                  <input
                    placeholder="e.g. 3 - 6 Bulan"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 text-sm text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:outline-none transition-all font-semibold"
                    value={newJob.duration}
                    onChange={(e) =>
                      setNewJob({ ...newJob, duration: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 mb-1.5 uppercase tracking-widest">
                    Link Pendaftaran (Apply URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://careers.tokopedia.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 text-sm text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:outline-none transition-all font-semibold"
                    value={newJob.apply_url}
                    onChange={(e) =>
                      setNewJob({ ...newJob, apply_url: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 mb-1.5 uppercase tracking-widest">
                    Skills / Tags (pisahkan dengan koma)
                  </label>
                  <input
                    placeholder="e.g. React, Node.js, SQL"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 text-sm text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:outline-none transition-all font-semibold"
                    value={newJob.tags}
                    onChange={(e) =>
                      setNewJob({ ...newJob, tags: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 mb-1.5 uppercase tracking-widest">
                    Deskripsi / Catatan Tambahan
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Ceritakan kualifikasi atau tugas utama pekerjaan..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 text-sm text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:outline-none transition-all font-semibold resize-none"
                    value={newJob.notes}
                    onChange={(e) =>
                      setNewJob({ ...newJob, notes: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPosting(false)}
                  className="flex-1 py-3.5 rounded-xl border border-white/5 text-sm font-bold text-slate-400 bg-slate-950 hover:bg-slate-900 hover:text-slate-200 transition-colors"
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
        </div>
      )}

      {/* Modal Detail Lowongan */}
      {selectedOpp && (
        <div className="fixed inset-0 z-[200] overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setSelectedId(null)}
          />
          <div className="flex min-h-full items-end sm:items-center justify-center p-4">
            <div className="relative w-full sm:max-w-xl bg-slate-900/95 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl p-8 mx-auto my-auto overflow-hidden animate-scale-in">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl ${getCategoryBg(selectedOpp.tags, selectedOpp.title)} flex items-center justify-center shadow-md`}
                  >
                    {getCategoryIcon(selectedOpp.tags, selectedOpp.title)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black text-slate-100 tracking-tight">
                        {selectedOpp.title}
                      </h2>
                      {selectedOpp.verified && (
                        <span className="text-[9px] px-2.5 py-1 rounded-full font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-widest shadow-sm flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-pink-400 mt-1 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-pink-400" />{" "}
                      {selectedOpp.company} ·{" "}
                      <MapPin className="w-4 h-4 text-pink-400" />{" "}
                      {selectedOpp.location}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-slate-400 hover:text-slate-200 border border-white/5 hover:bg-slate-900 transition-colors flex-shrink-0"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-slate-950/50 border border-white/5 rounded-xl p-3.5 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Tipe
                  </p>
                  <p className="text-sm font-extrabold text-slate-200 mt-1">
                    {selectedOpp.type}
                  </p>
                </div>
                <div className="bg-slate-950/50 border border-white/5 rounded-xl p-3.5 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Durasi
                  </p>
                  <p className="text-sm font-extrabold text-slate-200 mt-1">
                    {selectedOpp.duration || "N/A"}
                  </p>
                </div>
                <div className="bg-slate-950/50 border border-white/5 rounded-xl p-3.5 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Kualifikasi
                  </p>
                  <p className="text-sm font-extrabold text-slate-200 mt-1">
                    Sem {selectedOpp.min_sem || 1}+
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Detail Pekerjaan
                </h4>
                <div className="rounded-2xl border border-white/5 bg-slate-950/30 p-5 shadow-inner">
                  <p className="text-sm font-semibold text-slate-300 leading-relaxed whitespace-pre-line">
                    {selectedOpp.notes || "Belum ada detail deskripsi."}
                  </p>
                </div>
              </div>

              {selectedOpp.apply_url && (
                <div className="mt-4">
                  <a
                    href={selectedOpp.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full justify-center items-center py-2 px-4 rounded-xl text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold hover:bg-indigo-500/20 transition-all shadow-sm"
                  >
                    🌐 Buka Link Pendaftaran Resmi
                  </a>
                </div>
              )}

              <div className="mt-6 space-y-2">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Skills / Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedOpp.tags &&
                    selectedOpp.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-3.5 py-1.5 rounded-xl bg-pink-500/10 text-pink-400 font-bold border border-pink-500/20"
                      >
                        {t}
                      </span>
                    ))}
                </div>
              </div>


            </div>
          </div>
        </div>
      )}

      {/* Global Reminder Modal */}
      {isGlobalReminderOpen && (
        <div className="fixed inset-0 z-[200] overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setIsGlobalReminderOpen(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <form
              onSubmit={handleSaveNotification}
              className="relative w-full max-w-sm bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 text-slate-100 animate-scale-in"
            >
              <h3 className="text-lg font-extrabold mb-2">Set Notifikasi Lowongan</h3>
              <p className="text-xs text-slate-400 mb-4 font-semibold">
                Dapatkan email berkala ketika ada alumni yang memposting lowongan baru.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Role Fokus</label>
                  <input
                    type="text"
                    placeholder="e.g. Backend, DevOps (Opsional)"
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500/20 font-semibold"
                    value={globalReminder.role}
                    onChange={(e) => setGlobalReminder({ ...globalReminder, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Email Penerima</label>
                  <input
                    type="email"
                    required
                    placeholder="name@student.its.ac.id"
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500/20 font-semibold"
                    value={globalReminder.email}
                    onChange={(e) => setGlobalReminder({ ...globalReminder, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsGlobalReminderOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-white/5 text-xs font-bold text-slate-400 hover:bg-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-500/20"
                >
                  Aktifkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[300] bg-slate-950/90 border border-emerald-500/30 text-emerald-400 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-scale-in">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          {toast.message}
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.97); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}