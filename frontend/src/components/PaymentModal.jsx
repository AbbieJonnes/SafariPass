import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileScreenButton, faCircleCheck, faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../api/axiosInstance';

function PaymentModal({ open, subscriptionId, onDone }) {
  const [status, setStatus] = useState('pending');
  const pollRef = useRef(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!open || !subscriptionId) return;

    setStatus('pending');
    attemptsRef.current = 0;

    const poll = () => {
      attemptsRef.current += 1;

      axiosInstance.get('/payments/status/', { params: { subscription: subscriptionId } })
        .then((res) => {
          if (res.data.status === 'success') {
            setStatus('success');
            clearInterval(pollRef.current);
          } else if (res.data.status === 'failed') {
            setStatus('failed');
            clearInterval(pollRef.current);
          } else if (attemptsRef.current >= 30) {
            setStatus('timeout');
            clearInterval(pollRef.current);
          }
        })
        .catch(() => {
          if (attemptsRef.current >= 30) {
            setStatus('timeout');
            clearInterval(pollRef.current);
          }
        });
    };

    poll();
    pollRef.current = setInterval(poll, 3000);

    return () => clearInterval(pollRef.current);
  }, [open, subscriptionId]);

  if (!open) return null;

  const content = {
    pending: {
      icon: faSpinner,
      iconClass: 'text-primary animate-spin',
      title: 'Check your phone',
      message: 'A Lipa Na M-Pesa prompt has been sent. Enter your M-Pesa PIN to complete the payment.',
      showButton: false,
    },
    success: {
      icon: faCircleCheck,
      iconClass: 'text-green-600',
      title: 'Payment successful',
      message: 'Your subscription is now active. A confirmation email with your journey tracking link is on its way.',
      showButton: true,
    },
    failed: {
      icon: faCircleXmark,
      iconClass: 'text-red-600',
      title: 'Payment failed',
      message: 'Your payment did not go through. You can try subscribing again from Browse Routes.',
      showButton: true,
    },
    timeout: {
      icon: faMobileScreenButton,
      iconClass: 'text-gray-400',
      title: 'Still waiting',
      message: "We haven't heard back yet. Check Payment History shortly to confirm whether it went through.",
      showButton: true,
    },
  }[status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-card rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon icon={content.icon} className={`text-2xl ${content.iconClass}`} />
        </div>
        <h3 className="text-lg font-bold text-primary mb-2">{content.title}</h3>
        <p className="text-gray-500 text-sm mb-6">{content.message}</p>
        {content.showButton && (
          <button
            onClick={onDone}
            className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition"
          >
            Okay
          </button>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;