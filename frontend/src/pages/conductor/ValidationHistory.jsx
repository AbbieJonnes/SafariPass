import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faClock } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';

function ValidationHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/payments/validations/')
      .then((res) => setRecords(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-1">Validation History</h1>
        <p className="text-gray-500 mb-6">Your past scans.</p>

        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading...</p>
        ) : records.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No scans yet.</p>
        ) : (
          <div className="space-y-3">
            {records.map((r) => (
              <div key={r.id} className="bg-card rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-semibold text-textdark">{r.passenger_username}</p>
                  <p className="text-sm text-gray-500">{r.route} — {r.plan_type}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <FontAwesomeIcon icon={faClock} /> {new Date(r.scanned_at).toLocaleString()}
                  </p>
                </div>
                <FontAwesomeIcon icon={r.result === 'active' ? faCircleCheck : faCircleXmark}
                  className={`text-2xl ${r.result === 'active' ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ValidationHistory;