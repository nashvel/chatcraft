import React, { useState, useCallback } from 'react';
import { DocumentArrowUpIcon, DocumentTextIcon, ExclamationTriangleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { PDFParser } from '../utils/pdfParser';

const PDFUploader = ({ onPDFProcessed }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showExtractInfo, setShowExtractInfo] = useState(false);

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

      onPDFProcessed(scheduleData);
    } catch (err) {
      console.error('PDF processing error:', err);
      setError(err.message || 'Failed to process PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">4</div>
              <div className="text-white/70 text-sm">Online Classes</div>
              <div className="text-blue-400 text-xs mt-1">Virtual</div>
            </div>
          </div>
          
          {/* Face to Face Classes */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">6</div>
              <div className="text-white/70 text-sm">Face to Face Classes</div>
              <div className="text-green-400 text-xs mt-1">On Campus</div>
            </div>
          </div>
          
          {/* Upcoming Classes */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">3</div>
              <div className="text-white/70 text-sm">Upcoming Classes</div>
              <div className="text-orange-400 text-xs mt-1">Today</div>
            </div>
          </div>
          
          {/* Next Class Subject */}
          <div className="bg-yellow-400 backdrop-blur-lg rounded-2xl p-4 border border-yellow-500 relative">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 mb-1 flex items-center justify-center gap-2">
                IT 107
                <svg className="w-4 h-4 text-gray-800 transform rotate-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="text-gray-700 text-sm">Next Subject</div>
              <div className="text-gray-800 text-xs mt-1">9:00 AM</div>
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
            ? 'border-white/60 bg-white/20 shadow-xl scale-105' 
            : 'border-white/40 bg-white/10 hover:border-white/60 hover:bg-white/20 hover:shadow-lg'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-lg font-medium text-white drop-shadow-md">Processing your PDF...</p>
            <p className="text-sm text-white/80 drop-shadow-sm">Extracting course information and schedule data</p>
          </div>
        ) : (
          <div className="space-y-4">
            <DocumentArrowUpIcon className="mx-auto h-16 w-16 text-white/80 drop-shadow-lg" />
            <div>
              <p className="text-xl font-medium text-white drop-shadow-md">
                <label className="cursor-pointer hover:text-white/80 transition-colors">
                  Tap to browse files
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-sm text-white/70 mt-2 drop-shadow-sm">
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
