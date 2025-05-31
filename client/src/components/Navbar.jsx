import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Home, LogOut } from 'lucide-react';
import { FaBars } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between h-16 p-4 text-white bg-black shadow-md">
      {/* Logo and Hamburger Menu */}
      <div className="flex items-center flex-shrink-0">
        <button
          className="mr-4 text-white md:hidden focus:outline-none"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <FaBars className="w-6 h-6" />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-white no-underline transition-colors hover:text-gray-300">
          <Home className="w-6 h-6" />
          MyBlog
        </Link>
      </div>

      {/* User Controls */}
      <div className="flex items-center space-x-4">
        {user && (
          <>
            <span className="hidden text-gray-300 sm:inline">Welcome, {user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 p-2 text-white transition-colors bg-red-600 rounded-lg cursor-pointer hover:bg-red-700 whitespace-nowrap"
            >
              <LogOut className="w-5 h-5 text-white" />
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;