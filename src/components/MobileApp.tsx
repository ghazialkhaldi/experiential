import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMode } from '@/contexts/ModeContext';
import { useMobile } from '@/hooks/useMobile';
import { ImpactStyle } from '@capacitor/haptics';

// Import existing pages and components
import Dashboard from '@/pages/Dashboard';
import Discover from '@/pages/Discover';
import Explore from '@/pages/Explore';
import SearchResults from '@/pages/SearchResults';
import TrackExperience from '@/pages/TrackExperience';
import TrackHours from '@/pages/TrackHours';
import Portfolio from '@/pages/Portfolio';
import Settings from '@/pages/Settings';
import Auth from '@/pages/Auth';
import AuthCallback from '@/pages/AuthCallback';
import CompleteProfile from '@/pages/CompleteProfile';
import VerifyEmail from '@/pages/VerifyEmail';
import OrganizationDashboard from '@/pages/OrganizationDashboard';
import ManageOpportunities from '@/pages/ManageOpportunities';
import PostOpportunity from '@/pages/PostOpportunity';
import OpportunityDetail from '@/pages/OpportunityDetail';
import ResumeBuilder from '@/pages/ResumeBuilder';
import CareerResources from '@/pages/CareerResources';
import ProFeatures from '@/pages/ProFeatures';
import Billing from '@/pages/Billing';
import Resources from '@/pages/Resources';
import UniversityChecklist from '@/pages/UniversityChecklist';
import NotFound from '@/pages/NotFound';

// Mobile-specific components
import { MobileNavigation } from './MobileNavigation';
import { MobileHeader } from './MobileHeader';
import { MobileModeToggle } from './MobileModeToggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Search, User, Home, Briefcase, Clock, FileText } from 'lucide-react';

interface MobileAppProps {
  children?: React.ReactNode;
}

export const MobileApp: React.FC<MobileAppProps> = () => {
  const { user, loading, signOut } = useAuth();
  const { isInternshipMode, setMode } = useMode();
  const { isNative, triggerHaptic, scheduleNotification } = useMobile();
  const location = useLocation();
  const navigate = useNavigate();

  // Mobile-specific state
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Welcome notification for new users
    if (isNative && user) {
      scheduleNotification(
        'Welcome to Experiential!',
        `Discover ${isInternshipMode ? 'internship' : 'volunteer'} opportunities near you.`,
        2000
      );
    }
  }, [user, isNative, isInternshipMode]);

  const handleModeToggle = async () => {
    await triggerHaptic(ImpactStyle.Light);
    setMode(isInternshipMode ? 'volunteer' : 'internship');
    
    // Show feedback notification
    if (isNative) {
      scheduleNotification(
        'Mode Changed',
        `Switched to ${!isInternshipMode ? 'Internship' : 'Volunteer'} mode`,
        500
      );
    }
  };

  const handleQuickAction = async (action: string, route: string) => {
    await triggerHaptic(ImpactStyle.Medium);
    navigate(route);
    setShowQuickActions(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full"></div>
          <div className="h-4 bg-primary/20 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </div>
    );
  }

  // Check if user needs to complete profile (simplified for mobile app)
  // You can add profile completion logic here if needed

  const quickActions = [
    { icon: Search, label: 'Search', route: '/explore', color: 'bg-blue-500' },
    { icon: Briefcase, label: 'Opportunities', route: '/discover', color: 'bg-green-500' },
    { icon: Clock, label: 'Track Hours', route: '/track-hours', color: 'bg-orange-500' },
    { icon: FileText, label: 'Portfolio', route: '/portfolio', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Meta AI-inspired Header */}
      <MobileHeader 
        isNative={isNative}
        unreadCount={unreadCount}
        onNotificationPress={() => triggerHaptic(ImpactStyle.Light)}
      />

      {/* Mode Toggle - Meta AI style */}
      <div className="px-4 py-2">
        <MobileModeToggle 
          isInternshipMode={isInternshipMode}
          onToggle={handleModeToggle}
          isNative={isNative}
        />
      </div>

      {/* Quick Actions Floating Button */}
      {showQuickActions && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowQuickActions(false)}>
          <div className="absolute bottom-24 right-4 space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={action.label}
                size="lg"
                className={`${action.color} text-white rounded-full shadow-lg animate-scale-in hover-scale`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleQuickAction(action.label, action.route)}
              >
                <action.icon className="h-5 w-5 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Quick Actions Button */}
      <Button
        size="lg"
        className="fixed bottom-20 right-4 z-50 bg-primary text-primary-foreground rounded-full shadow-lg hover-scale"
        onClick={async () => {
          await triggerHaptic(ImpactStyle.Medium);
          setShowQuickActions(!showQuickActions);
        }}
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* Main Content */}
      <div className="pb-20">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/track-experience" element={<TrackExperience />} />
          <Route path="/track-hours" element={<TrackHours />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
          <Route path="/manage-opportunities" element={<ManageOpportunities />} />
          <Route path="/post-opportunity" element={<PostOpportunity />} />
          <Route path="/opportunity/:id" element={<OpportunityDetail />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/career-resources" element={<CareerResources />} />
          <Route path="/pro-features" element={<ProFeatures />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/university-checklist" element={<UniversityChecklist />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Bottom Navigation */}
      <MobileNavigation currentPath={location.pathname} isNative={isNative} />
    </div>
  );
};