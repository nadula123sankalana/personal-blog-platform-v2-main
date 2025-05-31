import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { User, Image as ImageIcon, Save } from 'lucide-react';

const Profile = () => {
  const { user, login } = useContext(AuthContext);

  const [username, setUsername] = useState(user?.username || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setAvatar(user.avatar);
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', username);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await api.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.user) {
        login(response.data.user);
        setSuccessMsg('Profile updated successfully!');
      } else {
        setError('Update failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm px-4 py-6 mx-auto bg-black sm:max-w-md sm:py-8 sm:px-6">
      <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl sm:mb-6">Your Profile</h2>

      {error && (
        <p className="p-2 mb-3 text-sm text-red-500 bg-red-900 bg-opacity-50 rounded-lg sm:p-3 sm:mb-4 sm:text-base">
          {error}
        </p>
      )}
      {successMsg && (
        <p className="p-2 mb-3 text-sm text-gray-300 bg-gray-800 bg-opacity-50 rounded-lg sm:p-3 sm:mb-4 sm:text-base">
          {successMsg}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Username Input */}
        <div>
          <label className="block mb-1 text-xs font-semibold text-gray-400 sm:text-sm">Username</label>
          <div className="relative">
            <User className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-2 top-1/2 sm:left-3 sm:w-5 sm:h-5" />
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

        {/* Avatar Upload */}
        <div>
          <label className="block mb-1 text-xs font-semibold text-gray-400 sm:text-sm">Avatar</label>
          <label className="flex items-center gap-2 p-2 transition-all duration-300 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700 sm:p-3">
            <ImageIcon className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" />
            <span className="text-sm text-gray-400 sm:text-base">
              {avatarFile ? avatarFile.name : "Upload an avatar"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={loading}
              className="hidden"
            />
          </label>
          {avatar && (
            <div className="flex justify-center mt-4">
              <img
                src={avatar}
                alt="Avatar Preview"
                className="object-cover w-20 h-20 rounded-full shadow-lg sm:w-24 sm:h-24"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm text-white transition-all duration-300 bg-red-600 rounded-lg hover:bg-red-700 hover:scale-105 disabled:opacity-50 sm:py-3 sm:text-base"
          >
            <Save className="w-4 h-4 text-white sm:w-5 sm:h-5" />
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;