import { Link } from 'react-router-dom';
import AuthButton from '@/components/AuthButton';
import ExperientialLogo from '@/components/ExperientialLogo';
import { useMode } from '@/contexts/ModeContext';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/NotificationBell';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';

const SharedNavigation = () => {
  const { isInternshipMode } = useMode();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { profile, organization } = useProfile();
  
  // Check if user is an organization (should see post opportunity button)
  const isOrganization = profile?.role === 'volunteer_searcher' || !!organization;

  return (
    <nav className={`backdrop-blur-md shadow-sm border-b ${
      isInternshipMode 
        ? 'bg-gray-800/80 border-gray-700' 
        : 'bg-white/80 border-blue-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile: Center the logo, Desktop: Left align */}
          <div className={`flex items-center space-x-2 fade-in ${
            isMobile ? 'absolute left-1/2 transform -translate-x-1/2' : ''
          }`}>
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <ExperientialLogo className={isInternshipMode ? "h-20 w-auto" : "h-16 w-auto"} />
            </Link>
          </div>
          <div className="flex items-center space-x-6 fade-in-delayed">
            {/* Desktop navigation - hide some items on mobile */}
            {!isMobile && (
              <>
                {user && <NotificationBell />}
                <AuthButton />
                {isOrganization && (
                  <Link to="/post-opportunity">
                    <Button className={`transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl ${
                      isInternshipMode 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}>
                      {isInternshipMode ? 'Post Internship' : 'Post Opportunity'}
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SharedNavigation;