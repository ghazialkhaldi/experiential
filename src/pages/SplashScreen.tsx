import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ExperientialLogo from '@/components/ExperientialLogo';

const SplashScreen = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      
      // Wait for fade out animation, then navigate
      setTimeout(() => {
        if (isAuthenticated) {
          navigate('/dashboard');
        } else {
          navigate('/auth');
        }
      }, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ExperientialLogo className="h-16 w-auto" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white flex items-center justify-center transition-opacity duration-500 ${
      fadeOut ? 'opacity-0' : 'opacity-100'
    }`}>
      <div className="text-center">
        <div className="animate-pulse">
          <img src="/E.png" alt="Experiential Logo" className="h-32 w-32 mx-auto mb-8" />
        </div>
        <ExperientialLogo className="h-16 w-auto mx-auto" />
      </div>
    </div>
  );
};

export default SplashScreen;