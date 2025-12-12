import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Toast from './components/ui/Toast';
import LandingPage from './pages/LandingPage';
import EventDetails from './pages/EventDetails';
import AdminLogin from './components/admin/AdminLogin';
import DashboardLayout from './components/admin/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import LeadsManagement from './pages/LeadsManagement';
import QuoteGeneration from './pages/QuoteGeneration';
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  return (
    <>
    <AuthProvider>
      <Router>
      <Toast/>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="leads" element={<LeadsManagement />} />
            <Route path="quotes" element={<QuoteGeneration />} />
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
    </>
  )
}

export default App
