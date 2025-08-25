import React, { useState, useEffect } from 'react';
import { XMarkIcon, ClockIcon, LinkIcon } from '@heroicons/react/24/outline';

const MeetingSetupModal = ({ isOpen, onClose, meeting, onSave }) => {
  const [setupData, setSetupData] = useState({
    time: '',
    link: '',
    customTime: false
  });

  useEffect(() => {
    if (meeting && isOpen) {
      // Auto-sync time from schedule
      setSetupData({
        time: meeting.time || '',
        link: '',
        customTime: false
      });

      // Load existing setup data from localStorage
      const savedSetups = JSON.parse(localStorage.getItem('meetingSetups') || '{}');
      if (savedSetups[meeting.id]) {
        setSetupData(prev => ({
          ...prev,
          ...savedSetups[meeting.id]
        }));
      }
    }
  }, [meeting, isOpen]);

  const handleSave = () => {
    // Save to localStorage
    const savedSetups = JSON.parse(localStorage.getItem('meetingSetups') || '{}');
    savedSetups[meeting.id] = setupData;
    localStorage.setItem('meetingSetups', JSON.stringify(savedSetups));

    // Call parent save handler
    onSave(meeting.id, setupData);
    onClose();
  };

  const handleTimeChange = (e) => {
    setSetupData(prev => ({
      ...prev,
      time: e.target.value,
      customTime: true
    }));
  };

  const resetToScheduleTime = () => {
    setSetupData(prev => ({
      ...prev,
      time: meeting.time || '',
      customTime: false
    }));
  };

  if (!isOpen || !meeting) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Meeting Setup
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Meeting Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              {meeting.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {meeting.date} • {meeting.location}
            </p>
          </div>

          {/* Time Setup */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <ClockIcon className="w-4 h-4 mr-2" />
              Meeting Time
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={setupData.time}
                onChange={handleTimeChange}
                placeholder="e.g., 10:00 - 11:30"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {setupData.customTime && (
                <button
                  onClick={resetToScheduleTime}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Reset to schedule time
                </button>
              )}
            </div>
          </div>

          {/* Link Setup */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <LinkIcon className="w-4 h-4 mr-2" />
              Meeting Link
            </label>
            <input
              type="url"
              value={setupData.link}
              onChange={(e) => setSetupData(prev => ({ ...prev, link: e.target.value }))}
              placeholder="https://meet.google.com/xxxx"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter your Google Meet, Zoom, or other meeting link
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Save Setup
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingSetupModal;
