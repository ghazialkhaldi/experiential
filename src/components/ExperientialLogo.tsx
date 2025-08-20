import React from 'react';
import { useMode } from '@/contexts/ModeContext';

interface ExperientialLogoProps {
  className?: string;
}

const ExperientialLogo: React.FC<ExperientialLogoProps> = ({ 
  className = "h-8 w-auto" 
}) => {
  const { isInternshipMode } = useMode();
  
  // Debug logging
  console.log('ExperientialLogo render:', { isInternshipMode, className });
  
  return (
    <img 
      src="/Experiential.jpeg" 
      alt="Experiential Logo" 
      className={className}
      style={isInternshipMode ? { 
        filter: 'brightness(10) contrast(0)',
        WebkitFilter: 'brightness(10) contrast(0)'
      } : {}}
      onLoad={() => console.log('Logo loaded successfully')}
      onError={(e) => console.error('Logo failed to load:', e)}
    />
  );
};

export default ExperientialLogo;