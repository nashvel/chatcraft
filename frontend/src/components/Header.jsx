import React from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const Header = ({ onShowTutorial }) => {
  return (
    <header className="bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border-2 border-white/30 p-0.5">
              <img 
                src="/icon.png" 
                alt="Timely" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h1 className="text-xl font-medium text-white">Timely</h1>
          </div>
          
          <button
            onClick={onShowTutorial}
            className="text-white/70 hover:text-white transition-colors p-2"
            title="Tutorial"
          >
            <QuestionMarkCircleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
