import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser({ username, email, password });

      if (response && response.data && response.data._id) {
        setSuccessMsg('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.data.message || 'Registration failed');
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
          <UserPlus className="w-5 h-5 text-white sm:w-6 sm:h-6" />
          Register
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
              Username
            </label>
            <div className="relative">
              <User className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-2 sm:left-3 top-1/2 sm:w-5 sm:h-5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="w-full p-2 pl-8 text-sm text-white bg-gray-800 border border-gray-700 rounded-lg sm:pl-10 sm:p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:text-base"
                placeholder="Enter your username"
              />
            </div>
          </div>

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

          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-300 sm:text-sm">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-2 sm:left-3 top-1/2 sm:w-5 sm:h-5" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full p-2 pl-8 text-sm text-white bg-gray-800 border border-gray-700 rounded-lg sm:pl-10 sm:p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:text-base"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full gap-2 py-2 text-sm text-white transition duration-200 transform bg-gray-600 rounded-lg hover:bg-gray-700 hover:scale-105 disabled:opacity-50 sm:py-3 sm:text-base"
          >
            <UserPlus className="w-4 h-4 text-white sm:w-5 sm:h-5" />
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;