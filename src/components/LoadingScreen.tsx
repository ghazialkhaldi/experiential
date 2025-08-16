import React, { useState, useEffect } from 'react';
import AnimatedLogo from './AnimatedLogo';
import MobileSplashScreen from './MobileSplashScreen';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Capacitor } from '@capacitor/core';

interface LoadingScreenProps {
  onComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [isCapacitorApp, setIsCapacitorApp] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if we're running in a Capacitor app (mobile app)
    const isNativeApp = Capacitor.isNativePlatform();
    setIsCapacitorApp(isNativeApp);
    
    // Only show animation in the mobile app
    if (isNativeApp) {
      setShowAnimation(true);
    }
  }, []);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    // If there's an onComplete callback, call it after a short delay
    if (onComplete) {
      setTimeout(onComplete, 100);
    }
  };

  // Show animated logo for preview (temporarily enabled for browser)
  if (showAnimation) {
    return <AnimatedLogo onAnimationComplete={handleAnimationComplete} />;
  }

  // After animation in mobile app, or for browser users
  if (isMobile && !user && isCapacitorApp) {
    // Show mobile splash screen for non-authenticated mobile users in the app
    return <MobileSplashScreen onComplete={onComplete || (() => {})} />;
  }

  // For browser or authenticated users, return null to let the main app render
  return null;
};

export default LoadingScreen;
