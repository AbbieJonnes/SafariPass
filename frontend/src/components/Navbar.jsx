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
    <nav className="bg-primary shadow-md px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-white">
          <FontAwesomeIcon icon={faBusSimple} className="text-accent" />
          SafariPass
        </Link>
        {!isOnDashboard && !hideBack && (
          <Link
            to={dashboardPath}
            className="flex items-center gap-2 text-sm font-medium bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition border border-white/10 ml-2"
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

        <div className="flex items-center gap-2">
          {photo && !photoFailed ? (
            <img
              src={photo}
              alt=""
              onError={() => setPhotoFailed(true)}
              className="w-8 h-8 rounded-full object-cover border border-white/20"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-accent text-primary font-bold flex items-center justify-center text-sm">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          )}
          <span className="text-sm text-gray-300 capitalize hidden sm:inline">
            {user?.username} — {user?.role?.replace('_', ' ')}
          </span>
        </div>

        <button onClick={logout} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition">
          <FontAwesomeIcon icon={faRightFromBracket} /> Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;