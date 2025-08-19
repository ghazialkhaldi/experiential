import React from 'react';
import { useMode } from '@/contexts/ModeContext';

interface SafetyBarProps {
  children: React.ReactNode;
}

const SafetyBar: React.FC<SafetyBarProps> = ({ children }) => {
  const { isInternshipMode } = useMode();
  
  // Different background colors for different modes - dark for internship, light for volunteer
  const backgroundColor = isInternshipMode 
    ? 'bg-gray-900 dark:bg-gray-900' 
    : 'bg-white dark:bg-gray-900';
  
  return (
    <div className="min-h-screen">
      {/* Safety bar - space at the top for iOS status bar */}
      <div className={`h-12 w-full ${backgroundColor} transition-colors duration-200`}>
        {/* This creates the safe area padding for iOS devices */}
      </div>
      
      {/* Main content */}
      <div className="min-h-[calc(100vh-3rem)]">
        {children}
      </div>
    </div>
  );
};

export default SafetyBar;
