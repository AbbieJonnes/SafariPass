import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faUsers, faRoute, faQrcode } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';

function Analytics({ title = 'Analytics', subtitle = 'Overview of your performance.' }) {
  const [revenue, setRevenue] = useState(null);
  const [activeSubs, setActiveSubs] = useState(null);
  const [routePopularity, setRoutePopularity] = useState([]);
  const [validations, setValidations] = useState(null);
  const [loading, setLoading] = useState(true);

  const toArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.results)) return data.results;
    if (data && typeof data === 'object') return Object.entries(data).map(([k, v]) => ({ route: k, count: v }));
    return [];
  };

  const firstNumber = (data, keys) => {
    if (!data) return '—';
    for (const key of keys) {
      if (data[key] !== undefined) return data[key];
    }
    if (typeof data === 'number') return data;
    return '—';
  };

  useEffect(() => {
    Promise.allSettled([
      axiosInstance.get('/analytics/revenue/'),
      axiosInstance.get('/analytics/active-subscriptions/'),
      axiosInstance.get('/analytics/route-popularity/'),
      axiosInstance.get('/analytics/boarding-validations/'),
    ]).then(([rev, subs, routes, val]) => {
      if (rev.status === 'fulfilled') setRevenue(rev.value.data);
      if (subs.status === 'fulfilled') setActiveSubs(subs.value.data);
      if (routes.status === 'fulfilled') setRoutePopularity(toArray(routes.value.data));
      if (val.status === 'fulfilled') setValidations(val.value.data);
    }).finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: faMoneyBillWave, label: 'Revenue', value: firstNumber(revenue, ['total_revenue', 'revenue']), color: 'bg-secondary' },
    { icon: faUsers, label: 'Active Subscriptions', value: firstNumber(activeSubs, ['count', 'active_subscriptions']), color: 'bg-primary' },
    { icon: faQrcode, label: 'Boarding Validations', value: firstNumber(validations, ['count', 'total']), color: 'bg-accent' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-1">{title}</h1>
        <p className="text-gray-500 mb-6">{subtitle}</p>

        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading...</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              {cards.map((c) => (
                <div key={c.label} className="bg-card rounded-2xl p-6 shadow-sm">
                  <div className={`${c.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                    <FontAwesomeIcon icon={c.icon} className="text-white text-xl" />
                  </div>
                  <p className="text-2xl font-bold text-primary">{c.value}</p>
                  <p className="text-sm text-gray-500">{c.label}</p>
                </div>
              ))}
            </div>

            <h3 className="font-semibold text-textdark mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faRoute} /> Route Popularity
            </h3>
            {routePopularity.length === 0 ? (
              <p className="text-gray-400">No data yet.</p>
            ) : (
              <div className="space-y-2">
                {routePopularity.map((r, i) => (
                  <div key={i} className="bg-card rounded-xl p-4 shadow-sm flex justify-between text-sm">
                    <span className="text-textdark">{r.route || r.name || `Route ${i + 1}`}</span>
                    <span className="font-semibold text-primary">{r.count ?? r.subscriptions ?? '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;