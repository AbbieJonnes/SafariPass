import AdminLayout from '../../components/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRoute,
  faTag,
  faLayerGroup,
  faUserPlus,
  faUsers,
  faChartLine,
  faArrowRight,
  faGauge,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: faGauge },
  { label: 'Manage Routes', to: '/admin/routes', icon: faRoute },
  { label: 'Manage Fares', to: '/admin/fares', icon: faTag },
  { label: 'Plan Types', to: '/admin/plan-types', icon: faLayerGroup },
  { label: 'Add Conductor', to: '/admin/add-conductor', icon: faUserPlus },
  { label: 'Subscriptions', to: '/admin/subscriptions', icon: faUsers },
  { label: 'Analytics', to: '/admin/analytics', icon: faChartLine },
];

function CompanyAdminDashboard() {
  const cards = [
    { icon: faRoute, title: 'Manage Routes', desc: 'Add or edit your routes', to: '/admin/routes', color: 'bg-primary' },
    { icon: faTag, title: 'Manage Fares', desc: 'Update pricing for routes', to: '/admin/fares', color: 'bg-secondary' },
    { icon: faLayerGroup, title: 'Plan Types', desc: 'Full Day and Peak Hours plans', to: '/admin/plan-types', color: 'bg-accent' },
    { icon: faUserPlus, title: 'Add Conductor', desc: 'Onboard new staff', to: '/admin/add-conductor', color: 'bg-primary' },
    { icon: faUsers, title: 'Subscriptions', desc: 'View passenger subscriptions', to: '/admin/subscriptions', color: 'bg-secondary' },
    { icon: faChartLine, title: 'Analytics', desc: 'Revenue and route performance', to: '/admin/analytics', color: 'bg-accent' },
  ];

  return (
    <AdminLayout title="Company Administration" navItems={navItems}>
      <h1 className="text-2xl font-bold text-primary mb-1">Company Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage your company's routes, fares, plans, and staff.</p>

      <div className="grid sm:grid-cols-2 gap-5">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="bg-card rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 group"
          >
            <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center mb-5`}>
              <FontAwesomeIcon icon={card.icon} className="text-white text-lg" />
            </div>
            <h3 className="font-semibold text-textdark mb-1">{card.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{card.desc}</p>
            <span className="text-sm text-secondary font-medium flex items-center gap-1">
              Open <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition" />
            </span>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}

export default CompanyAdminDashboard;