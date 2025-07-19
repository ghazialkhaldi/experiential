import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useMode } from "@/contexts/ModeContext";

interface GoogleUserNotificationProps {
  onDismiss: () => void;
}

const GoogleUserNotification: React.FC<GoogleUserNotificationProps> = ({ onDismiss }) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { isInternshipMode } = useMode();

  console.log('GoogleUserNotification - User:', user);
  console.log('GoogleUserNotification - Profile:', profile);
  console.log('GoogleUserNotification - User metadata:', user?.app_metadata);

  // Only show for Google users without a complete profile
  const isGoogleUser = user?.app_metadata?.provider === 'google';
  const needsProfile = !profile?.role;

  console.log('GoogleUserNotification - Is Google user:', isGoogleUser);
  console.log('GoogleUserNotification - Needs profile:', needsProfile);

  if (!isGoogleUser || !needsProfile) {
    console.log('GoogleUserNotification - Not showing notification');
    return null;
  }

  console.log('GoogleUserNotification - Showing notification');

  return (
    <Alert className={`mb-4 ${
      isInternshipMode 
        ? 'bg-purple-900/30 border-purple-500/50 text-purple-100' 
        : 'bg-blue-50 border-blue-200'
    }`}>
      <Settings className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span className={isInternshipMode ? 'text-purple-200' : ''}>
          Welcome! Please complete your profile in the sidebar to get started.
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className={`ml-2 p-1 ${
            isInternshipMode 
              ? 'hover:bg-purple-800/50 text-purple-300' 
              : 'hover:bg-blue-100'
          }`}
        >
          <X className="h-3 w-3" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default GoogleUserNotification;