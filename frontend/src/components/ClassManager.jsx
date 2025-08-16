import React, { useState, useEffect } from 'react';
import { 
  VideoCameraIcon, 
  LinkIcon, 
  BellIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { VideoCameraIcon as VideoCameraIconSolid } from '@heroicons/react/24/solid';

const ClassManager = ({ navigationManager }) => {
  const [classes, setClasses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [editingClass, setEditingClass] = useState(null);
  const [meetLink, setMeetLink] = useState('');
  const [notificationMinutes, setNotificationMinutes] = useState(10);

  useEffect(() => {
    if (navigationManager) {
      setClasses(navigationManager.getAllClasses());
      
      // Check for upcoming classes every minute
      const interval = setInterval(() => {
        const upcoming = navigationManager.checkUpcomingClasses();
        setUpcomingClasses(upcoming);
      }, 60000);

      // Initial check
      const upcoming = navigationManager.checkUpcomingClasses();
      setUpcomingClasses(upcoming);

      return () => clearInterval(interval);
    }
  }, [navigationManager]);

  const handleToggleOnline = (classId) => {
    const classItem = navigationManager.getClassById(classId);
    if (classItem) {
      navigationManager.updateOnlineClass(classId, {
        isOnline: !classItem.isOnline
      });
      setClasses(navigationManager.getAllClasses());
    }
  };

  const handleEditClass = (classId) => {
    const classItem = navigationManager.getClassById(classId);
    if (classItem) {
      setEditingClass(classId);
      setMeetLink(classItem.meetLink || '');
      setNotificationMinutes(classItem.notificationMinutes || 10);
    }
  };

  const handleSaveClass = () => {
    if (editingClass) {
      navigationManager.updateOnlineClass(editingClass, {
        meetLink,
        notificationMinutes
      });
      setClasses(navigationManager.getAllClasses());
      setEditingClass(null);
      setMeetLink('');
      setNotificationMinutes(10);
    }
  };

  const handleJoinClass = (classItem) => {
    if (classItem.meetLink) {
      window.open(classItem.meetLink, '_blank');
    }
  };

  const formatTime = (time) => {
    if (!time || typeof time !== 'string') {
      return 'Invalid Time';
    }
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Manage Classes</h2>
        <p className="text-base sm:text-lg text-gray-600">
          Set up online class links and notifications
        </p>
      </div>

      {/* Upcoming Class Notifications */}
      {upcomingClasses.length > 0 && (
        <div className="mb-6 space-y-3">
          {upcomingClasses.map((classItem) => (
            <div key={classItem.classId} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BellIcon className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900">{classItem.courseCode}</h3>
                    <p className="text-sm text-blue-700">
                      Starting in {classItem.minutesUntilClass} minutes
                    </p>
                  </div>
                </div>
                {classItem.meetLink && (
                  <button
                    onClick={() => handleJoinClass(classItem)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Join Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Class List */}
      <div className="space-y-4">
        {classes.map((classItem) => {
          const classId = `${classItem.courseId}-${classItem.day}-${classItem.startTime}`;
          const isEditing = editingClass === classId;
          const isHappening = navigationManager.isClassHappening(classItem);
          
          return (
            <div key={classId} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{classItem.courseCode}</h3>
                    {classItem.isOnline && (
                      <VideoCameraIconSolid className="w-5 h-5 text-blue-600" />
                    )}
                    {isHappening && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                        Live Now
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{classItem.courseName}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{classItem.day}, {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}</span>
                    </div>
                    <div>
                      <span>{classItem.room}</span>
                    </div>
                    <div>
                      <span>{classItem.instructor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Meet Link
                    </label>
                    <input
                      type="url"
                      value={meetLink}
                      onChange={(e) => setMeetLink(e.target.value)}
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notification (minutes before class)
                    </label>
                    <select
                      value={notificationMinutes}
                      onChange={(e) => setNotificationMinutes(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={5}>5 minutes</option>
                      <option value={10}>10 minutes</option>
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveClass}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingClass(null)}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 border-t pt-4">
                  <button
                    onClick={() => handleToggleOnline(classId)}
                    className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      classItem.isOnline
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <VideoCameraIcon className="w-4 h-4" />
                    <span>{classItem.isOnline ? 'Online Class' : 'Make Online'}</span>
                  </button>
                  
                  {classItem.isOnline && (
                    <>
                      <button
                        onClick={() => handleEditClass(classId)}
                        className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <LinkIcon className="w-4 h-4" />
                        <span>Setup Link</span>
                      </button>
                      
                      {classItem.meetLink && (
                        <button
                          onClick={() => handleJoinClass(classItem)}
                          className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            isHappening
                              ? 'bg-green-600 text-white hover:bg-green-700 animate-pulse'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          <VideoCameraIcon className="w-4 h-4" />
                          <span>{isHappening ? 'Join Now' : 'Join Class'}</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {classes.length === 0 && (
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Found</h3>
          <p className="text-gray-600">Upload your schedule first to manage your classes.</p>
        </div>
      )}
    </div>
  );
};

export default ClassManager;
