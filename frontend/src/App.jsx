import React, { useState, useEffect } from 'react';
import PDFUploader from './components/PDFUploader';
import ScheduleDesigner from './components/ScheduleDesigner';
import MeetingSchedule from './components/MeetingSchedule';
import ClassManager from './components/ClassManager';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import { NavigationManager } from './utils/navigation';

function App() {
  const [scheduleData, setScheduleData] = useState(null);
  const [currentStep, setCurrentStep] = useState('upload');
  const [navigationManager, setNavigationManager] = useState(null);

  useEffect(() => {
    const navManager = new NavigationManager();
    setNavigationManager(navManager);
  }, []);

  const handlePDFProcessed = (extractedData) => {
    setScheduleData(extractedData);
    if (navigationManager) {
      navigationManager.setScheduleData(extractedData);
    }
    setCurrentStep('design');
  };

  const handleBackToUpload = () => {
    setCurrentStep('upload');
    setScheduleData(null);
    if (navigationManager) {
      navigationManager.setScheduleData(null);
    }
  };

  const handleNavigation = (step) => {
    // Allow navigation to all steps for now, we'll handle requirements in the UI
    setCurrentStep(step);
    if (navigationManager) {
      navigationManager.navigateTo(step);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-16 md:pb-0">
      <Header />
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {currentStep === 'upload' ? (
          <PDFUploader onPDFProcessed={handlePDFProcessed} />
        ) : currentStep === 'design' ? (
          <ScheduleDesigner 
            scheduleData={scheduleData} 
            onBack={handleBackToUpload}
          />
        ) : currentStep === 'manage' ? (
          <ClassManager navigationManager={navigationManager} />
        ) : (
          <MeetingSchedule />
        )}
      </main>
      <BottomNavigation 
        currentStep={currentStep} 
        onNavigate={handleNavigation}
        hasScheduleData={!!scheduleData}
      />
    </div>
  );
}

export default App;
