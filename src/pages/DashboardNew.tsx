import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useMode } from '@/contexts/ModeContext';
import { Settings, User, LogOut } from 'lucide-react';
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
    navigate('/app/auth');
  };

  return (
    <div className={`min-h-screen flex flex-col ${
      isInternshipMode 
        ? 'bg-gray-900' 
        : 'bg-white'
    }`}>
      {/* Header */}
      <header className={`flex items-center justify-between p-4 ${
        isInternshipMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/app/settings')}
          className={isInternshipMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
        >
          <Settings className="h-6 w-6" />
        </Button>

        {/* Mode Toggle */}
        <div className="flex items-center space-x-2 bg-white rounded-full p-1 shadow-md">
          <Button
            variant={!isInternshipMode ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode('volunteer')}
            className={`rounded-full ${!isInternshipMode ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
          >
            Volunteer
          </Button>
          <Button
            variant={isInternshipMode ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode('internship')}
            className={`rounded-full ${isInternshipMode ? 'bg-purple-600 text-white' : 'text-gray-600'}`}
          >
            Internships
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className={isInternshipMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
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
          <img src="/Experiential 3.png" alt="Experiential Logo" className="h-24 w-auto mx-auto" />
        </div>

        {/* Greeting */}
        <h1 className={`text-3xl font-bold mb-2 text-center ${
          isInternshipMode ? 'text-white' : 'text-gray-900'
        }`}>
          {getGreeting()}!
        </h1>
        <p className={`mb-16 text-center ${
          isInternshipMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Ready to explore new opportunities?
        </p>

        {/* Action Buttons */}
        <div className="w-full max-w-md">
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/app/explore')}
              className={`h-16 text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-center p-4 ${
                isInternshipMode 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <span className="text-center leading-tight">Explore {isInternshipMode ? 'Opportunities' : 'Opportunities'}</span>
            </Button>
            
            <Button
              onClick={() => navigate('/app/portfolio')}
              variant="outline"
              className={`h-16 text-sm font-medium border-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-center p-4 ${
                isInternshipMode 
                  ? 'border-purple-600 text-purple-300 hover:bg-purple-800' 
                  : 'border-blue-600 text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span className="text-center leading-tight">Your Portfolio</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
