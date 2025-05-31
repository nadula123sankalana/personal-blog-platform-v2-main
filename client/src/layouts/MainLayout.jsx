import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-hidden bg-gray-100">
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-col flex-1 overflow-hidden md:flex-row">
        {/* Sidebar - Mobile: Drawer, Desktop: Fixed with better width management */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-300 transform transition-transform duration-300 ease-in-out md:static md:w-64 lg:w-72 md:transform-none md:block ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 overflow-y-auto`}
        >
          <Sidebar closeSidebar={closeSidebar} />
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Main content area - Ensure full width on desktop */}
        <main className="flex-1 p-4 overflow-y-auto sm:p-6 md:p-6 lg:p-8">
          <div className="w-full max-w-full mx-auto md:max-w-5xl lg:max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;