import React from 'react';
import { useMode } from '@/contexts/ModeContext';

interface ExperientialLogoProps {
  className?: string;
}

const ExperientialLogo: React.FC<ExperientialLogoProps> = ({ 
  className = "h-8 w-auto" 
}) => {
  const { isInternshipMode } = useMode();
  
  return (
    <img 
      src="/Experiential.jpeg" 
      alt="Experiential Logo" 
      className={className}
      style={isInternshipMode ? { 
        filter: 'brightness(0) invert(1)',
        WebkitFilter: 'brightness(0) invert(1)'
      } : {}}
    />
  );
};

export default ExperientialLogo;