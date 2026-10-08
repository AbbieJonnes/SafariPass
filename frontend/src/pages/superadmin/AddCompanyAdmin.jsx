import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../components/AdminLayout';
import { superAdminNav } from '../../components/adminNav';
import axiosInstance from '../../api/axiosInstance';

function AddCompanyAdmin() {
  const [companies, setCompanies] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axiosInstance.get('/companies/').then((res) => setCompanies(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    axiosInstance.post('/accounts/register/', {
      username,
      email,
      role: 'company_admin',
      company: companyId,
    })
      .then(() => {
        setSuccess(true);
        setMessage(`Company admin created. ${username} will receive an email to set their password.`);
        setUsername('');
        setEmail('');
        setCompanyId('');
      })
      .catch((err) => {
        setSuccess(false);
        const data = err.response?.data;
        if (data && typeof data === 'object') {
          const firstKey = Object.keys(data)[0];
          const firstMsg = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
          setMessage(`${firstKey}: ${firstMsg}`);
        } else {
          setMessage('Could not create company admin. Please try again.');
        }
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <AdminLayout title="Platform Administration" navItems={superAdminNav}>
      <h1 className="text-2xl font-bold text-primary mb-1">Add Company Admin</h1>
      <p className="text-gray-500 mb-6">Assign an admin to manage a specific company.</p>

      <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        {message && (
          <div className={`text-sm rounded-lg px-4 py-3 ${success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-textdark mb-1">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textdark mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textdark mb-1">Company</label>
            <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary">
              <option value="">Select a company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" disabled={submitting}
          className="bg-primary text-white font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50 inline-flex items-center gap-2">
          <FontAwesomeIcon icon={faUserShield} /> {submitting ? 'Creating...' : 'Create Company Admin'}
        </button>
      </form>
    </AdminLayout>
  );
}

export default AddCompanyAdmin;