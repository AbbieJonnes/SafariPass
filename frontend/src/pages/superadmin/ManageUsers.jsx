import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../components/AdminLayout';
import { superAdminNav } from '../../components/adminNav';
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

  const grouped = users.reduce((acc, u) => {
    const key = u.company_name || 'Platform Team';
    if (!acc[key]) acc[key] = [];
    acc[key].push(u);
    return acc;
  }, {});

  return (
    <AdminLayout title="Platform Administration" navItems={superAdminNav}>
      <h1 className="text-2xl font-bold text-primary mb-1">Manage Users</h1>
      <p className="text-gray-500 mb-6">All users, grouped by company.</p>

      {loading ? (
        <p className="text-gray-400 text-center py-8">Loading...</p>
      ) : Object.keys(grouped).length === 0 ? (
        <p className="text-gray-400 text-center py-8">No users found.</p>
      ) : (
        Object.entries(grouped).map(([companyName, groupUsers]) => (
          <div key={companyName} className="mb-8">
            <h3 className="font-semibold text-textdark mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} className="text-secondary" /> {companyName}
            </h3>
            <div className="grid lg:grid-cols-2 gap-3">
              {groupUsers.map((u) => (
                <div key={u.id} className="bg-card rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-textdark">{u.username}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${roleColor(u.role)}`}>
                      {u.role.replace('_', ' ')}
                    </span>
                    <FontAwesomeIcon
                      icon={u.is_active ? faCircleCheck : faCircleXmark}
                      className={u.is_active ? 'text-green-600' : 'text-red-400'}
                      title={u.is_active ? 'Active' : 'Inactive'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </AdminLayout>
  );
}

export default ManageUsers;