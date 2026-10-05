import AdminLayout from '../../components/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faTag, faLayerGroup, faUserPlus, faChartLine, faGauge } from '@fortawesome/free-solid-svg-icons';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: faGauge },
  { label: 'Manage Routes', to: '/admin/routes', icon: faRoute },
  { label: 'Manage Fares', to: '/admin/fares', icon: faTag },
  { label: 'Plan Types', to: '/admin/plan-types', icon: faLayerGroup },
  { label: 'Add Conductor', to: '/admin/add-conductor', icon: faUserPlus },
  { label: 'Subscriptions', to: '/admin/subscriptions', icon: faChartLine },
  { label: 'Analytics', to: '/admin/analytics', icon: faChartLine },
];

const steps = [
  { title: 'Set up your routes', desc: 'Add the routes your company operates from Manage Routes.' },
  { title: 'Set your fares', desc: 'Give each route a morning and evening price in Manage Fares.' },
  { title: 'Add your plan types', desc: 'Offer Full Day or Peak Hours plans, weekly or monthly.' },
  { title: 'Bring on your conductors', desc: "Add conductors so they can scan passengers' passes." },
];

function CompanyAdminDashboard() {
  return (
    <AdminLayout title="Company Administration" navItems={navItems}>
      <h1 className="text-2xl font-bold text-primary mb-1">Welcome back</h1>
      <p className="text-gray-500 mb-10">
        Use the menu on the left to manage your company's routes, fares, staff, and performance.
      </p>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.title} className="bg-card rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 items-start">
            <div className="w-9 h-9 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
              {index + 1}
            </div>
            <div>
              <h3 className="font-semibold text-textdark mb-1">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export default CompanyAdminDashboard;