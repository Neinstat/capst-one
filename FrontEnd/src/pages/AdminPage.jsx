import { useState, useEffect, useRef, useMemo } from "react";
import { useAuthStore } from "../store/authStore";
import {
  Users, UserPlus, Shield, Trash2, Edit2, Loader2, X,
  FileSpreadsheet, UploadCloud, CheckCircle2, AlertCircle, Eye, Search, Filter,
  HelpCircle
} from "lucide-react";
import * as XLSX from "xlsx";

// Map nilai kolom "Status" dari Excel ke role sistem
function statusToRole(status = "") {
  const s = status.toString().toLowerCase().trim();
  if (s.includes("alumni")) return "alumni";
  if (s.includes("aktif") || s.includes("mahasiswa")) return "mahasiswa";
  return "mahasiswa"; // default
}

export default function AdminPage() {
  const { token } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ── State Pop-up Notification Card ──────────────────────────────
  const [notification, setNotification] = useState(null); 
  // format: { type: "success" | "error" | "confirm", title: "", message: "", action: () => {} }

  const showSuccess = (message, title = "Berhasil") => {
    setNotification({ type: "success", title, message });
  };

  const showError = (message, title = "Gagal") => {
    setNotification({ type: "error", title, message });
  };

  const showConfirm = (message, action, title = "Konfirmasi") => {
    setNotification({ type: "confirm", title, message, action });
  };

  // ── Mode input (manual | excel) ──────────────────────────────────
  const [inputMode, setInputMode] = useState("manual"); // "manual" | "excel"

  // ── State Form Tambah/Edit Manual ────────────────────────────────
  const [formData, setFormData] = useState({ nrp: "", nama: "", role: "mahasiswa" });
  const [isEditing, setIsEditing] = useState(false);

  // ── State Upload Excel ────────────────────────────────────────────
  const fileInputRef = useRef(null);
  const [excelRows, setExcelRows] = useState([]);   // preview baris dari excel
  const [excelFileName, setExcelFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null); // null | "loading" | "done" | "error"
  const [uploadResult, setUploadResult] = useState({ success: 0, failed: 0, errors: [] });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // State Modal Pop-up

  // ── State Filter & Search Kontrol ─────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterAngkatan, setFilterAngkatan] = useState("all");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // ── Fetch semua user ──────────────────────────────────────────────
  async function fetchUsers() {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok) setUsers(result.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []);

  // ── Mendapatkan Daftar Angkatan Unik dari Data User Saat Ini ──────
  const daftarAngkatan = useMemo(() => {
    const angkatanSet = new Set();
    users.forEach((user) => {
      const nrpClean = String(user.nrp || "").trim();
      // Validasi jika berbentuk angka NRP standar (cth: 5027231052) dan panjangnya mencukupi
      if (nrpClean.length >= 6 && !isNaN(nrpClean)) {
        const kodeAngkatan = nrpClean.substring(4, 6); // Ambil digit ke-5 dan 6 (index 4 dan 5)
        angkatanSet.add(kodeAngkatan);
      }
    });
    // Urutkan angkatan dari yang terbaru
    return Array.from(angkatanSet).sort((a, b) => b - a);
  }, [users]);

  // ── Proses Filter & Pencarian Client-side ──────────────────────────
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.nrp.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRole = filterRole === "all" || user.role === filterRole;

      let matchAngkatan = true;
      if (filterAngkatan !== "all") {
        const nrpClean = String(user.nrp || "").trim();
        const kodeAngkatan = nrpClean.length >= 6 ? nrpClean.substring(4, 6) : "";
        matchAngkatan = kodeAngkatan === filterAngkatan;
      }

      return matchSearch && matchRole && matchAngkatan;
    });
  }, [users, searchQuery, filterRole, filterAngkatan]);

  // ── Submit form manual ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing
      ? `${API_URL}/admin/users/${formData.nrp}`
      : `${API_URL}/admin/users`;
    const method = isEditing ? "PUT" : "POST";
    const payload = isEditing ? formData : { ...formData, password: formData.nrp.trim() + "@dti" };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        showSuccess(isEditing ? "Data user berhasil diperbarui!" : `User baru berhasil ditambahkan! Password bawaan: ${formData.nrp.trim()}@dti`);
        setFormData({ nrp: "", nama: "", role: "mahasiswa" });
        setIsEditing(false);
        fetchUsers();
      } else {
        const errorResult = await response.json();
        showError(errorResult.message || "Terjadi kesalahan saat menyimpan data.");
      }
    } catch (error) {
      console.error(error);
      showError("Koneksi internet terputus atau server tidak merespons.");
    }
  };

  // ── Hapus user ────────────────────────────────────────────────────
  const handleDelete = (nrp) => {
    showConfirm(`Apakah Anda yakin ingin menghapus user dengan NRP ${nrp}? Tindakan ini bersifat permanen.`, async () => {
      try {
        const response = await fetch(`${API_URL}/admin/users/${nrp}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          showSuccess(`User dengan NRP ${nrp} berhasil dihapus dari database.`);
          fetchUsers();
        } else {
          const err = await response.json();
          showError(err.message || "Gagal menghapus user dari database.");
        }
      } catch (error) {
        console.error(error);
        showError("Koneksi gagal saat menghubungi server.");
      }
    });
  };

  // ── Parsing Excel ─────────────────────────────────────────────────
  const handleExcelFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFileName(file.name);
    setUploadStatus(null);
    setUploadResult({ success: 0, failed: 0, errors: [] });

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

        // Normalisasi header (case-insensitive, trim)
        const normalized = rows.map((row) => {
          const entry = {};
          for (const key of Object.keys(row)) {
            entry[key.trim().toLowerCase()] = row[key];
          }
          return {
            nrp: String(entry.nrp || "").trim(),
            nama: String(entry.nama || "").trim(),
            status: String(entry.status || "").trim(),
            role: statusToRole(entry.status),
          };
        }).filter((r) => r.nrp && r.nama);

        setExcelRows(normalized);
        setIsPreviewOpen(true);
      } catch {
        showError("File Excel tidak dapat dibaca. Pastikan format kolom benar (No, NRP, Nama, Status).");
        setExcelRows([]);
        setExcelFileName("");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // ── Submit bulk upload ────────────────────────────────────────────
  const handleBulkUpload = async () => {
    if (excelRows.length === 0) return;
    setUploadStatus("loading");
    let success = 0, failed = 0;
    const errors = [];

    for (const row of excelRows) {
      try {
        const res = await fetch(`${API_URL}/admin/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ nrp: row.nrp, nama: row.nama, role: row.role, password: row.nrp + "@dti" }),
        });
        if (res.ok) {
          success++;
        } else {
          const err = await res.json();
          failed++;
          errors.push(`NRP ${row.nrp}: ${err.message || "Gagal"}`);
        }
      } catch {
        failed++;
        errors.push(`NRP ${row.nrp}: Koneksi gagal`);
      }
    }

    setUploadResult({ success, failed, errors });
    setUploadStatus("done");
    setIsPreviewOpen(false);
    fetchUsers();
  };

  const resetExcel = () => {
    setExcelRows([]);
    setExcelFileName("");
    setUploadStatus(null);
    setIsPreviewOpen(false);
    setUploadResult({ success: 0, failed: 0, errors: [] });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Role badge ────────────────────────────────────────────────────
  const roleBadge = (role) => {
    if (role === "admin") return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    if (role === "alumni") return "bg-violet-500/10 text-violet-600 border-violet-500/20";
    return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 md:space-y-8 pb-10 md:pb-8 animate-scale-in text-spark-primary relative">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl spark-banner p-6 md:p-10 shadow-xl border flex-shrink-0">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-blue-900 border border-amber-500/35 uppercase tracking-widest shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              Security Root
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <Shield className="w-8 h-8 text-amber-500 flex-shrink-0" /> Admin Control Panel
            </h1>
            <p className="text-xs text-spark-secondary max-w-xl font-medium leading-relaxed">
              Manajemen komprehensif data civitas, pemutakhiran hak akses, serta penataan status database alumni secara tersentralisasi.
            </p>
          </div>
        </div>
      </div>

      <div className="features-blue-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Panel Kiri: Input ─────────────────────────────────── */}
          <div className="bg-spark-card border rounded-3xl p-6 shadow-md h-fit space-y-5">
            {/* Header panel + mode toggle */}
            <div className="flex items-center gap-2 pb-2.5 border-b border-spark-border">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-600">
                <UserPlus className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-spark-muted flex-1">
                {isEditing ? "Edit Hak Akses" : "Tambah User"}
              </h3>
            </div>

            {/* Toggle Manual / Excel */}
            {!isEditing && (
              <div className="flex rounded-xl overflow-hidden border border-spark-border text-[10px] font-extrabold uppercase tracking-widest">
                <button
                  onClick={() => setInputMode("manual")}
                  className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors ${inputMode === "manual"
                    ? "bg-blue-600 text-white"
                    : "text-spark-muted hover:bg-blue-500/5"
                    }`}
                >
                  <UserPlus className="w-3 h-3" /> Manual
                </button>
                <button
                  onClick={() => setInputMode("excel")}
                  className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors ${inputMode === "excel"
                    ? "bg-emerald-600 text-white"
                    : "text-spark-muted hover:bg-emerald-500/5"
                    }`}
                >
                  <FileSpreadsheet className="w-3 h-3" /> Excel
                </button>
              </div>
            )}

            {/* ── Mode: Manual ── */}
            {(inputMode === "manual" || isEditing) && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-spark-muted uppercase tracking-widest mb-2">
                    NRP ITS / Username Admin
                  </label>
                  <input
                    disabled={isEditing}
                    required
                    type="text"
                    placeholder="e.g. 5027231052"
                    className="w-full px-4 py-2.5 rounded-xl border border-spark-border text-xs focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none transition-all font-semibold disabled:opacity-50 text-spark-primary"
                    value={formData.nrp}
                    onChange={(e) => setFormData({ ...formData, nrp: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-spark-muted uppercase tracking-widest mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Fikri Aulia"
                    className="w-full px-4 py-2.5 rounded-xl border border-spark-border text-xs focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none transition-all font-semibold text-spark-primary"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-spark-muted uppercase tracking-widest mb-2">
                    Role / Status
                  </label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-spark-border text-xs focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none transition-all font-semibold cursor-pointer text-spark-primary"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="mahasiswa">Mahasiswa Aktif</option>
                    <option value="alumni">Alumni</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                {!isEditing && (
                  <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                    <p className="text-[10px] text-spark-secondary font-medium leading-relaxed">
                      💡 <span className="font-bold">Info:</span> Password bawaan = <span className="font-bold text-blue-600 font-mono">[NRP]@dti</span><br />
                      Contoh: <span className="font-mono text-blue-600">5027231052@dti</span>
                    </p>
                  </div>
                )}
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/10 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center"
                  >
                    {isEditing ? "Simpan Perubahan" : "Daftarkan User"}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setFormData({ nrp: "", nama: "", role: "mahasiswa" }); }}
                      className="w-full py-2.5 border border-spark-border hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-spark-secondary transition-all flex items-center justify-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Batal Edit
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* ── Mode: Excel ── */}
            {inputMode === "excel" && !isEditing && (
              <div className="space-y-4">
                {/* Info format */}
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
                  <p className="text-[10px] text-spark-secondary font-medium leading-relaxed">
                    📋 <span className="font-bold">Format kolom Excel:</span><br />
                    <span className="font-mono text-emerald-600">No · NRP · Nama · Status</span><br />
                    Status: <span className="font-bold">Mahasiswa Aktif</span> atau <span className="font-bold">Alumni</span><br />
                    Password otomatis = <span className="font-mono font-bold text-emerald-700">[NRP]@dti</span>
                  </p>
                </div>

                {/* Tombol pilih file */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-emerald-400/40 hover:border-emerald-500/70 rounded-2xl flex flex-col items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-all group"
                >
                  <UploadCloud className="w-7 h-7 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest max-w-full truncate px-4">
                    {excelFileName || "Pilih File Excel (.xlsx / .xls)"}
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleExcelFile}
                />

                {/* Tampilan Ringkasan Antrean File */}
                {excelRows.length > 0 && uploadStatus !== "done" && (
                  <div className="p-4 rounded-2xl border border-spark-border bg-slate-500/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-spark-muted uppercase tracking-widest">
                        🎯 Antrean Impor
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        {excelRows.length} Calon User
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsPreviewOpen(true)}
                        className="flex-1 py-2 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-blue-600 text-[10px] font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" /> Buka Preview
                      </button>
                      <button
                        onClick={resetExcel}
                        className="py-2 px-3 rounded-xl border border-spark-border hover:bg-rose-500/5 hover:text-rose-600 hover:border-rose-500/20 text-spark-muted text-[10px] font-bold transition-all flex items-center justify-center"
                        title="Batalkan File"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Hasil upload */}
                {uploadStatus === "done" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <p className="text-[10px] font-bold text-emerald-700">
                        {uploadResult.success} berhasil ditambahkan
                        {uploadResult.failed > 0 && `, ${uploadResult.failed} gagal`}
                      </p>
                    </div>
                    {uploadResult.errors.length > 0 && (
                      <div className="p-3 bg-rose-500/5 border border-rose-500/15 rounded-xl space-y-1 max-h-24 overflow-y-auto clean-scrollbar">
                        {uploadResult.errors.map((err, i) => (
                          <p key={i} className="text-[10px] text-rose-600 flex items-start gap-1">
                            <AlertCircle className="w-3 h-3 flex-shrink-0 mt-px" />{err}
                          </p>
                        ))}
                      </div>
                    )}
                    <button onClick={resetExcel} className="w-full py-2 border border-spark-border rounded-xl text-[10px] font-bold text-spark-muted hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-center gap-1">
                      <X className="w-3 h-3" /> Reset / Upload File Lain
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Panel Kanan: Tabel Database + Filter Toolbar ───────── */}
          <div className="lg:col-span-2 bg-spark-card border rounded-3xl shadow-md overflow-hidden flex flex-col">

            {/* Header Database */}
            <div className="px-6 py-4 border-b border-spark-border bg-slate-50/50 dark:bg-slate-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-600">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-extrabold text-spark-muted uppercase tracking-widest">
                  Database Civitas Terdaftar
                </h3>
                <span className="text-[10px] font-bold text-spark-muted bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                  {filteredUsers.length} dari {users.length} user
                </span>
              </div>
            </div>

            {/* ── TAMBAHAN BARU: FILTER & SEARCH TOOLBAR ── */}
            <div className="p-4 border-b border-spark-border bg-slate-50/30 dark:bg-slate-950/5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Search Box */}
              <div className="relative sm:col-span-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-spark-muted" />
                <input
                  type="text"
                  placeholder="Cari NRP atau Nama..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-spark-border text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all font-semibold text-spark-primary"
                />
              </div>

              {/* Filter Dropdown: Role */}
              <div className="relative">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 rounded-xl border border-spark-border text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all font-semibold cursor-pointer text-spark-primary appearance-none bg-white dark:bg-slate-900"
                >
                  <option value="all">✨ Semua Status/Role</option>
                  <option value="mahasiswa">Mahasiswa Aktif</option>
                  <option value="alumni">Alumni</option>
                  <option value="admin">Administrator</option>
                </select>
                <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-spark-muted pointer-events-none" />
              </div>

              {/* Filter Dropdown: Angkatan (Dinamis dari Digit ke 5-6 NRP) */}
              <div className="relative">
                <select
                  value={filterAngkatan}
                  onChange={(e) => setFilterAngkatan(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 rounded-xl border border-spark-border text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all font-semibold cursor-pointer text-spark-primary appearance-none bg-white dark:bg-slate-900"
                >
                  <option value="all">🎓 Semua Angkatan</option>
                  {daftarAngkatan.map((thn) => (
                    <option key={thn} value={thn}>Angkatan 20{thn}</option>
                  ))}
                </select>
                <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-spark-muted pointer-events-none" />
              </div>
            </div>

            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center gap-3 my-auto">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-xs font-semibold text-spark-muted">Memuat data database...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-950/10 text-[10px] font-extrabold text-spark-muted uppercase tracking-widest border-b border-spark-border">
                      <th className="px-6 py-3.5">NRP / Username</th>
                      <th className="px-6 py-3.5">Nama</th>
                      <th className="px-6 py-3.5">Role</th>
                      <th className="px-6 py-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-spark-border text-xs font-semibold text-spark-secondary">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-12 text-spark-muted italic">
                          Tidak ada data civitas yang cocok dengan filter.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.nrp} className="hover:bg-blue-500/5 transition-colors group">
                          <td className="px-6 py-4 font-mono text-spark-muted text-[11px]">{u.nrp}</td>
                          <td className="px-6 py-4 font-bold text-spark-primary group-hover:text-blue-600 transition-colors">{u.nama}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${roleBadge(u.role)}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-1.5 opacity-90 group-hover:opacity-100">
                            <button
                              onClick={() => {
                                setIsEditing(true);
                                setInputMode("manual");
                                setFormData({ nrp: u.nrp, nama: u.nama, role: u.role });
                              }}
                              className="p-2 border border-spark-border rounded-xl hover:bg-blue-500/5 hover:text-blue-600 hover:border-blue-500/20 text-spark-muted inline-flex items-center justify-center transition-all shadow-sm"
                              title="Edit User"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(u.nrp)}
                              className="p-2 border border-spark-border rounded-xl hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/20 text-spark-muted inline-flex items-center justify-center transition-all shadow-sm"
                              title="Hapus User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── POP-UP MODAL PREVIEW EXCEL ─────────────────────────────────── */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl border border-spark-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-in">

            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-spark-border bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-600">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-spark-primary">Pratinjau Data Dokumen</h3>
                  <p className="text-[10px] text-spark-muted font-medium truncate max-w-md">{excelFileName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-spark-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Konten Tabel di dalam Modal */}
            <div className="overflow-auto p-6 clean-scrollbar flex-1">
              <div className="rounded-xl border border-spark-border overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950/20 text-[10px] font-extrabold text-spark-muted uppercase tracking-widest border-b border-spark-border">
                      <th className="px-4 py-3">NRP / Username</th>
                      <th className="px-4 py-3">Nama Lengkap</th>
                      <th className="px-4 py-3">Sistem Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-spark-border font-medium text-spark-secondary">
                    {excelRows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-500/5 transition-colors">
                        <td className="px-4 py-2.5 font-mono text-[11px] text-spark-muted">{r.nrp}</td>
                        <td className="px-4 py-2.5 font-bold text-spark-primary">{r.nama}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${roleBadge(r.role)}`}>
                            {r.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Modal Aksi */}
            <div className="px-6 py-4 border-t border-spark-border bg-slate-50 dark:bg-slate-950/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] font-semibold text-spark-muted">
                Menampilkan <span className="font-bold text-spark-primary">{excelRows.length}</span> data siap impor.
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={resetExcel}
                  disabled={uploadStatus === "loading"}
                  className="flex-1 sm:flex-initial px-4 py-2.5 border border-rose-500/20 text-rose-600 hover:bg-rose-500/5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" /> Batal Impor
                </button>
                <button
                  onClick={handleBulkUpload}
                  disabled={uploadStatus === "loading"}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/10 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {uploadStatus === "loading" ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Memproses...</>
                  ) : (
                    <><UploadCloud className="w-3.5 h-3.5" /> Konfirmasi Upload</>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── CUSTOM NOTIFICATION MODAL (SUCCESS / ERROR / CONFIRM) ── */}
      {notification && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-spark-border rounded-3xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden animate-scale-in text-center">
            {/* Background decoration glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Icon Header */}
            <div className="flex justify-center mb-5">
              {notification.type === "success" && (
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              )}
              {notification.type === "error" && (
                <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 shadow-md">
                  <AlertCircle className="w-7 h-7" />
                </div>
              )}
              {notification.type === "confirm" && (
                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-md animate-bounce">
                  <HelpCircle className="w-7 h-7" />
                </div>
              )}
            </div>

            {/* Title & Description */}
            <h3 className="text-base font-extrabold text-spark-primary mb-2">
              {notification.title}
            </h3>
            <p className="text-xs text-spark-secondary font-medium leading-relaxed mb-6">
              {notification.message}
            </p>

            {/* Actions Buttons */}
            {notification.type === "confirm" ? (
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setNotification(null)}
                  className="flex-1 py-3 rounded-xl border border-spark-border hover:bg-slate-50 dark:hover:bg-slate-800 text-spark-secondary text-xs font-bold transition-all active:scale-95"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    notification.action();
                    setNotification(null);
                  }}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-500/10 transition-all active:scale-95"
                >
                  Ya, Hapus
                </button>
              </div>
            ) : (
              <button
                onClick={() => setNotification(null)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/10 transition-all active:scale-95"
              >
                Mengerti
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}