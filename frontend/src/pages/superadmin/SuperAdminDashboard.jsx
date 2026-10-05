import AdminLayout from '../../components/AdminLayout';
import { faBuilding, faUsers, faUserShield, faChartLine, faGauge } from '@fortawesome/free-solid-svg-icons';

const navItems = [
  { label: 'Dashboard', to: '/super-admin/dashboard', icon: faGauge },
  { label: 'Manage Companies', to: '/super-admin/companies', icon: faBuilding },
  { label: 'Manage Users', to: '/super-admin/users', icon: faUsers },
  { label: 'Add Company Admin', to: '/super-admin/add-admin', icon: faUserShield },
  { label: 'Analytics', to: '/super-admin/analytics', icon: faChartLine },
];

const steps = [
  { title: 'Add a transport company', desc: 'Register a new company from Manage Companies.' },
  { title: 'Assign a company admin', desc: 'Onboard someone to manage that company from Add Company Admin.' },
  { title: 'Keep an eye on everyone', desc: 'See every user on the platform, grouped by company, in Manage Users.' },
  { title: 'Check platform health', desc: 'Review revenue and activity across all companies in Analytics.' },
];

function SuperAdminDashboard() {
  return (
    <AdminLayout title="Platform Administration" navItems={navItems}>
      <h1 className="text-2xl font-bold text-primary mb-1">Welcome back</h1>
      <p className="text-gray-500 mb-10">
        Use the menu on the left for full platform oversight — companies, users, and analytics.
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

export default SuperAdminDashboard;