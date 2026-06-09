import { create } from "zustand";
import { persist } from "zustand/middleware";

// 1. Store untuk Autentikasi (Penyebab utama error Token Malformed)
export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null, // Menyimpan token JWT untuk dikirim ke Backend

      login: (userData) =>
        set({
          isAuthenticated: true,
          user: userData.user, // Menyimpan profil (nrp, nama, dll)[cite: 6]
          token: userData.token, // Menyimpan string token murni[cite: 6]
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          token: null, // Reset token saat logout[cite: 6]
        }),
    }),
    {
      name: "spark-dti-auth", // Nama kunci di localStorage[cite: 6]
    },
  ),
);

// 2. Store untuk Proses Upload (Dibutuhkan oleh fitur Academic Mapper)
export const useUploadStore = create((set) => ({
  transcriptFile: null,
  transcriptDocumentId: null,
  selectedRole: null,

  setTranscriptFile: (file) => set({ transcriptFile: file }),
  setTranscriptDocumentId: (id) => set({ transcriptDocumentId: id }),
  setSelectedRole: (role) => set({ selectedRole: role }),

  resetTranscript: () =>
    set({ transcriptFile: null, transcriptDocumentId: null }),
}));

// 3. Store untuk UI (Dibutuhkan oleh MainLayout.jsx - Mencegah SyntaxError)
export const useUIStore = create((set) => ({
  sidebarOpen: true,
  activeModal: null,
  theme: localStorage.getItem("spark-theme") || "dark",

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openModal: (name) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("spark-theme", nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
      return { theme: nextTheme };
    }),
}));

// 4. Store untuk Reminder/Notifikasi
export const useReminderStore = create(
  persist(
    (set) => ({
      reminders: {},
      toggleReminder: (id) =>
        set((state) => ({
          reminders: {
            ...state.reminders,
            [id]: !state.reminders[id],
          },
        })),
    }),
    {
      name: "spark-dti-reminders",
    },
  ),
);
