import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({ email, password });

      if (response.data && response.data.token && response.data.user) {
        login(response.data.user, response.data.token);
        setSuccessMsg('Login successful! Redirecting...');
        setEmail('');
        setPassword('');

        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black">
      <div className="absolute inset-0 z-0 bg-black bg-opacity-50" />
      <div className="relative z-10 w-full max-w-sm p-4 bg-black shadow-xl rounded-xl sm:max-w-md sm:p-6">
        <h2 className="flex items-center justify-center gap-2 mb-4 text-xl font-bold text-center text-white sm:text-2xl sm:mb-6">
          <LogIn className="w-5 h-5 text-white sm:w-6 sm:h-6" />
          Login
        </h2>

        {error && (
          <p className="p-2 mb-3 text-sm text-center text-red-500 bg-red-900 bg-opacity-50 rounded-lg sm:p-3 sm:mb-4 sm:text-base">
            {error}
          </p>
        )}
        {successMsg && (
          <p className="p-2 mb-3 text-sm text-center text-gray-300 bg-gray-800 bg-opacity-50 rounded-lg sm:p-3 sm:mb-4 sm:text-base">
            {successMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-300 sm:text-sm">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-2 sm:left-3 top-1/2 sm:w-5 sm:h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full p-2 pl-8 text-sm text-white bg-gray-800 border border-gray-700 rounded-lg sm:pl-10 sm:p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:text-base"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-300 sm:text-sm">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-2 sm:left-3 top-1/2 sm:w-5 sm:h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full p-2 pl-8 text-sm text-white bg-gray-800 border border-gray-700 rounded-lg sm:pl-10 sm:p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:text-base"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full gap-2 py-2 text-sm text-white transition duration-200 transform bg-red-600 rounded-lg hover:bg-red-700 hover:scale-105 disabled:opacity-50 sm:py-3 sm:text-base"
          >
            <LogIn className="w-4 h-4 text-white sm:w-5 sm:h-5" />
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;