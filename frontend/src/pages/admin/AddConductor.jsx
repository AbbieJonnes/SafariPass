import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faPenToSquare, faTrash, faCheck, faXmark, faUser } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../components/AdminLayout';
import ConfirmModal from '../../components/ConfirmModal';
import { companyAdminNav } from '../../components/adminNav';
import axiosInstance from '../../api/axiosInstance';

function errorText(err, fallback) {
  const data = err.response?.data;
  if (data && typeof data === 'object') {
    const firstKey = Object.keys(data)[0];
    const firstMsg = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
    return `${firstKey}: ${firstMsg}`;
  }
  return fallback;
}

function AddConductor() {
  const [conductors, setConductors] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadConductors = () => {
    axiosInstance.get('/accounts/conductors/')
      .then((res) => setConductors(res.data))
      .finally(() => setLoadingList(false));
  };

  useEffect(() => {
    loadConductors();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    axiosInstance.post('/accounts/register/', { username, email, role: 'conductor' })
      .then(() => {
        setSuccess(true);
        setMessage(`Conductor account created. ${username} will receive an email to set their password.`);
        setUsername('');
        setEmail('');
        loadConductors();
      })
      .catch((err) => {
        setSuccess(false);
        setMessage(errorText(err, 'Could not create conductor. Please try again.'));
      })
      .finally(() => setSubmitting(false));
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditUsername(c.username);
    setEditEmail(c.email);
    setMessage('');
  };

  const saveEdit = () => {
    setSavingEdit(true);
    axiosInstance.patch(`/accounts/conductors/${editingId}/`, {
      username: editUsername,
      email: editEmail,
    })
      .then(() => {
        setSuccess(true);
        setMessage('Conductor updated.');
        setEditingId(null);
        loadConductors();
      })
      .catch((err) => {
        setSuccess(false);
        setMessage(errorText(err, 'Could not update conductor.'));
      })
      .finally(() => setSavingEdit(false));
  };

  const confirmDelete = () => {
    setDeleting(true);
    axiosInstance.delete(`/accounts/conductors/${deleteTarget.id}/`)
      .then(() => {
        setSuccess(true);
        setMessage(`${deleteTarget.username} was removed.`);
        setDeleteTarget(null);
        loadConductors();
      })
      .catch(() => {
        setSuccess(false);
        setMessage('Could not delete conductor.');
        setDeleteTarget(null);
      })
      .finally(() => setDeleting(false));
  };

  return (
    <AdminLayout title="Company Administration" navItems={companyAdminNav}>
      <h1 className="text-2xl font-bold text-primary mb-1">Conductors</h1>
      <p className="text-gray-500 mb-6">Add conductors, edit their details, or remove them. New conductors get an email to set their own password.</p>

      {message && (
        <div className={`text-sm rounded-lg px-4 py-3 mb-6 ${success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4 mb-10">
        <h3 className="font-semibold text-textdark flex items-center gap-2">
          <FontAwesomeIcon icon={faUserPlus} className="text-secondary" /> Add a Conductor
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
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
        </div>
        <button type="submit" disabled={submitting}
          className="bg-primary text-white font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50 inline-flex items-center gap-2">
          <FontAwesomeIcon icon={faUserPlus} /> {submitting ? 'Creating...' : 'Create Conductor'}
        </button>
      </form>

      <h3 className="font-semibold text-textdark mb-3">Your Conductors</h3>
      {loadingList ? (
        <p className="text-gray-400 text-center py-8">Loading...</p>
      ) : conductors.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No conductors yet.</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {conductors.map((c) => (
            <div key={c.id} className="bg-card rounded-2xl border border-gray-100 p-5 shadow-sm">
              {editingId === c.id ? (
                <div className="space-y-3">
                  <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                  <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary" />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} disabled={savingEdit}
                      className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 inline-flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheck} /> {savingEdit ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditingId(null)}
                      className="border border-gray-300 text-textdark text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition inline-flex items-center gap-2">
                      <FontAwesomeIcon icon={faXmark} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-textdark truncate">{c.username}</p>
                      <p className="text-xs text-gray-400 truncate">{c.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(c)} title="Edit"
                      className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition flex items-center justify-center">
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button onClick={() => setDeleteTarget(c)} title="Delete"
                      className="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Remove this conductor?"
        message={deleteTarget ? `${deleteTarget.username} will lose access and can no longer scan passes. This cannot be undone.` : ''}
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}

export default AddConductor;