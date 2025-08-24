import React, { useState } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

const ExportModal = ({ isOpen, onClose, onExport }) => {
  const [selectedRatio, setSelectedRatio] = useState('original');
  const [isExporting, setIsExporting] = useState(false);

  const ratioOptions = [
    {
      id: 'original',
      name: 'Original Size',
      description: 'Export as-is',
      ratio: null,
      dimensions: 'Current size'
    },
    {
      id: 'phone-wallpaper',
      name: 'Phone Wallpaper',
      description: 'Perfect for mobile wallpapers',
      ratio: 9/16,
      dimensions: '1080 x 1920px'
    },
    {
      id: 'desktop-wallpaper',
      name: 'Desktop Wallpaper',
      description: 'Great for computer backgrounds',
      ratio: 16/9,
      dimensions: '1920 x 1080px'
    },
    {
      id: 'square',
      name: 'Square',
      description: 'Perfect for social media',
      ratio: 1,
      dimensions: '1080 x 1080px'
    },
    {
      id: 'tablet',
      name: 'Tablet',
      description: 'Optimized for tablets',
      ratio: 4/3,
      dimensions: '1536 x 2048px'
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(selectedRatio);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Export Schedule</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Choose the best format for your needs:
          </p>
          
          <div className="space-y-3">
            {ratioOptions.map((option) => (
              <label
                key={option.id}
                className={`block p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedRatio === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="ratio"
                  value={option.id}
                  checked={selectedRatio === option.id}
                  onChange={(e) => setSelectedRatio(e.target.value)}
                  className="sr-only"
                />
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">{option.name}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                    <div className="text-xs text-gray-500 mt-1">{option.dimensions}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedRatio === option.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedRatio === option.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <PhotoIcon className="w-4 h-4" />
                <span>Export</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
