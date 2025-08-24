import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import ExperientialLogo from '@/components/ExperientialLogo';

interface MobileHeaderProps {
  isNative: boolean;
  unreadCount: number;
  onNotificationPress: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  isNative, 
  unreadCount, 
  onNotificationPress 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearchPress = () => {
    navigate('/app/search');
  };

  const handleProfilePress = () => {
    navigate('/app/settings');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-top">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <ExperientialLogo className="h-8 w-auto" />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearchPress}
            className="h-9 w-9"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationPress}
            className="relative h-9 w-9"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>

          {/* Profile Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleProfilePress}
            className="h-9 w-9"
          >
            {user?.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                {user?.email?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
              </div>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;