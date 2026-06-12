import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Users, UserPlus, Shield, Trash2, Edit2, Loader2, X } from "lucide-react";

export default function AdminPage() {
  const { token } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // State Form Tambah/Edit
  const [formData, setFormData] = useState({
    nrp: "",
    nama: "",
    role: "mahasiswa",
  });
  const [isEditing, setIsEditing] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing
      ? `${API_URL}/admin/users/${formData.nrp}`
      : `${API_URL}/admin/users`;
    const method = isEditing ? "PUT" : "POST";

    const payload = isEditing
      ? formData
      : { ...formData, password: formData.nrp.trim() };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(
          isEditing
            ? "User diperbarui!"
            : `User ditambahkan! Password bawaan: ${formData.nrp}`,
        );
        setFormData({ nrp: "", nama: "", role: "mahasiswa" });
        setIsEditing(false);
        fetchUsers();
      } else {
        const errorResult = await response.json();
        alert(`Gagal: ${errorResult.message || "Terjadi kesalahan"}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (nrp) => {
    if (!confirm(`Hapus user dengan NRP ${nrp}?`)) return;
    try {
      const response = await fetch(`${API_URL}/admin/users/${nrp}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-scale-in text-spark-primary">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl spark-banner p-8 md:p-10 shadow-xl border flex-shrink-0">
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
          {/* Form Input (Gaya Minimalis Modern) */}
          <div className="bg-spark-card border rounded-3xl p-6 shadow-md h-fit space-y-5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-spark-border">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-600`}>
                <UserPlus className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-spark-muted">
                {isEditing ? "Edit Hak Akses" : "Tambah User Manual"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-spark-muted uppercase tracking-widest mb-2">
                  NRP ITS / Username Admin
                </label>
                <input
                  disabled={isEditing}
                  required
                  type="text"
                  placeholder="e.g. 5027231052 atau nama.admin"
                  className="w-full px-4 py-2.5 rounded-xl border border-spark-border text-xs focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none transition-all font-semibold disabled:opacity-50 text-spark-primary"
                  value={formData.nrp}
                  onChange={(e) =>
                    setFormData({ ...formData, nrp: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-spark-muted uppercase tracking-widest mb-2">
                  Role / Status Database
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-spark-border text-xs focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none transition-all font-semibold cursor-pointer text-spark-primary"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="mahasiswa">Mahasiswa Aktif</option>
                  <option value="alumni">Alumni</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {!isEditing && (
                <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                  <p className="text-[10px] text-spark-secondary font-medium leading-relaxed">
                    💡 <span className="font-bold">Info:</span> Password bawaan akun baru otomatis disamakan dengan <span className="font-bold text-blue-600">NRP/Username</span> yang dimasukkan.
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
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ nrp: "", nama: "", role: "mahasiswa" });
                    }}
                    className="w-full py-2.5 border border-spark-border hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-spark-secondary transition-all flex items-center justify-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Batal Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Tabel User (Gaya Clean Premium) */}
          <div className="lg:col-span-2 bg-spark-card border rounded-3xl shadow-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-spark-border bg-slate-50/50 dark:bg-slate-950/20 flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-600">
                <Users className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-extrabold text-spark-muted uppercase tracking-widest">
                Database Civitas Terdaftar
              </h3>
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
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-10 text-spark-muted italic">
                          Belum ada data civitas terdaftar.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.nrp} className="hover:bg-blue-500/5 transition-colors group">
                          <td className="px-6 py-4 font-mono text-spark-muted text-[11px]">
                            {u.nrp}
                          </td>
                          <td className="px-6 py-4 font-bold text-spark-primary group-hover:text-blue-600 transition-colors">
                            {u.nama}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${u.role === "admin"
                                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                  : u.role === "alumni"
                                    ? "bg-violet-500/10 text-violet-600 border-violet-500/20"
                                    : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-1.5 opacity-90 group-hover:opacity-100">
                            <button
                              onClick={() => {
                                setIsEditing(true);
                                setFormData({
                                  nrp: u.nrp,
                                  nama: u.nama,
                                  role: u.role,
                                });
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
    </div>
  );
}