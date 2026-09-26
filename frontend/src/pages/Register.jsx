import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faBusSimple, faEye, faEyeSlash, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../api/axiosInstance';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axiosInstance.post('/accounts/register/', {
        ...formData,
        role: 'passenger',
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError('Registration failed. Username or email may already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
        //   src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80"
        src="https://images.unsplash.com/photo-1556122071-e404eaedb77f?auto=format&fit=crop&w=1200&q=80"
          alt="City transit"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/80"></div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
            <FontAwesomeIcon icon={faBusSimple} className="text-accent" />
            SafariPass
          </Link>
          <div>
            <h2 className="text-3xl font-bold mb-3">Join SafariPass today.</h2>
            <p className="text-gray-200 max-w-sm mb-6">
              Create your account and start riding smarter — no more counting coins every morning.
            </p>
            <ul className="space-y-2 text-sm text-gray-200">
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-accent" /> Digital QR pass
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-accent" /> Secure M-Pesa payments
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-accent" /> Flexible route shifting
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-300">&copy; {new Date().getFullYear()} SafariPass. All rights reserved.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 font-bold text-2xl text-primary mb-8 justify-center">
            <FontAwesomeIcon icon={faBusSimple} className="text-secondary" />
            SafariPass
          </div>

          <h1 className="text-2xl font-bold text-primary mb-1">Create your account</h1>
          <p className="text-gray-500 mb-6">It only takes a minute.</p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
              Account created! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textdark mb-1">Username</label>
              <div className="relative">
                <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textdark mb-1">Email</label>
              <div className="relative">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textdark mb-1">Password</label>
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary font-semibold">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;