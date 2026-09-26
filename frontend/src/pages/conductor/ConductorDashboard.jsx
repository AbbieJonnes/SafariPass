import Navbar from '../../components/Navbar';

function ConductorDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-2">Conductor Dashboard</h1>
        <p className="text-gray-500">This is where the QR scanner and validation history will live.</p>
      </div>
    </div>
  );
}

export default ConductorDashboard;