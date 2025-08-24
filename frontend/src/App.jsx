import React, { useState, useEffect } from 'react';
import PDFUploader from './components/PDFUploader';
import ScheduleDesigner from './components/ScheduleDesigner';
import MeetingSchedule from './components/MeetingSchedule';
import ClassManager from './components/ClassManager';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import Tutorial from './components/Tutorial';
import { NavigationManager } from './utils/navigation';

function App() {
  const [scheduleData, setScheduleData] = useState(null);
  const [currentStep, setCurrentStep] = useState('upload');
  const [navigationManager, setNavigationManager] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const navManager = new NavigationManager();
    setNavigationManager(navManager);
    
    // Check if tutorial should be shown for first-time users
    const tutorialCompleted = localStorage.getItem('tutorial_completed');
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  }, []);

  const handlePDFProcessed = (extractedData) => {
    console.log('App.jsx received PDF data:', extractedData);
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
      <Header onShowTutorial={() => setShowTutorial(true)} />
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {currentStep === 'upload' ? (
          <PDFUploader onPDFProcessed={handlePDFProcessed} />
        ) : currentStep === 'design' ? (
          <ScheduleDesigner 
            scheduleData={scheduleData} 
            onBack={handleBackToUpload}
          />
        ) : currentStep === 'manage' ? (
          <ClassManager navigationManager={navigationManager} scheduleData={scheduleData} />
        ) : (
          <MeetingSchedule scheduleData={scheduleData} />
        )}
      </main>
      <BottomNavigation 
        currentStep={currentStep} 
        onNavigate={handleNavigation}
        hasScheduleData={!!scheduleData}
      />
      <Tutorial 
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onNavigate={handleNavigation}
        currentStep={currentStep}
      />
    </div>
  );
}

export default App;
