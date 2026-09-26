import Navbar from '../../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faClockRotateLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function ConductorDashboard() {
  const cards = [
    { icon: faQrcode, title: 'Scan Pass', desc: 'Validate a passenger QR code', to: '/conductor/scan', color: 'bg-secondary' },
    { icon: faClockRotateLeft, title: 'Validation History', desc: 'View your past scans', to: '/conductor/history', color: 'bg-primary' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-1">Conductor Dashboard</h1>
        <p className="text-gray-500 mb-8">Scan passenger passes and review your validation history.</p>

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
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

export default ConductorDashboard;