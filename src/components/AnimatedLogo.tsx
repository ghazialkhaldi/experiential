import React, { useEffect, useState } from 'react';

interface AnimatedLogoProps {
  onAnimationComplete: () => void;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ onAnimationComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show logo for 3 seconds, then fade out quickly
    const timer = setTimeout(() => {
      setFadeOut(true);
      // After quick fade (200ms), complete
      setTimeout(onAnimationComplete, 200);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-opacity duration-200 ${
      fadeOut ? 'opacity-0' : 'opacity-100'
    }`}>
      <img
        src="/Experiential.jpeg"
        alt="Experiential"
        className="w-48 h-auto object-contain"
      />
    </div>
  );
};

export default AnimatedLogo;
