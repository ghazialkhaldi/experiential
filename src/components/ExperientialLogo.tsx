import React from 'react';
import { useMode } from '@/contexts/ModeContext';

interface ExperientialLogoProps {
  className?: string;
}

const ExperientialLogo: React.FC<ExperientialLogoProps> = ({ 
  className = "h-20 w-auto" 
}) => {
  const { isInternshipMode, isJobsMode } = useMode();
  
  // Use same size for all modes now
  const logoSrc = isJobsMode 
    ? "/Experiential 3.png" 
    : isInternshipMode 
      ? "/Experiential 4.png" 
      : "/Experiential.jpeg";
  
  return (
    <img 
      src={logoSrc}
      alt="Experiential Logo" 
      className={className}
    />
  );
};

export default ExperientialLogo;