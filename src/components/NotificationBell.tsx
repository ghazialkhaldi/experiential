import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppNotifications, type AppNotification } from '@/hooks/useAppNotifications';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useAppNotifications();
  const { isOrganization } = useProfile();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClick = (n: AppNotification) => {
    if (!n.is_read) markAsRead(n.id);
    setOpen(false);
    if (n.application_id) navigate(isOrganization ? '/manage-opportunities' : '/my-applications');
    else if (n.opportunity_id) navigate(`/opportunity/${n.opportunity_id}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full"
          aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        >
          <Bell className="h-[1.125rem] w-[1.125rem]" />
          {unreadCount > 0 && (
            <span className="tabular absolute -right-0.5 -top-0.5 grid h-[1.125rem] min-w-[1.125rem] place-items-center rounded-full bg-primary px-1 text-[0.625rem] font-bold text-primary-foreground ring-2 ring-background">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-[min(22rem,calc(100vw-1.5rem))] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="font-sans text-sm font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-xs font-medium text-primary hover:underline">
              Mark all read
            </button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-medium">You’re all caught up</p>
            <p className="mt-1 text-sm text-muted-foreground">Application updates will show up here.</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[24rem]">
            <ul className="divide-y">
              {notifications.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => handleClick(n)}
                    className={cn(
                      'flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60',
                      !n.is_read && 'bg-accent/50'
                    )}
                  >
                    <span className={cn('mt-1.5 shrink-0', n.is_read ? 'opacity-0' : '')} aria-hidden>
                      <span className="brand-dot" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn('block text-sm', n.is_read ? 'text-muted-foreground' : 'font-semibold')}>{n.title}</span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">{n.message}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};
