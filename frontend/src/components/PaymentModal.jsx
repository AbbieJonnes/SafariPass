import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileScreenButton, faXmark } from '@fortawesome/free-solid-svg-icons';

function PaymentModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-card rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon icon={faMobileScreenButton} className="text-primary text-2xl" />
        </div>
        <h3 className="text-lg font-bold text-primary mb-2">Check your phone</h3>
        <p className="text-gray-500 text-sm mb-6">
          A Lipa Na M-Pesa prompt has been sent to your phone. Enter your M-Pesa PIN to complete the payment.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition"
        >
          Okay
        </button>
      </div>
    </div>
  );
}

export default PaymentModal;