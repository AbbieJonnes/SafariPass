import Navbar from '../../components/Navbar';

function PassengerDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-2">Passenger Dashboard</h1>
        <p className="text-gray-500">Welcome — this is where your subscription, QR pass, and routes will live.</p>
      </div>
    </div>
  );
}

export default PassengerDashboard;