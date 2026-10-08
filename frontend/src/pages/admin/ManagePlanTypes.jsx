import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faPlus } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../components/AdminLayout';
import { companyAdminNav } from '../../components/adminNav';
import axiosInstance from '../../api/axiosInstance';

function ManagePlanTypes() {
  const [plans, setPlans] = useState([]);
  const [category, setCategory] = useState('full_day');
  const [duration, setDuration] = useState('weekly');
  const [multiplier, setMultiplier] = useState('');
  const [peakStart, setPeakStart] = useState('');
  const [peakEnd, setPeakEnd] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadPlans = () => {
    axiosInstance.get('/companies/plan-types/')
      .then((res) => setPlans(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    const payload = {
      plan_category: category,
      duration,
      price_multiplier: multiplier,
    };
    if (category === 'peak') {
      payload.peak_start_time = peakStart;
      payload.peak_end_time = peakEnd;
    }
    axiosInstance.post('/companies/plan-types/', payload)
      .then(() => {
        setMessage('Plan type added.');
        setMultiplier('');
        setPeakStart('');
        setPeakEnd('');
        loadPlans();
      })
      .catch(() => setMessage('Could not add plan type.'))
      .finally(() => setSubmitting(false));
  };

  return (
    <AdminLayout title="Company Administration" navItems={companyAdminNav}>
      <h1 className="text-2xl font-bold text-primary mb-1">Plan Types</h1>
      <p className="text-gray-500 mb-6">Define Full Day and Peak Hours plans, weekly or monthly.</p>

      <form onSubmit={handleAdd} className="bg-card rounded-2xl border border-gray-100 p-6 shadow-sm mb-8 space-y-4">
        <h3 className="font-semibold text-textdark flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} className="text-secondary" /> Add Plan Type
        </h3>
        {message && <div className="bg-blue-50 text-blue-700 text-sm rounded-lg px-4 py-3">{message}</div>}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-textdark mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary">
              <option value="full_day">Full Day</option>
              <option value="peak">Peak Hours</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-textdark mb-1">Duration</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary">
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-textdark mb-1">Price Multiplier</label>
            <input type="number" step="0.1" value={multiplier} onChange={(e) => setMultiplier(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary" />
          </div>
          {category === 'peak' && (
            <>
              <div>
                <label className="block text-sm font-medium text-textdark mb-1">Peak Start</label>
                <input type="time" value={peakStart} onChange={(e) => setPeakStart(e.target.value)} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-textdark mb-1">Peak End</label>
                <input type="time" value={peakEnd} onChange={(e) => setPeakEnd(e.target.value)} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary" />
              </div>
            </>
          )}
        </div>
        <button type="submit" disabled={submitting}
          className="bg-primary text-white font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50">
          {submitting ? 'Adding...' : 'Add Plan Type'}
        </button>
      </form>

      <h3 className="font-semibold text-textdark mb-3">Existing Plan Types</h3>
      {loading ? (
        <p className="text-gray-400 text-center py-8">Loading...</p>
      ) : plans.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No plan types yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div key={p.id} className="bg-card rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-3">
              <div className="bg-primary w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faLayerGroup} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-textdark capitalize">{p.plan_category.replace('_', ' ')} — {p.duration}</p>
                <p className="text-xs text-gray-500">Multiplier: {p.price_multiplier}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default ManagePlanTypes;