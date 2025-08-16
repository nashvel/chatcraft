import React, { useState } from 'react';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserGroupIcon,
  VideoCameraIcon,
  PlusIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const MeetingSchedule = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const upcomingMeetings = [
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
    { id: 'study', label: 'Study', count: upcomingMeetings.filter(m => m.type === 'study').length },
    { id: 'project', label: 'Project', count: upcomingMeetings.filter(m => m.type === 'project').length },
    { id: 'office', label: 'Office', count: upcomingMeetings.filter(m => m.type === 'office').length },
    { id: 'workshop', label: 'Workshop', count: upcomingMeetings.filter(m => m.type === 'workshop').length }
  ];

  const filteredMeetings = selectedFilter === 'all' 
    ? upcomingMeetings 
    : upcomingMeetings.filter(meeting => meeting.type === selectedFilter);

  const handleJoinMeeting = (meeting) => {
    if (meeting.isOnline && meeting.meetLink) {
      window.open(meeting.meetLink, '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Meeting Schedule</h2>
        <p className="text-base sm:text-lg text-gray-600">
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          <div key={meeting.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                  {meeting.isOnline && (
                    <VideoCameraIcon className="w-5 h-5 text-blue-600" />
                  )}
                  {meeting.date === 'Today' && (
                    <BellIcon className="w-4 h-4 text-orange-500" />
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <CalendarDaysIcon className="w-4 h-4" />
                    <span>{meeting.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>{meeting.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{meeting.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UserGroupIcon className="w-4 h-4" />
                    <span>{meeting.attendees} attendee{meeting.attendees !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 sm:mt-0 sm:ml-4">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(meeting.type)}`}>
                  {meeting.type.charAt(0).toUpperCase() + meeting.type.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {meeting.isOnline && meeting.meetLink ? (
                <button 
                  onClick={() => handleJoinMeeting(meeting)}
                  className="flex items-center justify-center space-x-2 flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <VideoCameraIcon className="w-4 h-4" />
                  <span>Join Online</span>
                </button>
              ) : (
                <button className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
                  In-Person Meeting
                </button>
              )}
              <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMeetings.length === 0 && (
        <div className="text-center py-12">
          <CalendarDaysIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {selectedFilter} meetings</h3>
          <p className="text-gray-600">Try selecting a different filter or schedule a new meeting.</p>
        </div>
      )}

      {/* Add Meeting Button */}
      <div className="mt-8 text-center">
        <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <PlusIcon className="w-5 h-5" />
          <span>Schedule New Meeting</span>
        </button>
      </div>
    </div>
  );
};

export default MeetingSchedule;
