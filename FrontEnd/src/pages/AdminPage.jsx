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
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Premium Hero Banner (Disamakan dengan CV Reviewer) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white p-8 md:p-10 shadow-2xl border border-white/5">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold bg-white/10 backdrop-blur-md text-amber-200 border border-white/10 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              Security Root
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-100 flex items-center gap-3">
              <Shield className="w-8 h-8 text-amber-400 flex-shrink-0" /> Admin Control Panel
            </h1>
            <p className="text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
              Manajemen komprehensif data civitas, pemutakhiran hak akses, serta penataan status database alumni secara tersentralisasi.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Input (Gaya Minimalis Modern) */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 p-6 shadow-sm h-fit space-y-5">
          <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600`}>
              <UserPlus className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-700">
              {isEditing ? "Edit Hak Akses" : "Tambah User Manual"}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">
                NRP ITS / Username Admin
              </label>
              <input
                disabled={isEditing}
                required
                type="text"
                placeholder="e.g. 5027231052 atau nama.admin"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-semibold disabled:bg-gray-50 disabled:text-gray-400"
                value={formData.nrp}
                onChange={(e) =>
                  setFormData({ ...formData, nrp: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">
                Nama Lengkap
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Fikri Aulia"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-semibold"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">
                Role / Status Database
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-semibold bg-white cursor-pointer"
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
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  💡 <span className="font-bold">Info:</span> Password bawaan akun baru otomatis disamakan dengan <span className="font-bold text-indigo-600">NRP/Username</span> yang dimasukkan.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/10 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center"
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
                  className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-500 transition-all flex items-center justify-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Batal Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabel User (Gaya Clean Premium) */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-gray-100 text-gray-500">
              <Users className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-widest">
              Database Civitas Terdaftar
            </h3>
          </div>

          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-3 my-auto">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-xs font-semibold text-gray-400">Memuat data database...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="px-6 py-3.5">NRP / Username</th>
                    <th className="px-6 py-3.5">Nama</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-600">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-gray-400 italic">
                        Belum ada data civitas terdaftar.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.nrp} className="hover:bg-blue-50/20 transition-colors group">
                        <td className="px-6 py-4 font-mono text-gray-400 text-[11px]">
                          {u.nrp}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {u.nama}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${u.role === "admin"
                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                : u.role === "alumni"
                                  ? "bg-pink-50 text-pink-700 border-pink-100"
                                  : "bg-blue-50 text-blue-700 border-blue-100"
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
                            className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-100 text-gray-400 inline-flex items-center justify-center transition-all shadow-sm"
                            title="Edit User"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(u.nrp)}
                            className="p-2 border border-gray-200 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-gray-400 inline-flex items-center justify-center transition-all shadow-sm"
                            title="Hapus User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    )
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}