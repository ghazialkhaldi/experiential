import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useMode } from '@/contexts/ModeContext';
import { Settings, User, LogOut } from 'lucide-react';
<<<<<<< HEAD
import ExperientialLogo from '@/components/ExperientialLogo';
=======
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
>>>>>>> origin/main
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

<<<<<<< HEAD
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // Short vibration
    }
  };

=======
>>>>>>> origin/main
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleSignOut = async () => {
<<<<<<< HEAD
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
=======
    await signOut();
    navigate('/');
  };

  const handleModeChange = async (newMode: 'volunteer' | 'internship') => {
    // Add haptic feedback for mobile
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
>>>>>>> origin/main
    setMode(newMode);
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/app/settings')}
          className="text-gray-600 hover:text-gray-900"
>>>>>>> origin/main
        >
          <Settings className="h-6 w-6" />
        </Button>

        {/* Mode Toggle */}
<<<<<<< HEAD
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
=======
        <div className="flex items-center space-x-2 bg-white rounded-full p-1 shadow-md">
          <Button
            variant={!isInternshipMode ? "default" : "ghost"}
            size="sm"
            onClick={() => handleModeChange('volunteer')}
            className={`rounded-full ${!isInternshipMode ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
>>>>>>> origin/main
          >
            Volunteer
          </Button>
          <Button
<<<<<<< HEAD
            variant="ghost"
            size="sm"
            onClick={() => handleModeChange('internship')}
            className={`rounded-full ${
              isInternshipMode 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'
            }`}
=======
            variant={isInternshipMode ? "default" : "ghost"}
            size="sm"
            onClick={() => handleModeChange('internship')}
            className={`rounded-full ${isInternshipMode ? 'bg-purple-600 text-white' : 'text-gray-600'}`}
>>>>>>> origin/main
          >
            Internships
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
<<<<<<< HEAD
            <Button variant="ghost" size="icon" className={`shadow-lg backdrop-blur-sm ${
              isInternshipMode 
                ? 'text-white hover:text-white bg-gray-800/90 hover:bg-gray-700/90 shadow-purple-500/30' 
                : 'text-gray-600 hover:text-gray-900 bg-white/90 hover:bg-white shadow-blue-500/30'
            }`}>
=======
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
>>>>>>> origin/main
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
<<<<<<< HEAD
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
=======
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Logo */}
        <div className="mb-8">
          <img src="/E.png" alt="Experiential Logo" className="h-24 w-24 mx-auto" />
        </div>

        {/* Greeting */}
        <h1 className="text-3xl font-bold text-gray-900 mb-16 text-center">
          {getGreeting()}!
        </h1>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <Button
            onClick={() => navigate('/app/explore')}
            className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Explore {isInternshipMode ? 'Opportunities' : 'Opportunities'}
          </Button>
          
          <Button
            onClick={() => navigate('/app/portfolio')}
            variant="outline"
            className="w-full h-14 text-lg border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
>>>>>>> origin/main
          >
            Your Portfolio
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;