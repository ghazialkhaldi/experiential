import React from 'react';
import { useMode } from '@/contexts/ModeContext';

interface ExperientialLogoProps {
  className?: string;
}

const ExperientialLogo: React.FC<ExperientialLogoProps> = ({ 
  className = "h-20 w-auto" 
}) => {
  const { isInternshipMode } = useMode();
  
  // Use larger size for internship mode to match volunteer
  const logoSize = isInternshipMode ? "h-24 w-auto" : "h-20 w-auto";
  const finalClassName = className === "h-20 w-auto" ? logoSize : className;
  
  const logoSrc = isInternshipMode 
    ? "/Experiential 4.png" 
    : "/Experiential.jpeg";
  
  return (
    <img 
      src={logoSrc}
      alt="Experiential Logo" 
      className={finalClassName}
    />
  );
};

export default ExperientialLogo;