import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faRightFromBracket, faBusSimple, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
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

  const handleReplayTour = () => {
    localStorage.removeItem('safaripass_tour_seen');
    window.location.reload();
  };

  return (
    <nav className="bg-primary shadow-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-white">
          <FontAwesomeIcon icon={faBusSimple} className="text-accent" />
          SafariPass
        </Link>
        {!isOnDashboard && (
          <Link
            to={dashboardPath}
            className="flex items-center gap-1 text-sm text-gray-300 hover:text-accent transition border-l border-white/20 pl-4"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" /> Back to Dashboard
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user?.role === 'passenger' && isOnDashboard && (
          <button
            onClick={handleReplayTour}
            className="flex items-center gap-1 text-sm text-accent hover:opacity-80 transition"
          >
            <FontAwesomeIcon icon={faCircleQuestion} /> Replay Tour
          </button>
        )}
        <span className="text-sm text-gray-300 capitalize hidden sm:inline">
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