import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageShell, PageHeader, EmptyState, RequireAuth, ListSkeleton } from '@/components/layout/PageShell';
import { useApplications, type Application } from '@/hooks/useApplications';
import { useAuth } from '@/hooks/useAuth';
import { formatDate, formatTimeAgo } from '@/lib/opportunities';

export const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'accepted') return <Badge variant="success">Accepted</Badge>;
  if (status === 'rejected') return <Badge variant="muted">Not selected</Badge>;
  return <Badge variant="warning">Pending</Badge>;
};

const ApplicationRow = ({ application: a }: { application: Application }) => (
  <li className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between">
    <div className="min-w-0">
      {a.opportunity ? (
        <Link to={`/opportunity/${a.opportunity.id}`} className="font-semibold hover:text-primary hover:underline">
          {a.opportunity.title}
        </Link>
      ) : (
        <span className="font-semibold text-muted-foreground">Opportunity removed</span>
      )}
      <p className="mt-0.5 text-sm text-muted-foreground">
        {[a.opportunity?.organization?.name, a.opportunity?.location].filter(Boolean).join(' · ')}
      </p>
      {a.opportunity?.start_date && (
        <p className="mt-1 text-sm text-muted-foreground">
          {formatDate(a.opportunity.start_date)}
          {a.opportunity.end_date ? ` – ${formatDate(a.opportunity.end_date)}` : ' onward'}
        </p>
      )}
      {a.status === 'accepted' && (
        <p className="mt-2 text-sm text-success">
          You’re in. Watch your email for next steps, and{' '}
          <Link to="/track-hours" className="font-semibold underline">
            log your hours
          </Link>{' '}
          when you’ve served.
        </p>
      )}
    </div>
    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
      <StatusBadge status={a.status} />
      <span className="text-xs text-muted-foreground">Applied {formatTimeAgo(a.applied_at)}</span>
    </div>
  </li>
);

const ApplicationsList = () => {
  const { user } = useAuth();
  const { applications, loading, error } = useApplications();
  const mine = applications.filter((a) => a.user_id === user?.id);

  if (loading) return <ListSkeleton />;
  if (error) return <EmptyState title="Applications couldn’t load" description={error} />;
  if (mine.length === 0) {
    return (
      <EmptyState
        title="No applications yet"
        description="When you apply to an opportunity, you can follow its status here."
        action={
          <Button asChild>
            <Link to="/search">Find an opportunity</Link>
          </Button>
        }
      />
    );
  }

  const counts = {
    pending: mine.filter((a) => a.status === 'pending').length,
    accepted: mine.filter((a) => a.status === 'accepted').length,
  };

  return (
    <>
      <p className="mb-2 text-sm text-muted-foreground">
        <span className="tabular font-semibold text-foreground">{counts.pending}</span> pending ·{' '}
        <span className="tabular font-semibold text-foreground">{counts.accepted}</span> accepted
      </p>
      <ul className="divide-y divide-border border-y border-border">
        {mine.map((a) => (
          <ApplicationRow key={a.id} application={a} />
        ))}
      </ul>
    </>
  );
};

const MyApplications = () => (
  <PageShell width="narrow">
    <PageHeader title="My applications" description="Where each of your applications stands." />
    <RequireAuth message="Sign in to see the opportunities you’ve applied to.">
      <ApplicationsList />
    </RequireAuth>
  </PageShell>
);

export default MyApplications;
