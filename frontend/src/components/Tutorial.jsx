import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  DocumentArrowUpIcon,
  SwatchIcon,
  CalendarDaysIcon,
  CogIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const Tutorial = ({ isOpen, onClose, onNavigate, currentStep }) => {
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const tutorialSteps = [
    {
      id: 'welcome',
      title: 'Welcome to ClassCraft! 🎓',
      content: 'This tutorial will guide you through all the features of your class schedule management app. Let\'s get started!',
      icon: LightBulbIcon,
      targetStep: null,
      highlight: null
    },
    {
      id: 'upload',
      title: 'Step 1: Upload Your Schedule',
      content: 'Start by uploading your PDF schedule or course registration document. The app will automatically extract your class information.',
      icon: DocumentArrowUpIcon,
      targetStep: 'upload',
      highlight: '.upload-area',
      instructions: [
        'Click the upload area or drag & drop your PDF file',
        'Wait for the file to process',
        'Your classes will be automatically extracted'
      ]
    },
    {
      id: 'design',
      title: 'Step 2: Design Your Schedule',
      content: 'Customize how your schedule looks with different templates and color schemes.',
      icon: SwatchIcon,
      targetStep: 'design',
      highlight: '.template-selector',
      instructions: [
        'Choose from different schedule templates',
        'Customize colors to match your style',
        'Export your schedule as an image'
      ]
    },
    {
      id: 'meeting',
      title: 'Step 3: View Meeting Schedule',
      content: 'See your upcoming classes and meetings in a clean, organized view.',
      icon: CalendarDaysIcon,
      targetStep: 'meeting',
      highlight: '.meeting-schedule',
      instructions: [
        'View your daily and weekly schedule',
        'See upcoming classes at a glance',
        'Check class times and locations'
      ]
    },
    {
      id: 'manage',
      title: 'Step 4: Manage Your Classes',
      content: 'Add meeting links, set notifications, and manage all your class details.',
      icon: CogIcon,
      targetStep: 'manage',
      highlight: '.class-manager',
      instructions: [
        'Add Zoom/Teams links to your classes',
        'Set up notifications for upcoming classes',
        'Edit class details and information'
      ]
    },
    {
      id: 'complete',
      title: 'You\'re All Set! 🚀',
      content: 'You now know how to use all the features of ClassCraft. Start by uploading your schedule and explore each section.',
      icon: LightBulbIcon,
      targetStep: 'upload',
      highlight: null,
      tips: [
        'Use the bottom navigation to switch between sections',
        'Your data is saved locally in your browser',
        'You can restart this tutorial anytime from the settings'
      ]
    }
  ];

  const currentTutorial = tutorialSteps[currentTutorialStep];

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Navigate to the target step if specified
      if (currentTutorial.targetStep && currentTutorial.targetStep !== currentStep) {
        onNavigate(currentTutorial.targetStep);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, currentTutorialStep, currentTutorial.targetStep, currentStep, onNavigate]);

  const nextStep = () => {
    if (currentTutorialStep < tutorialSteps.length - 1) {
      setCurrentTutorialStep(currentTutorialStep + 1);
    }
  };

  const prevStep = () => {
    if (currentTutorialStep > 0) {
      setCurrentTutorialStep(currentTutorialStep - 1);
    }
  };

  const skipTutorial = () => {
    localStorage.setItem('tutorial_completed', 'true');
    onClose();
  };

  const completeTutorial = () => {
    localStorage.setItem('tutorial_completed', 'true');
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden mx-2 sm:mx-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6 relative">
          <button
            onClick={skipTutorial}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white hover:bg-opacity-20"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <div className="flex items-center space-x-2 sm:space-x-3 pr-8">
            <currentTutorial.icon className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold leading-tight">{currentTutorial.title}</h2>
              <p className="text-blue-100 text-xs sm:text-sm">
                Step {currentTutorialStep + 1} of {tutorialSteps.length}
              </p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 sm:mt-4 bg-blue-500 bg-opacity-30 rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-white rounded-full h-1.5 sm:h-2 transition-all duration-300"
              style={{ width: `${((currentTutorialStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            {currentTutorial.content}
          </p>

          {currentTutorial.instructions && (
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">How to use this feature:</h4>
              <ul className="space-y-1">
                {currentTutorial.instructions.map((instruction, index) => (
                  <li key={index} className="text-blue-800 text-xs sm:text-sm flex items-start">
                    <span className="text-blue-600 mr-2 flex-shrink-0 mt-0.5">•</span>
                    <span className="flex-1">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {currentTutorial.tips && (
            <div className="bg-green-50 rounded-lg p-3 sm:p-4">
              <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">💡 Pro Tips:</h4>
              <ul className="space-y-1">
                {currentTutorial.tips.map((tip, index) => (
                  <li key={index} className="text-green-800 text-xs sm:text-sm flex items-start">
                    <span className="text-green-600 mr-2 flex-shrink-0 mt-0.5">•</span>
                    <span className="flex-1">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center flex-shrink-0">
          <button
            onClick={prevStep}
            disabled={currentTutorialStep === 0}
            className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors min-h-[44px] ${
              currentTutorialStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200 active:bg-gray-300'
            }`}
          >
            <ChevronLeftIcon className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm sm:text-base">Previous</span>
          </button>

          <div className="flex space-x-1.5 sm:space-x-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                  index === currentTutorialStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentTutorialStep === tutorialSteps.length - 1 ? (
            <button
              onClick={completeTutorial}
              className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors font-medium text-sm sm:text-base min-h-[44px]"
            >
              Get Started!
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center space-x-1 sm:space-x-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors min-h-[44px]"
            >
              <span className="text-sm sm:text-base">Next</span>
              <ChevronRightIcon className="w-4 h-4 flex-shrink-0" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
