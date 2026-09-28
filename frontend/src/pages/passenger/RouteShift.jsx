import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faArrowRight, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';

function RouteShift() {
  const [subscription, setSubscription] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([
      axiosInstance.get('/subscriptions/'),
      axiosInstance.get('/companies/routes/'),
      axiosInstance.get('/subscriptions/shifts/'),
    ])
      .then(([subsRes, routesRes, shiftsRes]) => {
        if (subsRes.data.length > 0) setSubscription(subsRes.data[subsRes.data.length - 1]);
        setRoutes(routesRes.data);
        setShifts(shiftsRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleShift = () => {
    if (!selectedRoute || !subscription) return;
    setSubmitting(true);
    setMessage('');

    axiosInstance.post('/subscriptions/shifts/', {
      subscription: subscription.id,
      temporary_route: selectedRoute.id,
    })
      .then((res) => {
        setMessage('Route shift started successfully.');
        setShifts([res.data, ...shifts]);
        setSelectedRoute(null);
      })
      .catch((err) => setMessage(err.response?.data?.detail || 'Could not start route shift.'))
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <p className="text-center text-gray-400 py-12">Loading...</p>
      </div>
    );
  }

  const currentRouteId = subscription
    ? (typeof subscription.route === 'object' ? subscription.route.id : subscription.route)
    : null;
  const availableRoutes = routes.filter((r) => r.id !== currentRouteId);
  const shiftLimitReached = subscription && subscription.shift_count >= 3;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-1">Route Shift</h1>
        <p className="text-gray-500 mb-6">Temporarily switch to a different route (up to 3 times).</p>

        {!subscription ? (
          <p className="text-gray-400 text-center py-8">You don't have a subscription yet.</p>
        ) : (
          <>
            {message && <div className="bg-blue-50 text-blue-700 text-sm rounded-lg px-4 py-3 mb-4">{message}</div>}

            {shiftLimitReached ? (
              <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
                You've used all 3 route shifts allowed for this subscription.
              </div>
            ) : (
              <div className="bg-card rounded-2xl p-6 shadow-sm mb-8">
                <h3 className="font-semibold text-textdark mb-4">Choose a temporary route</h3>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  {availableRoutes.map((route) => (
                    <button
                      key={route.id}
                      onClick={() => setSelectedRoute(route)}
                      className={`rounded-xl p-4 text-left border-2 transition ${
                        selectedRoute?.id === route.id ? 'border-secondary bg-secondary/5' : 'border-gray-200'
                      }`}
                    >
                      <FontAwesomeIcon icon={faLocationDot} className="text-secondary mb-1" />
                      <p className="text-sm font-medium text-textdark">
                        {route.origin} <FontAwesomeIcon icon={faArrowRight} className="text-xs mx-1 text-gray-400" /> {route.destination}
                      </p>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleShift}
                  disabled={!selectedRoute || submitting}
                  className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {submitting ? 'Starting shift...' : 'Start Route Shift'}
                </button>
              </div>
            )}

            <h3 className="font-semibold text-textdark mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faClockRotateLeft} /> Shift History
            </h3>
            {shifts.length === 0 ? (
              <p className="text-gray-400 text-sm">No route shifts yet.</p>
            ) : (
              <div className="space-y-3">
                {shifts.map((shift) => (
                  <div key={shift.id} className="bg-card rounded-xl p-4 shadow-sm text-sm">
                    <p className="text-textdark">
                      Shifted on {new Date(shift.starts_at).toLocaleDateString()}
                      {shift.reverted ? ' (reverted)' : ' (active)'}
                    </p>
                    {shift.extra_amount_paid > 0 && (
                      <p className="text-gray-500">Extra paid: KES {shift.extra_amount_paid}</p>
                    )}
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

export default RouteShift;