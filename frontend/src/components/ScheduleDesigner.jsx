import React, { useState, useRef } from 'react';
import { ArrowLeftIcon, PhotoIcon, SwatchIcon, PaintBrushIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';
import CourseInfoModal from './CourseInfoModal';
import ExportModal from './ExportModal';
import SuccessToast from './SuccessToast';

const ScheduleDesigner = ({ scheduleData, onBack }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [customColors, setCustomColors] = useState({
    primary: '#3B82F6',
    secondary: '#EFF6FF',
    accent: '#1D4ED8',
    text: '#1F2937'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const scheduleRef = useRef(null);


  // Use actual schedule data from PDF upload
  const displayData = scheduleData;
  const isShowcase = !scheduleData;

  const templates = {
    modern: {
      name: 'Modern',
      description: 'Clean and minimalist design',
      preview: 'bg-gradient-to-br from-blue-50 to-indigo-100'
    },
    classic: {
      name: 'Classic',
      description: 'Traditional academic style',
      preview: 'bg-gradient-to-br from-gray-50 to-gray-100'
    },
    vibrant: {
      name: 'Vibrant',
      description: 'Colorful and energetic',
      preview: 'bg-gradient-to-br from-purple-50 to-pink-100'
    },
    minimal: {
      name: 'Minimal',
      description: 'Simple black and white',
      preview: 'bg-white border-2 border-gray-200'
    }
  };

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getClassForTimeSlot = (day, time) => {
    if (!displayData?.schedule) return null;
    
    return displayData.schedule.find(item => {
      // Convert times to minutes for accurate comparison
      const [startHour, startMin] = item.startTime.split(':').map(Number);
      const [endHour, endMin] = item.endTime.split(':').map(Number);
      const [currentHour, currentMin] = time.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      const currentMinutes = currentHour * 60 + currentMin;
      
      return item.day === day && currentMinutes >= startMinutes && currentMinutes < endMinutes;
    });
  };

  const getCourseById = (courseId) => {
    return displayData.courses.find(course => course.id === courseId);
  };

  const exportAsImage = async (ratioOption = 'original') => {
    if (!scheduleRef.current) {
      alert('Schedule not found. Please try again.');
      return;
    }
    
    try {
      // Wait for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const element = scheduleRef.current;
      
      // Use the full element instead of trying to find a sub-element
      const targetElement = element;
      
      // Force a repaint
      targetElement.style.transform = 'translateZ(0)';
      
      const canvas = await html2canvas(targetElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        height: targetElement.scrollHeight,
        width: targetElement.scrollWidth,
        scrollX: 0,
        scrollY: 0
      });
      
      let finalCanvas = canvas;
      
      // Create resized canvas if not original
      if (ratioOption !== 'original') {
        const ratioMap = {
          'phone-wallpaper': { width: 1080, height: 1920 },
          'desktop-wallpaper': { width: 1920, height: 1080 },
          'square': { width: 1080, height: 1080 },
          'tablet': { width: 1536, height: 2048 }
        };
        
        if (ratioMap[ratioOption]) {
          const targetWidth = ratioMap[ratioOption].width;
          const targetHeight = ratioMap[ratioOption].height;
          
          finalCanvas = document.createElement('canvas');
          const ctx = finalCanvas.getContext('2d');
          finalCanvas.width = targetWidth;
          finalCanvas.height = targetHeight;
          
          // Fill with white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          
          // Calculate scaling to fit content while maintaining aspect ratio
          const scaleX = targetWidth / canvas.width;
          const scaleY = targetHeight / canvas.height;
          const scale = Math.min(scaleX, scaleY);
          
          const scaledWidth = canvas.width * scale;
          const scaledHeight = canvas.height * scale;
          const x = (targetWidth - scaledWidth) / 2;
          const y = (targetHeight - scaledHeight) / 2;
          
          ctx.drawImage(canvas, x, y, scaledWidth, scaledHeight);
        }
      }
      
      // Try multiple download methods
      const timestamp = new Date().getTime();
      const ratioName = ratioOption === 'original' ? 'original' : (ratioOption && ratioOption.replace ? ratioOption.replace('-', '_') : 'export');
      const fileName = `schedule_${ratioName}_${timestamp}.png`;
      
      // Convert canvas to data URL
      const dataURL = finalCanvas.toDataURL('image/png', 0.95);
      
      // Skip download due to sandbox restrictions - go straight to clipboard
      let downloadSuccess = false;
      try {
        // Convert data URL to blob for clipboard
        const response = await fetch(dataURL);
        const blob = await response.blob();
        
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        
        alert('Image copied to clipboard! Paste it into an image editor or document to save.');
        downloadSuccess = true;
      } catch (clipboardError) {
        // Final fallback: Show image in new window for manual save
        try {
          const newWindow = window.open('', '_blank');
          if (newWindow) {
            newWindow.document.write(`
              <html>
                <head><title>Schedule Image</title></head>
                <body style="margin:0;padding:20px;text-align:center;background:#f5f5f5;">
                  <h2>Your Schedule Image</h2>
                  <p>Right-click the image below and select "Save image as..." to download</p>
                  <img src="${dataURL}" style="max-width:100%;height:auto;box-shadow:0 4px 6px rgba(0,0,0,0.1);" />
                </body>
              </html>
            `);
            downloadSuccess = true;
          } else {
            alert('Unable to copy to clipboard or open new window. Please check your browser settings.');
          }
        } catch (windowError) {
          alert('Unable to export image. Please try a different browser or check your settings.');
        }
      }
      
      // Show success toast
      const formatName = ratioOption === 'original' ? 'Original' : 
        (ratioOption && ratioOption.split ? ratioOption.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Custom');
      setToastMessage(`${formatName} format ready for download!`);
      setShowSuccessToast(true);
      
    } catch (error) {
      console.error('Export error:', error);
      alert(`Failed to export image: ${error.message}. Please try again or check browser console for details.`);
    }
  };

  const getTemplateStyles = () => {
    switch (selectedTemplate) {
      case 'modern':
        return {
          container: 'bg-gradient-to-br from-blue-50 to-indigo-100',
          header: 'bg-white shadow-sm border-b-2 border-blue-200',
          cell: 'bg-white border border-gray-200',
          classCell: 'bg-blue-100 border-l-4 border-blue-500 text-blue-900',
          headerText: 'text-gray-800 font-semibold',
          timeText: 'text-gray-600 text-sm'
        };
      case 'classic':
        return {
          container: 'bg-gray-50',
          header: 'bg-gray-800 text-white',
          cell: 'bg-white border border-gray-300',
          classCell: 'bg-gray-100 border-l-4 border-gray-600 text-gray-800',
          headerText: 'text-white font-bold',
          timeText: 'text-gray-700 text-sm'
        };
      case 'vibrant':
        return {
          container: 'bg-gradient-to-br from-purple-100 to-pink-100',
          header: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
          cell: 'bg-white border border-purple-200',
          classCell: 'bg-gradient-to-r from-purple-100 to-pink-100 border-l-4 border-purple-500 text-purple-900',
          headerText: 'text-white font-bold',
          timeText: 'text-purple-700 text-sm'
        };
      case 'minimal':
        return {
          container: 'bg-white',
          header: 'bg-black text-white',
          cell: 'bg-white border border-gray-400',
          classCell: 'bg-gray-50 border-l-4 border-black text-black',
          headerText: 'text-white font-bold',
          timeText: 'text-gray-900 text-sm'
        };
      default:
        return templates.modern;
    }
  };

  const styles = getTemplateStyles();

  // Convert 24-hour time to 12-hour format
  const formatTime12Hour = (time24) => {
    if (!time24) return time24;
    
    const [hours, minutes] = time24.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6 pb-40 sm:pb-32 md:pb-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            {isShowcase ? (
              <div className="flex items-center space-x-2">
                <SwatchIcon className="w-5 h-5 text-blue-600" />
                <span className="text-sm sm:text-base font-medium text-gray-700">Design Showcase</span>
              </div>
            ) : (
              <button
                onClick={onBack}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Back to Upload</span>
              </button>
            )}
            
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center space-x-1 sm:space-x-2 bg-blue-600 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <PhotoIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Export as Image</span>
              <span className="xs:hidden">Export</span>
            </button>
          </div>


          {/* Schedule Preview */}
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 sm:p-3 lg:p-6">
            <div ref={scheduleRef} className={`${styles.container} p-2 sm:p-3 lg:p-6 rounded-lg`} style={{overflow: 'visible'}}>
              {/* Schedule Header */}
              <div className={`${styles.header} p-3 sm:p-4 rounded-t-lg mb-3 sm:mb-4 flex justify-between items-center`}>
                <div>
                  <h2 className={`text-xl sm:text-2xl font-bold ${styles.headerText}`}>My Class Schedule</h2>
                  <p className={`text-sm sm:text-base ${styles.headerText} opacity-80`}>Fall 2024 Semester</p>
                </div>
                {displayData && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-white hover:text-gray-200 transition-colors"
                    title="View Course Information"
                  >
                    <QuestionMarkCircleIcon className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Card-based Schedule Layout */}
              {displayData ? (
                <div className="relative min-h-[400px] sm:min-h-[600px] bg-gradient-to-br from-rose-100 via-pink-50 to-rose-200 rounded-lg p-3 sm:p-4 lg:p-6 overflow-hidden mb-8 sm:mb-12">
                  {/* Decorative Background Elements */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-rose-300 rounded-full opacity-30 -translate-x-16 -translate-y-16"></div>
                  <div className="absolute top-20 right-0 w-24 h-24 bg-rose-400 rounded-full opacity-20 translate-x-12"></div>
                  <div className="absolute bottom-0 left-20 w-40 h-40 bg-rose-200 rounded-full opacity-40 translate-y-20"></div>
                  <div className="absolute bottom-10 right-10 w-20 h-20 bg-rose-300 rounded-full opacity-25"></div>
                  
                  {/* Decorative Lines */}
                  <div className="absolute top-10 right-20 w-16 h-0.5 bg-gray-400 opacity-30 rotate-45"></div>
                  <div className="absolute top-12 right-16 w-12 h-0.5 bg-gray-400 opacity-30 rotate-45"></div>
                  <div className="absolute bottom-20 left-10 w-20 h-0.5 bg-gray-400 opacity-30 -rotate-12"></div>
                  <div className="absolute bottom-24 left-8 w-16 h-0.5 bg-gray-400 opacity-30 -rotate-12"></div>

                  {/* Title */}
                  <div className="relative z-10 mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-4xl font-bold text-rose-800 mb-1 sm:mb-2" style={{ fontFamily: 'serif' }}>Class Schedule</h1>
                    <p className="text-rose-700 text-sm sm:text-lg">BSIT-2F</p>
                  </div>

                  {/* Days Grid */}
                  <div className="relative z-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                    {days.map(day => {
                      const daySchedule = displayData.schedule.filter(item => item.day === day);
                      
                      if (daySchedule.length === 0) return null;
                      
                      return (
                        <div key={day} className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 shadow-lg border border-white/50">
                          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-1 sm:mb-2 lg:mb-3">{day}</h3>
                          <div className="space-y-1 sm:space-y-1.5 lg:space-y-2">
                            {daySchedule.map((classItem, index) => {
                              const course = getCourseById(classItem.courseId);
                              return (
                                <div key={index} className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                  <div className="font-medium">{course?.code || classItem.courseName}</div>
                                  <div className="text-gray-600">({formatTime12Hour(classItem.startTime)} - {formatTime12Hour(classItem.endTime)})</div>
                                  <div className="text-gray-600">{classItem.room}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Upload a PDF to see your schedule</p>
                </div>
              )}

            </div>
          </div>
          </div>
        </div>
      </div>
      
      <CourseInfoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        displayData={displayData} 
      />
      
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={exportAsImage}
      />
      
      <SuccessToast
        isVisible={showSuccessToast}
        onHide={() => setShowSuccessToast(false)}
        message={toastMessage}
      />
    </div>
  );
};

export default ScheduleDesigner;
