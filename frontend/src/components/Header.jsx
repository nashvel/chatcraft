import React from 'react';
import { CalendarDaysIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <AcademicCapIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ClassCraft</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden xs:block">Design Your Perfect Schedule</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 text-gray-600">
            <CalendarDaysIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">Schedule Designer</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
