import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faBusSimple } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../api/axiosInstance';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post('/accounts/password-reset/', { email });
    } finally {
      setSubmitted(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-card shadow-md rounded-2xl p-8 w-full max-w-md">
        <div className="flex items-center gap-2 font-bold text-2xl text-primary mb-6 justify-center">
          <FontAwesomeIcon icon={faBusSimple} className="text-secondary" />
          SafariPass
        </div>

        <h1 className="text-2xl font-bold text-primary mb-1 text-center">Reset your password</h1>
        <p className="text-gray-500 mb-6 text-center">
          Enter your email and we'll send you a reset link.
        </p>

        {submitted ? (
          <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3 text-center">
            If that email exists in our system, a reset link has been sent. Please check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textdark mb-1">Email</label>
              <div className="relative">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="text-sm text-center mt-6 text-gray-500">
          <Link to="/login" className="text-secondary font-semibold">Back to login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;