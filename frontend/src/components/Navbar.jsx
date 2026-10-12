import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faRightFromBracket, faBusSimple, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const dashboardByRole = {
  passenger: '/passenger/dashboard',
  conductor: '/conductor/dashboard',
  company_admin: '/admin/dashboard',
  super_admin: '/super-admin/dashboard',
};

function Navbar({ hideBack = false }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [photo, setPhoto] = useState(null);
  const [photoFailed, setPhotoFailed] = useState(false);
  const dashboardPath = user ? dashboardByRole[user.role] : '/';
  const isOnDashboard = location.pathname === dashboardPath;
  const showBack = !isOnDashboard && !hideBack;

  useEffect(() => {
    if (!user) return;

    const loadPhoto = () => {
      axiosInstance.get('/accounts/profile/')
        .then((res) => {
          setPhoto(res.data.profile_picture || null);
          setPhotoFailed(false);
        })
        .catch(() => {});
    };

    loadPhoto();
    window.addEventListener('profile-updated', loadPhoto);
    return () => window.removeEventListener('profile-updated', loadPhoto);
  }, [user?.token]);

  const handleReplayTour = () => {
    localStorage.removeItem('safaripass_tour_seen');
    window.location.reload();
  };

  return (
    <nav className="bg-primary shadow-md px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 flex-shrink-0">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <Link to="/" className="flex items-center gap-2 font-bold text-white flex-shrink-0">
          <FontAwesomeIcon icon={faBusSimple} className="text-accent" />
          <span className={showBack ? 'hidden sm:inline' : ''}>SafariPass</span>
        </Link>

        {showBack && (
          <Link
            to={dashboardPath}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium bg-white/10 hover:bg-white/20 text-white px-2.5 sm:px-3 py-1.5 rounded-lg transition border border-white/10 whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            <span className="sm:hidden">Dashboard</span>
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {user?.role === 'passenger' && isOnDashboard && (
          <button
            onClick={handleReplayTour}
            aria-label="Replay tour"
            className="flex items-center gap-1 text-sm text-accent hover:opacity-80 transition"
          >
            <FontAwesomeIcon icon={faCircleQuestion} />
            <span className="hidden sm:inline">Replay Tour</span>
          </button>
        )}

        <div className="flex items-center gap-2 min-w-0">
          {photo && !photoFailed ? (
            <img
              src={photo}
              alt=""
              onError={() => setPhotoFailed(true)}
              className="w-8 h-8 rounded-full object-cover border border-white/20 flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-accent text-primary font-bold flex items-center justify-center text-sm flex-shrink-0">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          )}
          <span className="text-sm text-gray-300 capitalize truncate max-w-[64px] sm:max-w-none">
            {user?.username}
            <span className="hidden sm:inline"> — {user?.role?.replace('_', ' ')}</span>
          </span>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition flex-shrink-0"
        >
          <FontAwesomeIcon icon={faRightFromBracket} /> Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;