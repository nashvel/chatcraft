import React, { useState, useCallback } from 'react';
import { DocumentArrowUpIcon, DocumentTextIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const PDFUploader = ({ onPDFProcessed }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate PDF processing - in a real app, you'd use a PDF parsing library
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted schedule data
      const mockScheduleData = {
        courses: [
          { id: 1, name: 'Mathematics 101', code: 'MATH101', instructor: 'Dr. Smith', credits: 3 },
          { id: 2, name: 'Physics 201', code: 'PHYS201', instructor: 'Prof. Johnson', credits: 4 },
          { id: 3, name: 'Chemistry 150', code: 'CHEM150', instructor: 'Dr. Brown', credits: 3 },
          { id: 4, name: 'English Literature', code: 'ENG200', instructor: 'Ms. Davis', credits: 3 },
          { id: 5, name: 'Computer Science', code: 'CS101', instructor: 'Dr. Wilson', credits: 4 }
        ],
        schedule: [
          { courseId: 1, day: 'Monday', startTime: '09:00', endTime: '10:30', room: 'Room 101' },
          { courseId: 1, day: 'Wednesday', startTime: '09:00', endTime: '10:30', room: 'Room 101' },
          { courseId: 2, day: 'Tuesday', startTime: '11:00', endTime: '12:30', room: 'Lab 201' },
          { courseId: 2, day: 'Thursday', startTime: '11:00', endTime: '12:30', room: 'Lab 201' },
          { courseId: 3, day: 'Monday', startTime: '14:00', endTime: '15:30', room: 'Lab 150' },
          { courseId: 3, day: 'Friday', startTime: '14:00', endTime: '15:30', room: 'Lab 150' },
          { courseId: 4, day: 'Tuesday', startTime: '13:00', endTime: '14:30', room: 'Room 200' },
          { courseId: 5, day: 'Wednesday', startTime: '15:00', endTime: '16:30', room: 'Computer Lab' }
        ]
      };

      onPDFProcessed(mockScheduleData);
    } catch (err) {
      setError('Failed to process PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Upload Your Class Schedule</h2>
        <p className="text-base sm:text-lg text-gray-600 px-4 sm:px-0">
          Upload a PDF of your class schedule and we'll extract the information to create a beautiful, customizable schedule design.
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 sm:p-8 md:p-12 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="space-y-3 sm:space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-base sm:text-lg font-medium text-gray-700">Processing your PDF...</p>
            <p className="text-sm text-gray-500">Extracting course information and schedule data</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <DocumentArrowUpIcon className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
            <div>
              <p className="text-lg sm:text-xl font-medium text-gray-700">
                <span className="hidden sm:inline">Drop your PDF here, or </span>
                <label className="text-blue-600 hover:text-blue-500 cursor-pointer underline">
                  <span className="sm:hidden">Tap to </span>browse files
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports PDF files up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 sm:space-x-3">
          <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-red-700">{error}</p>
        </div>
      )}

      <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
          <DocumentTextIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          What we can extract from your PDF:
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-600">
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></span>
              Course names and codes
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></span>
              Class times and days
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></span>
              Room locations
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></span>
              Instructor names
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></span>
              Credit hours
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></span>
              Course descriptions
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PDFUploader;
