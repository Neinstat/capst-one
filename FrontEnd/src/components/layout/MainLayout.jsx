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
  // Menggunakan Selector Fungsi Murni agar React mendeteksi perubahan state di localStorage secara reactive
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  const navigate = useNavigate();
  const isAlumni = checkIsAlumniOrAdmin(user?.role);

  // 2. LOGIKA SIDEBAR DINAMIS: Menyuntikkan Menu Admin Panel jika role terdeteksi sebagai admin
  const allowedNavItems =
    user?.role === "admin"
      ? [
          ...BASE_NAV_ITEMS,
          {
            path: "/admin-panel",
            key: "admin-panel", // Key unik untuk pemetaan warna fallback admin
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
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
          flex flex-col bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64" : "w-16"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">SD</span>
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                SPARK DTI
              </p>
              <p className="text-xs text-gray-500">ITS Surabaya</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {allowedNavItems.map(({ path, key, icon: Icon, label }) => {
            // Mekanisme Fallback Object Warna Khusus Admin Panel
            const colors = FEATURE_COLORS[key] || {
              bg: "#f8fafc", // slate-50
              border: "#e2e8f0", // slate-200
              accent: "#0f172a", // slate-900
              text: "#1e293b", // slate-800
            };

            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                  ${
                    isActive
                      ? "text-gray-900 font-medium"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? { backgroundColor: colors.bg, color: colors.text }
                    : {}
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                      style={isActive ? { backgroundColor: colors.accent } : {}}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: isActive ? "white" : colors.accent }}
                      />
                    </span>
                    {sidebarOpen && <span className="truncate">{label}</span>}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-gray-100 p-3">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              {/* 🚨 PERBAIKAN UTAMA: Membungkus Informasi Akun dengan Link menuju /profile */}
              <Link
                to="/profile"
                className="flex flex-1 items-center gap-3 min-w-0 hover:bg-gray-50 p-1.5 rounded-xl transition-all group text-left"
                title="Lihat Profil Saya"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-900 group-hover:text-white transition-all">
                  <span className="text-xs font-semibold text-gray-600 group-hover:text-white">
                    {user?.nama?.charAt(0) ?? "M"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                      {user?.nama ?? "Mahasiswa"}
                    </p>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        user?.role === "admin"
                          ? "bg-amber-50 text-amber-600 border border-amber-100"
                          : isAlumni
                            ? "bg-pink-50 text-pink-600 border border-pink-100"
                            : "bg-green-50 text-green-600 border border-green-100"
                      }`}
                    >
                      {user?.role === "admin"
                        ? "Admin"
                        : isAlumni
                          ? "Alumni"
                          : "Aktif"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.nrp ?? "5027231000"}
                  </p>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                title="Logout"
              >
                <LogoutIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {/* 🚨 PERBAIKAN: Link Avatar ketika Sidebar sedang Menyarukan (w-16) */}
              <Link
                to="/profile"
                className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                title="Lihat Profil Saya"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-gray-600">
                    {user?.nama?.charAt(0) ?? "M"}
                  </span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex justify-center p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <LogoutIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
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
