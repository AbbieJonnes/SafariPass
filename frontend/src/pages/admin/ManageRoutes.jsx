import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faArrowRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';

function ManageRoutes() {
  const [routes, setRoutes] = useState([]);
  const [company, setCompany] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadRoutes = (companyId) => {
    axiosInstance.get('/companies/routes/').then((res) => {
      setRoutes(res.data.filter((r) => r.company === companyId));
    });
  };

  useEffect(() => {
    axiosInstance.get('/accounts/profile/').then((res) => {
      setCompany(res.data.company);
      loadRoutes(res.data.company);
    }).finally(() => setLoading(false));
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    axiosInstance.post('/companies/routes/', { company, origin, destination })
      .then(() => {
        setMessage('Route added successfully.');
        setOrigin('');
        setDestination('');
        loadRoutes(company);
      })
      .catch(() => setMessage('Could not add route.'))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-1">Manage Routes</h1>
        <p className="text-gray-500 mb-6">Add and view routes for your company.</p>

        <form onSubmit={handleAdd} className="bg-card rounded-2xl p-6 shadow-sm mb-8 space-y-4">
          <h3 className="font-semibold text-textdark flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} className="text-secondary" /> Add New Route
          </h3>
          {message && <div className="bg-blue-50 text-blue-700 text-sm rounded-lg px-4 py-3">{message}</div>}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-textdark mb-1">Origin</label>
              <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} required
                placeholder="e.g. Nairobi CBD"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textdark mb-1">Destination</label>
              <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} required
                placeholder="e.g. Rongai, Kajiado"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary" />
            </div>
          </div>
          <button type="submit" disabled={submitting}
            className="bg-primary text-white font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50">
            {submitting ? 'Adding...' : 'Add Route'}
          </button>
        </form>

        <h3 className="font-semibold text-textdark mb-3">Existing Routes</h3>
        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading...</p>
        ) : routes.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No routes yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {routes.map((route) => (
              <div key={route.id} className="bg-card rounded-2xl p-5 shadow-sm flex items-center gap-3">
                <div className="bg-secondary w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faLocationDot} className="text-white" />
                </div>
                <p className="text-sm font-medium text-textdark">
                  {route.origin} <FontAwesomeIcon icon={faArrowRight} className="text-xs mx-1 text-gray-400" /> {route.destination}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageRoutes;