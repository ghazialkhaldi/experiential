import React from 'react';
import { useMode } from '@/contexts/ModeContext';

interface ExperientialLogoProps {
  className?: string;
}

const ExperientialLogo: React.FC<ExperientialLogoProps> = ({ 
  className 
}) => {
  const { isInternshipMode } = useMode();
  
  // Apply mode-based sizing unless a custom size is explicitly set
  let finalClassName = className;
  
  // If no className provided or standard sizes, apply mode-based sizing
  if (!className || className === "h-16 w-auto" || className === "h-20 w-auto") {
    const logoSize = "h-20 w-auto"; // Same size for both modes
    finalClassName = logoSize;
  }
  
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