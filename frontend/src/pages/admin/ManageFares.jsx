import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faPlus } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';

function ManageFares() {
  const [routes, setRoutes] = useState([]);
  const [fares, setFares] = useState([]);
  const [company, setCompany] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = (companyId) => {
    Promise.all([
      axiosInstance.get('/companies/routes/'),
      axiosInstance.get('/companies/fares/'),
    ]).then(([routesRes, faresRes]) => {
      const myRoutes = routesRes.data.filter((r) => r.company === companyId);
      setRoutes(myRoutes);
      const myRouteIds = myRoutes.map((r) => r.id);
      setFares(faresRes.data.filter((f) => myRouteIds.includes(f.route)));
    });
  };

  useEffect(() => {
    axiosInstance.get('/accounts/profile/').then((res) => {
      setCompany(res.data.company);
      loadData(res.data.company);
    }).finally(() => setLoading(false));
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    axiosInstance.post('/companies/fares/', {
      route: selectedRoute,
      price,
      effective_from: new Date().toISOString().split('T')[0],
    })
      .then(() => {
        setMessage('Fare added — passengers and conductors on this route have been notified.');
        setPrice('');
        setSelectedRoute('');
        loadData(company);
      })
      .catch(() => setMessage('Could not add fare.'))
      .finally(() => setSubmitting(false));
  };

  const routeLabel = (routeId) => {
    const r = routes.find((rt) => rt.id === routeId);
    return r ? `${r.origin} → ${r.destination}` : `Route #${routeId}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-1">Manage Fares</h1>
        <p className="text-gray-500 mb-6">Set pricing per route. Changing a fare notifies affected users by email.</p>

        <form onSubmit={handleAdd} className="bg-card rounded-2xl p-6 shadow-sm mb-8 space-y-4">
          <h3 className="font-semibold text-textdark flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} className="text-secondary" /> Set New Fare
          </h3>
          {message && <div className="bg-blue-50 text-blue-700 text-sm rounded-lg px-4 py-3">{message}</div>}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-textdark mb-1">Route</label>
              <select value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary">
                <option value="">Select a route</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>{r.origin} → {r.destination}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textdark mb-1">Price (KES)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary" />
            </div>
          </div>
          <button type="submit" disabled={submitting}
            className="bg-primary text-white font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50">
            {submitting ? 'Saving...' : 'Set Fare'}
          </button>
        </form>

        <h3 className="font-semibold text-textdark mb-3">Current Fares</h3>
        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading...</p>
        ) : fares.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No fares set yet.</p>
        ) : (
          <div className="space-y-3">
            {fares.filter((f) => !f.effective_to).map((f) => (
              <div key={f.id} className="bg-card rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-accent w-10 h-10 rounded-xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faTag} className="text-white" />
                  </div>
                  <p className="text-sm font-medium text-textdark">{routeLabel(f.route)}</p>
                </div>
                <p className="font-bold text-primary">KES {f.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageFares;