import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightFromBracket,
  faBusSimple,
  faCircleQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const dashboardByRole = {
  passenger: '/passenger/dashboard',
  conductor: '/conductor/dashboard',
  company_admin: '/admin/dashboard',
  super_admin: '/super-admin/dashboard',
};

function Navbar({ hideBack = false }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const dashboardPath = user
    ? dashboardByRole[user.role]
    : '/';

  const isOnDashboard = location.pathname === dashboardPath;

  const handleReplayTour = () => {
    localStorage.removeItem('safaripass_tour_seen');
    window.location.reload();
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-primary shadow-md px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-white text-base sm:text-lg"
          >
            <FontAwesomeIcon
              icon={faBusSimple}
              className="text-accent"
            />
            SafariPass
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Replay Tour */}
            {user?.role === 'passenger' && isOnDashboard && (
              <button
                onClick={handleReplayTour}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-accent hover:text-white transition"
              >
                <FontAwesomeIcon icon={faCircleQuestion} />

                <span className="hidden sm:inline">
                  Replay Tour
                </span>
              </button>
            )}

            {/* User */}
            <span className="text-sm text-gray-300 capitalize hidden md:inline">
              {user?.username} — {user?.role?.replace('_', ' ')}
            </span>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs sm:text-sm text-red-400 hover:text-red-300 transition font-medium"
            >
              <FontAwesomeIcon icon={faRightFromBracket} />

              <span className="hidden sm:inline">
                Logout
              </span>
            </button>

          </div>
        </div>
      </nav>

      {/* Back to Dashboard Button */}
      {!isOnDashboard && !hideBack && (
        <div className="bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-5">
            <Link
              to={dashboardPath}
              className="inline-flex items-center justify-center bg-primary text-white hover:bg-primary/90 px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;

