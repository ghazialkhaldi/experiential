import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Bookmark,
  Briefcase,
  ClipboardList,
  Clock,
  CreditCard,
  FileText,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Shield,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ExperientialLogo from '@/components/ExperientialLogo';
import { NotificationBell } from '@/components/NotificationBell';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';

const PRIMARY_NAV = [
  { to: '/search', label: 'Browse' },
  { to: '/track-hours', label: 'Track hours' },
  { to: '/resume-builder', label: 'Resume' },
  { to: '/resources', label: 'Guides' },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors',
    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
  );

const SiteHeader = () => {
  const { user } = useAuth();
  const { getDisplayName, isOrganization, isAdmin } = useProfile();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    navigate('/');
  };

  const accountLinks = [
    ...(isOrganization
      ? [
          { to: '/manage-opportunities', label: 'Manage postings', icon: ClipboardList },
          { to: '/post-opportunity', label: 'Post an opportunity', icon: Plus },
        ]
      : [
          { to: '/my-applications', label: 'My applications', icon: Briefcase },
          { to: '/saved', label: 'Saved', icon: Bookmark },
        ]),
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/billing', label: 'Billing', icon: CreditCard },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: Shield }] : []),
  ];

  const name = getDisplayName();
  const initials = name
    .split(/[\s@]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p: string) => p[0]?.toUpperCase())
    .join('');

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background">
      <div className="container flex h-16 items-center gap-6">
        <Link to="/" className="shrink-0 rounded-sm" aria-label="Experiential home">
          <ExperientialLogo height={28} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && <span className="brand-dot absolute bottom-0.5 left-1/2 -translate-x-1/2" aria-hidden />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user && <NotificationBell />}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="hidden h-9 items-center gap-2 rounded-full border border-border bg-card pl-1 pr-3 text-sm font-medium transition-colors hover:border-primary/40 md:inline-flex"
                  aria-label="Account menu"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                    {initials || <User className="h-3.5 w-3.5" />}
                  </span>
                  <span className="max-w-[10rem] truncate">{name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate font-normal text-muted-foreground">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {accountLinks.map(({ to, label, icon: Icon }) => (
                  <DropdownMenuItem key={to} onSelect={() => navigate(to)}>
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth?mode=signup">Create account</Link>
              </Button>
            </div>
          )}

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[18rem] flex-col gap-0 p-0">
              <SheetHeader className="border-b px-5 py-4 text-left">
                <SheetTitle className="text-sm font-medium text-muted-foreground">
                  {user ? name : 'Menu'}
                </SheetTitle>
              </SheetHeader>
              <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Mobile">
                <MobileLink to="/search" icon={Search} onNavigate={() => setMenuOpen(false)}>Browse opportunities</MobileLink>
                <MobileLink to="/track-hours" icon={Clock} onNavigate={() => setMenuOpen(false)}>Track hours</MobileLink>
                <MobileLink to="/resume-builder" icon={FileText} onNavigate={() => setMenuOpen(false)}>Resume builder</MobileLink>
                <MobileLink to="/resources" icon={BookOpen} onNavigate={() => setMenuOpen(false)}>College guides</MobileLink>
                {user && (
                  <>
                    <div className="my-3 h-px bg-border" />
                    {accountLinks.map(({ to, label, icon }) => (
                      <MobileLink key={to} to={to} icon={icon} onNavigate={() => setMenuOpen(false)}>
                        {label}
                      </MobileLink>
                    ))}
                  </>
                )}
              </nav>
              <div className="border-t p-4">
                {user ? (
                  <Button variant="outline" className="w-full" onClick={handleSignOut}>
                    <LogOut />
                    Sign out
                  </Button>
                ) : (
                  <div className="grid gap-2">
                    <Button asChild onClick={() => setMenuOpen(false)}>
                      <Link to="/auth?mode=signup">Create account</Link>
                    </Button>
                    <Button variant="outline" asChild onClick={() => setMenuOpen(false)}>
                      <Link to="/auth">Sign in</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

const MobileLink = ({
  to,
  icon: Icon,
  children,
  onNavigate,
}: {
  to: string;
  icon: typeof FileText;
  children: React.ReactNode;
  onNavigate: () => void;
}) => (
  <NavLink
    to={to}
    onClick={onNavigate}
    className={({ isActive }) =>
      cn(
        'flex h-11 items-center gap-3 rounded-md px-3 text-[0.95rem] font-medium transition-colors',
        isActive ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-muted'
      )
    }
  >
    <Icon className="h-4 w-4 text-muted-foreground" />
    {children}
  </NavLink>
);

export default SiteHeader;
