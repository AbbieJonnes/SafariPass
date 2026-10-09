import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faCalendarCheck, faCircleCheck, faCircleXmark, faDownload } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';

const routeLabelOf = (route) =>
  route && typeof route === 'object' ? `${route.origin} → ${route.destination}` : `Route #${route}`;

const isExpired = (s) => s.status === 'expired' || new Date(s.expiry_date) < new Date();
const statusOf = (s) => (isExpired(s) ? 'expired' : s.status);

function MyQRCode() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [qrImage, setQrImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/subscriptions/')
      .then((res) => {
        const list = res.data;
        setSubscriptions(list);
        const preferred = list.find((s) => !isExpired(s) && s.status === 'active') || list[0];
        if (preferred) setSelectedId(preferred.id);
      })
      .finally(() => setLoading(false));
  }, []);

  const subscription = subscriptions.find((s) => s.id === selectedId) || null;

  useEffect(() => {
    if (!subscription) {
      setQrImage('');
      return;
    }
    QRCode.toDataURL(subscription.qr_token, { width: 600, margin: 2 })
      .then(setQrImage)
      .catch(() => setQrImage(''));
  }, [subscription?.qr_token]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrImage;
    link.download = `safaripass-qr-${subscription.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <p className="text-center text-gray-400 py-12">Loading...</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-16 text-center">
          <p className="text-gray-500">You don't have a subscription yet.</p>
        </div>
      </div>
    );
  }

  const status = statusOf(subscription);
  const isActive = status === 'active';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-1">My QR Pass</h1>
        <p className="text-gray-500 mb-6">Show this to your conductor when boarding.</p>

        {subscriptions.length > 1 && (
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm mb-4 bg-card focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            {subscriptions.map((s) => (
              <option key={s.id} value={s.id}>
                #{s.id} · {routeLabelOf(s.route)} · {statusOf(s)}
              </option>
            ))}
          </select>
        )}

        <div className="bg-card rounded-2xl border border-gray-100 p-6 shadow-sm text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 capitalize ${
            isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <FontAwesomeIcon icon={isActive ? faCircleCheck : faCircleXmark} />
            {status}
          </div>

          {qrImage && <img src={qrImage} alt="QR Code" className="mx-auto mb-4 rounded-lg w-56 h-56" />}

          <button
            onClick={handleDownload}
            disabled={!qrImage}
            className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50 inline-flex items-center justify-center gap-2 mb-5"
          >
            <FontAwesomeIcon icon={faDownload} /> Download QR
          </button>

          <div className="text-left space-y-2 border-t border-gray-100 pt-4">
            <p className="text-sm text-textdark flex items-center gap-2">
              <FontAwesomeIcon icon={faRoute} className="text-secondary" /> {routeLabelOf(subscription.route)}
            </p>
            <p className="text-sm text-textdark flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendarCheck} className="text-secondary" />
              {isActive ? 'Expires' : 'Expired'}: {new Date(subscription.expiry_date).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Route shifts used: {subscription.shift_count} / 3</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          A downloaded code always checks your live subscription when scanned, so an expired pass will show as expired.
        </p>
      </div>
    </div>
  );
}

export default MyQRCode;