import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CourseInfoModal = ({ isOpen, onClose, displayData }) => {
  if (!isOpen || !displayData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Course Information</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Course List */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-base">Enrolled Courses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {displayData.courses.map(course => (
                <div key={course.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-3 h-3 bg-blue-500 rounded flex-shrink-0"></div>
                    <span className="font-medium text-gray-900">{course.code}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{course.name}</p>
                  <p className="text-xs text-gray-500">{course.units} units</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Units</p>
                <p className="text-2xl font-bold text-blue-600">
                  {displayData.courses.reduce((total, course) => total + course.units, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-blue-600">
                  {displayData.courses.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseInfoModal;
