import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/accounts/users/')
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  const roleColor = (role) => {
    if (role === 'super_admin') return 'bg-primary/10 text-primary';
    if (role === 'company_admin') return 'bg-secondary/10 text-secondary';
    if (role === 'conductor') return 'bg-accent/10 text-accent';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-1">Manage Users</h1>
        <p className="text-gray-500 mb-6">All users across the platform.</p>

        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No users found.</p>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.id} className="bg-card rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-textdark">{u.username}</p>
                    <p className="text-xs text-gray-400">{u.email}{u.company_name ? ` — ${u.company_name}` : ''}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${roleColor(u.role)}`}>
                  {u.role.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;