import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


import MainLayout from './components/layout/MainLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import AcademicMapperPage from './pages/AcademicMapperPage'
import SemesterPlannerPage from './pages/SemesterPlannerPage'
import OpportunityBoardPage from './pages/OpportunityBoardPage'
import CvReviewerPage from './pages/CvReviewerPage'
import SksChatbotPage from './pages/SksChatbotPage'
import NotFoundPage from './pages/NotFoundPage'

import { useAuthStore } from './store/authStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
})

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="academic-mapper" element={<AcademicMapperPage />} />
            <Route path="semester-planner" element={<SemesterPlannerPage />} />
            <Route path="opportunity-board" element={<OpportunityBoardPage />} />
            <Route path="cv-reviewer" element={<CvReviewerPage />} />
            <Route path="sks-chatbot" element={<SksChatbotPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>

    </QueryClientProvider>
  )
}