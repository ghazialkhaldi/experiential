import { Link } from 'react-router-dom';
import { Bookmark, Clock, MapPin, Tag, Users } from 'lucide-react';
import {
  categoryLabel,
  formatDistance,
  formatTimeAgo,
  isNewOpportunity,
  spotsLeft,
  type Opportunity,
} from '@/lib/opportunities';
import { cn } from '@/lib/utils';

interface OpportunityCardProps {
  opportunity: Opportunity;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  className?: string;
}

/**
 * One opportunity in a list. The whole card links to the detail page; the
 * save control sits above the link so it stays independently clickable.
 */
const OpportunityCard = ({ opportunity: o, isSaved = false, onToggleSave, className }: OpportunityCardProps) => {
  const spots = spotsLeft(o);
  const isNew = isNewOpportunity(o.posted_at);

  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-lg border border-border bg-card p-5 shadow-card transition-[box-shadow,border-color] duration-200 ease-out-expo hover:border-primary/30 hover:shadow-lift',
        className
      )}
    >
      <h3 className="pr-10 text-[1.0625rem] font-semibold leading-snug">
        <Link
          to={`/opportunity/${o.id}`}
          className="rounded-sm outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-ring"
        >
          {o.title}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {o.organization?.name ?? 'Organization'}
        <span aria-hidden> · </span>
        {isNew ? <span className="font-medium text-primary">New</span> : formatTimeAgo(o.posted_at)}
      </p>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-foreground/80">{o.description}</p>

      <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-border/70 pt-3 text-[0.8125rem] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Category</dt>
          <Tag className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <dd>{categoryLabel(o.category)}</dd>
        </div>
        <div className="flex min-w-0 items-center gap-1.5">
          <dt className="sr-only">Location</dt>
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <dd className="truncate">
            {o.location}
            {o.distance !== undefined && <span className="tabular text-foreground"> · {formatDistance(o.distance)}</span>}
          </dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Time commitment</dt>
          <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <dd>{o.time_commitment}</dd>
        </div>
        {spots !== null && (
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Spots</dt>
            <Users className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <dd className={cn('tabular', spots === 0 && 'text-destructive')}>
              {spots === 0 ? 'Full' : `${spots} ${spots === 1 ? 'spot' : 'spots'} left`}
            </dd>
          </div>
        )}
      </dl>

      {onToggleSave && (
        <button
          type="button"
          onClick={() => onToggleSave(o.id)}
          aria-pressed={isSaved}
          aria-label={isSaved ? `Remove ${o.title} from saved` : `Save ${o.title}`}
          className={cn(
            'absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full transition-colors',
            isSaved ? 'text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <Bookmark className={cn('h-[1.125rem] w-[1.125rem]', isSaved && 'fill-current')} />
        </button>
      )}
    </article>
  );
};

export const OpportunityCardSkeleton = () => (
  <div className="rounded-lg border bg-card p-5" aria-hidden>
    <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
    <div className="mt-3 h-5 w-4/5 animate-pulse rounded bg-muted" />
    <div className="mt-2 h-3.5 w-1/3 animate-pulse rounded bg-muted" />
    <div className="mt-4 h-3.5 w-full animate-pulse rounded bg-muted" />
    <div className="mt-2 h-3.5 w-2/3 animate-pulse rounded bg-muted" />
  </div>
);

export default OpportunityCard;
