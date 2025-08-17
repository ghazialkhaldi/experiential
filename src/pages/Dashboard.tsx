import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useMode } from '@/contexts/ModeContext';
import { Settings, User, LogOut } from 'lucide-react';
import ExperientialLogo from '@/components/ExperientialLogo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { mode, setMode, isInternshipMode } = useMode();

  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // Short vibration
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleSignOut = async () => {
    triggerHaptic();
    await signOut();
    navigate('/auth');
  };

  const handleNavigation = (path: string) => {
    triggerHaptic();
    navigate(path);
  };

  const handleModeChange = (newMode: 'volunteer' | 'internship') => {
    triggerHaptic();
    setMode(newMode);
  };

  return (
    <div className={`min-h-screen flex flex-col ${
      isInternshipMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900' 
        : 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400'
    }`}>
      {/* Header - Added top padding for iPhone notch */}
      <header className="flex items-center justify-between p-4 pt-16">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => handleNavigation('/settings')}
          className={`shadow-lg backdrop-blur-sm ${
            isInternshipMode 
              ? 'text-white hover:text-white bg-gray-800/90 hover:bg-gray-700/90 shadow-purple-500/30' 
              : 'text-gray-600 hover:text-gray-900 bg-white/90 hover:bg-white shadow-blue-500/30'
          }`}
        >
          <Settings className="h-6 w-6" />
        </Button>

        {/* Mode Toggle */}
        <div className={`flex items-center space-x-2 rounded-full p-1 shadow-md ${
          isInternshipMode ? 'bg-gray-800 text-white' : 'bg-white'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleModeChange('volunteer')}
            className={`rounded-full ${
              !isInternshipMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            Volunteer
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleModeChange('internship')}
            className={`rounded-full ${
              isInternshipMode 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Internships
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className={`shadow-lg backdrop-blur-sm ${
              isInternshipMode 
                ? 'text-white hover:text-white bg-gray-800/90 hover:bg-gray-700/90 shadow-purple-500/30' 
                : 'text-gray-600 hover:text-gray-900 bg-white/90 hover:bg-white shadow-blue-500/30'
            }`}>
              <User className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4">
        {/* Centered content container */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Logo */}
          <div className="mb-8">
            <ExperientialLogo className="h-28 w-auto mx-auto" />
          </div>

          {/* Greeting - Centered */}
          <h1 className={`text-3xl font-bold text-center ${
            isInternshipMode ? 'text-white' : 'text-white'
          }`}>
            {getGreeting()}!
          </h1>
        </div>

        {/* Action Buttons - Moved to bottom */}
        <div className="w-full max-w-sm space-y-4 mb-12">
          <Button
            onClick={() => handleNavigation('/explore')}
            className={`w-full h-14 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${
              isInternshipMode 
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/30' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
            }`}
          >
            Explore {isInternshipMode ? 'Internships' : 'Opportunities'}
          </Button>
          
          <Button
            onClick={() => handleNavigation('/portfolio')}
            variant="outline"
            className={`w-full h-14 text-lg border-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${
              isInternshipMode 
                ? 'border-purple-500 text-purple-300 bg-gray-800/50 hover:bg-purple-500/20 shadow-purple-500/30' 
                : 'border-blue-600 text-blue-700 bg-white hover:bg-blue-50 shadow-blue-500/30'
            }`}
          >
            Your Portfolio
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;