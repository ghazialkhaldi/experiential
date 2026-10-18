import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from './SiteHeader';
import Footer from '@/components/Footer';
import ProfileNotice from './ProfileNotice';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface PageShellProps {
  children: ReactNode;
  /** Constrain the main column. Defaults to the site container. */
  width?: 'default' | 'narrow' | 'reading';
  className?: string;
  /** Hide the footer for focused task pages. */
  bare?: boolean;
}

const widths = {
  default: 'container',
  narrow: 'container max-w-3xl',
  reading: 'container max-w-[46rem]',
};

export const PageShell = ({ children, width = 'default', className, bare = false }: PageShellProps) => (
  <div className="flex min-h-screen flex-col">
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:shadow-lift"
    >
      Skip to content
    </a>
    <SiteHeader />
    <ProfileNotice />
    <main id="main" className={cn(widths[width], 'flex-1 py-8 md:py-12', className)}>
      {children}
    </main>
    {!bare && <Footer />}
  </div>
);

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({ title, description, actions, className }: PageHeaderProps) => (
  <div className={cn('mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold leading-tight md:text-[2.125rem]">{title}</h1>
      {description && <p className="mt-2 text-base text-muted-foreground">{description}</p>}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
  </div>
);

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({ title, description, action, className }: EmptyStateProps) => (
  <div className={cn('border-y border-border py-12', className)}>
    <h2 className="font-sans text-lg font-semibold tracking-tight">{title}</h2>
    {description && <p className="mt-1.5 max-w-md text-muted-foreground">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

/** Renders children only for signed-in users; otherwise a sign-in prompt. */
export const RequireAuth = ({ children, message }: { children: ReactNode; message: string }) => {
  const { user, loading } = useAuth();
  if (loading) return <ListSkeleton rows={3} />;
  if (!user) {
    return (
      <EmptyState
        title="Sign in to continue"
        description={message}
        action={
          <Button asChild>
            <Link to={`/auth?next=${encodeURIComponent(window.location.pathname)}`}>Sign in</Link>
          </Button>
        }
      />
    );
  }
  return <>{children}</>;
};

export const ListSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <div className="space-y-3" aria-busy="true" aria-label="Loading">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="rounded-lg border bg-card p-5">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="mt-3 h-5 w-2/3" />
        <Skeleton className="mt-3 h-4 w-1/2" />
      </div>
    ))}
  </div>
);
