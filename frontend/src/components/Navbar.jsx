import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faRightFromBracket, faBusSimple } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const dashboardByRole = {
  passenger: '/passenger/dashboard',
  conductor: '/conductor/dashboard',
  company_admin: '/admin/dashboard',
  super_admin: '/super-admin/dashboard',
};

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const dashboardPath = user ? dashboardByRole[user.role] : '/';
  const isOnDashboard = location.pathname === dashboardPath;

  return (
    <nav className="bg-card shadow-sm px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-primary">
          <FontAwesomeIcon icon={faBusSimple} className="text-secondary" />
          SafariPass
        </Link>
        {!isOnDashboard && (
          <Link
            to={dashboardPath}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition border-l border-gray-200 pl-4"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" /> Back to Dashboard
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 capitalize hidden sm:inline">
          {user?.username} — {user?.role?.replace('_', ' ')}
        </span>
        <button onClick={logout} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition">
          <FontAwesomeIcon icon={faRightFromBracket} /> Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;