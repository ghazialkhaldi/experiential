import React from 'react';

interface ExperientialLogoProps {
  className?: string;
  textClassName?: string;
}

const ExperientialLogo: React.FC<ExperientialLogoProps> = ({ 
  className = "h-8 w-auto", 
  textClassName = "" 
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className={`font-bold text-xl ${textClassName}`}>
        E<span className="text-blue-500">x</span>periential
      </span>
    </div>
  );
};

export default ExperientialLogo;