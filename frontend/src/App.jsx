import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
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
    </Routes>
  );
}

export default App;