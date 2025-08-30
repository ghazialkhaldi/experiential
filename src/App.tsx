
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ModeProvider } from '@/contexts/ModeContext';
import { Capacitor } from '@capacitor/core';

// Import both regular and mobile app components
import { MobileApp } from '@/experiential-latest-app';

// Import page components
import Index from './pages/Index';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import Billing from './pages/Billing';
import CareerResources from './pages/CareerResources';
import CompleteProfile from './pages/CompleteProfile';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import Explore from './pages/Explore';
import LegalDocuments from './pages/LegalDocuments';
import ManageOpportunities from './pages/ManageOpportunities';
import NotFound from './pages/NotFound';
import OpportunityDetail from './pages/OpportunityDetail';
import OrganizationDashboard from './pages/OrganizationDashboard';
import Portfolio from './pages/Portfolio';
import PostOpportunity from './pages/PostOpportunity';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProFeatures from './pages/ProFeatures';
import Resources from './pages/Resources';
import ResumeBuilder from './pages/ResumeBuilder';
import SearchResults from './pages/SearchResults';
import Settings from './pages/Settings';
import TermsAndConditions from './pages/TermsAndConditions';
import TrackExperience from './pages/TrackExperience';
import TrackHours from './pages/TrackHours';
import UniversityChecklist from './pages/UniversityChecklist';
import VerifyEmail from './pages/VerifyEmail';

const queryClient = new QueryClient();

const App = () => {
  // Use mobile app when running on native platform or when URL contains mobile parameter
  const isMobile = Capacitor.isNativePlatform() || 
                   new URLSearchParams(window.location.search).has('mobile');

  return (
    <QueryClientProvider client={queryClient}>
      <ModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {isMobile ? <MobileApp /> : (
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/career-resources" element={<CareerResources />} />
                <Route path="/complete-profile" element={<CompleteProfile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/legal" element={<LegalDocuments />} />
                <Route path="/manage-opportunities" element={<ManageOpportunities />} />
                <Route path="/opportunity/:id" element={<OpportunityDetail />} />
                <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/post-opportunity" element={<PostOpportunity />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/pro" element={<ProFeatures />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/resume-builder" element={<ResumeBuilder />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/track-experience" element={<TrackExperience />} />
                <Route path="/track-hours" element={<TrackHours />} />
                <Route path="/university-checklist" element={<UniversityChecklist />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </BrowserRouter>
        </TooltipProvider>
      </ModeProvider>
    </QueryClientProvider>
  );
};

export default App;
