import { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/authStore";
import { FEATURE_COLORS, checkIsAlumniOrAdmin } from "../../lib/utils";

// 1. DAFTAR MENU UTAMA UNTUK MAHASISWA & ALUMNI
const BASE_NAV_ITEMS = [
  {
    path: "/home",
    key: "home",
    icon: HomeIcon,
    label: "Menu Utama",
  },
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
  const location = useLocation();
  const mainRef = useRef(null);
  const isAlumni = checkIsAlumniOrAdmin(user?.role);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  // State untuk Dropdown Profile di Header
  const [profileOpen, setProfileOpen] = useState(false);
  // State untuk Modal Konfirmasi Tentang DTI
  const [tentangDTIOpen, setTentangDTIOpen] = useState(false);

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

  return (
    // Mengunci container paling luar agar tidak memicu scrollbar browser utama
    <div
      className="w-screen h-[100dvh] flex flex-col relative overflow-hidden dashboard-theme text-slate-100 font-sans"
      style={{
        backgroundImage: "url('/tower-2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay background layer */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-0" />

      {/* Deep Dark Color Layer for Atmospheric Look */}
      <div className="absolute -top-32 -right-32 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute -bottom-32 -left-32 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Header Top Bar - spans full width at the very top */}
      <header className="border-b border-white/5 px-4 md:px-6 py-4 flex items-center justify-between bg-slate-950/20 backdrop-blur-md relative z-30 flex-shrink-0 select-none">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all md:hidden"
            title={sidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          <Link to="/home" className="flex items-center gap-2 select-none hover:opacity-90 transition-opacity">
            <img
              src="/Logo Spark DTI.png"
              alt="Logo SPARK DTI"
              className="h-9 md:h-12 w-auto object-contain drop-shadow-sm"
            />
          </Link>
        </div>

        {/* Navigation Links in Center */}
        <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-500">
          <Link to="/our-team" className="hover:text-blue-400 transition-colors">Our Team</Link>
          <button
            onClick={() => setTentangDTIOpen(true)}
            className="hover:text-blue-400 transition-colors"
          >
            Tentang DTI
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-400 hidden lg:inline">
            <span className="font-mono text-white">{user?.nrp ?? "5027231000"}</span>
          </span>

          {/* Account Name as shown in Diagram 1 ("nama akun") */}
          <span className="text-xs font-extrabold text-slate-200 hidden sm:inline">
            {user?.nama ?? "Civitas DTI"}
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

      {/* Lower body container - sidebar on left, content on right */}
      <div className={`flex-1 flex overflow-hidden min-h-0 relative z-10 bg-slate-950/10 ${location.pathname !== "/home" && location.pathname !== "/" ? "has-grid-bg" : ""}`}>
        {/* Glow khusus Menu Utama (Home Page) di bawah sidebar & content area agar tidak terpotong */}
        {(location.pathname === "/home" || location.pathname === "/") && (
          <div
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
            style={{
              background: "radial-gradient(circle at 15% 15%, rgba(14, 165, 233, 0.25) 0%, rgba(56, 189, 248, 0.14) 25%, rgba(59, 130, 246, 0.05) 50%, rgba(59, 130, 246, 0) 80%)"
            }}
          />
        )}
        {/* Mobile Sidebar Backdrop Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Left Sidebar */}
        <aside
          className={`
              fixed md:relative top-[73px] md:top-auto left-0 bottom-0 z-40 md:z-auto
              flex flex-col bg-slate-950/95 md:bg-slate-950/45 backdrop-blur-2xl flex-shrink-0
              transition-all duration-300 ease-in-out select-none
              mt-0 md:mt-6 mb-0 md:mb-3 ml-0 md:ml-6 mr-0 md:mr-2
              rounded-none md:rounded-[24px] border-r md:border border-white/10 shadow-lg
              h-[calc(100dvh-73px)] md:h-fit md:max-h-[calc(100%-2.25rem)]
              overflow-hidden md:overflow-visible
              ${sidebarOpen 
                ? "w-60 p-4 translate-x-0" 
                : "w-0 md:w-20 p-0 md:p-4 -translate-x-full md:translate-x-0"
              }
            `}
        >
          {/* Toggle Sidebar Button */}
          <div className={`flex items-center mb-6 ${sidebarOpen ? "justify-between px-2" : "justify-center"}`}>
            {sidebarOpen && (
              <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">
                Menu Panel
              </span>
            )}
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
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          toggleSidebar();
                        }
                      }}
                      className={({ isActive }) =>
                        `flex items-center rounded-xl transition-all duration-300 group ${sidebarOpen ? "gap-3 px-2 py-2" : "justify-center px-0 py-2"
                        } ${isActive
                          ? "bg-white/10 text-white"
                          : "hover:bg-white/5 text-slate-400 hover:text-slate-200"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* Modern Square Icon Badge — background only on the icon itself */}
                          <span
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 text-slate-400"
                            style={{
                              backgroundColor: isActive
                                ? colors.accent
                                : "rgba(100, 116, 139, 0.10)",
                            }}
                          >
                            <Icon
                              className="w-4 h-4 transition-colors duration-300"
                              style={{ color: isActive ? "#ffffff" : undefined }}
                            />
                          </span>
                          {sidebarOpen && (
                            <span
                              className="text-xs font-semibold truncate tracking-wide transition-colors duration-300"
                              style={{
                                color: isActive ? colors.accent : undefined,
                              }}
                            >
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
          <div className="border-t border-white/5 pt-5 mt-12">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-xs font-bold ${sidebarOpen ? "gap-3 px-3 py-2 text-left" : "justify-center px-0 py-2"
                }`}
            >
              <LogoutIcon className="w-4 h-4" />
              {sidebarOpen && <span>Keluar</span>}
            </button>
          </div>
        </aside>

        {/* Page main content area - conditionally rendered with has-grid-bg on non-home pages */}
        <main
          ref={mainRef}
          className="flex-1 h-full overflow-y-auto text-slate-100 min-h-0 clean-scrollbar"
        >
          <Outlet />
        </main>
      </div>

      {/* Modal Konfirmasi Tentang DTI */}
      {tentangDTIOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-[24px] p-8 max-w-sm w-full shadow-2xl relative overflow-hidden animate-scale-in">
            {/* Dekorasi background */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>

              <p className="text-[13px] font-semibold text-slate-600 mb-8 leading-relaxed">
                Anda akan dialihkan ke website resmi Departemen Teknologi Informasi ITS (<span className="text-blue-500 font-bold">its.ac.id</span>). Lanjutkan?
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setTentangDTIOpen(false)}
                  className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold shadow-md transition-all active:scale-95"
                >
                  Batal
                </button>
                <a
                  href="https://www.its.ac.id/it/id/departemen-teknologi-informasi/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setTentangDTIOpen(false)}
                  className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center"
                >
                  Ya, Lanjutkan
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
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
function HomeIcon({ className, style }) { // <--- Tambahkan style di sini
  return (
    <svg
      className={className}
      style={style}                     // <--- Tambahkan baris ini
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}