import React from 'react';

interface GradientELogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const GradientELogo: React.FC<GradientELogoProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl',
    xl: 'text-9xl'
  };

  return (
    <div className={`inline-block ${className}`}>
      <span 
        className={`
          ${sizeClasses[size]} 
          font-bold 
          bg-gradient-to-r 
          from-blue-600 
          via-blue-500 
          to-purple-600 
          bg-clip-text 
          text-transparent 
          drop-shadow-lg
          tracking-tight
          font-sans
        `}
      >
        E
      </span>
    </div>
  );
};

export default GradientELogo;
