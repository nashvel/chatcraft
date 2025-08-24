import React from 'react';
import { HomeIcon, SwatchIcon, CalendarDaysIcon, CogIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, SwatchIcon as SwatchIconSolid, CalendarDaysIcon as CalendarDaysIconSolid, CogIcon as CogIconSolid } from '@heroicons/react/24/solid';

const BottomNavigation = ({ currentStep, onNavigate, hasScheduleData }) => {
  const navItems = [
    {
      id: 'upload',
      label: 'Home',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
    },
    {
      id: 'design',
      label: 'Designs',
      icon: SwatchIcon,
      iconSolid: SwatchIconSolid,
    },
    {
      id: 'meeting',
      label: 'Meeting',
      icon: CalendarDaysIcon,
      iconSolid: CalendarDaysIconSolid,
    },
    {
      id: 'manage',
      label: 'Manage',
      icon: CogIcon,
      iconSolid: CogIconSolid,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb md:hidden z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = currentStep === item.id;
          const Icon = isActive ? item.iconSolid : item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
