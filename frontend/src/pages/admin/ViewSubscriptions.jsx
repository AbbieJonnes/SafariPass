import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../components/AdminLayout';
import { companyAdminNav } from '../../components/adminNav';
import axiosInstance from '../../api/axiosInstance';

function ViewSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/subscriptions/')
      .then((res) => setSubscriptions(res.data))
      .finally(() => setLoading(false));
  }, []);

  const routeLabel = (route) =>
    route && typeof route === 'object' ? `${route.origin} → ${route.destination}` : `Route #${route}`;

  return (
    <AdminLayout title="Company Administration" navItems={companyAdminNav}>
      <h1 className="text-2xl font-bold text-primary mb-1">Subscriptions</h1>
      <p className="text-gray-500 mb-6">Passengers subscribed to your company's routes.</p>

      {loading ? (
        <p className="text-gray-400 text-center py-8">Loading...</p>
      ) : subscriptions.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No subscriptions yet.</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {subscriptions.map((s) => (
            <div key={s.id} className="bg-card rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-textdark">Subscription #{s.id}</p>
                  <p className="text-sm text-gray-500">{routeLabel(s.route)}</p>
                  <p className="text-xs text-gray-400">Expires: {new Date(s.expiry_date).toLocaleDateString()}</p>
                </div>
              </div>
              <FontAwesomeIcon icon={s.status === 'active' ? faCircleCheck : faCircleXmark}
                className={`text-xl ${s.status === 'active' ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default ViewSubscriptions;