import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faPlus } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../components/AdminLayout';
import { superAdminNav } from '../../components/adminNav';
import axiosInstance from '../../api/axiosInstance';

function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadCompanies = () => {
    axiosInstance.get('/companies/')
      .then((res) => setCompanies(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    axiosInstance.post('/companies/', {
      name,
      contact_email: contactEmail,
      contact_phone: contactPhone,
    })
      .then(() => {
        setMessage('Company added successfully.');
        setName('');
        setContactEmail('');
        setContactPhone('');
        loadCompanies();
      })
      .catch(() => setMessage('Could not add company.'))
      .finally(() => setSubmitting(false));
  };

  return (
    <AdminLayout title="Platform Administration" navItems={superAdminNav}>
      <h1 className="text-2xl font-bold text-primary mb-1">Manage Companies</h1>
      <p className="text-gray-500 mb-6">Add transport companies to the platform.</p>

      <form onSubmit={handleAdd} className="bg-card rounded-2xl border border-gray-100 p-6 shadow-sm mb-8 space-y-4">
        <h3 className="font-semibold text-textdark flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} className="text-secondary" /> Add Company
        </h3>
        {message && <div className="bg-blue-50 text-blue-700 text-sm rounded-lg px-4 py-3">{message}</div>}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-textdark mb-1">Company Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textdark mb-1">Contact Email</label>
            <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textdark mb-1">Contact Phone</label>
            <input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary" />
          </div>
        </div>
        <button type="submit" disabled={submitting}
          className="bg-primary text-white font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50">
          {submitting ? 'Adding...' : 'Add Company'}
        </button>
      </form>

      <h3 className="font-semibold text-textdark mb-3">Existing Companies</h3>
      {loading ? (
        <p className="text-gray-400 text-center py-8">Loading...</p>
      ) : companies.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No companies yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {companies.map((c) => (
            <div key={c.id} className="bg-card rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-3">
              <div className="bg-primary w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faBuilding} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-textdark">{c.name}</p>
                <p className="text-xs text-gray-500">{c.contact_email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default ManageCompanies;