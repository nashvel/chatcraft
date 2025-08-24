import React from 'react';
import { XMarkIcon, ExclamationTriangleIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

const DesktopWarningModal = ({ isOpen, onClose, onUseAnyway }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="w-8 h-8" />
            <h2 className="text-xl font-bold">Desktop Mode Detected</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <DevicePhoneMobileIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Not Optimized for Desktop
            </h3>
            <p className="text-gray-600 leading-relaxed">
              This application is designed for mobile devices and may not display properly on desktop screens. 
              For the best experience, please switch to mobile mode or use a mobile device.
            </p>
          </div>

          {/* Recommendation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <DevicePhoneMobileIcon className="w-5 h-5 text-blue-500 mt-0.5" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">
                  Recommended Action
                </h4>
                <p className="text-sm text-blue-700">
                  Open your browser's developer tools and switch to mobile view, or access this app from your mobile device.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Switch to Mobile
            </button>
            <button
              onClick={onUseAnyway}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Use Anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopWarningModal;
