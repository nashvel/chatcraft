import React, { useState, useEffect } from 'react';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserGroupIcon,
  VideoCameraIcon,
  PlusIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import MeetingSetupModal from './MeetingSetupModal';

const MeetingSchedule = ({ scheduleData }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [meetingSetups, setMeetingSetups] = useState({});
  
  // Convert schedule data to meeting format
  const generateMeetingsFromSchedule = (data) => {
    if (!data || !data.courses || !data.schedule) {
      return [];
    }
    
    const meetings = [];
    const today = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    data.schedule.forEach((scheduleItem, index) => {
      const course = data.courses.find(c => c.id === scheduleItem.courseId);
      if (!course) return;
      
      // Calculate next occurrence of this day
      const targetDayIndex = daysOfWeek.indexOf(scheduleItem.day);
      const todayIndex = today.getDay();
      let daysUntil = targetDayIndex - todayIndex;
      if (daysUntil < 0) daysUntil += 7;
      
      const meetingDate = new Date(today);
      meetingDate.setDate(today.getDate() + daysUntil);
      
      let dateLabel = 'Today';
      if (daysUntil === 1) dateLabel = 'Tomorrow';
      else if (daysUntil > 1) dateLabel = scheduleItem.day;
      
      meetings.push({
        id: index + 1,
        title: course.code || course.name,
        time: `${scheduleItem.startTime} - ${scheduleItem.endTime}`,
        date: dateLabel,
        location: scheduleItem.room || 'TBA',
        instructor: course.instructor,
        type: 'class',
        isOnline: scheduleItem.room && (scheduleItem.room.toLowerCase().includes('online') || scheduleItem.room.toLowerCase().includes('zoom') || scheduleItem.room.toLowerCase().includes('meet')),
        status: 'upcoming',
        meetLink: null,
        credits: course.credits
      });
    });
    
    return meetings.sort((a, b) => {
      const order = { 'Today': 0, 'Tomorrow': 1 };
      return (order[a.date] || 2) - (order[b.date] || 2);
    });
  };
  
  const upcomingMeetings = scheduleData ? generateMeetingsFromSchedule(scheduleData) : [
    {
      id: 1,
      title: 'Study Group - Calculus II',
      time: '2:00 PM - 4:00 PM',
      date: 'Today',
      location: 'Library Room 201',
      attendees: 5,
      type: 'study',
      isOnline: false,
      status: 'upcoming',
      meetLink: null
    },
    {
      id: 2,
      title: 'CS 101 Project Discussion',
      time: '10:00 AM - 11:30 AM',
      date: 'Tomorrow',
      location: 'Google Meet',
      attendees: 3,
      type: 'project',
      isOnline: true,
      status: 'upcoming',
      meetLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: 3,
      title: 'Physics Office Hours',
      time: '3:00 PM - 4:00 PM',
      date: 'Friday',
      location: 'Prof. Davis Office',
      attendees: 1,
      type: 'office',
      isOnline: false,
      status: 'upcoming',
      meetLink: null
    },
    {
      id: 4,
      title: 'English Composition Workshop',
      time: '1:00 PM - 2:30 PM',
      date: 'Monday',
      location: 'Zoom Meeting',
      attendees: 8,
      type: 'workshop',
      isOnline: true,
      status: 'upcoming',
      meetLink: 'https://zoom.us/j/123456789'
    },
    {
      id: 5,
      title: 'History Study Session',
      time: '4:00 PM - 6:00 PM',
      date: 'Wednesday',
      location: 'Student Center',
      attendees: 6,
      type: 'study',
      isOnline: false,
      status: 'upcoming',
      meetLink: null
    }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'study': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'project': return 'bg-green-100 text-green-800 border-green-200';
      case 'office': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'workshop': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filterTypes = [
    { id: 'all', label: 'All', count: upcomingMeetings.length },
    { id: 'inperson', label: 'In-person', count: upcomingMeetings.filter(m => !m.isOnline).length },
    { id: 'online', label: 'Online', count: upcomingMeetings.filter(m => m.isOnline).length }
  ];

  const filteredMeetings = selectedFilter === 'all' 
    ? upcomingMeetings 
    : selectedFilter === 'online'
    ? upcomingMeetings.filter(meeting => meeting.isOnline)
    : upcomingMeetings.filter(meeting => !meeting.isOnline);

  useEffect(() => {
    // Load meeting setups from localStorage
    const savedSetups = JSON.parse(localStorage.getItem('meetingSetups') || '{}');
    setMeetingSetups(savedSetups);
  }, []);

  const handleJoinMeeting = (meeting) => {
    const setup = meetingSetups[meeting.id];
    const meetLink = setup?.link || meeting.meetLink;
    if (meeting.isOnline && meetLink) {
      window.open(meetLink, '_blank');
    }
  };

  const handleSetupMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setIsSetupModalOpen(true);
  };

  const handleSaveSetup = (meetingId, setupData) => {
    setMeetingSetups(prev => ({
      ...prev,
      [meetingId]: setupData
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 min-h-screen bg-white dark:bg-gray-900">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Meeting Schedule</h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Stay organized with your upcoming study sessions and meetings
        </p>
      </div>

      {/* Filter Tabs - Mobile Optimized */}
      <div className="mb-6">
        <div className="flex overflow-x-auto pb-2 space-x-2 sm:space-x-4">
          {filterTypes.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter.id
                  ? 'bg-blue-600 dark:bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Meeting Cards */}
      <div className="space-y-4">
        {filteredMeetings.map((meeting) => (
          <div key={meeting.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{meeting.title}</h3>
                  {meeting.isOnline && (
                    <VideoCameraIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                  {meetingSetups[meeting.id] && (
                    <BellIcon className="w-5 h-5 ml-2 text-green-500" title="Meeting setup configured" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <CalendarDaysIcon className="w-4 h-4 mr-2" />
                    <span>{meeting.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span>{meetingSetups[meeting.id]?.time || meeting.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    <span>{meeting.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <UserGroupIcon className="w-4 h-4 mr-2" />
                    <span>{meeting.instructor || meeting.attendees}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(meeting.type)}`}>
                  {meeting.type === 'class' ? 'Class' : meeting.type.charAt(0).toUpperCase() + meeting.type.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {meeting.isOnline && meeting.meetLink ? (
                <button 
                  onClick={() => handleJoinMeeting(meeting)}
                  className="flex items-center justify-center space-x-2 flex-1 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  <VideoCameraIcon className="w-4 h-4" />
                  <span>Join Online</span>
                </button>
              ) : (
                <button 
                  onClick={() => handleSetupMeeting(meeting)}
                  className="flex-1 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  {meeting.isOnline ? 'Setup' : 'In-Person Meeting'}
                </button>
              )}
              <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMeetings.length === 0 && (
        <div className="text-center py-12">
          <CalendarDaysIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No {selectedFilter} meetings</h3>
          <p className="text-gray-600 dark:text-gray-400">Try selecting a different filter or schedule a new meeting.</p>
        </div>
      )}

      {/* Add Meeting Button */}
      <div className="mt-8 text-center">
        <button className="flex items-center justify-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium">
          <PlusIcon className="w-5 h-5" />
          <span>Schedule New Meeting</span>
        </button>
      </div>

      {/* Meeting Setup Modal */}
      <MeetingSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        meeting={selectedMeeting}
        onSave={handleSaveSetup}
      />
    </div>
  );
};

export default MeetingSchedule;
