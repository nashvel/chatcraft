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
      color: 'text-blue-500',
      activeColor: 'text-blue-600',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-300/30',
    },
    {
      id: 'design',
      label: 'Designs',
      icon: SwatchIcon,
      iconSolid: SwatchIconSolid,
      color: 'text-purple-500',
      activeColor: 'text-purple-600',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-300/30',
    },
    {
      id: 'meeting',
      label: 'Meeting',
      icon: CalendarDaysIcon,
      iconSolid: CalendarDaysIconSolid,
      color: 'text-green-500',
      activeColor: 'text-green-600',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-300/30',
    },
    {
      id: 'manage',
      label: 'Manage',
      icon: CogIcon,
      iconSolid: CogIconSolid,
      color: 'text-orange-500',
      activeColor: 'text-orange-600',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-300/30',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20 px-4 py-3 safe-area-pb md:hidden z-50 shadow-2xl">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = currentStep === item.id;
          const Icon = isActive ? item.iconSolid : item.icon;
          const isDisabled = !hasScheduleData && item.id !== 'upload';
          
          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && onNavigate(item.id)}
              disabled={isDisabled}
              className={`flex flex-col items-center space-y-1 py-3 px-4 rounded-2xl transition-all duration-300 ${
                isDisabled
                  ? 'text-gray-300 cursor-not-allowed opacity-50'
                  : isActive 
                    ? `${item.activeColor} ${item.bgColor} backdrop-blur-sm shadow-lg scale-105 border ${item.borderColor}` 
                    : `${item.color} hover:${item.activeColor} hover:bg-white/40 hover:backdrop-blur-sm hover:shadow-md hover:scale-105 border border-transparent`
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
