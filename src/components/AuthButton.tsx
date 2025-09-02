
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Building } from 'lucide-react';
import { useMode } from '@/contexts/ModeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AuthButton = () => {
  const { signOut, isAuthenticated } = useAuth();
  const { getDisplayName, loading, isOrganization } = useProfile();
  const { isInternshipMode } = useMode();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <Button 
        variant={isInternshipMode ? "default" : "outline"}
        className={`transition-all duration-200 hover:scale-105 ${
          isInternshipMode 
            ? 'bg-purple-700 hover:bg-purple-800 text-white border-0' 
            : 'border-blue-600 text-blue-600 hover:bg-blue-50'
        }`}
        onClick={() => navigate('/auth')}
      >
        Sign In
      </Button>
    );
  }

  if (loading) {
    return (
      <Button 
        variant={isInternshipMode ? "default" : "outline"}
        className={`transition-all duration-200 ${
          isInternshipMode 
            ? 'bg-purple-700 text-white border-0' 
            : 'border-blue-600 text-blue-600'
        }`} 
        disabled
      >
        Loading...
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={isInternshipMode ? "default" : "outline"}
          className={`transition-all duration-200 hover:scale-105 ${
            isInternshipMode 
              ? 'bg-purple-700 hover:bg-purple-800 text-white border-0' 
              : 'border-blue-600 text-blue-600 hover:bg-blue-50'
          }`}
        >
          {isOrganization ? (
            <Building className="h-4 w-4 mr-2" />
          ) : (
            <User className="h-4 w-4 mr-2" />
          )}
          {getDisplayName()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButton;
