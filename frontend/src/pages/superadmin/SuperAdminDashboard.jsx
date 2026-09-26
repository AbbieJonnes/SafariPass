import Navbar from '../../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUsers, faUserShield, faChartLine, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function SuperAdminDashboard() {
  const cards = [
    { icon: faBuilding, title: 'Manage Companies', desc: 'Add or edit transport companies', to: '/super-admin/companies', color: 'bg-primary' },
    { icon: faUsers, title: 'Manage Users', desc: 'View all platform users', to: '/super-admin/users', color: 'bg-secondary' },
    { icon: faUserShield, title: 'Add Company Admin', desc: 'Onboard a new company admin', to: '/super-admin/add-admin', color: 'bg-accent' },
    { icon: faChartLine, title: 'Platform Analytics', desc: 'Revenue and usage, platform-wide', to: '/super-admin/analytics', color: 'bg-primary' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-1">Super Admin Dashboard</h1>
        <p className="text-gray-500 mb-8">Full platform oversight — companies, users, and analytics.</p>

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

export default SuperAdminDashboard;