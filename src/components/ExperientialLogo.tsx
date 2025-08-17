import React from 'react';
import GradientELogo from './GradientELogo';

interface ExperientialLogoProps {
  className?: string;
  textClassName?: string;
}

const ExperientialLogo: React.FC<ExperientialLogoProps> = ({ 
  className = "h-8 w-auto", 
  textClassName = "" 
}) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <GradientELogo size="sm" />
      <span className="text-blue-600 text-4xl font-bold leading-none">•</span>
    </div>
  );
};

export default ExperientialLogo;