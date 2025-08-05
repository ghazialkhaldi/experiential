
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ModeProvider } from "./contexts/ModeContext";
import Index from "./pages/Index";
import Resources from "./pages/Resources";
import CareerResources from "./pages/CareerResources";
import UniversityChecklist from "./pages/UniversityChecklist";
import ResumeBuilder from "./pages/ResumeBuilder";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import CompleteProfile from "./pages/CompleteProfile";
import PostOpportunity from "./pages/PostOpportunity";
import ManageOpportunities from "./pages/ManageOpportunities";
import SearchResults from "./pages/SearchResults";
import Discover from "./pages/Discover";
import TrackHours from "./pages/TrackHours";
import TrackExperience from "./pages/TrackExperience";
import ProFeatures from "./pages/ProFeatures";
import Billing from "./pages/Billing";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ModeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/career-resources" element={<CareerResources />} />
            <Route path="/university-checklist" element={<UniversityChecklist />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/post-opportunity" element={<PostOpportunity />} />
            <Route path="/manage-opportunities" element={<ManageOpportunities />} />
            <Route path="/track-hours" element={<TrackHours />} />
            <Route path="/track-experience" element={<TrackExperience />} />
            <Route path="/pro" element={<ProFeatures />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ModeProvider>
  </QueryClientProvider>
);

export default App;
