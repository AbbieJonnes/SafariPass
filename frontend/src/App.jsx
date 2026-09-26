import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import SetPassword from './pages/SetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import PassengerDashboard from './pages/passenger/PassengerDashboard';
import ConductorDashboard from './pages/conductor/ConductorDashboard';
import CompanyAdminDashboard from './pages/admin/CompanyAdminDashboard';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/set-password/:uid/:token" element={<SetPassword />} />
      <Route path="/reset-password/:uid/:token" element={<SetPassword />} />

      <Route
        path="/passenger/dashboard"
        element={
          <ProtectedRoute allowedRoles={['passenger']}>
            <PassengerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/conductor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['conductor']}>
            <ConductorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <CompanyAdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/super-admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all: any unmatched or malformed URL redirects home instead of a blank page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;