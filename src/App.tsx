import { lazy, Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/hooks/useAuth';
import Index from './pages/Index';

const Auth = lazy(() => import('./pages/Auth'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const CompleteProfile = lazy(() => import('./pages/CompleteProfile'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const OpportunityDetail = lazy(() => import('./pages/OpportunityDetail'));
const Saved = lazy(() => import('./pages/Saved'));
const MyApplications = lazy(() => import('./pages/MyApplications'));
const TrackHours = lazy(() => import('./pages/TrackHours'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
const Resources = lazy(() => import('./pages/Resources'));
const UniversityChecklist = lazy(() => import('./pages/UniversityChecklist'));
const PostOpportunity = lazy(() => import('./pages/PostOpportunity'));
const ManageOpportunities = lazy(() => import('./pages/ManageOpportunities'));
const Settings = lazy(() => import('./pages/Settings'));
const Billing = lazy(() => import('./pages/Billing'));
const ProFeatures = lazy(() => import('./pages/ProFeatures'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
});

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center" aria-busy="true" aria-label="Loading">
    <span className="brand-dot h-2.5 w-2.5 animate-pulse" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/opportunity/:id" element={<OpportunityDetail />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/my-applications" element={<MyApplications />} />
              <Route path="/track-hours" element={<TrackHours />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/university-checklist" element={<UniversityChecklist />} />

              <Route path="/post-opportunity" element={<PostOpportunity />} />
              <Route path="/manage-opportunities" element={<ManageOpportunities />} />

              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/pro" element={<ProFeatures />} />
              <Route path="/admin" element={<AdminDashboard />} />

              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsAndConditions />} />

              {/* Retired pages: keep old links and bookmarks working. */}
              <Route path="/discover" element={<Navigate to="/search" replace />} />
              <Route path="/explore" element={<Navigate to="/search" replace />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/portfolio" element={<Navigate to="/my-applications" replace />} />
              <Route path="/track-experience" element={<Navigate to="/track-hours" replace />} />
              <Route path="/career-resources" element={<Navigate to="/resources" replace />} />
              <Route path="/organization-dashboard" element={<Navigate to="/manage-opportunities" replace />} />
              <Route path="/notification-settings" element={<Navigate to="/settings" replace />} />
              <Route path="/legal" element={<Navigate to="/terms" replace />} />
              <Route path="/app/*" element={<Navigate to="/" replace />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
