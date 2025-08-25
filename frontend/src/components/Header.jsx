import React, { useState } from 'react';
import { QuestionMarkCircleIcon, ChevronDownIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const Header = ({ onShowTutorial, onShowAboutUs }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 sticky top-0 z-50 group">
      <div className="container mx-auto px-6 py-4 transition-all duration-500 group-hover:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 group-hover:scale-105 transition-all duration-500">
            <div className="w-8 h-8 rounded-full border-2 border-white/30 p-0.5 group-hover:border-white/50 group-hover:shadow-lg transition-all duration-500">
              <img 
                src="/icon.png" 
                alt="Timely" 
                className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <h1 className="text-xl font-medium text-white group-hover:text-white/95 group-hover:tracking-wider transition-all duration-500">
              Timely
            </h1>
          </div>
          
          <div className="relative md:hidden">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-white/70 hover:text-white transition-all duration-300 p-2 rounded-full hover:bg-white/10"
              title="Menu"
            >
              <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown Menu */}
            <div className={`absolute right-0 top-full mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden transition-all duration-500 ease-out ${
              isDropdownOpen 
                ? 'opacity-100 scale-100 translate-y-0 rotate-0' 
                : 'opacity-0 scale-90 -translate-y-4 rotate-1 pointer-events-none'
            }`}>
              <div className="p-2">
                <button
                  onClick={() => {
                    onShowTutorial();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-5 py-4 text-left text-gray-700 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-purple-50/80 transition-all duration-300 flex items-center space-x-4 rounded-2xl group hover:scale-105 hover:shadow-lg"
                >
                  <div className="w-10 h-10 bg-blue-100/80 rounded-2xl flex items-center justify-center group-hover:bg-blue-200/80 transition-colors duration-300">
                    <QuestionMarkCircleIcon className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">Tutorial</span>
                    <p className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors duration-300">Learn how to use Timely</p>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    onShowAboutUs();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-5 py-4 text-left text-gray-700 hover:bg-gradient-to-r hover:from-purple-50/80 hover:to-pink-50/80 transition-all duration-300 flex items-center space-x-4 rounded-2xl group hover:scale-105 hover:shadow-lg"
                >
                  <div className="w-10 h-10 bg-purple-100/80 rounded-2xl flex items-center justify-center group-hover:bg-purple-200/80 transition-colors duration-300">
                    <InformationCircleIcon className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">About Us</span>
                    <p className="text-xs text-gray-500 group-hover:text-purple-500 transition-colors duration-300">Learn about our mission</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={onShowTutorial}
              className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              title="Tutorial"
            >
              <QuestionMarkCircleIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={onShowAboutUs}
              className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              title="About Us"
            >
              <InformationCircleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
