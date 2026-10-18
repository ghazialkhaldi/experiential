import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageShell, PageHeader, EmptyState, RequireAuth, ListSkeleton } from '@/components/layout/PageShell';
import OpportunityCard from '@/components/OpportunityCard';
import { useSavedOpportunities } from '@/hooks/useSavedOpportunities';

const SavedList = () => {
  const { savedOpportunities, loading, toggleSave } = useSavedOpportunities();

  if (loading) return <ListSkeleton />;
  if (savedOpportunities.length === 0) {
    return (
      <EmptyState
        title="Nothing saved yet"
        description="Tap the bookmark on any opportunity to keep it here for later."
        action={
          <Button asChild>
            <Link to="/search">Browse opportunities</Link>
          </Button>
        }
      />
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {savedOpportunities.map((s) => (
        <OpportunityCard key={s.id} opportunity={s.opportunity!} isSaved onToggleSave={toggleSave} />
      ))}
    </div>
  );
};

const Saved = () => (
  <PageShell>
    <PageHeader title="Saved" description="Opportunities you’ve bookmarked." />
    <RequireAuth message="Sign in to see the opportunities you’ve saved.">
      <SavedList />
    </RequireAuth>
  </PageShell>
);

export default Saved;
