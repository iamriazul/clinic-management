import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorsPage from './pages/DoctorsPage';
import BookAppointmentPage from './pages/BookAppointmentPage';

// Dashboard pages
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import DoctorManagement from './pages/dashboard/DoctorManagement';
import PatientManagement from './pages/dashboard/PatientManagement';
import AppointmentManagement from './pages/dashboard/AppointmentManagement';

// Components
import Toast from './components/Toast';
import LoadingScreen from './components/LoadingScreen';
import { ToastProvider } from './context/ToastContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  const { loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <ToastProvider>
      <Toast />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/appointments/book" element={<BookAppointmentPage />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route
            path="doctors"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DoctorManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="patients"
            element={
              <ProtectedRoute allowedRoles={['admin', 'receptionist', 'doctor']}>
                <PatientManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="appointments"
            element={
              <ProtectedRoute>
                <AppointmentManagement />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
