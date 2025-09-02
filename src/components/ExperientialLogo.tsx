import React from 'react';
import { useMode } from '@/contexts/ModeContext';

interface ExperientialLogoProps {
  className?: string;
}

const ExperientialLogo: React.FC<ExperientialLogoProps> = ({ 
  className = "h-16 w-auto" 
}) => {
  const { isInternshipMode } = useMode();
  
  // Use original volunteer size for all modes
  const logoSrc = isInternshipMode 
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