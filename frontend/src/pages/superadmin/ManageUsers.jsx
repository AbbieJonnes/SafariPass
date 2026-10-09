import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding, faCircleCheck, faCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../components/AdminLayout';
import { superAdminNav } from '../../components/adminNav';
import axiosInstance from '../../api/axiosInstance';

const PAGE_SIZE = 10;

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);

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

  const companyName = (u) => u.company_name || 'Platform Team';
  const companyOptions = [...new Set(users.map(companyName))].sort();

  const filtered = users.filter((u) => {
    const matchesSearch =
      !search ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase());
    const matchesCompany = companyFilter === 'all' || companyName(u) === companyFilter;
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesCompany && matchesRole;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageUsers = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <AdminLayout title="Platform Administration" navItems={superAdminNav}>
      <h1 className="text-2xl font-bold text-primary mb-1">Manage Users</h1>
      <p className="text-gray-500 mb-6">Search and filter every user on the platform.</p>

      <div className="bg-card rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 grid md:grid-cols-3 gap-3">
        <div className="relative">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search username or email"
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
        <select
          value={companyFilter}
          onChange={(e) => { setCompanyFilter(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <option value="all">All companies</option>
          {companyOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <option value="all">All roles</option>
          <option value="passenger">Passengers</option>
          <option value="conductor">Conductors</option>
          <option value="company_admin">Company admins</option>
          <option value="super_admin">Super admins</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-8">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No users match these filters.</p>
      ) : (
        <>
          <div className="grid lg:grid-cols-2 gap-3 mb-6">
            {pageUsers.map((u) => (
              <div key={u.id} className="bg-card rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-textdark truncate">{u.username}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <FontAwesomeIcon icon={faBuilding} /> {companyName(u)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
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

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {filtered.length} user{filtered.length === 1 ? '' : 's'}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-card hover:bg-gray-50 transition disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-textdark">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-card hover:bg-gray-50 transition disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export default ManageUsers;