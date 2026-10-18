import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageShell } from '@/components/layout/PageShell';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';

// Only list what the product actually does for Pro members.
const BENEFITS = [
  {
    title: 'Priority placement',
    body: 'Your applications are listed first when organizations review applicants.',
  },
  {
    title: 'Pro badge',
    body: 'Organizations see a Pro label next to your name on every application.',
  },
  {
    title: 'Cancel anytime',
    body: 'Manage or cancel from Billing. No contracts.',
  },
];

const ProFeatures = () => {
  const { subscribed, createCheckoutSession, loading } = useSubscription();
  const { user } = useAuth();

  return (
    <PageShell>
      <div className="grid gap-12 md:grid-cols-[minmax(0,36rem)_20rem] md:items-start md:justify-between lg:grid-cols-[minmax(0,36rem)_22rem]">
        <div>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Get your applications read first
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            Pro moves your applications to the top of each organization’s review list, so they’re seen before the rest.
          </p>
          <dl className="mt-10 divide-y divide-border border-y border-border">
            {BENEFITS.map((b) => (
              <div key={b.title} className="py-5">
                <dt className="font-semibold">{b.title}</dt>
                <dd className="mt-1 text-muted-foreground">{b.body}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="rounded-xl border border-border bg-card p-6 shadow-lift">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Pro</p>
            {subscribed && <Badge variant="success">Active</Badge>}
          </div>
          <p className="mt-3">
            <span className="tabular font-display text-4xl font-semibold">$4.99</span>
            <span className="text-muted-foreground"> / month</span>
          </p>
          <div className="mt-6">
            {subscribed ? (
              <Button variant="outline" className="w-full" asChild>
                <Link to="/billing">Manage subscription</Link>
              </Button>
            ) : user ? (
              <Button className="w-full" size="lg" onClick={createCheckoutSession} disabled={loading}>
                Upgrade to Pro
              </Button>
            ) : (
              <Button className="w-full" size="lg" asChild>
                <Link to="/auth?next=/pro">Sign in to upgrade</Link>
              </Button>
            )}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">Secure checkout with Stripe opens in a new tab.</p>
        </aside>
      </div>
    </PageShell>
  );
};

export default ProFeatures;
