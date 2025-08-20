import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useMode } from '@/contexts/ModeContext';
import { Settings, User, LogOut } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import ExperientialLogo from '@/components/ExperientialLogo';
import { NotificationBell } from '@/components/NotificationBell';
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleSignOut = async () => {
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
    setMode(newMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/app/settings')}
            className="text-gray-600 hover:text-gray-900"
          >
            <Settings className="h-6 w-6" />
          </Button>
          <NotificationBell />
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center space-x-2 bg-white rounded-full p-1 shadow-md">
          <Button
            variant={!isInternshipMode ? "default" : "ghost"}
            size="sm"
            onClick={() => handleModeChange('volunteer')}
            className={`rounded-full ${!isInternshipMode ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
          >
            Volunteer
          </Button>
          <Button
            variant={isInternshipMode ? "default" : "ghost"}
            size="sm"
            onClick={() => handleModeChange('internship')}
            className={`rounded-full ${isInternshipMode ? 'bg-purple-600 text-white' : 'text-gray-600'}`}
          >
            Internships
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
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
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Logo */}
        <div className="mb-8">
          <ExperientialLogo className="h-24 w-24 mx-auto" />
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
          >
            Your Portfolio
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;