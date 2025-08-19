import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const SplashScreen = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      
      // Wait for fade out animation, then navigate
      setTimeout(() => {
        if (loading) return;
        
        if (isAuthenticated) {
          navigate('/dashboard');
        } else {
          navigate('/auth');
        }
      }, 500);
    }, 3000); // Static for 3 seconds

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated, loading]);

  return (
    <div className={`min-h-screen bg-white flex items-center justify-center transition-opacity duration-500 ${
      fadeOut ? 'opacity-0' : 'opacity-100'
    }`}>
      <div className="text-center">
        <div className="mb-4">
          <img src="/Experiential.jpeg" alt="Experiential" className="h-32 w-auto mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;