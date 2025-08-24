import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, TrendingUp, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMobile } from '../hooks/useMobile';

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
      path: '/app/dashboard',
      badge: null,
    },
    {
      icon: Search,
      label: 'Discover',
      path: '/app/discover',
      badge: null,
    },
    {
      icon: TrendingUp,
      label: 'Track',
      path: '/app/track-experience',
      badge: null,
    },
    {
      icon: BookOpen,
      label: 'Portfolio',
      path: '/app/portfolio',
      badge: null,
    },
    {
      icon: User,
      label: 'Profile',
      path: '/app/settings',
      badge: null,
    },
  ];

  const handleNavigation = async (path: string) => {
    if (isNative) {
      await triggerHaptic('light');
    }
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-1">
        {navigationItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-0 relative ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium leading-none">
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;