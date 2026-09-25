import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/accounts/login/', { username, password });
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-card shadow-md rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">Log in to SafariPass</h1>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textdark mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textdark mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-secondary font-medium">Sign up</Link>
        </p>
        <p className="text-sm text-center mt-2">
          <Link to="/forgot-password" className="text-secondary">Forgot password?</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;