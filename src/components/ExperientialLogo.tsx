import React from 'react';
import { useMode } from '@/contexts/ModeContext';

interface ExperientialLogoProps {
  className?: string;
}

const ExperientialLogo: React.FC<ExperientialLogoProps> = ({ 
  className = "h-20 w-auto" 
}) => {
  const { isInternshipMode } = useMode();
  
  return (
    <img 
      src={isInternshipMode ? "/Experiential 4.png" : "/Experiential.jpeg"}
      alt="Experiential Logo" 
      className={className}
    />
  );
};

export default ExperientialLogo;