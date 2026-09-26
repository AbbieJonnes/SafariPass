import Navbar from '../../components/Navbar';

function SuperAdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-2">Super Admin Dashboard</h1>
        <p className="text-gray-500">Manage companies, users, and platform-wide analytics here.</p>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;