import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LocationSelector from '@/components/LocationSelector';
import { CATEGORIES } from '@/lib/opportunities';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  /** Two-row layout for narrow columns, such as beside the hero map. */
  stacked?: boolean;
  initialQuery?: string;
  initialCategory?: string;
  onSearch: (query: string, category: string) => void;
  className?: string;
}

const SearchBar = ({ stacked = false, initialQuery = '', initialCategory = 'all', onSearch, className }: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => setQuery(initialQuery), [initialQuery]);
  useEffect(() => setCategory(initialCategory), [initialCategory]);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(query.trim(), category);
      }}
      className={cn(
        'grid gap-2 rounded-xl border border-border bg-card p-2 text-foreground shadow-lift sm:grid-cols-2',
        stacked
          ? 'sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]'
          : 'lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_auto]',
        className
      )}
    >
      <div className={cn('relative sm:col-span-2', stacked ? 'sm:col-span-3' : 'lg:col-span-1')}>
        <label htmlFor="search-query" className="sr-only">
          Search opportunities
        </label>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="search-query"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tutoring, food bank, animal shelter…"
          className="h-12 border-transparent pl-10 shadow-none focus-visible:border-input"
        />
      </div>
      <LocationSelector className="w-full" />
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="h-12 font-medium" aria-label="Category">
          <SelectValue placeholder="Any category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any category</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" size="lg" className={cn('h-12 sm:col-span-2', stacked ? 'sm:col-span-1' : 'lg:col-span-1')}>
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
