import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import SetPassword from './pages/SetPassword';
import ProtectedRoute from './components/ProtectedRoute';

import PassengerDashboard from './pages/passenger/PassengerDashboard';
import BrowseRoutes from './pages/passenger/BrowseRoutes';
import MyQRCode from './pages/passenger/MyQRCode';
import RouteShift from './pages/passenger/RouteShift';
import PaymentHistory from './pages/passenger/PaymentHistory';
import Profile from './pages/passenger/Profile';

import ConductorDashboard from './pages/conductor/ConductorDashboard';
import ScanPass from './pages/conductor/ScanPass';
import ValidationHistory from './pages/conductor/ValidationHistory';

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

      <Route path="/passenger/dashboard" element={<ProtectedRoute allowedRoles={['passenger']}><PassengerDashboard /></ProtectedRoute>} />
      <Route path="/passenger/browse" element={<ProtectedRoute allowedRoles={['passenger']}><BrowseRoutes /></ProtectedRoute>} />
      <Route path="/passenger/qr" element={<ProtectedRoute allowedRoles={['passenger']}><MyQRCode /></ProtectedRoute>} />
      <Route path="/passenger/shift" element={<ProtectedRoute allowedRoles={['passenger']}><RouteShift /></ProtectedRoute>} />
      <Route path="/passenger/payments" element={<ProtectedRoute allowedRoles={['passenger']}><PaymentHistory /></ProtectedRoute>} />
      <Route path="/passenger/profile" element={<ProtectedRoute allowedRoles={['passenger']}><Profile /></ProtectedRoute>} />

      <Route path="/conductor/dashboard" element={<ProtectedRoute allowedRoles={['conductor']}><ConductorDashboard /></ProtectedRoute>} />
      <Route path="/conductor/scan" element={<ProtectedRoute allowedRoles={['conductor']}><ScanPass /></ProtectedRoute>} />
      <Route path="/conductor/history" element={<ProtectedRoute allowedRoles={['conductor']}><ValidationHistory /></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['company_admin']}><CompanyAdminDashboard /></ProtectedRoute>} />
      <Route path="/super-admin/dashboard" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminDashboard /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;