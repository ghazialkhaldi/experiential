import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageShell, EmptyState } from '@/components/layout/PageShell';
import SearchBar from '@/components/SearchBar';
import OpportunityCard, { OpportunityCardSkeleton } from '@/components/OpportunityCard';
import { useOpportunities, sortOpportunities, type SortKey } from '@/hooks/useOpportunities';
import { useLocation } from '@/hooks/useLocation';
import { useSavedOpportunities } from '@/hooks/useSavedOpportunities';
import { categoryLabel } from '@/lib/opportunities';

const SearchResults = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const category = params.get('category') ?? 'all';
  const { location } = useLocation();
  const sort = (params.get('sort') as SortKey) || (location ? 'closest' : 'newest');

  const { opportunities, loading, error, refetch } = useOpportunities({ search: q, category, origin: location });
  const { isSaved, toggleSave } = useSavedOpportunities();
  const results = sortOpportunities(opportunities, sort);

  const update = (next: Record<string, string | null>) => {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    setParams(p, { replace: true });
  };

  const hasFilters = !!q || category !== 'all';
  const summary = [q && `“${q}”`, category !== 'all' && categoryLabel(category)].filter(Boolean).join(' in ');

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold md:text-[2.125rem]">Browse opportunities</h1>
      <SearchBar
        initialQuery={q}
        initialCategory={category}
        onSearch={(nextQ, nextCat) => update({ q: nextQ || null, category: nextCat !== 'all' ? nextCat : null })}
        className="mt-6 shadow-card"
      />

      <div className="mb-5 mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {loading ? (
            'Searching…'
          ) : (
            <>
              <span className="tabular font-semibold text-foreground">{results.length}</span>{' '}
              {results.length === 1 ? 'opportunity' : 'opportunities'}
              {summary && <> for {summary}</>}
            </>
          )}
        </p>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={() => setParams({}, { replace: true })}>
              Clear filters
            </Button>
          )}
          <Select value={sort} onValueChange={(v) => update({ sort: v })}>
            <SelectTrigger className="h-9 w-[10.5rem]" aria-label="Sort by">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="closest" disabled={!location}>
                Closest first{!location && ' (set a location)'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <OpportunityCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          title="Search is unavailable"
          description={error}
          action={<Button variant="outline" onClick={() => refetch()}>Try again</Button>}
        />
      ) : results.length === 0 ? (
        <EmptyState
          title="No matches"
          description={hasFilters ? 'Try a broader keyword or a different category.' : 'No opportunities are open right now.'}
          action={hasFilters ? <Button variant="outline" onClick={() => setParams({})}>Clear filters</Button> : undefined}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((o) => (
            <OpportunityCard key={o.id} opportunity={o} isSaved={isSaved(o.id)} onToggleSave={toggleSave} />
          ))}
        </div>
      )}
    </PageShell>
  );
};

export default SearchResults;
