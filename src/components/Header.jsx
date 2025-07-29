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
              <div className="w-8 h-8 sm:w-10 sm:h-10">
                <img
                  src={logo}
                  alt="Malarvadi Little Scholar Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Malarvadi Little Scholar</h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate">Registration System</p>
            </div>
          </div>

          {/* Desktop Navigation Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => navigate('/certificate/simple')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Certificate Generate
            </button>

            <button
              onClick={() => navigate('/admin/login')}
              className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Admin Login
            </button>
          </div>

          {/* Mobile Navigation Buttons */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => navigate('/certificate/simple')}
              className="inline-flex items-center p-2 border border-gray-300 rounded-md text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              title="Generate Certificate"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <button
              onClick={() => navigate('/admin/login')}
              className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              title="Admin Login"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;