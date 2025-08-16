import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMode } from '@/contexts/ModeContext';

const Portfolio = () => {
  const navigate = useNavigate();
  const { isInternshipMode } = useMode();

  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // Short vibration
    }
  };

  const handleNavigation = (path: string, title: string) => {
    triggerHaptic();
    // Removed loading notification toast
    navigate(path);
  };

  const handleBackNavigation = () => {
    // Trigger haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    // Removed loading notification toast
    navigate('/dashboard');
  };

  const portfolioOptions = [
    {
      title: 'Track Hours',
      description: 'Log and manage your volunteer hours',
      icon: Clock,
      path: '/track-hours',
      color: 'bg-blue-500'
    },
    {
      title: 'Resources',
      description: 'Access helpful guides and materials',
      icon: BookOpen,
      path: '/resources',
      color: 'bg-green-500'
    },
    {
      title: 'Resume Builder',
      description: 'Create and edit your resume',
      icon: FileText,
      path: '/resume-builder',
      color: 'bg-orange-500'
    },
    {
      title: 'Track Experience',
      description: 'Document your volunteer experiences',
      icon: Settings,
      path: '/track-experience',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className={`min-h-screen ${
      isInternshipMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900' 
        : 'bg-gradient-to-br from-white via-blue-200 to-blue-400'
    }`}>
      {/* Content - Added top padding for iPhone notch */}
      <div className="p-4 pt-16">
        {/* Back Button and Title */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBackNavigation}
            className={`mr-4 rounded-full ${
              isInternshipMode 
                ? 'text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-600/50' 
                : 'text-gray-700 hover:text-gray-900 bg-white hover:bg-white border border-gray-200'
            }`}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className={`text-xl font-semibold ${
            isInternshipMode ? 'text-white' : 'text-gray-900'
          }`}>
            Your Portfolio
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolioOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card 
                key={option.path}
                className={`cursor-pointer hover:shadow-lg transition-shadow duration-200 ${
                  isInternshipMode 
                    ? 'bg-gray-800/50 border-purple-500/30 hover:bg-gray-700/50' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => handleNavigation(option.path, option.title)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${option.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className={`text-lg ${
                        isInternshipMode ? 'text-white' : 'text-gray-900'
                      }`}>{option.title}</CardTitle>
                      <CardDescription className={
                        isInternshipMode ? 'text-gray-300' : 'text-gray-600'
                      }>{option.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;