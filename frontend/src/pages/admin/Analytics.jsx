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
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    Promise.allSettled([
      axiosInstance.get('/analytics/revenue/'),
      axiosInstance.get('/analytics/active-subscriptions/'),
      axiosInstance.get('/analytics/route-popularity/'),
      axiosInstance.get('/analytics/boarding-validations/'),
    ]).then(([rev, subs, routes, val]) => {
      if (rev.status === 'fulfilled') setRevenue(rev.value.data);
      if (subs.status === 'fulfilled') setActiveSubs(subs.value.data);
      if (routes.status === 'fulfilled') setRoutePopularity(routes.value.data);
      if (val.status === 'fulfilled') setValidations(val.value.data);
      if ([rev, subs, routes, val].every((r) => r.status === 'rejected')) {
        setErrorMsg('Could not load analytics. Check that the analytics endpoints match your backend URLs.');
      }
    }).finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: faMoneyBillWave, label: 'Revenue', value: revenue?.total_revenue ?? revenue?.revenue ?? '—', color: 'bg-secondary' },
    { icon: faUsers, label: 'Active Subscriptions', value: activeSubs?.count ?? activeSubs?.active_subscriptions ?? '—', color: 'bg-primary' },
    { icon: faQrcode, label: 'Boarding Validations', value: validations?.count ?? validations?.total ?? '—', color: 'bg-accent' },
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
            {errorMsg && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">{errorMsg}</div>}

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
                    <span className="font-semibold text-primary">{r.count || r.subscriptions || '—'}</span>
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