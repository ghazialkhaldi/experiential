import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Search, Briefcase, Clock, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/useMobile';
import { ImpactStyle } from '@capacitor/haptics';

interface MobileNavigationProps {
  currentPath: string;
  isNative: boolean;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentPath, isNative }) => {
  const navigate = useNavigate();
  const { triggerHaptic } = useMobile();

  const navigationItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/dashboard',
      badge: null,
    },
    {
      icon: Search,
      label: 'Explore',
      path: '/explore',
      badge: null,
    },
    {
      icon: Briefcase,
      label: 'Discover',
      path: '/discover',
      badge: null,
    },
    {
      icon: Clock,
      label: 'Hours',
      path: '/track-hours',
      badge: null,
    },
    {
      icon: User,
      label: 'Profile',
      path: '/settings',
      badge: null,
    },
  ];

  const handleNavigation = async (path: string) => {
    if (isNative) {
      await triggerHaptic(ImpactStyle.Light);
    }
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-t border-border/50">
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => {
          const isActive = currentPath === item.path || 
            (item.path === '/dashboard' && currentPath === '/');
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center space-y-1 px-2 py-2 h-auto min-w-[60px] rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              onClick={() => handleNavigation(item.path)}
            >
              <div className="relative">
                <item.icon className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive && "scale-110"
                )} />
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className={cn(
                "text-xs font-medium transition-all duration-200",
                isActive ? "opacity-100" : "opacity-70"
              )}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
      
      {/* Safe area for iOS devices */}
      <div className="h-safe-area-inset-bottom bg-background/90" />
    </div>
  );
};