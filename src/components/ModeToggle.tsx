import React from 'react';
import { useMode } from '@/contexts/ModeContext';
import { Briefcase, Heart, Users } from 'lucide-react';

const ModeToggle = () => {
  const { mode, setMode } = useMode();

  const modes = [
    { 
      id: 'volunteer', 
      label: 'Volunteer', 
      icon: Heart,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      textColor: 'text-blue-700'
    },
    { 
      id: 'internship', 
      label: 'Internship', 
      icon: Briefcase,
      color: 'from-purple-500 to-indigo-500', 
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      textColor: 'text-purple-700'
    },
    { 
      id: 'jobs', 
      label: 'Jobs', 
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 hover:bg-green-100', 
      textColor: 'text-green-700'
    }
  ];

  return (
    <div className="p-4 border-t border-sidebar-border">
      <div className="text-xs font-medium text-sidebar-foreground/60 mb-3 uppercase tracking-wide">
        Switch Mode
      </div>
      <div className="space-y-2">
        {modes.map(({ id, label, icon: Icon, color, bgColor, textColor }) => (
          <button
            key={id}
            onClick={() => setMode(id as any)}
            className={`
              w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 
              ${mode === id 
                ? `bg-gradient-to-r ${color} text-white shadow-lg scale-105 border-2 border-white/20` 
                : `${bgColor} ${textColor} hover:scale-102 border border-transparent`
              }
            `}
          >
            <Icon className={`h-4 w-4 ${mode === id ? 'text-white' : ''}`} />
            <span className={`text-sm font-medium ${mode === id ? 'text-white' : ''}`}>
              {label}
            </span>
            {mode === id && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModeToggle;