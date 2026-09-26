import Navbar from '../../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faRoute, faCreditCard, faUser, faMapLocationDot, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function PassengerDashboard() {
  const cards = [
    { icon: faQrcode, title: 'My QR Pass', desc: 'View your scannable pass', to: '/passenger/qr', color: 'bg-secondary' },
    { icon: faRoute, title: 'Browse Routes', desc: 'Subscribe to a new plan', to: '/passenger/browse', color: 'bg-primary' },
    { icon: faMapLocationDot, title: 'Route Shift', desc: 'Temporarily change routes', to: '/passenger/shift', color: 'bg-accent' },
    { icon: faCreditCard, title: 'Payment History', desc: 'See past transactions', to: '/passenger/payments', color: 'bg-secondary' },
    { icon: faUser, title: 'My Profile', desc: 'Edit your account details', to: '/passenger/profile', color: 'bg-primary' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-1">Welcome back</h1>
        <p className="text-gray-500 mb-8">Here's a quick overview of your SafariPass account.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition group"
            >
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