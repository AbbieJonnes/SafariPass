import {
  faGauge,
  faRoute,
  faTag,
  faLayerGroup,
  faUserPlus,
  faUsers,
  faChartLine,
  faBuilding,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';

export const companyAdminNav = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: faGauge },
  { label: 'Manage Routes', to: '/admin/routes', icon: faRoute },
  { label: 'Manage Fares', to: '/admin/fares', icon: faTag },
  { label: 'Plan Types', to: '/admin/plan-types', icon: faLayerGroup },
  { label: 'Add Conductor', to: '/admin/add-conductor', icon: faUserPlus },
  { label: 'Subscriptions', to: '/admin/subscriptions', icon: faUsers },
  { label: 'Analytics', to: '/admin/analytics', icon: faChartLine },
];

export const superAdminNav = [
  { label: 'Dashboard', to: '/super-admin/dashboard', icon: faGauge },
  { label: 'Manage Companies', to: '/super-admin/companies', icon: faBuilding },
  { label: 'Manage Users', to: '/super-admin/users', icon: faUsers },
  { label: 'Add Company Admin', to: '/super-admin/add-admin', icon: faUserShield },
  { label: 'Analytics', to: '/super-admin/analytics', icon: faChartLine },
];