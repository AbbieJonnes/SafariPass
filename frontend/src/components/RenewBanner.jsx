import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faArrowRight } from '@fortawesome/free-solid-svg-icons';

function RenewBanner({ routeLabel, expiredOn, stacked = false, className = '' }) {
  const dateText = new Date(expiredOn).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      className={`bg-red-50 border border-red-100 rounded-2xl p-5 flex gap-4 ${
        stacked ? 'flex-col' : 'flex-col sm:flex-row sm:items-center sm:justify-between'
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
          <FontAwesomeIcon icon={faCircleExclamation} className="text-red-500" />
        </div>
        <div>
          <p className="font-semibold text-red-700">Your subscription has expired</p>
          <p className="text-sm text-red-600/80 mt-0.5">
            {routeLabel ? `${routeLabel} expired on ${dateText}.` : `It expired on ${dateText}.`} Renew to keep riding.
          </p>
        </div>
      </div>

      <Link
        to="/passenger/browse"
        className={`inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition whitespace-nowrap ${
          stacked ? 'w-full' : ''
        }`}
      >
        Browse Routes <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
      </Link>
    </div>
  );
}

export default RenewBanner;