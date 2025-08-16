import React, { useState, useRef } from 'react';
import { ArrowLeftIcon, PhotoIcon, SwatchIcon, PaintBrushIcon } from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';

const ScheduleDesigner = ({ scheduleData, onBack }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [customColors, setCustomColors] = useState({
    primary: '#3B82F6',
    secondary: '#EFF6FF',
    accent: '#1D4ED8',
    text: '#1F2937'
  });
  const scheduleRef = useRef(null);

  // Use sample data if no schedule data provided (for showcase)
  const displayData = scheduleData || {
    courses: [
      { id: 1, name: 'Advanced Mathematics', code: 'MATH301', instructor: 'Dr. Sarah Chen', credits: 4 },
      { id: 2, name: 'Computer Science Fundamentals', code: 'CS101', instructor: 'Prof. Michael Johnson', credits: 3 },
      { id: 3, name: 'Physics Laboratory', code: 'PHYS201', instructor: 'Dr. Emily Rodriguez', credits: 3 },
      { id: 4, name: 'English Literature', code: 'ENG200', instructor: 'Ms. Jennifer Davis', credits: 3 },
      { id: 5, name: 'Digital Design Studio', code: 'ART250', instructor: 'Prof. David Kim', credits: 4 }
    ],
    schedule: [
      { courseId: 1, day: 'Monday', startTime: '09:00', endTime: '10:30', room: 'Math Building 201' },
      { courseId: 1, day: 'Wednesday', startTime: '09:00', endTime: '10:30', room: 'Math Building 201' },
      { courseId: 2, day: 'Tuesday', startTime: '11:00', endTime: '12:30', room: 'Computer Lab A' },
      { courseId: 2, day: 'Thursday', startTime: '11:00', endTime: '12:30', room: 'Computer Lab A' },
      { courseId: 3, day: 'Monday', startTime: '14:00', endTime: '16:00', room: 'Physics Lab 150' },
      { courseId: 3, day: 'Friday', startTime: '14:00', endTime: '16:00', room: 'Physics Lab 150' },
      { courseId: 4, day: 'Tuesday', startTime: '13:00', endTime: '14:30', room: 'Humanities 300' },
      { courseId: 4, day: 'Thursday', startTime: '13:00', endTime: '14:30', room: 'Humanities 300' },
      { courseId: 5, day: 'Wednesday', startTime: '15:00', endTime: '17:00', room: 'Art Studio B' },
      { courseId: 5, day: 'Friday', startTime: '10:00', endTime: '12:00', room: 'Art Studio B' }
    ]
  };

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

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getClassForTimeSlot = (day, time) => {
    return displayData.schedule.find(item => {
      const startHour = parseInt(item.startTime.split(':')[0]);
      const currentHour = parseInt(time.split(':')[0]);
      const endHour = parseInt(item.endTime.split(':')[0]);
      
      return item.day === day && currentHour >= startHour && currentHour < endHour;
    });
  };

  const getCourseById = (courseId) => {
    return displayData.courses.find(course => course.id === courseId);
  };

  const exportAsImage = async () => {
    if (scheduleRef.current) {
      try {
        const canvas = await html2canvas(scheduleRef.current, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true
        });
        
        const link = document.createElement('a');
        link.download = `classcraft-schedule-${selectedTemplate}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } catch (error) {
        console.error('Error exporting image:', error);
      }
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
          onClick={exportAsImage}
          className="flex items-center space-x-1 sm:space-x-2 bg-blue-600 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          <PhotoIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden xs:inline">Export as Image</span>
          <span className="xs:hidden">Export</span>
        </button>
      </div>

      {/* Mobile-first layout */}
      <div className="space-y-6">
        {/* Mobile Controls - Horizontal Scroll */}
        <div className="lg:hidden">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <SwatchIcon className="w-5 h-5 mr-2" />
              Design Templates
            </h3>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {Object.entries(templates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTemplate(key)}
                  className={`flex-shrink-0 w-32 text-left p-3 rounded-lg border-2 transition-colors ${
                    selectedTemplate === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-full h-8 rounded mb-2 ${template.preview}`}></div>
                  <div className="font-medium text-gray-900 text-sm">{template.name}</div>
                </button>
              ))}
            </div>
            
            <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3 flex items-center">
              <PaintBrushIcon className="w-4 h-4 mr-2" />
              Colors
            </h4>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(customColors).map(([key, color]) => (
                <div key={key} className="text-center">
                  <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">
                    {key}
                  </label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setCustomColors(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full h-10 rounded border border-gray-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-8">
          {/* Design Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <SwatchIcon className="w-5 h-5 mr-2" />
                Templates
              </h3>
              <div className="space-y-3">
                {Object.entries(templates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                      selectedTemplate === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-8 rounded mb-2 ${template.preview}`}></div>
                    <div className="font-medium text-gray-900">{template.name}</div>
                    <div className="text-sm text-gray-600">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <PaintBrushIcon className="w-5 h-5 mr-2" />
                Customize Colors
              </h3>
              <div className="space-y-3">
                {Object.entries(customColors).map(([key, color]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {key}
                    </label>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setCustomColors(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Preview - Both Mobile and Desktop */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 sm:p-6">
            <div ref={scheduleRef} className={`${styles.container} p-3 sm:p-6 rounded-lg`}>
              {/* Schedule Header */}
              <div className={`${styles.header} p-3 sm:p-4 rounded-t-lg mb-3 sm:mb-4`}>
                <h2 className={`text-xl sm:text-2xl font-bold ${styles.headerText}`}>My Class Schedule</h2>
                <p className={`text-sm sm:text-base ${styles.headerText} opacity-80`}>Fall 2024 Semester</p>
              </div>

              {/* Schedule Grid */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[600px]">
                  <thead>
                    <tr>
                      <th className={`${styles.cell} p-2 sm:p-3 text-left min-w-[60px]`}>
                        <span className={`${styles.headerText} text-xs sm:text-sm`}>Time</span>
                      </th>
                      {days.map(day => (
                        <th key={day} className={`${styles.cell} p-2 sm:p-3 text-center min-w-[100px]`}>
                          <span className={`${styles.headerText} text-xs sm:text-sm`}>
                            <span className="hidden sm:inline">{day}</span>
                            <span className="sm:hidden">{day.slice(0, 3)}</span>
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map(time => (
                      <tr key={time}>
                        <td className={`${styles.cell} p-2 sm:p-3 font-medium`}>
                          <span className={`${styles.timeText} text-xs sm:text-sm`}>{time}</span>
                        </td>
                        {days.map(day => {
                          const classItem = getClassForTimeSlot(day, time);
                          const course = classItem ? getCourseById(classItem.courseId) : null;
                          
                          return (
                            <td key={`${day}-${time}`} className={`${classItem ? styles.classCell : styles.cell} p-1 sm:p-3`}>
                              {course && (
                                <div className="space-y-0.5 sm:space-y-1">
                                  <div className="font-semibold text-xs sm:text-sm">{course.code}</div>
                                  <div className="text-xs opacity-80 hidden sm:block">{course.name}</div>
                                  <div className="text-xs opacity-70">{classItem.room}</div>
                                  <div className="text-xs opacity-70 hidden sm:block">{course.instructor}</div>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Course Legend */}
              <div className="mt-4 sm:mt-6 grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Course Information</h3>
                  <div className="space-y-1.5 sm:space-y-2">
                    {displayData.courses.map(course => (
                      <div key={course.id} className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded flex-shrink-0"></div>
                        <span className="font-medium">{course.code}</span>
                        <span className="text-gray-600 truncate">{course.name}</span>
                        <span className="text-gray-500 whitespace-nowrap">({course.credits}cr)</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Total Credits</h3>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {displayData.courses.reduce((total, course) => total + course.credits, 0)} Credits
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {displayData.courses.length} courses enrolled
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDesigner;
