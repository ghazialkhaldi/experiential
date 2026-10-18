import type { Database } from '@/integrations/supabase/types';

export type VolunteerCategory = Database['public']['Enums']['volunteer_category'];

export const CATEGORIES: { value: VolunteerCategory; label: string }[] = [
  { value: 'education', label: 'Education' },
  { value: 'environment', label: 'Environment' },
  { value: 'animal_care', label: 'Animal care' },
  { value: 'community_service', label: 'Community service' },
  { value: 'healthcare', label: 'Healthcare' },
];

/** Organizations may also pick "other" for their own category. */
export const ORGANIZATION_CATEGORIES = [...CATEGORIES, { value: 'other', label: 'Other' }];

export const categoryLabel = (value?: string | null) => {
  if (!value) return '';
  const match = ORGANIZATION_CATEGORIES.find((c) => c.value === value);
  if (match) return match.label;
  const spaced = value.replace(/_/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  time_commitment: string;
  requirements: string | null;
  location: string;
  posted_at: string;
  opportunity_type: string;
  max_volunteers: number | null;
  current_volunteers: number;
  resume_required?: boolean | null;
  start_date?: string | null;
  end_date?: string | null;
  is_active?: boolean;
  distance?: number;
  organization: {
    name: string;
    id: string;
  } | null;
}

export const isNewOpportunity = (postedAt: string) =>
  Date.now() - new Date(postedAt).getTime() < 3 * 24 * 60 * 60 * 1000;

export const formatTimeAgo = (date: string) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  if (days < 365) {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/** Parse a value as a local date. Date-only strings (YYYY-MM-DD) would otherwise be read as UTC and shift a day. */
export const parseDate = (date: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(date);
};

export const formatDate = (date: string) =>
  parseDate(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/** Distances are stored in km; the audience is US-based, so show miles. */
export const formatDistance = (km: number) => {
  const miles = km * 0.621371;
  if (miles < 1) return 'Under 1 mi';
  return `${miles < 10 ? miles.toFixed(1) : Math.round(miles)} mi`;
};

export const spotsLeft = (o: Pick<Opportunity, 'max_volunteers' | 'current_volunteers'>) =>
  o.max_volunteers ? Math.max(0, o.max_volunteers - (o.current_volunteers || 0)) : null;

/** Escape characters that would break a PostgREST `or()` filter. */
export const sanitizeSearch = (q: string) => q.replace(/[%,()*\\]/g, ' ').trim();
