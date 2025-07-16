import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="flex-shrink-0">
              <img 
                src={logo} 
                alt="Malarvadi Little Scholar Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 truncate">
                Malarvadi Little Scholar
              </h1>
              <p className="text-sm sm:text-base text-gray-500 truncate">Registration System</p>
            </div>
          </div>

          {/* Admin Login Button - Visible on all screens */}
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/admin/login')}
              className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              <svg 
                className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
              <span className="hidden xs:inline">Admin Login</span>
              <span className="xs:hidden">Login</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 