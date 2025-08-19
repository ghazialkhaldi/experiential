import React from 'react';
<<<<<<< HEAD
import GradientELogo from './GradientELogo';
=======
>>>>>>> origin/main

interface ExperientialLogoProps {
  className?: string;
  textClassName?: string;
}

const ExperientialLogo: React.FC<ExperientialLogoProps> = ({ 
  className = "h-8 w-auto", 
  textClassName = "" 
}) => {
  return (
<<<<<<< HEAD
    <div className={`flex items-center space-x-1 ${className}`}>
      <GradientELogo size="sm" />
      <span className="text-blue-600 text-4xl font-bold leading-none">•</span>
=======
    <div className={`flex items-center ${className}`}>
      <span className={`font-bold text-xl ${textClassName}`}>
        E<span className="text-blue-500">x</span>periential
      </span>
>>>>>>> origin/main
    </div>
  );
};

export default ExperientialLogo;