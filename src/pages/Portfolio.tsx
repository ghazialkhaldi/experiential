import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Award, FileText, Settings, Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMode } from '@/contexts/ModeContext';
import { useProfile } from '@/hooks/useProfile';
import Footer from '@/components/Footer';
import SharedNavigation from '@/components/SharedNavigation';
import Sidebar from '@/components/Sidebar';

const Portfolio = () => {
  const navigate = useNavigate();
  const { isInternshipMode } = useMode();
  const { profile, isOrganization } = useProfile();

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
      title: 'Achievements',
      description: 'View your accomplishments and badges',
      icon: Award,
      path: '/achievements',
      color: 'bg-purple-500'
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
    <div className={`min-h-screen ${isInternshipMode ? 'bg-gray-900' : 'hero-bg'}`}>
      <Sidebar />
      <SharedNavigation />

      {/* Content */}
      <div className="p-4">
        {isOrganization ? (
          <>
            <h2 className="text-lg font-semibold text-foreground mb-4">Organization Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {organizationOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Card 
                    key={option.path}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-card border-border"
                    onClick={() => navigate(option.path)}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-lg bg-primary text-primary-foreground">
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-card-foreground">{option.title}</CardTitle>
                          <CardDescription className="text-muted-foreground">{option.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Personal Tools</h2>
          </>
        ) : (
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Tools</h2>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolioOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card 
                key={option.path}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-card border-border"
                onClick={() => navigate(option.path)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-secondary text-secondary-foreground">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-card-foreground">{option.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">{option.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Portfolio;