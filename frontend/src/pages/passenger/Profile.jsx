import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faLock, faSave, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';

const RING_PATH = 'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831';

function Ring({ percent, colorClass, children }) {
  return (
    <div className="relative w-24 h-24 mx-auto mb-3">
      <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
        <path className="text-gray-200" stroke="currentColor" strokeWidth="3" fill="none" d={RING_PATH} />
        {percent > 0 && (
          <path
            className={colorClass}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${percent}, 100`}
            d={RING_PATH}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">{children}</div>
    </div>
  );
}

function Profile() {
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [subsLoaded, setSubsLoaded] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pictureFile, setPictureFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    axiosInstance.get('/accounts/profile/').then((res) => {
      setProfile(res.data);
      setUsername(res.data.username);
      setEmail(res.data.email);
      setPreview(res.data.profile_picture);
    });

    axiosInstance.get('/subscriptions/')
      .then((res) => {
        const list = res.data;
        const now = new Date();
        const active = list.find((s) => s.status === 'active' && new Date(s.expiry_date) > now);
        setSubscription(active || list[0] || null);
      })
      .finally(() => setSubsLoaded(true));
  }, []);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPictureFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    setSaving(true);
    setMessage('');
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    if (pictureFile) formData.append('profile_picture', pictureFile);

    axiosInstance.patch('/accounts/profile/', formData)
      .then((res) => {
        setProfile(res.data);
        setMessage('Profile updated successfully.');
        window.dispatchEvent(new Event('profile-updated'));
      })
      .catch(() => setMessage('Could not update profile.'))
      .finally(() => setSaving(false));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setChangingPassword(true);
    setPasswordMessage('');

    axiosInstance.post('/accounts/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
    })
      .then(() => {
        setPasswordMessage('Password changed successfully.');
        setOldPassword('');
        setNewPassword('');
      })
      .catch(() => setPasswordMessage('Could not change password. Check your current password.'))
      .finally(() => setChangingPassword(false));
  };

  const completionFields = profile ? [profile.username, profile.email, profile.profile_picture] : [];
  const completionPercent = profile
    ? Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100)
    : 0;

  let usage = null;
  if (subscription) {
    const now = new Date();
    const expiry = new Date(subscription.expiry_date);
    const planDays =
      subscription.plan_days ??
      Math.max(1, Math.round((expiry - new Date(subscription.start_date)) / 86400000));
    const rolloverDays = subscription.rollover_days ?? 0;
    const daysRidden = subscription.days_ridden ?? 0;
    const totalDays = planDays + rolloverDays;

    usage = {
      expired: subscription.status === 'expired' || expiry <= now,
      daysRidden,
      totalDays,
      rolloverDays,
      daysLeft: Math.max(0, Math.ceil((expiry - now) / 86400000)),
      percent: totalDays > 0 ? Math.min(100, Math.round((daysRidden / totalDays) * 100)) : 0,
      expiryLabel: expiry.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
    };
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <p className="text-center text-gray-400 py-12">Loading...</p>
      </div>
    );
  }

  const browseButton = (label) => (
    <Link
      to="/passenger/browse"
      className="mt-4 inline-flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition"
    >
      {label} <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
    </Link>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-1">My Profile</h1>
        <p className="text-gray-500 mb-8">Manage your account details.</p>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-2xl p-6 shadow-sm text-center">
            <Ring percent={completionPercent} colorClass="text-secondary">
              <span className="text-lg font-bold text-primary">{completionPercent}%</span>
            </Ring>
            <p className="text-sm text-gray-500">Profile Completion</p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-sm text-center">
            {!subsLoaded ? (
              <p className="text-sm text-gray-400 py-10">Loading...</p>
            ) : !subscription ? (
              <>
                <Ring percent={0} colorClass="text-accent">
                  <span className="text-lg text-gray-300">—</span>
                </Ring>
                <p className="text-sm font-medium text-textdark">No subscription yet</p>
                <p className="text-xs text-gray-400 mt-1">Pick a route to get your first pass.</p>
                {browseButton('Browse Routes')}
              </>
            ) : usage.expired ? (
              <>
                <Ring percent={0} colorClass="text-accent">
                  <span className="text-sm font-bold text-red-500">Expired</span>
                </Ring>
                <p className="text-sm font-medium text-textdark">Subscription expired</p>
                <p className="text-xs text-gray-400 mt-1">
                  Rode {usage.daysRidden} of {usage.totalDays} days · ended {usage.expiryLabel}
                </p>
                {browseButton('Renew')}
              </>
            ) : (
              <>
                <Ring percent={usage.percent} colorClass="text-accent">
                  <span className="text-lg font-bold text-primary">
                    {usage.daysRidden}/{usage.totalDays}
                  </span>
                </Ring>
                <p className="text-sm text-gray-500">Days Ridden</p>
                <p className="text-xs text-gray-400 mt-1">
                  {usage.daysLeft} day{usage.daysLeft === 1 ? '' : 's'} left
                  {usage.rolloverDays > 0 ? ` · +${usage.rolloverDays} added back` : ''}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="font-semibold text-textdark mb-4">Account Details</h3>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              {preview ? (
                <img src={preview} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200"></div>
              )}
              <label className="absolute -bottom-1 -right-1 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center cursor-pointer text-xs">
                <FontAwesomeIcon icon={faCamera} />
                <input type="file" accept="image/*" onChange={handlePictureChange} className="hidden" />
              </label>
            </div>
          </div>

          {message && <div className="bg-blue-50 text-blue-700 text-sm rounded-lg px-4 py-3 mb-4">{message}</div>}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textdark mb-1">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textdark mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary" />
            </div>
            <button onClick={handleSave} disabled={saving}
              className="bg-primary text-white font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2">
              <FontAwesomeIcon icon={faSave} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-textdark mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faLock} /> Change Password
          </h3>

          {passwordMessage && <div className="bg-blue-50 text-blue-700 text-sm rounded-lg px-4 py-3 mb-4">{passwordMessage}</div>}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textdark mb-1">Current Password</label>
              <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textdark mb-1">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary" />
            </div>
            <button type="submit" disabled={changingPassword}
              className="bg-primary text-white font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50">
              {changingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;