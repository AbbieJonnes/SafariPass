import Navbar from '../../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRoute,
  faTag,
  faLayerGroup,
  faUserPlus,
  faUsers,
  faChartLine,
  faArrowRight,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function CompanyAdminDashboard() {
  const cards = [
    {
      icon: faRoute,
      title: 'Manage Routes',
      desc: 'Add or edit your routes',
      to: '/admin/routes',
      color: 'bg-primary',
    },
    {
      icon: faTag,
      title: 'Manage Fares',
      desc: 'Update pricing for routes',
      to: '/admin/fares',
      color: 'bg-secondary',
    },
    {
      icon: faLayerGroup,
      title: 'Plan Types',
      desc: 'Full Day and Peak Hours plans',
      to: '/admin/plan-types',
      color: 'bg-accent',
    },
    {
      icon: faUserPlus,
      title: 'Add Conductor',
      desc: 'Onboard new staff',
      to: '/admin/add-conductor',
      color: 'bg-primary',
    },
    {
      icon: faUsers,
      title: 'Subscriptions',
      desc: 'View passenger subscriptions',
      to: '/admin/subscriptions',
      color: 'bg-secondary',
    },
    {
      icon: faChartLine,
      title: 'Analytics',
      desc: 'Revenue and route performance',
      to: '/admin/analytics',
      color: 'bg-accent',
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
                icon={faBuilding}
                className="text-white"
              />
            </div>

            <p className="text-secondary text-sm font-semibold">
              Company Administration
            </p>

          </div>

          <h1 className="text-2xl font-bold text-primary mb-1">
            Company Admin Dashboard
          </h1>

          <p className="text-gray-500">
            Manage your company's routes, fares, plans, and staff.
          </p>

        </div>

        {/* Quick Overview */}
        <div className="bg-card rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">

          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faChartLine}
                className="text-secondary text-lg"
              />
            </div>

            <div>
              <p className="font-semibold text-textdark">
                Manage your transport operations
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Use the tools below to manage routes, pricing, staff,
                subscriptions, and company performance.
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

export default CompanyAdminDashboard;