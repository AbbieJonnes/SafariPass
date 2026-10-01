import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faBusSimple,
  faEye,
  faEyeSlash,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../api/axiosInstance';

function SetPassword() {
  const { uid, token } = useParams();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post('/accounts/password-reset-confirm/', {
        uid,
        token,
        new_password: newPassword,
      });

      setSuccess(true);

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(
        'This link is invalid or has expired. Please contact whoever created your account.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">

      {/* Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1400&q=85"
          alt="Commuters using public transportation"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-primary/85"></div>

        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-secondary/75"></div>

        <div className="relative z-10 flex flex-col p-10 xl:p-14 text-white w-full h-full">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 font-bold text-2xl"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faBusSimple}
                className="text-accent"
              />
            </div>

            SafariPass
          </Link>

          {/* Main Message */}
          <div className="max-w-md mt-auto mb-auto py-16">

            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
              <FontAwesomeIcon
                icon={faShieldHalved}
                className="text-accent text-sm"
              />

              <span className="text-sm text-white/90">
                Keep your account secure
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl xl:text-4xl font-bold leading-tight mb-6">
              Set a new password.
              <span className="block text-accent mt-2">
                Get back on the road.
              </span>
            </h2>

            {/* Description */}
            <p className="text-gray-200 leading-relaxed text-base">
              Create a secure password for your SafariPass account and
              continue managing your daily transport journey with ease.
            </p>

            {/* Feature */}
            <div className="mt-10">

              <div className="flex items-center gap-4">

                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faShieldHalved}
                    className="text-accent"
                  />
                </div>

                <span className="text-sm text-gray-200">
                  Your account stays protected
                </span>

              </div>

            </div>

          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-300 mt-8">
            &copy; {new Date().getFullYear()} SafariPass. All rights reserved.
          </p>

        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">

            <Link
              to="/"
              className="flex items-center gap-3 font-bold text-2xl text-primary"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faBusSimple}
                  className="text-accent"
                />
              </div>

              SafariPass
            </Link>

          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">

            {/* Heading */}
            <div className="mb-7">

              <p className="text-secondary text-sm font-semibold mb-2">
                Account security
              </p>

              <h1 className="text-2xl font-bold text-primary">
                Set your password
              </h1>

              <p className="text-gray-500 mt-2 text-sm">
                Choose a secure password to activate your account.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl px-4 py-3 mb-5">
                Password set successfully! Redirecting to login...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* New Password */}
              <div>

                <label className="block text-sm font-medium text-textdark mb-2">
                  New Password
                </label>

                <div className="relative">

                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-11 pr-11 py-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition"
                    placeholder="Enter a new password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary transition"
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                    />
                  </button>

                </div>

              </div>

              {/* Confirm Password */}
              <div>

                <label className="block text-sm font-medium text-textdark mb-2">
                  Confirm Password
                </label>

                <div className="relative">

                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-11 pr-11 py-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition"
                    placeholder="Re-enter your password"
                  />

                </div>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition disabled:opacity-50"
              >
                {loading ? 'Setting password...' : 'Set Password'}
              </button>

            </form>

            {/* Login Link */}
            <p className="text-sm text-center mt-7 text-gray-500">

              <Link
                to="/login"
                className="text-secondary font-semibold hover:text-primary transition"
              >
                Back to login
              </Link>

            </p>

          </div>

          {/* Mobile Footer */}
          <p className="lg:hidden text-xs text-gray-400 text-center mt-6">
            &copy; {new Date().getFullYear()} SafariPass. All rights reserved.
          </p>

        </div>
      </div>

    </div>
  );
}

export default SetPassword;