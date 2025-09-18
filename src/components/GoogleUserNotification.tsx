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
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { isInternshipMode } = useMode();

  console.log('GoogleUserNotification - User:', user);
  console.log('GoogleUserNotification - Profile:', profile);
  console.log('GoogleUserNotification - Auth loading:', loading);
  console.log('GoogleUserNotification - Profile loading:', profileLoading);
  console.log('GoogleUserNotification - User metadata:', user?.user_metadata);

  // Don't show anything while loading
  if (loading || profileLoading) {
    console.log('GoogleUserNotification - Still loading, not showing');
    return null;
  }

  // Check if user signed up with Google - access the full user object from supabase
  const userData = user?.user_metadata || {};
  // For Google users, the metadata should contain provider information
  const isGoogleUser = userData?.iss === 'https://accounts.google.com' || userData?.provider_id || userData?.full_name;
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