import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import PassengerTour from '../../components/PassengerTour';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQrcode,
  faRoute,
  faCreditCard,
  faUser,
  faMapLocationDot,
  faArrowRight,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

function PassengerDashboard() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/subscriptions/')
      .then((res) => {
        if (res.data.length > 0) {
          setSubscription(res.data[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      icon: faQrcode,
      title: 'My QR Pass',
      desc: 'View your scannable pass',
      to: '/passenger/qr',
      color: 'bg-secondary',
      tourClass: 'tour-qr',
      cardColor: 'bg-[#E3F3E9]',
      borderColor: 'border-[#CBE6D4]',
      hoverColor: 'hover:bg-[#D9EEDF]',
    },
    {
      icon: faMapLocationDot,
      title: 'Route Shift',
      desc: 'Temporarily change routes',
      to: '/passenger/shift',
      color: 'bg-accent',
      tourClass: 'tour-shift',
      cardColor: 'bg-[#EAF5DE]',
      borderColor: 'border-[#D5E8C1]',
      hoverColor: 'hover:bg-[#E0EFD1]',
    },
    {
      icon: faCreditCard,
      title: 'Payment History',
      desc: 'See past transactions',
      to: '/passenger/payments',
      color: 'bg-secondary',
      tourClass: 'tour-payments',
      cardColor: 'bg-[#DDF0E5]',
      borderColor: 'border-[#C6E4D4]',
      hoverColor: 'hover:bg-[#D2E9DC]',
    },
    {
      icon: faUser,
      title: 'My Profile',
      desc: 'Edit your account details',
      to: '/passenger/profile',
      color: 'bg-primary',
      tourClass: 'tour-profile',
      cardColor: 'bg-[#F0F7EF]',
      borderColor: 'border-[#DCE9D9]',
      hoverColor: 'hover:bg-[#E5F1E3]',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#E4F4E9] via-[#F3F9F4] to-white">
        <Navbar />

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-white/80 rounded-2xl border border-green-100 shadow-sm p-8 text-center">
            <p className="text-sm text-gray-400">
              Loading your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#E4F4E9] via-[#F3F9F4] to-white">
        <Navbar />
        <PassengerTour />

        <div className="max-w-2xl mx-auto px-6 py-16 text-center tour-welcome">
          <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon
              icon={faRoute}
              className="text-white text-2xl"
            />
          </div>

          <p className="text-secondary text-sm font-semibold mb-2">
            Welcome to SafariPass
          </p>

          <h1 className="text-2xl font-bold text-primary mb-3">
            Start your journey
          </h1>

          <p className="text-gray-500 leading-relaxed mb-8">
            You don't have an active subscription yet. Pick a company and
            route to get your first QR pass.
          </p>

          <Link
            to="/passenger/browse"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3 rounded-xl hover:bg-primary/90 transition"
          >
            Browse Routes
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </div>
    );
  }

  const routeLabel =
    typeof subscription.route === 'object'
      ? `${subscription.route.origin} → ${subscription.route.destination}`
      : `Route #${subscription.route}`;

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#E4F4E9] via-[#F3F9F4] to-white">
      <Navbar />
      <PassengerTour />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome Header */}
        <div className="mb-8 tour-welcome">
          <p className="text-secondary text-sm font-semibold mb-2">
            Passenger Dashboard
          </p>

          <h1 className="text-2xl font-bold text-primary mb-1">
            Welcome back
          </h1>

          <p className="text-gray-600">
            Here's your SafariPass account at a glance.
          </p>
        </div>

        {/* Active Subscription */}
        <div className="bg-[#E0F1E5] rounded-2xl border border-[#C9E4D1] shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#C5E6D0] flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-green-700 text-lg"
                />
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Active Route
                </p>

                <p className="font-semibold text-textdark">
                  {routeLabel}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  Expires {subscription.expiry_date}
                  {' — '}
                  <span className="capitalize">
                    {subscription.status}
                  </span>
                </p>
              </div>
            </div>

            <Link
              to="/passenger/qr"
              className="text-secondary font-medium text-sm flex items-center gap-2 hover:text-primary transition"
            >
              View QR Pass
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-xs"
              />
            </Link>
          </div>
        </div>

        {/* Dashboard Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className={`${card.cardColor} ${card.borderColor} ${card.hoverColor} rounded-2xl border p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-200 group ${card.tourClass}`}
            >
              <div
                className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-sm`}
              >
                <FontAwesomeIcon
                  icon={card.icon}
                  className="text-white text-lg"
                />
              </div>

              <h3 className="font-semibold text-textdark mb-1">
                {card.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                {card.desc}
              </p>

              <span className="text-sm text-secondary font-semibold flex items-center gap-1">
                Open
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-xs group-hover:translate-x-1 transition"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PassengerDashboard;

