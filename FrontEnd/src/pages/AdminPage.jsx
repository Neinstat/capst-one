import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Users, UserPlus, Shield, Trash2, Edit2, Loader2 } from "lucide-react";

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

    // 🚨 PERBAIKAN: Setel password bawaan otomatis disamakan dengan isi variabel formData.nrp
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
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800">
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <Shield className="w-6 h-6 text-amber-400" /> Admin Control Panel
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manajemen data civitas, hak akses, dan status alumni DTI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Input */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm h-fit">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-indigo-500" />{" "}
            {isEditing ? "Edit Hak Akses" : "Tambah User Manual"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">
                NRP ITS / Username Admin
              </label>
              <input
                disabled={isEditing}
                required
                type="text"
                placeholder="e.g. 5027231052 atau nama.admin"
                className="w-full px-3 py-2 border rounded-xl text-xs font-semibold disabled:bg-gray-50"
                value={formData.nrp}
                onChange={(e) =>
                  setFormData({ ...formData, nrp: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">
                Nama Lengkap
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Fikri Aulia"
                className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">
                Role / Status Database
              </label>
              <select
                className="w-full px-3 py-2 border rounded-xl text-xs font-semibold bg-white"
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
              <p className="text-[10px] text-gray-400 italic">
                * Akun baru otomatis menggunakan password bawaan yang **sama
                dengan NRP / Username** yang diinputkan.
              </p>
            )}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
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
                  className="px-3 py-2 border rounded-xl text-xs font-bold text-gray-500"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabel User */}
        <div className="lg:col-span-2 bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b bg-gray-50 flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <h3 className="text-xs font-black text-gray-800 uppercase">
              Database Civitas Terdaftar
            </h3>
          </div>

          {loading ? (
            <div className="p-10 flex justify-center">
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b">
                    <th className="px-4 py-3">NRP / Username</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs font-semibold text-gray-700">
                  {users.map((u) => (
                    <tr key={u.nrp} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-mono text-gray-500">
                        {u.nrp}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">
                        {u.nama}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${u.role === "admin" ? "bg-amber-50 text-amber-600" : u.role === "alumni" ? "bg-pink-50 text-pink-600" : "bg-blue-50 text-blue-600"}`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-1">
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setFormData({
                              nrp: u.nrp,
                              nama: u.nama,
                              role: u.role,
                            });
                          }}
                          className="p-1.5 border rounded-lg hover:bg-gray-100 text-gray-500"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.nrp)}
                          className="p-1.5 border rounded-lg hover:bg-red-50 text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
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
