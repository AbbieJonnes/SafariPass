import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser, faBusSimple } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../api/axiosInstance';

function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slowNotice, setSlowNotice] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSlowNotice(false);

    const slowTimer = setTimeout(() => setSlowNotice(true), 4000);

    try {
      await axiosInstance.post('/accounts/password-reset/', { username, email });
      setSubmitted(true);
    } catch (err) {
      const data = err.response?.data;
      if (data?.error) {
        setError(data.error);
      } else if (data && typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        const firstMsg = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
        setError(`${firstKey}: ${firstMsg}`);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      clearTimeout(slowTimer);
      setLoading(false);
      setSlowNotice(false);
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
          Enter your username and the email you registered with, and we'll send you a reset link.
        </p>

        {submitted ? (
          <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3 text-center">
            A reset link has been sent to your email. Please check your inbox, and your spam folder if you
            don't see it.
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
                {error}
              </div>
            )}
            {slowNotice && (
              <div className="bg-blue-50 text-blue-700 text-sm rounded-lg px-4 py-3 mb-4">
                Our server is waking up from idle — this can take up to a minute on the first request.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-textdark mb-1">Username</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="Your username"
                  />
                </div>
              </div>

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
                    placeholder="The email you registered with"
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
          </>
        )}

        <p className="text-sm text-center mt-6 text-gray-500">
          <Link to="/login" className="text-secondary font-semibold">Back to login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;