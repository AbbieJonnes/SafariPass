import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import PassengerTour from '../../components/PassengerTour';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faRoute, faCreditCard, faUser, faMapLocationDot, faArrowRight, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

function PassengerDashboard() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/subscriptions/')
      .then((res) => {
        if (res.data.length > 0) setSubscription(res.data[res.data.length - 1]);
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: faQrcode, title: 'My QR Pass', desc: 'View your scannable pass', to: '/passenger/qr', color: 'bg-secondary', tourClass: 'tour-qr' },
    { icon: faMapLocationDot, title: 'Route Shift', desc: 'Temporarily change routes', to: '/passenger/shift', color: 'bg-accent', tourClass: 'tour-shift' },
    { icon: faCreditCard, title: 'Payment History', desc: 'See past transactions', to: '/passenger/payments', color: 'bg-secondary', tourClass: 'tour-payments' },
    { icon: faUser, title: 'My Profile', desc: 'Edit your account details', to: '/passenger/profile', color: 'bg-primary', tourClass: 'tour-profile' },
    { icon: faMapLocationDot, title: 'Route Map', desc: 'See your route and live location', to: '/passenger/map', color: 'bg-accent', tourClass: '' },
  ];

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
        <PassengerTour />
        <div className="max-w-2xl mx-auto px-6 py-16 text-center tour-welcome">
          <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faRoute} className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">Start your journey</h1>
          <p className="text-gray-500 mb-8">
            You don't have an active subscription yet. Pick a company and route to get your first QR pass.
          </p>
          <Link
            to="/passenger/browse"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition"
          >
            Browse Routes <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </div>
    );
  }

  const routeLabel = typeof subscription.route === 'object'
    ? `${subscription.route.origin} → ${subscription.route.destination}`
    : `Route #${subscription.route}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PassengerTour />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-1 tour-welcome">Welcome back</h1>
        <p className="text-gray-500 mb-6">Here's your account at a glance.</p>

        <div className="bg-card rounded-2xl p-6 shadow-sm mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faCircleCheck} className="text-green-600 text-2xl" />
            <div>
              <p className="font-semibold text-textdark">{routeLabel}</p>
              <p className="text-sm text-gray-500">Expires {subscription.expiry_date} — status: {subscription.status}</p>
            </div>
          </div>
          <Link to="/passenger/qr" className="text-secondary font-medium text-sm flex items-center gap-1">
            View QR Pass <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Link key={card.title} to={card.to} className={`bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition group ${card.tourClass}`}>
              <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <FontAwesomeIcon icon={card.icon} className="text-white text-xl" />
              </div>
              <h3 className="font-semibold text-textdark mb-1">{card.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{card.desc}</p>
              <span className="text-sm text-secondary font-medium flex items-center gap-1">
                Open <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PassengerDashboard;