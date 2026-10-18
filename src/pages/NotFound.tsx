import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageShell } from '@/components/layout/PageShell';

const NotFound = () => (
  <PageShell width="narrow" className="flex flex-col items-start justify-center py-24">
    <h1 className="text-4xl font-semibold md:text-5xl">We can’t find that page</h1>
    <p className="mt-4 max-w-md text-lg text-muted-foreground">
      The link may be old, or the opportunity may have been removed.
    </p>
    <div className="mt-8 flex flex-wrap gap-2">
      <Button asChild>
        <Link to="/search">Browse opportunities</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link to="/">Go home</Link>
      </Button>
    </div>
  </PageShell>
);

export default NotFound;
