import React, { useState, useCallback, useEffect } from 'react';
import { DocumentArrowUpIcon, DocumentTextIcon, ExclamationTriangleIcon, QuestionMarkCircleIcon, ArrowUpTrayIcon, FolderOpenIcon } from '@heroicons/react/24/outline';
import { PDFParser } from '../utils/pdfParser';

const PDFUploader = ({ onPDFProcessed }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showExtractInfo, setShowExtractInfo] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [hasUploadedPDF, setHasUploadedPDF] = useState(false);

  useEffect(() => {
    // Load dashboard data from localStorage on component mount
    const savedData = localStorage.getItem('scheduleData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setDashboardData(parsedData);
        setHasUploadedPDF(true);
      } catch (error) {
        console.error('Error loading saved schedule data:', error);
      }
    }
  }, []);

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

  const handleReupload = () => {
    // Clear existing data and reset to upload state
    localStorage.removeItem('scheduleData');
    setDashboardData(null);
    setHasUploadedPDF(false);
    setError(null);
  };

  const handleExplorer = () => {
    // Navigate to schedule explorer view
    if (onPDFProcessed && dashboardData) {
      onPDFProcessed(dashboardData);
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
      const parser = new PDFParser();
      
      // Extract text from PDF
      const extractedText = await parser.extractTextFromPDF(file);
      
      // Parse the extracted text into structured schedule data
      const scheduleData = parser.parseScheduleData(extractedText);
      
      console.log('PDFUploader parsed schedule data:', scheduleData);
      
      // Validate that we have some data
      if (!scheduleData.courses || scheduleData.courses.length === 0) {
        throw new Error('No course information found in the PDF');
      }

      // Save to localStorage
      localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
      setDashboardData(scheduleData);
      setHasUploadedPDF(true);

      onPDFProcessed(scheduleData);
    } catch (err) {
      console.error('PDF processing error:', err);
      setError(err.message || 'Failed to process PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper functions to calculate dashboard statistics
  const getOnlineClassesCount = (data) => {
    if (!data.courses) return 0;
    return data.courses.filter(course => 
      course.room && (course.room.toLowerCase().includes('online') || 
                     course.room.toLowerCase().includes('virtual') ||
                     course.room.toLowerCase().includes('zoom') ||
                     course.room.toLowerCase().includes('meet'))
    ).length;
  };

  const getFaceToFaceClassesCount = (data) => {
    if (!data.courses) return 0;
    return data.courses.filter(course => 
      course.room && !(course.room.toLowerCase().includes('online') || 
                      course.room.toLowerCase().includes('virtual') ||
                      course.room.toLowerCase().includes('zoom') ||
                      course.room.toLowerCase().includes('meet'))
    ).length;
  };

  const getTodayClassesCount = (data) => {
    if (!data.courses) return 0;
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayName = dayNames[today];
    
    return data.courses.filter(course => 
      course.days && course.days.toLowerCase().includes(todayName.substring(0, 3))
    ).length;
  };

  const getNextSubject = (data) => {
    if (!data.courses || data.courses.length === 0) return 'No Data';
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const today = new Date().getDay();
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const todayName = dayNames[today];
    
    // Find today's classes
    const todayClasses = data.courses.filter(course => 
      course.days && course.days.toLowerCase().includes(todayName)
    );
    
    // Find next class today
    for (const course of todayClasses) {
      if (course.time) {
        const timeMatch = course.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const ampm = timeMatch[3].toUpperCase();
          
          if (ampm === 'PM' && hours !== 12) hours += 12;
          if (ampm === 'AM' && hours === 12) hours = 0;
          
          const classTime = hours * 60 + minutes;
          
          if (classTime > currentTime) {
            return course.code || course.name || 'Unknown';
          }
        }
      }
    }
    
    // If no class today, return first course
    return data.courses[0].code || data.courses[0].name || 'Unknown';
  };

  const getNextSubjectTime = (data) => {
    if (!data.courses || data.courses.length === 0) return 'No Data';
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const today = new Date().getDay();
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const todayName = dayNames[today];
    
    // Find today's classes
    const todayClasses = data.courses.filter(course => 
      course.days && course.days.toLowerCase().includes(todayName)
    );
    
    // Find next class today
    for (const course of todayClasses) {
      if (course.time) {
        const timeMatch = course.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const ampm = timeMatch[3].toUpperCase();
          
          if (ampm === 'PM' && hours !== 12) hours += 12;
          if (ampm === 'AM' && hours === 12) hours = 0;
          
          const classTime = hours * 60 + minutes;
          
          if (classTime > currentTime) {
            return course.time;
          }
        }
      }
    }
    
    // If no class today, show "Tomorrow 8:00 AM"
    return 'Tomorrow 8:00 AM';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-8 px-4 sm:px-6 relative">
      {/* Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <img 
          src="/logo.png" 
          alt="Timely Logo" 
          className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain"
        />
      </div>
      
      
      {/* Dashboard Stats */}
      <div className="relative z-10 w-full max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Online Classes */}
          <div className="bg-blue-500/90 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-blue-600 dark:border-white/20 shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {dashboardData ? getOnlineClassesCount(dashboardData) : 'No Data'}
              </div>
              <div className="text-white/90 dark:text-white/70 text-sm">Online Classes</div>
              <div className="text-blue-200 dark:text-blue-400 text-xs mt-1">Virtual</div>
            </div>
          </div>
          
          {/* Face to Face Classes */}
          <div className="bg-green-500/90 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-green-600 dark:border-white/20 shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {dashboardData ? getFaceToFaceClassesCount(dashboardData) : 'No Data'}
              </div>
              <div className="text-white/90 dark:text-white/70 text-sm">Face to Face Classes</div>
              <div className="text-green-200 dark:text-green-400 text-xs mt-1">On Campus</div>
            </div>
          </div>
          
          {/* Upcoming Classes */}
          <div className="bg-orange-500/90 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-orange-600 dark:border-white/20 shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {dashboardData ? getTodayClassesCount(dashboardData) : 'No Data'}
              </div>
              <div className="text-white/90 dark:text-white/70 text-sm">Upcoming Classes</div>
              <div className="text-orange-200 dark:text-orange-400 text-xs mt-1">Today</div>
            </div>
          </div>
          
          {/* Next Class Subject */}
          <div className="bg-yellow-400 dark:bg-yellow-400 backdrop-blur-lg rounded-2xl p-4 border border-yellow-500 dark:border-yellow-500 relative shadow-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-900 mb-1 flex items-center justify-center gap-2">
                {dashboardData ? getNextSubject(dashboardData) : 'No Data'}
                {dashboardData && (
                  <svg className="w-4 h-4 text-gray-800 dark:text-gray-800 transform rotate-12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                )}
              </div>
              <div className="text-gray-700 dark:text-gray-700 text-sm">Next Subject</div>
              <div className="text-gray-800 dark:text-gray-800 text-xs mt-1">
                {dashboardData ? getNextSubjectTime(dashboardData) : 'No Data'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="text-center mb-8">
        </div>

      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 backdrop-blur-sm ${
          dragActive 
            ? 'border-gray-400 dark:border-white/60 bg-gray-200 dark:bg-white/20 shadow-xl scale-105' 
            : 'border-gray-300 dark:border-white/40 bg-gray-100 dark:bg-white/10 hover:border-gray-400 dark:hover:border-white/60 hover:bg-gray-200 dark:hover:bg-white/20 hover:shadow-lg'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 dark:border-white mx-auto"></div>
            <p className="text-lg font-medium text-gray-800 dark:text-white drop-shadow-md">Processing your PDF...</p>
            <p className="text-sm text-gray-600 dark:text-white/80 drop-shadow-sm">Extracting course information and schedule data</p>
          </div>
        ) : hasUploadedPDF ? (
          <div className="space-y-6">
            <div className="text-center">
              <DocumentTextIcon className="mx-auto h-16 w-16 text-green-500 dark:text-green-400 drop-shadow-lg" />
              <p className="text-xl font-medium text-gray-800 dark:text-white drop-shadow-md mt-4">
                PDF Successfully Loaded
              </p>
              <p className="text-sm text-gray-600 dark:text-white/70 mt-2 drop-shadow-sm">
                Your schedule data is ready to explore
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleReupload}
                className="flex flex-col items-center justify-center p-6 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/50 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
              >
                <ArrowUpTrayIcon className="h-8 w-8 text-blue-400 dark:text-blue-300 mb-2" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-300">Reupload</span>
                <span className="text-xs text-blue-500/80 dark:text-blue-400/80 mt-1">New PDF</span>
              </button>
              
              <button
                onClick={handleExplorer}
                className="flex flex-col items-center justify-center p-6 bg-green-500/20 hover:bg-green-500/30 border border-green-400/50 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
              >
                <FolderOpenIcon className="h-8 w-8 text-green-400 dark:text-green-300 mb-2" />
                <span className="text-sm font-medium text-green-600 dark:text-green-300">Explorer</span>
                <span className="text-xs text-green-500/80 dark:text-green-400/80 mt-1">View Schedule</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <DocumentArrowUpIcon className="mx-auto h-16 w-16 text-gray-600 dark:text-white/80 drop-shadow-lg" />
            <div>
              <p className="text-xl font-medium text-gray-800 dark:text-white drop-shadow-md">
                <label className="cursor-pointer hover:text-gray-600 dark:hover:text-white/80 transition-colors">
                  Tap to browse files
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-sm text-gray-600 dark:text-white/70 mt-2 drop-shadow-sm">
                Supports PDF files up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-300/50 rounded-2xl flex items-start space-x-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-200 flex-shrink-0 mt-0.5" />
          <p className="text-white/90 drop-shadow-sm">{error}</p>
        </div>
      )}

      {showExtractInfo && (
        <div className="mt-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
            What we can extract from your PDF:
          </h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                Course names and codes
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                Class times and days
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                Room locations
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                Instructor names
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                Credit hours
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                Course descriptions
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default PDFUploader;
