import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Book, Plus, FileText, Heart, User, Settings, Search, X } from 'lucide-react';

const Sidebar = ({ closeSidebar }) => {
  const navItems = [
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'View Blogs', path: '/blogs', icon: Book },
    { name: 'Create Post', path: '/create', icon: Plus },
    { name: 'My Posts', path: '/myposts', icon: FileText },
    { name: 'Liked Posts', path: '/liked', icon: Heart },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen p-3 bg-black border-r border-gray-700 md:w-64 lg:w-72 sm:p-4">
      {/* Close button for mobile */}
      <div className="flex justify-end mb-3 md:hidden sm:mb-4">
        <button
          onClick={closeSidebar}
          className="p-2 transition-colors rounded-lg hover:bg-gray-800"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5 text-white sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Navigation items */}
      <div className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:bg-gray-800 hover:text-gray-400 transition-colors sm:gap-3 sm:px-4 sm:py-3 ${
                isActive ? 'bg-gray-700 text-white font-semibold' : ''
              }`
            }
          >
            <item.icon className="w-4 h-4 text-white sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm lg:text-base">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;