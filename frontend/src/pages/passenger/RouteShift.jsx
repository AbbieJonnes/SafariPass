import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faArrowRight,
  faClockRotateLeft,
  faRoute,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
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
        if (subsRes.data.length > 0) {
          setSubscription(subsRes.data[subsRes.data.length - 1]);
        }

        setRoutes(routesRes.data);
        setShifts(shiftsRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleShift = () => {
    if (!selectedRoute || !subscription) return;

    setSubmitting(true);
    setMessage('');

    axiosInstance
      .post('/subscriptions/shifts/', {
        subscription: subscription.id,
        temporary_route: selectedRoute.id,
      })
      .then((res) => {
        setMessage('Route shift started successfully.');
        setShifts([res.data, ...shifts]);
        setSelectedRoute(null);
      })
      .catch((err) =>
        setMessage(
          err.response?.data?.detail || 'Could not start route shift.'
        )
      )
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="flex items-center justify-center px-4 py-16">
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const currentRouteId = subscription
    ? typeof subscription.route === 'object'
      ? subscription.route.id
      : subscription.route
    : null;

  const availableRoutes = routes.filter(
    (route) => route.id !== currentRouteId
  );

  const shiftLimitReached =
    subscription && subscription.shift_count >= 3;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Page Header */}
        <div className="mb-7 sm:mb-8">
          <div className="flex items-start gap-3">

            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <FontAwesomeIcon
                icon={faRoute}
                className="text-white text-base sm:text-lg"
              />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary">
                Route Shift
              </h1>

              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                Temporarily switch to a different route, up to 3 times per
                subscription.
              </p>
            </div>

          </div>
        </div>

        {/* No Subscription */}
        {!subscription ? (
          <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon
                icon={faRoute}
                className="text-gray-400 text-lg"
              />
            </div>

            <h2 className="text-base sm:text-lg font-semibold text-textdark mb-1">
              No active subscription
            </h2>

            <p className="text-sm text-gray-400">
              You don't have a subscription yet.
            </p>
          </div>
        ) : (
          <>
            {/* Message */}
            {message && (
              <div
                className={`text-sm rounded-xl px-4 py-3 mb-6 border ${
                  message.includes('successfully')
                    ? 'bg-green-50 border-green-100 text-green-700'
                    : 'bg-blue-50 border-blue-100 text-blue-700'
                }`}
              >
                <div className="flex items-start gap-2">
                  <FontAwesomeIcon
                    icon={
                      message.includes('successfully')
                        ? faCircleCheck
                        : faRoute
                    }
                    className="mt-0.5 shrink-0"
                  />

                  <span>{message}</span>
                </div>
              </div>
            )}

            {/* Shift Limit */}
            {shiftLimitReached ? (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-7">
                You've used all 3 route shifts allowed for this subscription.
              </div>
            ) : (
              <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-sm mb-8">

                <div className="mb-5">
                  <h2 className="text-base font-semibold text-textdark">
                    Choose a temporary route
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Select the route you'd like to use temporarily.
                  </p>
                </div>

                {/* Routes */}
                {availableRoutes.length === 0 ? (
                  <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center">
                    <p className="text-sm text-gray-400">
                      No other routes are currently available.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    {availableRoutes.map((route) => (
                      <button
                        key={route.id}
                        onClick={() => setSelectedRoute(route)}
                        className={`rounded-xl p-4 text-left border-2 transition-all ${
                          selectedRoute?.id === route.id
                            ? 'border-secondary bg-secondary/5 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-secondary/40 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">

                          <div className="flex items-start gap-3 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                selectedRoute?.id === route.id
                                  ? 'bg-secondary'
                                  : 'bg-gray-100'
                              }`}
                            >
                              <FontAwesomeIcon
                                icon={faLocationDot}
                                className={
                                  selectedRoute?.id === route.id
                                    ? 'text-white text-sm'
                                    : 'text-secondary text-sm'
                                }
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-medium text-textdark leading-relaxed">
                                {route.origin}
                                <FontAwesomeIcon
                                  icon={faArrowRight}
                                  className="text-xs mx-2 text-gray-400"
                                />
                                {route.destination}
                              </p>

                              <p className="text-xs text-gray-400 mt-1">
                                Temporary route
                              </p>
                            </div>
                          </div>

                          {selectedRoute?.id === route.id && (
                            <FontAwesomeIcon
                              icon={faCircleCheck}
                              className="text-secondary shrink-0"
                            />
                          )}

                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={handleShift}
                  disabled={!selectedRoute || submitting}
                  className="w-full bg-primary text-white text-sm font-semibold py-3 rounded-xl hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    'Starting shift...'
                  ) : (
                    <>
                      Start Route Shift
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-xs"
                      />
                    </>
                  )}
                </button>

              </div>
            )}

            {/* Shift History */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-textdark">
                    Shift History
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Your previous temporary route changes.
                  </p>
                </div>

                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faClockRotateLeft}
                    className="text-gray-500 text-sm"
                  />
                </div>
              </div>

              {shifts.length === 0 ? (
                <div className="bg-card rounded-xl p-5 shadow-sm">
                  <p className="text-sm text-gray-400 text-center">
                    No route shifts yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {shifts.map((shift) => (
                    <div
                      key={shift.id}
                      className="bg-card rounded-xl p-4 sm:p-5 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                        <div>
                          <p className="text-sm font-medium text-textdark">
                            Route shift
                          </p>

                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Shifted on{' '}
                            {new Date(
                              shift.starts_at
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        <span
                          className={`self-start sm:self-auto text-xs font-medium px-2.5 py-1 rounded-full ${
                            shift.reverted
                              ? 'bg-gray-100 text-gray-500'
                              : 'bg-green-50 text-green-600'
                          }`}
                        >
                          {shift.reverted ? 'Reverted' : 'Active'}
                        </span>

                      </div>

                      {shift.extra_amount_paid > 0 && (
                        <div className="border-t border-gray-100 mt-3 pt-3">
                          <p className="text-xs sm:text-sm text-gray-500">
                            Extra paid:{' '}
                            <span className="font-medium text-textdark">
                              KES {shift.extra_amount_paid}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

          </>
        )}
      </main>
    </div>
  );
}

export default RouteShift;

