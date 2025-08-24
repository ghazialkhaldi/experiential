import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ExperientialLogo from '@/components/ExperientialLogo';

export const SplashScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const steps = [
    { text: "Welcome to", subtext: "" },
    { text: "Experiential", subtext: "Latest APP" },
    { text: "Your journey", subtext: "starts here" }
  ];

  useEffect(() => {
    // Step through the animation sequence
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepTimer);
          
          // Start fade out after last step
          setTimeout(() => {
            setFadeOut(true);
            
            // Navigate after fade out
            setTimeout(() => {
              if (isAuthenticated) {
                navigate('/app/dashboard');
              } else {
                navigate('/auth');
              }
            }, 500);
          }, 1000);
          
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(stepTimer);
  }, [navigate, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
        <div className="relative">
          <ExperientialLogo className="h-16 w-auto animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-secondary/50 blur-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center transition-all duration-500 ${
      fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    }`}>
      {/* Background particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-secondary/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-accent/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative text-center space-y-12 z-10">
        {/* Logo with sophisticated animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent blur-2xl opacity-30 animate-pulse" />
          <div className={`relative transition-all duration-700 ${currentStep >= 1 ? 'scale-110' : 'scale-100'}`}>
            <ExperientialLogo className="h-40 w-40 mx-auto filter drop-shadow-lg" />
          </div>
          {/* Subtle glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Animated text sequence */}
        <div className="space-y-6 min-h-[120px] flex flex-col justify-center">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                currentStep >= index 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {step.text}
              </h1>
              {step.subtext && (
                <p className="text-xl text-muted-foreground/80 font-medium mt-2">
                  {step.subtext}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        <div className={`transition-all duration-500 ${currentStep >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;