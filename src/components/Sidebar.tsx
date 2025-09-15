import { useState } from "react";
import { 
  Users, 
  Menu, 
  X, 
  Search, 
  UserPlus, 
  Clock, 
  Plus, 
  Settings, 
  BarChart3, 
  BookOpen, 
  Lightbulb, 
  Phone,
  Briefcase,
  Heart,
  LogIn,
  FileText,
  CheckSquare,
  Crown,
  Zap,
  CreditCard
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useMode } from "@/contexts/ModeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSubscription } from "@/hooks/useSubscription";
import ProfileSettings from './ProfileSettings';
import AuthButton from "@/components/AuthButton";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import ExperientialLogo from "@/components/ExperientialLogo";
import ModeToggle from "@/components/ModeToggle";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { isInternshipMode, mode, setMode } = useMode();
  const { subscribed, subscription_tier, createCheckoutSession, manageSubscription, loading } = useSubscription();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleCreateProfile = () => {
    if (user) {
      alert("You are already signed in!");
    } else {
      window.location.href = "/auth";
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 shadow-lg border-2 ${
          isInternshipMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-white border-gray-600' 
            : 'bg-white hover:bg-gray-50 border-gray-300'
        }`}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isInternshipMode 
            ? 'bg-gray-900 shadow-2xl' 
            : 'bg-white shadow-lg'
        }`}
      >
        <div className="p-6 pb-8">{/* Added extra bottom padding to ensure mode switch is accessible */}
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              to="/" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
              onClick={(e) => {
                console.log('Logo clicked!');
                setIsOpen(false);
              }}
            >
              <ExperientialLogo />
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className={`h-6 w-6 ${isInternshipMode ? 'text-gray-300' : ''}`} />
            </Button>
          </div>

          {/* Pro Subscription Button - Only show for non-subscribers */}
          {!subscribed && (
            <div className="mb-6">
              <Link to="/pro">
                <Button
                  className="w-full relative overflow-hidden bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  <div className="flex items-center justify-center space-x-2 relative z-10">
                    <Crown className="h-6 w-6" />
                    <span className="text-xl font-bold">Pro</span>
                  </div>
                </Button>
              </Link>
            </div>
          )}

          {/* Navigation Sections */}
          <div className="space-y-8">
            {/* For Students */}
            <div>
              <h3 className={`font-semibold mb-4 ${
                isInternshipMode 
                  ? 'text-white' 
                  : 'text-gray-900'
              }`}>
                {isInternshipMode ? 'For Job Seekers' : 'For Students'}
              </h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Home button clicked - navigating to /');
                      setIsOpen(false);
                      navigate('/');
                    }}
                    className={`flex items-center space-x-3 transition-colors w-full text-left p-2 rounded hover:bg-gray-100 ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <Search className="h-4 w-4" />
                    <span>{isInternshipMode ? 'Find Internships' : 'Find Opportunities'}</span>
                  </button>
                </li>
                <li>
                  <Link
                    to="/discover"
                    className={`flex items-center space-x-3 transition-colors ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={(e) => {
                      console.log('Navigate to discover clicked');
                      setIsOpen(false);
                      navigate('/discover');
                    }}
                  >
                    <Heart className="h-4 w-4" />
                    <span>Discover</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleCreateProfile}
                    className={`flex items-center space-x-3 transition-colors w-full text-left ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Create Profile</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const targetPath = isInternshipMode ? "/track-experience" : "/track-hours";
                      console.log('Track hours button clicked - navigating to:', targetPath);
                      setIsOpen(false);
                      navigate(targetPath);
                    }}
                    className={`flex items-center space-x-3 transition-colors w-full text-left p-2 rounded hover:bg-gray-100 ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                    <span>{isInternshipMode ? 'Track Experience' : 'Track Hours'}</span>
                  </button>
                </li>
                
                {/* Resume Builder - Available in both modes */}
                <li>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Resume builder button clicked - navigating to /resume-builder');
                      setIsOpen(false);
                      navigate("/resume-builder");
                    }}
                    className={`flex items-center space-x-3 transition-colors w-full text-left p-2 rounded hover:bg-gray-100 ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Resume Builder</span>
                  </button>
                </li>
                
                {/* My Applications - Show for all users for testing */}
                <li>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('My Applications button clicked - navigating to /my-applications');
                      setIsOpen(false);
                      navigate("/my-applications");
                    }}
                    className={`flex items-center space-x-3 transition-colors w-full text-left p-2 rounded hover:bg-gray-100 ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>My Applications</span>
                  </button>
                </li>
                
                {/* Mobile-only Auth options */}
                {isMobile && !user && (
                  <li>
                    <Link
                      to="/auth"
                      className={`flex items-center space-x-3 transition-colors ${
                        isInternshipMode 
                          ? 'text-gray-300 hover:text-blue-400' 
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Mobile Auth Button for logged in users */}
            {isMobile && user && (
              <div className={`pb-4 ${isInternshipMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`font-semibold mb-4 ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                  Account
                </h3>
                <div className="px-2">
                  <AuthButton />
                </div>
              </div>
            )}

            {/* For Organizations */}
            <div>
              <h3 className={`font-semibold mb-4 ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                {isInternshipMode ? 'For Companies' : 'For Organizations'}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/post-opportunity"
                    className={`flex items-center space-x-3 transition-colors ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isInternshipMode ? 'Post Internships' : 'Post Opportunities'}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manage-opportunities"
                    className={`flex items-center space-x-3 transition-colors ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Manage Applications</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/manage-opportunities"
                    className={`flex items-center space-x-3 transition-colors ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>{isInternshipMode ? 'Company Dashboard' : 'Organization Dashboard'}</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className={`font-semibold mb-4 ${isInternshipMode ? 'text-white' : 'text-gray-900'}`}>
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to={isInternshipMode ? "/career-resources" : "/resources"}
                    className={`flex items-center space-x-3 transition-colors ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>{isInternshipMode ? 'Career Guide' : 'University Guide'}</span>
                  </Link>
                </li>
                {!isInternshipMode && (
                  <li>
                    <Link
                      to="/university-checklist"
                      className="flex items-center space-x-3 transition-colors text-gray-600 hover:text-blue-600"
                      onClick={() => setIsOpen(false)}
                    >
                      <CheckSquare className="h-4 w-4" />
                      <span>University Checklist</span>
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    to={isInternshipMode ? "/career-resources" : "/resources"}
                    className={`flex items-center space-x-3 transition-colors ${
                      isInternshipMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Lightbulb className="h-4 w-4" />
                    <span>{isInternshipMode ? 'Interview Tips' : 'Volunteer Tips'}</span>
                  </Link>
                </li>
                <li>
                  <FeedbackDialog>
                    <button
                      className={`flex items-center space-x-3 transition-colors w-full text-left ${
                        isInternshipMode 
                          ? 'text-gray-300 hover:text-blue-400' 
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Phone className="h-4 w-4" />
                      <span>Give Feedback/Support</span>
                    </button>
                  </FeedbackDialog>
                </li>
              </ul>
            </div>
            
            {/* Profile Settings - Shows for Google users without profile */}
            {user && <ProfileSettings />}

            {/* Quick Billing Access for logged in users */}
            {user && (
              <div className="mb-4">
                <Link to="/billing" onClick={() => setIsOpen(false)}>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${isInternshipMode ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                  >
                    <CreditCard className="h-4 w-4 mr-3" />
                    Billing & Subscription
                  </Button>
                </Link>
              </div>
            )}

            {/* Mode Toggle Component */}
            <ModeToggle />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;