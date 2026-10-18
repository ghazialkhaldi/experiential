import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageShell, PageHeader, RequireAuth, ListSkeleton } from '@/components/layout/PageShell';
import { useSubscription } from '@/hooks/useSubscription';
import { formatDate } from '@/lib/opportunities';

const BillingBody = () => {
  const { subscribed, subscription_tier, subscription_end, manageSubscription, checkSubscription, loading } = useSubscription();

  if (loading) return <ListSkeleton rows={1} />;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Current plan</p>
            <p className="mt-1 text-2xl font-semibold">{subscribed ? subscription_tier || 'Pro' : 'Free'}</p>
          </div>
          {subscribed ? <Badge variant="success">Active</Badge> : <Badge variant="muted">Free</Badge>}
        </div>

        {subscribed ? (
          <>
            <dl className="mt-6 grid gap-4 border-t border-border pt-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Price</dt>
                <dd className="tabular mt-0.5 font-medium">$4.99 / month</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Renews</dt>
                <dd className="mt-0.5 font-medium">{subscription_end ? formatDate(subscription_end) : '—'}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button onClick={manageSubscription}>
                Manage in Stripe
                <ExternalLink />
              </Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Update your card, download invoices, or cancel from the Stripe billing portal.
            </p>
          </>
        ) : (
          <div className="mt-6 border-t border-border pt-5">
            <p className="text-sm text-muted-foreground">
              Pro puts your applications at the top of each organization’s review list.
            </p>
            <Button className="mt-4" asChild>
              <Link to="/pro">See Pro</Link>
            </Button>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Just upgraded and still seeing Free?{' '}
        <button onClick={() => checkSubscription()} className="font-semibold text-primary hover:underline">
          Refresh status
        </button>
      </p>
    </div>
  );
};

const Billing = () => (
  <PageShell width="narrow">
    <PageHeader title="Billing" />
    <RequireAuth message="Sign in to view your plan.">
      <BillingBody />
    </RequireAuth>
  </PageShell>
);

export default Billing;
