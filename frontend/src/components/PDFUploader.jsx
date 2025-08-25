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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative">
      {/* Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-8 shadow-2xl">
          <img 
            src="/logo.png" 
            alt="Timely Logo" 
            className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain"
          />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">Upload Your COR</h2>
            <button
              onClick={() => setShowExtractInfo(!showExtractInfo)}
              className="text-white/80 hover:text-white transition-colors drop-shadow-lg"
              title="What can we extract from your PDF?"
            >
              <QuestionMarkCircleIcon className="w-6 h-6" />
            </button>
          </div>
          <p className="text-white/90 text-lg drop-shadow-md leading-relaxed">
            Upload a PDF of your COR and we'll extract the information to create a beautiful, customizable schedule design.
          </p>
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
