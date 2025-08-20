import React from 'react';
import { useMode } from '@/contexts/ModeContext';

interface ExperientialLogoProps {
  className?: string;
}

const ExperientialLogo: React.FC<ExperientialLogoProps> = ({ 
  className = "h-20 w-auto" 
}) => {
  const { isInternshipMode } = useMode();
  
  // Debug logging
  console.log('ExperientialLogo render:', { isInternshipMode, className });
  
  return (
    <img 
      src={isInternshipMode ? "/Experiential 4.png" : "/Experiential.jpeg"}
      alt="Experiential Logo" 
      className={className}
      onLoad={() => console.log('Logo loaded successfully')}
      onError={(e) => {
        console.error('Logo failed to load:', e);
        console.log('Attempting fallback image');
      }}
    />
  );
};

export default ExperientialLogo;