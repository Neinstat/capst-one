import { useState } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/authStore";
import { FEATURE_COLORS, checkIsAlumniOrAdmin } from "../../lib/utils";

// 1. DAFTAR MENU UTAMA UNTUK MAHASISWA & ALUMNI
const BASE_NAV_ITEMS = [
  {
    path: "/academic-mapper",
    key: "academic-mapper",
    icon: MapIcon,
    label: "Academic Mapper",
  },
  {
    path: "/semester-planner",
    key: "semester-planner",
    icon: CalendarIcon,
    label: "Semester Planner",
  },
  {
    path: "/opportunity-board",
    key: "opportunity-board",
    icon: BoardIcon,
    label: "Opportunity Board",
  },
  {
    path: "/cv-reviewer",
    key: "cv-reviewer",
    icon: FileIcon,
    label: "CV Reviewer",
  },
  {
    path: "/sks-chatbot",
    key: "sks-chatbot",
    icon: ChatIcon,
    label: "Konversi SKS",
  },
];

export default function MainLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  const navigate = useNavigate();
  const isAlumni = checkIsAlumniOrAdmin(user?.role);

  // State untuk Dropdown Profile di Header
  const [profileOpen, setProfileOpen] = useState(false);

  // 2. LOGIKA SIDEBAR DINAMIS: Menyuntikkan Menu Admin Panel jika role terdeteksi sebagai admin
  const allowedNavItems =
    user?.role === "admin"
      ? [
        ...BASE_NAV_ITEMS,
        {
          path: "/admin-panel",
          key: "admin-panel",
          icon: ShieldIcon,
          label: "Admin Panel",
        },
      ]
      : BASE_NAV_ITEMS;

  function handleLogout() {
    logout();
    navigate("/auth");
  }

  {/* Background iamge */ }

  return (
    <div
      className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-6 relative overflow-hidden dashboard-theme text-slate-100"
      style={{
        backgroundImage: "url('/tower-2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Deep Dark Color Layer for Atmospheric Look */}
      <div className="absolute -top-32 -right-32 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute -bottom-32 -left-32 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Main Glassmorphic Wrapper */}
      <div className="w-full max-w-7xl h-[92vh] rounded-[2.5rem] border border-white/10 glass-panel flex overflow-hidden shadow-2xl relative z-10 font-sans">

        {/* Left Sidebar */}
        <aside
          className={`
            flex flex-col border-r border-white/5 bg-slate-950/45 backdrop-blur-2xl
            transition-all duration-300 ease-in-out select-none
            ${sidebarOpen ? "w-72 p-5" : "w-20 p-4"}
          `}
        >
          {/* Bagian Atas Sidebar */}
          <div className={`flex items-center mb-6 ${sidebarOpen ? "justify-between px-2" : "justify-center"}`}>
            {sidebarOpen ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-[10px] font-black text-white shadow-md shadow-cyan-500/10">
                  SP
                </div>
                <span className="text-xs font-black text-slate-200 tracking-wider uppercase">
                  Spark Menu
                </span>
              </div>
            ) : null}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              title={sidebarOpen ? "Perkecil Sidebar" : "Perbesar Sidebar"}
            >
              <MenuIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Nav List */}
          <div className="flex-1 overflow-y-auto space-y-5 pr-1 clean-scrollbar">
            <div>
              {sidebarOpen && (
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 px-2">
                  Layanan DTI
                </p>
              )}
              <nav className="space-y-1">
                {allowedNavItems.map(({ path, key, icon: Icon, label }) => {
                  const colors = FEATURE_COLORS[key] || {
                    bg: "rgba(139, 92, 246, 0.1)",
                    border: "rgba(139, 92, 246, 0.2)",
                    accent: "#8b5cf6",
                    text: "#ffffff",
                  };

                  return (
                    <NavLink
                      key={path}
                      to={path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-2.5 py-2 rounded-xl transition-all duration-200 group
                        ${isActive
                          ? "bg-white/10 text-white shadow-sm border border-white/5"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* Book Cover Design */}
                          <span
                            className="w-8 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg border transition-transform group-hover:scale-105"
                            style={{
                              backgroundColor: colors.accent,
                              borderColor: colors.border,
                              boxShadow: `0 4px 12px ${colors.accent}30`,
                            }}
                          >
                            <Icon className="w-4 h-4 text-white font-bold" />
                          </span>
                          {sidebarOpen && (
                            <span className="text-xs font-bold truncate tracking-wide">
                              {label}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Bottom: Logout */}
          <div className="border-t border-white/5 pt-4 mt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-xs font-bold text-left"
            >
              <LogoutIcon className="w-4 h-4" />
              {sidebarOpen && <span>Keluar</span>}
            </button>
          </div>
        </aside>

        {/* Center Content and Header */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-900/15">
          {/* Header Top Bar */}
          <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between bg-slate-950/20 backdrop-blur-md relative z-30">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
                SPARK DTI ITS
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                NRP: <span className="font-mono text-white">{user?.nrp ?? "5027231000"}</span>
              </span>

              {/* Avatar Pemicu Dropdown Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 focus:outline-none p-1 rounded-xl hover:bg-white/5 transition-all"
                  title="Menu Profil"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-xs font-black text-white shadow-md shadow-cyan-500/10 border border-white/10">
                    {user?.nama ? user.nama.charAt(0).toUpperCase() : "M"}
                  </div>
                </button>

                {/* Dropdown Menu Box */}
                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setProfileOpen(false)}
                    />

                    <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2.5 shadow-2xl z-50 animate-scale-in">
                      <div className="px-3 py-2 border-b border-white/5 mb-1.5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Akun Pengguna</p>
                        <p className="text-xs font-extrabold text-slate-200 truncate mt-0.5">{user?.nama ?? "Mahasiswa IT"}</p>
                        <p className="text-[9px] font-medium text-slate-400 mt-0.5 truncate">{user?.role ?? "Civitas Aktif"}</p>
                      </div>

                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 text-left transition-colors"
                      >
                        <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Informasi & Password
                      </button>

                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-left transition-colors"
                      >
                        <LogoutIcon className="w-4 h-4" />
                        Keluar Sesi
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>
          </header>

          {/* Page main content */}
          <main className="flex-1 overflow-y-auto bg-slate-950/10 text-slate-100">
            <Outlet />
          </main>
        </div>

      </div>
    </div>
  );
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────
function ShieldIcon({ className, style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function MapIcon({ className, style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z" />
      <path d="M9 4v13M15 7v13" />
    </svg>
  );
}
function CalendarIcon({ className, style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
// Icon Grid Dashboard untuk Opportunity Board
function BoardIcon({ className, style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function FileIcon({ className, style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}
function ChatIcon({ className, style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}
function LogoutIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}
function MenuIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  );
}