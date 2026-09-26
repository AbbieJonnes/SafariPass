import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faClock, faReceipt } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/payments/')
      .then((res) => setPayments(res.data))
      .finally(() => setLoading(false));
  }, []);

  const statusIcon = (status) => {
    if (status === 'completed' || status === 'success') return faCircleCheck;
    if (status === 'pending') return faClock;
    return faCircleXmark;
  };

  const statusColor = (status) => {
    if (status === 'completed' || status === 'success') return 'text-green-600';
    if (status === 'pending') return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-primary mb-1">Payment History</h1>
        <p className="text-gray-500 mb-6">All your past M-Pesa transactions.</p>

        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading...</p>
        ) : payments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No payments yet.</p>
        ) : (
          <div className="space-y-3">
            {payments.map((p) => (
              <div key={p.id} className="bg-card rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faReceipt} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-textdark">KES {p.amount}</p>
                    <p className="text-xs text-gray-400">{p.mpesa_transaction_id || 'Pending transaction'}</p>
                  </div>
                </div>
                <FontAwesomeIcon icon={statusIcon(p.status)} className={`text-xl ${statusColor(p.status)}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentHistory;