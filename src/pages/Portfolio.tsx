import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { ArrowLeft, Clock, BookOpen, FileText, Settings, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMode } from '@/contexts/ModeContext';
import { useAuth } from '@/hooks/useAuth';
=======
import { ArrowLeft, Clock, BookOpen, Award, FileText, Settings, Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMode } from '@/contexts/ModeContext';
import { useProfile } from '@/hooks/useProfile';
>>>>>>> origin/main

const Portfolio = () => {
  const navigate = useNavigate();
  const { isInternshipMode } = useMode();
<<<<<<< HEAD
  const { user } = useAuth();

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

  let portfolioOptions = [
=======
  const { profile, isOrganization } = useProfile();

  const portfolioOptions = [
>>>>>>> origin/main
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
<<<<<<< HEAD
=======
      title: 'Achievements',
      description: 'View your accomplishments and badges',
      icon: Award,
      path: '/achievements',
      color: 'bg-purple-500'
    },
    {
>>>>>>> origin/main
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

<<<<<<< HEAD
  // If user is an organization, add Manage Opportunities card
  if (user && (user.role === 'organization' || user.role === 'org' || user.role === 'volunteer_searcher')) {
    portfolioOptions.unshift({
      title: 'Manage Opportunities',
      description: "View applicants and posted opportunities",
      icon: Briefcase,
      path: '/manage-opportunities',
      color: 'bg-purple-600'
    });
  }

  return (
    <div className={`min-h-screen ${
      isInternshipMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900' 
        : 'bg-gradient-to-br from-white via-blue-200 to-blue-400'
    }`}>
      {/* Back Button - Fixed positioning */}
      <div className="absolute top-16 left-4 z-10">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleBackNavigation}
          className={`shadow-lg backdrop-blur-sm ${
            isInternshipMode 
              ? 'text-gray-100 hover:text-white bg-gray-800/90 hover:bg-gray-700/90' 
              : 'text-gray-700 hover:text-gray-900 bg-white/90 hover:bg-white'
          }`}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* Content - Added top padding and title */}
      <div className="p-4 pt-20">
        <h1 className={`text-xl font-semibold mb-6 text-center ${
          isInternshipMode ? 'text-white' : 'text-gray-900'
        }`}>
          Your Portfolio
        </h1>
=======
  const organizationOptions = [
    {
      title: 'Organization Dashboard',
      description: 'View applicants and manage your opportunities',
      icon: Building2,
      path: '/organization-dashboard',
      color: 'bg-blue-600'
    },
    {
      title: 'Post Opportunity',
      description: 'Create new volunteer or internship opportunities',
      icon: Users,
      path: '/post-opportunity',
      color: 'bg-green-600'
    },
    {
      title: 'Manage Opportunities',
      description: 'Edit and manage your posted opportunities',
      icon: Settings,
      path: '/manage-opportunities',
      color: 'bg-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/app/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">
            Your Portfolio
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        {isOrganization ? (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {organizationOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Card 
                    key={option.path}
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={() => navigate(option.path)}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${option.color} text-white`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{option.title}</CardTitle>
                          <CardDescription>{option.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Tools</h2>
          </>
        ) : (
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Tools</h2>
        )}
        
>>>>>>> origin/main
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolioOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card 
                key={option.path}
<<<<<<< HEAD
                className={`cursor-pointer hover:shadow-lg transition-shadow duration-200 ${
                  isInternshipMode 
                    ? 'bg-gray-800/50 border-purple-500/30 hover:bg-gray-700/50' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => handleNavigation(option.path, option.title)}
=======
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => navigate(option.path)}
>>>>>>> origin/main
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${option.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
<<<<<<< HEAD
                      <CardTitle className={`text-lg ${
                        isInternshipMode ? 'text-white' : 'text-gray-900'
                      }`}>{option.title}</CardTitle>
                      <CardDescription className={
                        isInternshipMode ? 'text-gray-300' : 'text-gray-600'
                      }>{option.description}</CardDescription>
=======
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                      <CardDescription>{option.description}</CardDescription>
>>>>>>> origin/main
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