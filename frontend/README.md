# ClassCraft

A modern, mobile-friendly class schedule designer application that transforms PDF schedules into beautiful, customizable designs with integrated online class management.

## Overview

ClassCraft is a comprehensive academic scheduling solution that allows students to upload their class schedules in PDF format and create visually appealing, customizable schedule designs. The application features online class management with Google Meet integration, meeting scheduling, and a responsive design optimized for both desktop and mobile devices.

## Technology Stack

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

### Core Technologies

- **React 19.1.0** - Modern React with latest features and hooks
- **Vite 7.0.0** - Fast build tool and development server
- **Tailwind CSS 3.4.4** - Utility-first CSS framework for responsive design
- **JavaScript ES6+** - Modern JavaScript with module support

### UI Components & Icons

- **Heroicons 2.2.0** - Beautiful hand-crafted SVG icons
- **Headless UI 2.2.4** - Unstyled, accessible UI components

### Additional Libraries

- **html2canvas 1.4.1** - Screenshot and image export functionality
- **PostCSS 8.4.38** - CSS processing and optimization
- **Autoprefixer 10.4.17** - Automatic vendor prefixing

## Key Features

### Schedule Management
- PDF upload and processing for class schedule extraction
- Automatic extraction of course names, codes, times, and locations
- Instructor information parsing and display

### Design Customization
- Multiple professional templates (Modern, Classic, Vibrant, Minimal)
- Customizable color schemes with real-time preview
- Export schedule as high-quality images
- Mobile-optimized design controls with horizontal scrolling

### Online Class Integration
- Google Meet link management for virtual classes
- Automatic class notifications and reminders
- Live class status indicators
- One-click join functionality for online meetings

### Meeting Scheduling
- Comprehensive meeting and study session management
- Filter by meeting type (Study, Project, Office Hours, Workshop)
- Online/offline meeting support with video conferencing links
- Mobile-friendly meeting cards and controls

### Mobile Responsiveness
- Fully responsive design for all screen sizes
- Touch-optimized controls and navigation
- Horizontal scrolling for template selection on mobile
- Adaptive layouts for optimal mobile experience

## Project Structure

```
src/
├── components/
│   ├── Header.jsx              # Sticky responsive header
│   ├── PDFUploader.jsx         # File upload with drag/drop
│   ├── ScheduleDesigner.jsx    # Main design interface
│   ├── ClassManager.jsx        # Online class management
│   ├── MeetingSchedule.jsx     # Meeting and event scheduling
│   └── BottomNavigation.jsx    # Mobile navigation
├── utils/
│   └── navigation.js           # Navigation state management
├── App.jsx                     # Main application container
└── main.jsx                    # Application entry point
```

## Development Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd prototype/frontend
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code analysis

## Browser Support

ClassCraft supports all modern browsers including:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is private and proprietary.
