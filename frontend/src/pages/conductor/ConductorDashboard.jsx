import Navbar from '../../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQrcode,
  faClockRotateLeft,
  faArrowRight,
  faBusSimple,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function ConductorDashboard() {
  const cards = [
    {
      icon: faQrcode,
      title: 'Scan Pass',
      desc: 'Validate a passenger QR code',
      to: '/conductor/scan',
      color: 'bg-secondary',
    },
    {
      icon: faClockRotateLeft,
      title: 'Validation History',
      desc: 'View your past scans',
      to: '/conductor/history',
      color: 'bg-primary',
    },
  ];

  return (
    <div className="min-h-screen bg-background">

      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">

          <div className="flex items-center gap-3 mb-3">

            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <FontAwesomeIcon
                icon={faBusSimple}
                className="text-white"
              />
            </div>

            <p className="text-secondary text-sm font-semibold">
              Conductor Portal
            </p>

          </div>

          <h1 className="text-2xl font-bold text-primary mb-1">
            Conductor Dashboard
          </h1>

          <p className="text-gray-500">
            Scan passenger passes and review your validation history.
          </p>

        </div>

        {/* Quick Overview */}
        <div className="bg-card rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">

          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon
                icon={faQrcode}
                className="text-secondary text-lg"
              />
            </div>

            <div>
              <p className="font-semibold text-textdark">
                Ready to validate passenger passes
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Scan a passenger's QR pass to verify their active
                subscription before boarding.
              </p>
            </div>

          </div>

        </div>

        {/* Action Cards */}
        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl">

          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="bg-card rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition group"
            >

              <div
                className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center mb-5`}
              >
                <FontAwesomeIcon
                  icon={card.icon}
                  className="text-white text-lg"
                />
              </div>

              <h3 className="font-semibold text-textdark mb-1">
                {card.title}
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                {card.desc}
              </p>

              <span className="text-sm text-secondary font-medium flex items-center gap-1">
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

export default ConductorDashboard;