import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/hooks/useAuth';
import { useMode } from '@/contexts/ModeContext';
import { useMobile } from '../hooks/useMobile';

// Regular app pages
import Dashboard from '@/pages/Dashboard';
import Discover from '@/pages/Discover';
import Explore from '@/pages/Explore';
import TrackExperience from '@/pages/TrackExperience';
import TrackHours from '@/pages/TrackHours';
import Portfolio from '@/pages/Portfolio';
import Resources from '@/pages/Resources';
import Settings from '@/pages/Settings';
import Auth from '@/pages/Auth';
import AuthCallback from '@/pages/AuthCallback';
import CompleteProfile from '@/pages/CompleteProfile';
import CareerResources from '@/pages/CareerResources';
import ResumeBuilder from '@/pages/ResumeBuilder';
import UniversityChecklist from '@/pages/UniversityChecklist';
import VerifyEmail from '@/pages/VerifyEmail';
import Billing from '@/pages/Billing';
import ProFeatures from '@/pages/ProFeatures';
import OpportunityDetail from '@/pages/OpportunityDetail';
import SearchResults from '@/pages/SearchResults';
import PostOpportunity from '@/pages/PostOpportunity';
import ManageOpportunities from '@/pages/ManageOpportunities';
import OrganizationDashboard from '@/pages/OrganizationDashboard';
import MyApplications from '@/pages/MyApplications';

// Mobile-specific components
import { MobileNavigation } from './MobileNavigation';
import { MobileHeader } from './MobileHeader';
import { MobileModeToggle } from './MobileModeToggle';
import { SplashScreen } from './SplashScreen';

// Mobile app styles
import '../styles/mobile.css';

interface MobileAppProps {}

export const MobileApp: React.FC<MobileAppProps> = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const { isInternshipMode, setMode } = useMode();
  const { isNative, triggerHaptic, scheduleNotification } = useMobile();
  const location = useLocation();
  
  // Mobile-specific state
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showSplash, setShowSplash] = useState(true);

  // Hide splash screen after 4 seconds to show the sophisticated animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Quick actions for floating action button
  const quickActions = [
    {
      label: 'Dashboard',
      icon: '🏠',
      path: '/app/dashboard',
    },
    {
      label: 'Discover',
      icon: '🔍',
      path: '/app/discover',
    },
    {
      label: 'Track',
      icon: '📊',
      path: '/app/track-experience',
    },
    {
      label: 'Portfolio',
      icon: '💼',
      path: '/app/portfolio',
    },
  ];

  const handleQuickAction = async (path: string) => {
    if (isNative) {
      await triggerHaptic('light');
    }
    setShowQuickActions(false);
    // Navigation will be handled by the button's NavLink
  };

  const handleNotificationPress = async () => {
    if (isNative) {
      await triggerHaptic('medium');
    }
    // Handle notification press
  };

  // Show splash screen
  if (showSplash) {
    return <SplashScreen />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user needs to complete profile (simplified for mobile app)
  const needsProfileCompletion = isAuthenticated && user && 
    (!user.user_metadata?.display_name || !user.user_metadata?.location);

  if (needsProfileCompletion && location.pathname !== '/app/complete-profile') {
    return (
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/app/complete-profile" element={<CompleteProfile />} />
          <Route path="*" element={<Navigate to="/app/complete-profile" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-top safe-area-bottom">
      <MobileHeader 
        isNative={isNative}
      />
      
      <div className="flex-1 flex flex-col">
        <MobileModeToggle 
          isInternshipMode={isInternshipMode}
          onToggle={() => setMode(isInternshipMode ? 'volunteer' : 'internship')}
          isNative={isNative}
        />
        
        <main className="flex-1 overflow-auto pb-16">
          <Routes>
            {/* Auth routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
            {/* Protected routes */}
            {isAuthenticated ? (
              <>
                <Route path="/app/dashboard" element={<Dashboard />} />
                <Route path="/app/discover" element={<Discover />} />
                <Route path="/app/explore" element={<Explore />} />
                <Route path="/app/track-experience" element={<TrackExperience />} />
                <Route path="/app/track-hours" element={<TrackHours />} />
                <Route path="/app/portfolio" element={<Portfolio />} />
                <Route path="/app/resources" element={<Resources />} />
                <Route path="/app/career-resources" element={<CareerResources />} />
                <Route path="/app/resume-builder" element={<ResumeBuilder />} />
                <Route path="/app/university-checklist" element={<UniversityChecklist />} />
                <Route path="/app/settings" element={<Settings />} />
                <Route path="/app/billing" element={<Billing />} />
                <Route path="/app/pro-features" element={<ProFeatures />} />
                <Route path="/app/complete-profile" element={<CompleteProfile />} />
                <Route path="/app/opportunity/:id" element={<OpportunityDetail />} />
                <Route path="/app/search" element={<SearchResults />} />
                <Route path="/app/post-opportunity" element={<PostOpportunity />} />
                <Route path="/app/manage-opportunities" element={<ManageOpportunities />} />
                <Route path="/app/organization-dashboard" element={<OrganizationDashboard />} />
                <Route path="/app/my-applications" element={<MyApplications />} />
                <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
                <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
              </>
            ) : (
              <>
                <Route path="/app/*" element={<Navigate to="/auth" replace />} />
                <Route path="/" element={<Navigate to="/auth" replace />} />
              </>
            )}
          </Routes>
        </main>
      </div>

      <MobileNavigation currentPath={location.pathname} isNative={isNative} />

      <Toaster />
    </div>
  );
};

export default MobileApp;