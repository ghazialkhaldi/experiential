import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, User } from 'lucide-react';
import ExperientialLogo from '@/components/ExperientialLogo';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <ExperientialLogo className="h-8 w-8" />
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Experiential
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full hover-scale"
            onClick={() => navigate('/explore')}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full hover-scale relative"
            onClick={onNotificationPress}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>

          {/* Profile */}
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full hover-scale"
            onClick={() => navigate('/settings')}
          >
            {user?.email ? (
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {user.email.charAt(0).toUpperCase()}
              </div>
            ) : (
              <User className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};