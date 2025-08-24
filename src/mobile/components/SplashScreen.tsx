import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ExperientialLogo from '@/components/ExperientialLogo';

export const SplashScreen: React.FC = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      
      // Wait for fade out animation, then navigate
      setTimeout(() => {
        if (isAuthenticated) {
          navigate('/app/dashboard');
        } else {
          navigate('/auth');
        }
      }, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ExperientialLogo className="h-16 w-auto animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background flex items-center justify-center transition-opacity duration-500 ${
      fadeOut ? 'opacity-0' : 'opacity-100'
    }`}>
      <div className="text-center space-y-8">
        <div className="meta-ai-scale">
          <ExperientialLogo className="h-32 w-32 mx-auto" />
        </div>
        <div className="meta-ai-fade">
          <h1 className="text-2xl font-bold text-foreground">Experiential</h1>
          <p className="text-muted-foreground">Your journey starts here</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;