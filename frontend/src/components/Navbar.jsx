import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBusSimple, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  const roleLabels = {
    passenger: 'Passenger',
    conductor: 'Conductor',
    company_admin: 'Company Admin',
    super_admin: 'Super Admin',
  };

  return (
    <nav className="bg-primary px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2 text-white font-bold text-xl">
        <FontAwesomeIcon icon={faBusSimple} className="text-accent" />
        SafariPass
      </div>
      <div className="flex items-center gap-4 text-white">
        <span className="text-sm text-gray-200">
          {user?.username} · <span className="text-accent">{roleLabels[user?.role]}</span>
        </span>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition"
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;