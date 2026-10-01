import Navbar from '../../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faUsers,
  faUserShield,
  faChartLine,
  faArrowRight,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function SuperAdminDashboard() {
  const cards = [
    {
      icon: faBuilding,
      title: 'Manage Companies',
      desc: 'Add or edit transport companies',
      to: '/super-admin/companies',
      color: 'bg-primary',
    },
    {
      icon: faUsers,
      title: 'Manage Users',
      desc: 'View all platform users',
      to: '/super-admin/users',
      color: 'bg-secondary',
    },
    {
      icon: faUserShield,
      title: 'Add Company Admin',
      desc: 'Onboard a new company admin',
      to: '/super-admin/add-admin',
      color: 'bg-accent',
    },
    {
      icon: faChartLine,
      title: 'Platform Analytics',
      desc: 'Revenue and usage, platform-wide',
      to: '/super-admin/analytics',
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

            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <FontAwesomeIcon
                icon={faShieldHalved}
                className="text-white"
              />
            </div>

            <p className="text-secondary text-sm font-semibold">
              Platform Administration
            </p>

          </div>

          <h1 className="text-2xl font-bold text-primary mb-1">
            Super Admin Dashboard
          </h1>

          <p className="text-gray-500">
            Manage companies, users, administrators, and platform-wide analytics.
          </p>

        </div>

        {/* Quick Overview */}
        <div className="bg-card rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">

          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon
                icon={faChartLine}
                className="text-primary text-lg"
              />
            </div>

            <div>
              <p className="font-semibold text-textdark">
                Full platform oversight
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Use the tools below to manage transport companies, platform
                users, company administrators, and overall system performance.
              </p>
            </div>

          </div>

        </div>

        {/* Management Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

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

export default SuperAdminDashboard;