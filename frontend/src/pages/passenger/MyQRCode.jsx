import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faCalendarCheck, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';

function MyQRCode() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/subscriptions/')
      .then((res) => {
        if (res.data.length > 0) setSubscription(res.data[res.data.length - 1]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <p className="text-center text-gray-400 py-12">Loading...</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-16 text-center">
          <p className="text-gray-500 mb-4">You don't have an active subscription yet.</p>
        </div>
      </div>
    );
  }

  const isActive = subscription.status === 'active';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${subscription.qr_token}`;
  const routeLabel = typeof subscription.route === 'object'
    ? `${subscription.route.origin} → ${subscription.route.destination}`
    : `Route #${subscription.route}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-1">My QR Pass</h1>
        <p className="text-gray-500 mb-6">Show this to your conductor when boarding.</p>

        <div className="bg-card rounded-2xl p-6 shadow-sm text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${
            isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <FontAwesomeIcon icon={isActive ? faCircleCheck : faCircleXmark} />
            {subscription.status}
          </div>

          <img src={qrUrl} alt="QR Code" className="mx-auto mb-4 rounded-lg" />

          <div className="text-left space-y-2 border-t border-gray-100 pt-4">
            <p className="text-sm text-textdark flex items-center gap-2">
              <FontAwesomeIcon icon={faRoute} className="text-secondary" /> {routeLabel}
            </p>
            <p className="text-sm text-textdark flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendarCheck} className="text-secondary" /> Expires: {subscription.expiry_date}
            </p>
            <p className="text-sm text-gray-500">Route shifts used: {subscription.shift_count} / 3</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyQRCode;