import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AcademicMapperPage from "./pages/AcademicMapperPage";
import SemesterPlannerPage from "./pages/SemesterPlannerPage";
import OpportunityBoardPage from "./pages/OpportunityBoardPage";
import CvReviewerPage from "./pages/CvReviewerPage";
import SksChatbotPage from "./pages/SksChatbotPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import OurTeamPage from "./pages/OurTeamPage";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";

import { useAuthStore } from "./store/authStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

// Middleware Global Pengunci Autentikasi Login
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return children;
}

// 🚨 PERBAIKAN 2: Tambahkan Proteksi Tambahan khusus Rute Admin di Frontend
function AdminRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (user?.role !== "admin") return <Navigate to="/sks-chatbot" replace />; // Lempar ke dashboard jika bukan admin
  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<LoginPage />} />

          {/* Rute Terproteksi Login Global */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<HomePage />} />
            <Route path="/academic-mapper" element={<AcademicMapperPage />} />
            <Route path="/semester-planner" element={<SemesterPlannerPage />} />
            <Route
              path="/opportunity-board"
              element={<OpportunityBoardPage />}
            />
            <Route path="/cv-reviewer" element={<CvReviewerPage />} />
            <Route path="/sks-chatbot" element={<SksChatbotPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/our-team" element={<OurTeamPage />} />

            {/* 🚨 PERBAIKAN 4: Bungkus rute admin menggunakan AdminRoute agar berlapis keamanannya */}
            <Route
              path="admin-panel"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
