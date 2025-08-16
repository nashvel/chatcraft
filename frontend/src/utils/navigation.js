// Navigation utilities and state management
export const NAVIGATION_STEPS = {
  UPLOAD: 'upload',
  DESIGN: 'design', 
  MEETING: 'meeting',
  MANAGE: 'manage'
};

export const navigationConfig = {
  [NAVIGATION_STEPS.UPLOAD]: {
    id: NAVIGATION_STEPS.UPLOAD,
    label: 'Home',
    path: '/',
    requiresData: false
  },
  [NAVIGATION_STEPS.DESIGN]: {
    id: NAVIGATION_STEPS.DESIGN,
    label: 'Designs',
    path: '/designs',
    requiresData: true
  },
  [NAVIGATION_STEPS.MEETING]: {
    id: NAVIGATION_STEPS.MEETING,
    label: 'Meeting',
    path: '/meetings',
    requiresData: false
  },
  [NAVIGATION_STEPS.MANAGE]: {
    id: NAVIGATION_STEPS.MANAGE,
    label: 'Manage',
    path: '/manage',
    requiresData: true
  }
};

export class NavigationManager {
  constructor(initialStep = NAVIGATION_STEPS.UPLOAD) {
    this.currentStep = initialStep;
    this.scheduleData = this.createDemoScheduleData();
    this.onlineClasses = new Map();
    this.notifications = [];
    this.initializeDemoClasses();
  }

  createDemoScheduleData() {
    return {
      courses: [
        {
          id: 'CS101',
          code: 'CS 101',
          name: 'Introduction to Computer Science',
          instructor: 'Dr. Smith',
          credits: 3
        },
        {
          id: 'MATH201',
          code: 'MATH 201',
          name: 'Calculus II',
          instructor: 'Prof. Johnson',
          credits: 4
        },
        {
          id: 'ENG102',
          code: 'ENG 102',
          name: 'English Composition',
          instructor: 'Dr. Williams',
          credits: 3
        },
        {
          id: 'PHYS150',
          code: 'PHYS 150',
          name: 'General Physics I',
          instructor: 'Prof. Davis',
          credits: 4
        },
        {
          id: 'HIST101',
          code: 'HIST 101',
          name: 'World History',
          instructor: 'Dr. Brown',
          credits: 3
        }
      ],
      schedule: [
        { courseId: 'CS101', day: 'Monday', startTime: '09:00', endTime: '10:30', room: 'Room 201' },
        { courseId: 'CS101', day: 'Wednesday', startTime: '09:00', endTime: '10:30', room: 'Room 201' },
        { courseId: 'MATH201', day: 'Tuesday', startTime: '11:00', endTime: '12:30', room: 'Room 105' },
        { courseId: 'MATH201', day: 'Thursday', startTime: '11:00', endTime: '12:30', room: 'Room 105' },
        { courseId: 'ENG102', day: 'Monday', startTime: '14:00', endTime: '15:30', room: 'Room 302' },
        { courseId: 'ENG102', day: 'Wednesday', startTime: '14:00', endTime: '15:30', room: 'Room 302' },
        { courseId: 'PHYS150', day: 'Tuesday', startTime: '08:00', endTime: '09:30', room: 'Lab 101' },
        { courseId: 'PHYS150', day: 'Friday', startTime: '08:00', endTime: '09:30', room: 'Lab 101' },
        { courseId: 'HIST101', day: 'Thursday', startTime: '15:00', endTime: '16:30', room: 'Room 250' }
      ]
    };
  }

  initializeDemoClasses() {
    // Set up some demo online classes
    const demoOnlineClasses = [
      {
        classId: 'CS101-Monday-09:00',
        isOnline: true,
        meetLink: 'https://meet.google.com/abc-defg-hij',
        notificationMinutes: 10
      },
      {
        classId: 'MATH201-Tuesday-11:00',
        isOnline: true,
        meetLink: 'https://meet.google.com/xyz-uvwx-rst',
        notificationMinutes: 15
      },
      {
        classId: 'ENG102-Monday-14:00',
        isOnline: false
      }
    ];

    demoOnlineClasses.forEach(classData => {
      this.onlineClasses.set(classData.classId, classData);
    });
  }

  canNavigateTo(step) {
    const config = navigationConfig[step];
    if (!config) return false;
    
    if (config.requiresData && !this.scheduleData) {
      return false;
    }
    
    return true;
  }

  navigateTo(step) {
    if (this.canNavigateTo(step)) {
      this.currentStep = step;
      return true;
    }
    return false;
  }

  setScheduleData(data) {
    this.scheduleData = data;
    this.initializeOnlineClasses(data);
  }

  initializeOnlineClasses(data) {
    if (!data || !data.schedule) return;
    
    data.schedule.forEach(scheduleItem => {
      const course = data.courses.find(c => c.id === scheduleItem.courseId);
      if (course) {
        this.onlineClasses.set(`${scheduleItem.courseId}-${scheduleItem.day}-${scheduleItem.startTime}`, {
          ...scheduleItem,
          courseName: course.name,
          courseCode: course.code,
          instructor: course.instructor,
          isOnline: false,
          meetLink: '',
          notificationEnabled: true,
          notificationMinutes: 10
        });
      }
    });
  }

  updateOnlineClass(classId, updates) {
    if (this.onlineClasses.has(classId)) {
      const existingClass = this.onlineClasses.get(classId);
      this.onlineClasses.set(classId, { ...existingClass, ...updates });
      return true;
    }
    return false;
  }

  getOnlineClasses() {
    return Array.from(this.onlineClasses.values()).filter(cls => cls.isOnline);
  }

  getAllClasses() {
    if (!this.scheduleData || !this.scheduleData.schedule) {
      return [];
    }

    return this.scheduleData.schedule.map(scheduleItem => {
      const course = this.scheduleData.courses.find(c => c.id === scheduleItem.courseId);
      const classId = `${scheduleItem.courseId}-${scheduleItem.day}-${scheduleItem.startTime}`;
      const onlineClassData = this.onlineClasses.get(classId) || {};
      
      return {
        ...scheduleItem,
        courseName: course ? course.name : 'Unknown Course',
        courseCode: course ? course.code : scheduleItem.courseId,
        instructor: course ? course.instructor : 'Unknown Instructor',
        isOnline: onlineClassData.isOnline || false,
        meetLink: onlineClassData.meetLink || '',
        notificationEnabled: onlineClassData.notificationEnabled !== false,
        notificationMinutes: onlineClassData.notificationMinutes || 10
      };
    });
  }

  getClassById(classId) {
    return this.onlineClasses.get(classId);
  }

  checkUpcomingClasses() {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toTimeString().slice(0, 5);
    
    const upcomingClasses = [];
    
    this.onlineClasses.forEach((classItem, classId) => {
      if (classItem.isOnline && classItem.notificationEnabled) {
        const classTime = new Date();
        const [hours, minutes] = classItem.startTime.split(':');
        classTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        const timeDiff = classTime.getTime() - now.getTime();
        const minutesUntilClass = Math.floor(timeDiff / (1000 * 60));
        
        if (classItem.day === currentDay && minutesUntilClass <= classItem.notificationMinutes && minutesUntilClass > 0) {
          upcomingClasses.push({
            ...classItem,
            classId,
            minutesUntilClass
          });
        }
      }
    });
    
    return upcomingClasses;
  }

  isClassHappening(classItem) {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toTimeString().slice(0, 5);
    
    if (classItem.day !== currentDay) return false;
    
    const [startHour, startMin] = classItem.startTime.split(':').map(Number);
    const [endHour, endMin] = classItem.endTime.split(':').map(Number);
    const [currentHour, currentMin] = currentTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const currentMinutes = currentHour * 60 + currentMin;
    
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }
}
