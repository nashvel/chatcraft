import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const AboutUs = ({ onBack }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [terminalText, setTerminalText] = useState('');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  const terminalPrompts = [
    '$ npm install timely-scheduler',
    '$ timely --extract-pdf schedule.pdf',
    '✓ Successfully extracted 8 classes from COR',
    '$ timely --optimize-schedule',
    '✓ Found 3 free time slots for meetings',
    '$ timely --export-calendar',
    '✓ Calendar exported to Google Calendar',
    '$ echo "Schedule management made easy!"'
  ];

  const features = [
    {
      id: 1,
      title: "AI Schedule Generator",
      description: "Upload your COR PDF and let AI extract and organize your class schedule automatically.",
      image: "/ai-1.png",
      hoverImage: "/ai-2.png",
      gradient: "from-blue-400 to-blue-500",
      textColor: "text-blue-100"
    },
    {
      id: 2,
      title: "Smart Class Manager",
      description: "Organize and manage your classes with intelligent scheduling and beautiful visual design.",
      emoji: "🎯",
      gradient: "from-green-400 to-green-500",
      textColor: "text-green-100"
    },
    {
      id: 3,
      title: "Meeting Scheduler",
      description: "Plan and schedule meetings with classmates using your available time slots.",
      emoji: "⏰",
      gradient: "from-yellow-400 to-orange-400",
      textColor: "text-yellow-100"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  useEffect(() => {
    const typeText = () => {
      const currentPrompt = terminalPrompts[currentPromptIndex];
      let charIndex = 0;
      setTerminalText('');
      
      const typeInterval = setInterval(() => {
        if (charIndex < currentPrompt.length) {
          setTerminalText(currentPrompt.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            setCurrentPromptIndex((prev) => (prev + 1) % terminalPrompts.length);
          }, 2000);
        }
      }, 50);
    };

    typeText();
  }, [currentPromptIndex, terminalPrompts]);
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-white/70 hover:text-white transition-all duration-300 p-2 rounded-full hover:bg-white/10"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full border-2 border-white/30 p-0.5">
                  <img 
                    src="/icon.png" 
                    alt="Timely" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <h1 className="text-xl font-medium text-white">Timely</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 pb-0">
        <div className="max-w-md mx-auto">
          {/* Subtitle */}
          <div className="text-center mb-6">
            <p className="text-gray-700 text-lg font-medium">
              Lightweight demos and experiments designed for fun
            </p>
          </div>

          {/* Feature Carousel */}
          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {features.map((feature, index) => (
                  <div key={feature.id} className="w-full flex-shrink-0">
                    <div className={`bg-gradient-to-br ${feature.gradient} rounded-3xl p-6 text-white relative overflow-hidden group`}>
                      <div className="flex items-start space-x-4">
                        <div className={`${feature.image ? 'w-24 h-24' : 'w-16 h-16'} flex items-center justify-center flex-shrink-0 relative`}>
                          {feature.image ? (
                            <div className="w-24 h-24 bg-black/20 backdrop-blur-sm rounded-3xl flex items-center justify-center relative overflow-hidden">
                              <img 
                                src={feature.image} 
                                alt={feature.title}
                                className="w-20 h-20 object-contain transition-opacity duration-300 group-hover:opacity-0"
                              />
                              <img 
                                src={feature.hoverImage} 
                                alt={feature.title}
                                className="w-20 h-20 object-contain absolute inset-0 m-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                              <span className="text-2xl">{feature.emoji}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                          <p className={`${feature.textColor} text-sm leading-relaxed mb-4`}>
                            {feature.description}
                          </p>
                          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-white/30">
                            Try It Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center space-x-2 mt-4">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'bg-gray-600 w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Mac Terminal */}
          <div className="mt-4">
            <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
              {/* Terminal Header */}
              <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-gray-400 text-sm font-medium">Terminal</span>
                </div>
              </div>
              
              {/* Terminal Body */}
              <div className="p-4 h-32 bg-gray-900 font-mono text-sm">
                <div className="text-green-400">
                  <span className="text-blue-400">user@timely</span>
                  <span className="text-white">:</span>
                  <span className="text-purple-400">~/projects/timely</span>
                  <span className="text-white">$ </span>
                  <span className="text-green-300">{terminalText}</span>
                  <span className="animate-pulse text-green-400">|</span>
                </div>
                <div className="mt-2 text-gray-500 text-xs">
                  Building the future of academic scheduling...
                </div>
              </div>
            </div>
          </div>

          {/* Developers Section */}
          <div className="mt-8">
            <h3 className="text-center text-gray-700 text-lg font-semibold mb-4">Meet Our Team</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xl font-bold">B</span>
                </div>
                <p className="text-gray-700 text-sm font-medium">Brandon</p>
                <p className="text-gray-500 text-xs">Developer</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xl font-bold">N</span>
                </div>
                <p className="text-gray-700 text-sm font-medium">Nacht</p>
                <p className="text-gray-500 text-xs">Developer</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xl font-bold">H</span>
                </div>
                <p className="text-gray-700 text-sm font-medium">Hazel</p>
                <p className="text-gray-500 text-xs">Developer</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200 pb-0">
            <p className="text-gray-500 text-sm mb-0">Made with ❤️ for students</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
