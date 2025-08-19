<<<<<<< HEAD
import ManageOpportunities from "./pages/ManageOpportunities";
=======
>>>>>>> origin/main

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ModeProvider } from "./contexts/ModeContext";
<<<<<<< HEAD
=======
import Index from "./pages/Index";
>>>>>>> origin/main
import SplashScreen from "./pages/SplashScreen";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import Portfolio from "./pages/Portfolio";
import Settings from "./pages/Settings";
import Resources from "./pages/Resources";
<<<<<<< HEAD
import ResumeBuilder from "./pages/ResumeBuilder";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import CompleteProfile from "./pages/CompleteProfile";
import TrackHours from "./pages/TrackHours";
import TrackExperience from "./pages/TrackExperience";
import TermsAndConditions from "./pages/TermsAndConditions";
import LogoDemo from "./pages/LogoDemo";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LegalDocuments from "./pages/LegalDocuments";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import OpportunityDetail from "./pages/OpportunityDetail";
import Index from "./pages/Index";
=======
import CareerResources from "./pages/CareerResources";
import UniversityChecklist from "./pages/UniversityChecklist";
import ResumeBuilder from "./pages/ResumeBuilder";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import VerifyEmail from "./pages/VerifyEmail";
import CompleteProfile from "./pages/CompleteProfile";
import PostOpportunity from "./pages/PostOpportunity";
import ManageOpportunities from "./pages/ManageOpportunities";
import SearchResults from "./pages/SearchResults";
import Discover from "./pages/Discover";
import TrackHours from "./pages/TrackHours";
import TrackExperience from "./pages/TrackExperience";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import ProFeatures from "./pages/ProFeatures";
import Billing from "./pages/Billing";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LegalDocuments from "./pages/LegalDocuments";
import NotFound from "./pages/NotFound";
>>>>>>> origin/main

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ModeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
<<<<<<< HEAD
            {/* YOUR NEW APP - ALL ROUTES NOW GO TO THE NEW APP */}
            <Route path="/" element={<Index />} />
            <Route path="/opportunities" element={<Index />} />
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/track-hours" element={<TrackHours />} />
            <Route path="/track-experience" element={<TrackExperience />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/achievements" element={<Dashboard />} />
            <Route path="/manage-opportunities" element={<ManageOpportunities />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/legal" element={<LegalDocuments />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/opportunity/:id" element={<OpportunityDetail />} />
            <Route path="/logo-demo" element={<LogoDemo />} />
            {/* ALL OTHER ROUTES REDIRECT TO YOUR NEW APP */}
            <Route path="*" element={<SplashScreen />} />
=======
            <Route path="/" element={<Index />} />
            {/* Mobile App Routes */}
            <Route path="/app" element={<SplashScreen />} />
            <Route path="/app/dashboard" element={<Dashboard />} />
            <Route path="/app/explore" element={<Explore />} />
            <Route path="/app/portfolio" element={<Portfolio />} />
            <Route path="/app/settings" element={<Settings />} />
            {/* Original Website Routes */}
            <Route path="/search" element={<SearchResults />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/career-resources" element={<CareerResources />} />
            <Route path="/university-checklist" element={<UniversityChecklist />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/post-opportunity" element={<PostOpportunity />} />
            <Route path="/manage-opportunities" element={<ManageOpportunities />} />
            <Route path="/track-hours" element={<TrackHours />} />
            <Route path="/track-experience" element={<TrackExperience />} />
            <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
            <Route path="/pro" element={<ProFeatures />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/legal" element={<LegalDocuments />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
>>>>>>> origin/main
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ModeProvider>
  </QueryClientProvider>
);

export default App;
