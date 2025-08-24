import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

const SuccessToast = ({ isVisible, onHide, message = "Export completed successfully!" }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onHide, 300); // Wait for exit animation
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible && !isAnimating) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
      isVisible && isAnimating 
        ? 'translate-x-0 opacity-100 scale-100' 
        : 'translate-x-full opacity-0 scale-95'
    }`}>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center space-x-3 min-w-[300px]">
        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
            <img src="/logo.png" alt="Timely" className="w-8 h-8 object-contain" />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
            <p className="text-sm font-medium text-gray-900">Success!</p>
          </div>
          <p className="text-xs text-gray-600 mt-1">{message}</p>
        </div>
        
        {/* Download Icon */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <ArrowDownTrayIcon className="w-4 h-4 text-green-600 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessToast;
