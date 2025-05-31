import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black bg-center bg-no-repeat bg-cover font-poppins"
      style={{
        backgroundImage: 'url(/k.jpg)', // Ensure k.jpg is placed inside the public/ folder
      }}
    >
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-2 text-center sm:p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <h1
            className="mb-3 font-bold text-white sm:mb-4 md:mb-6"
            style={{ fontSize: 'clamp(1.5rem, 10vw, 5.125rem)' }} // 82px = 5.125rem
          >
            Welcome to Our Blog Platform
          </h1>

          <p className="mb-3 text-xs text-gray-200 sm:mb-4 sm:text-sm md:text-base lg:text-lg">
            Share your thoughts, explore others' ideas, and connect with the community.
          </p>

          <div className="flex flex-col justify-center gap-2 sm:flex-row sm:gap-3 md:gap-4">
            <Link to="/login" className="flex justify-center">
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors w-full sm:w-auto text-xs sm:text-sm md:text-base">
                Login
              </button>
            </Link>
            <Link to="/register" className="flex justify-center">
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors w-full sm:w-auto text-xs sm:text-sm md:text-base">
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
