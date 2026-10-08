import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faUsers, faRoute, faQrcode } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../components/AdminLayout';
import { companyAdminNav, superAdminNav } from '../../components/adminNav';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';

function Analytics({ title = 'Analytics', subtitle = 'Overview of your performance.' }) {
  const { user } = useAuth();
  const isSuper = user?.role === 'super_admin';
  const navItems = isSuper ? superAdminNav : companyAdminNav;
  const layoutTitle = isSuper ? 'Platform Administration' : 'Company Administration';

  const [revenue, setRevenue] = useState(null);
  const [activeSubs, setActiveSubs] = useState(null);
  const [routePopularity, setRoutePopularity] = useState([]);
  const [validations, setValidations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      axiosInstance.get('/analytics/revenue/'),
      axiosInstance.get('/analytics/active-subscriptions/'),
      axiosInstance.get('/analytics/route-popularity/'),
      axiosInstance.get('/analytics/boarding-validations/'),
    ]).then(([rev, subs, routes, val]) => {
      if (rev.status === 'fulfilled') setRevenue(rev.value.data);
      if (subs.status === 'fulfilled') setActiveSubs(subs.value.data);
      if (routes.status === 'fulfilled') setRoutePopularity(routes.value.data.route_popularity || []);
      if (val.status === 'fulfilled') setValidations(val.value.data);
    }).finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: faMoneyBillWave, label: 'Revenue', value: revenue ? `KES ${revenue.total_revenue}` : '—', color: 'bg-secondary' },
    { icon: faUsers, label: 'Active Subscriptions', value: activeSubs ? activeSubs.total_active_subscriptions : '—', color: 'bg-primary' },
    { icon: faQrcode, label: 'Boarding Validations', value: validations ? validations.total_validations : '—', color: 'bg-accent' },
  ];

  return (
    <AdminLayout title={layoutTitle} navItems={navItems}>
      <h1 className="text-2xl font-bold text-primary mb-1">{title}</h1>
      <p className="text-gray-500 mb-6">{subtitle}</p>

      {loading ? (
        <p className="text-gray-400 text-center py-8">Loading...</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {cards.map((c) => (
              <div key={c.label} className="bg-card rounded-2xl border border-gray-100 p-6 shadow-sm">
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
            <p className="text-gray-400">No boarding scans recorded yet.</p>
          ) : (
            <div className="grid lg:grid-cols-2 gap-3">
              {routePopularity.map((r) => (
                <div key={r.subscription__route__id} className="bg-card rounded-xl border border-gray-100 p-4 shadow-sm flex justify-between text-sm">
                  <span className="text-textdark">
                    {r.subscription__route__origin} → {r.subscription__route__destination}
                  </span>
                  <span className="font-semibold text-primary">{r.validation_count} scans</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}

export default Analytics;