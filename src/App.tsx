
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ModeProvider } from "./contexts/ModeContext";
import SplashScreen from "./pages/SplashScreen";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import Portfolio from "./pages/Portfolio";
import Settings from "./pages/Settings";
import Resources from "./pages/Resources";
import ResumeBuilder from "./pages/ResumeBuilder";
import AuthApp from "./pages/AuthApp";
import AuthCallback from "./pages/AuthCallback";
import CompleteProfile from "./pages/CompleteProfile";
import TrackHours from "./pages/TrackHours";
import TrackExperience from "./pages/TrackExperience";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LegalDocuments from "./pages/LegalDocuments";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ModeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* YOUR NEW APP - ALL ROUTES NOW GO TO THE NEW APP */}
            <Route path="/" element={<SplashScreen />} />
            <Route path="/auth" element={<AuthApp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/track-hours" element={<TrackHours />} />
            <Route path="/track-experience" element={<TrackExperience />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/achievements" element={<Dashboard />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/legal" element={<LegalDocuments />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/change-password" element={<ChangePassword />} />
            {/* ALL OTHER ROUTES REDIRECT TO YOUR NEW APP */}
            <Route path="*" element={<SplashScreen />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ModeProvider>
  </QueryClientProvider>
);

export default App;
