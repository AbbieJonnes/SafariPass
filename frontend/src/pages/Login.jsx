import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faLock,
  faBusSimple,
  faEye,
  faEyeSlash,
  faShieldHalved,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slowNotice, setSlowNotice] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSlowNotice(false);

    const slowTimer = setTimeout(() => setSlowNotice(true), 4000);

    try {
      const response = await axiosInstance.post('/accounts/login/', {
        username,
        password,
      });

      login(response.data);

      const role = response.data.role;

      if (role === 'passenger') navigate('/passenger/dashboard');
      else if (role === 'conductor') navigate('/conductor/dashboard');
      else if (role === 'company_admin') navigate('/admin/dashboard');
      else if (role === 'super_admin') navigate('/super-admin/dashboard');
      else navigate('/');
    } catch (err) {
      setError('Invalid username or password.');
    } finally {
      clearTimeout(slowTimer);
      setLoading(false);
      setSlowNotice(false);
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
                Your commute, connected
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Welcome back.
              <span className="block text-accent mt-2">
                Your journey continues.
              </span>
            </h2>

            {/* Description */}
            <p className="text-gray-200 leading-relaxed text-base xl:text-lg">
              Log in to check your subscription, view your digital QR pass,
              and manage your transport journey — all in one place.
            </p>

            {/* Feature Highlights */}
            <div className="mt-10 space-y-6">

              {/* Feature 1 */}
              <div className="flex items-center gap-4">

                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faShieldHalved}
                    className="text-accent"
                  />
                </div>

                <span className="text-sm text-gray-200">
                  Secure transport payments
                </span>

              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-4">

                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faBusSimple}
                    className="text-accent"
                  />
                </div>

                <span className="text-sm text-gray-200">
                  Manage your daily commute
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
                Welcome back
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                Log in to your account
              </h1>

              <p className="text-gray-500 mt-2 text-sm">
                Enter your details to continue to SafariPass.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
                {error}
              </div>
            )}

            {/* Slow Server Notice */}
            {slowNotice && (
              <div className="bg-blue-50 border border-blue-100 text-blue-700 text-sm rounded-xl px-4 py-3 mb-5">
                Our server is waking up from idle — this can take up to a
                minute on the first request. Thanks for your patience.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username */}
              <div>

                <label className="block text-sm font-medium text-textdark mb-2">
                  Username
                </label>

                <div className="relative">

                  <FontAwesomeIcon
                    icon={faUser}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition"
                    placeholder="Enter your username"
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <label className="block text-sm font-medium text-textdark mb-2">
                  Password
                </label>

                <div className="relative">

                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-11 pr-11 py-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition"
                    placeholder="Enter your password"
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

              {/* Forgot Password */}
              <div className="flex justify-end">

                <Link
                  to="/forgot-password"
                  className="text-sm text-secondary font-medium hover:text-primary transition"
                >
                  Forgot password?
                </Link>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Logging in...'
                ) : (
                  <>
                    Log In
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-sm"
                    />
                  </>
                )}
              </button>

            </form>

            {/* Register Link */}
            <p className="text-sm text-center mt-7 text-gray-500">
              Don't have an account?{' '}

              <Link
                to="/register"
                className="text-secondary font-semibold hover:text-primary transition"
              >
                Sign up
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

export default Login;