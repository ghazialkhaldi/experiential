import React, { useState } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Clock, Star, Users, Briefcase, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAppNotifications } from '@/hooks/useAppNotifications';
import { useMode } from '@/contexts/ModeContext';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'acceptance':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'rejection':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'application':
      return <Users className="h-4 w-4 text-blue-500" />;
    case 'new_opportunity':
      return <Briefcase className="h-4 w-4 text-purple-500" />;
    case 'welcome':
      return <Star className="h-4 w-4 text-yellow-500" />;
    case 'reminder':
      return <Clock className="h-4 w-4 text-orange-500" />;
    case 'achievement':
      return <GraduationCap className="h-4 w-4 text-indigo-500" />;
    default:
      return <Info className="h-4 w-4 text-gray-500" />;
  }
};

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useAppNotifications();
  const { isInternshipMode } = useMode();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled className={isInternshipMode ? 'text-gray-300' : ''}>
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  const handleNotificationClick = async (notification: any) => {
    await markAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.opportunity_id) {
      navigate(`/opportunity/${notification.opportunity_id}`);
    } else if (notification.application_id) {
      navigate('/manage-opportunities');
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={`relative ${isInternshipMode ? 'text-gray-300 hover:text-blue-400' : ''}`}>
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
      </PopoverTrigger>
      
      <PopoverContent 
        className={`w-80 p-0 ${isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}`}
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <Card className={`border-0 shadow-lg ${isInternshipMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-lg font-semibold ${isInternshipMode ? 'text-white' : ''}`}>
              Notifications
            </CardTitle>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleMarkAllAsRead}
                  className={`text-xs ${isInternshipMode ? 'text-gray-400 hover:text-gray-200' : ''}`}
                >
                  Mark all read
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className={isInternshipMode ? 'text-gray-400 hover:text-gray-200' : ''}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className={`p-6 text-center ${isInternshipMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b last:border-0 cursor-pointer transition-colors hover:bg-muted/50 ${
                        !notification.is_read 
                          ? `${isInternshipMode ? 'bg-blue-500/10 border-l-4 border-l-blue-400' : 'bg-primary/5 border-l-4 border-l-primary'}` 
                          : ''
                      } ${isInternshipMode ? 'border-gray-700' : 'border-border'}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${
                              !notification.is_read 
                                ? isInternshipMode ? 'text-white' : 'text-foreground'
                                : isInternshipMode ? 'text-gray-300' : 'text-muted-foreground'
                            }`}>
                              {notification.title}
                            </p>
                            {!notification.is_read && (
                              <div className={`h-2 w-2 rounded-full ${isInternshipMode ? 'bg-blue-400' : 'bg-primary'}`} />
                            )}
                          </div>
                          <p className={`text-xs ${isInternshipMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                            {notification.message}
                          </p>
                          <p className={`text-xs ${isInternshipMode ? 'text-gray-500' : 'text-muted-foreground'}`}>
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};