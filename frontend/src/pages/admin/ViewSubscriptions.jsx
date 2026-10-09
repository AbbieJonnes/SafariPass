import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../components/AdminLayout';
import { companyAdminNav } from '../../components/adminNav';
import axiosInstance from '../../api/axiosInstance';

const routeLabel = (route) =>
  route && typeof route === 'object' ? `${route.origin} → ${route.destination}` : `Route #${route}`;

const statusOf = (s) =>
  s.status === 'expired' || new Date(s.expiry_date) < new Date() ? 'expired' : s.status;

function ViewSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axiosInstance.get('/subscriptions/')
      .then((res) => setSubscriptions(res.data))
      .finally(() => setLoading(false));
  }, []);

  const visible = subscriptions.filter((s) => filter === 'all' || statusOf(s) === filter);

  return (
    <AdminLayout title="Company Administration" navItems={companyAdminNav}>
      <h1 className="text-2xl font-bold text-primary mb-1">Subscriptions</h1>
      <p className="text-gray-500 mb-6">Passengers subscribed to your company's routes.</p>

      <div className="flex gap-2 mb-6">
        {['all', 'active', 'expired'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm capitalize transition ${
              filter === f ? 'bg-primary text-white' : 'bg-card border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-8">Loading...</p>
      ) : visible.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No subscriptions to show.</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {visible.map((s) => {
            const status = statusOf(s);
            const active = status === 'active';
            return (
              <div key={s.id} className="bg-card rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faUser} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-textdark truncate">
                      {s.passenger_username || 'Passenger'} · #{s.id}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{routeLabel(s.route)}</p>
                    {s.plan_label && <p className="text-xs text-gray-400">{s.plan_label}</p>}
                    <p className="text-xs text-gray-400">
                      {active ? 'Expires' : 'Expired'}: {new Date(s.expiry_date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <FontAwesomeIcon icon={active ? faCircleCheck : faCircleXmark}
                    className={`text-xl ${active ? 'text-green-600' : 'text-red-500'}`} />
                  <span className={`text-xs font-medium capitalize ${active ? 'text-green-700' : 'text-red-600'}`}>
                    {status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}

export default ViewSubscriptions;