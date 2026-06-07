export const FEATURE_COLORS = {
  "academic-mapper": {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    accent: "#22c55e",
    text: "#166534",
  },
  "semester-planner": {
    bg: "#fefce8",
    border: "#fef08a",
    accent: "#eab308",
    text: "#854d0e",
  },
  "opportunity-board": {
    bg: "#fdf2f8",
    border: "#fbcfe8",
    accent: "#ec4899",
    text: "#9d174d",
  },
  "cv-reviewer": {
    bg: "#eff6ff",
    border: "#bfdbfe",
    accent: "#3b82f6",
    text: "#1d4ed8",
  },
  "sks-chatbot": {
    bg: "#fef2f2",
    border: "#fecaca",
    accent: "#ef4444",
    text: "#991b1b",
  },
};

export const CAREER_ROLES = [
  { id: "backend", label: "Backend Engineer" },
  { id: "frontend", label: "Frontend Engineer" },
  { id: "data-analyst", label: "Data Analyst" },
  { id: "ui-ux", label: "UI/UX Designer" },
];

export const SKS_JALUR = {
  magang: {
    id: "magang",
    label: "Magang MBKM",
    description: "Konversi dari magang industri.",
    sub: ["Mandiri", "MSIB"],
  },
  prestasi: {
    id: "prestasi",
    label: "Prestasi/Lomba",
    description: "Konversi dari juara kompetisi.",
    sub: ["Belmawa", "Non-Belmawa"],
  },
};

export function formatFileSize(bytes = 0) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const idx = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** idx;
  const rounded =
    value >= 10 || idx === 0 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${units[idx]}`;
}

export function validatePdf(file, maxMb = 10) {
  if (!file) return { valid: false, error: "File tidak ditemukan." };

  const isPdfMime = file.type === "application/pdf";
  const isPdfExt =
    typeof file.name === "string" && file.name.toLowerCase().endsWith(".pdf");
  if (!isPdfMime && !isPdfExt) {
    return { valid: false, error: "Format file harus PDF." };
  }

  const maxBytes = maxMb * 1024 * 1024;
  if (Number.isFinite(file.size) && file.size > maxBytes) {
    return { valid: false, error: `Ukuran file maksimal ${maxMb}MB.` };
  }

  return { valid: true, error: null };
}

/**
 * MENGENDALIKAN VISUAL UI BERDASARKAN ROLE DATABASE
 * Fungsi lama yang memotong string NRP dihapus untuk menghindari bug perbedaan user.
 * @param {string} role - Diambil dari properti user.role di database Supabase
 * @returns {boolean}
 */
export function checkIsAlumniOrAdmin(role) {
  if (!role) return false;
  const userRole = String(role).toLowerCase();
  return userRole === "alumni" || userRole === "admin";
}
