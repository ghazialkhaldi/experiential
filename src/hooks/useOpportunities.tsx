import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { distanceKm, geocode, type Coordinates } from '@/lib/geo';
import { parseDate, sanitizeSearch, type Opportunity } from '@/lib/opportunities';

interface Options {
  search?: string;
  category?: string;
  /** When set, each result gets a `distance` in km from this point. */
  origin?: Coordinates | null;
  limit?: number;
}

export const OPPORTUNITIES_KEY = 'opportunities';

/** Hide postings whose application deadline or end date has already passed. */
const isStillOpen = (o: { expires_at?: string | null; end_date?: string | null }) => {
  const now = new Date();
  if (o.expires_at && new Date(o.expires_at) < now) return false;
  if (o.end_date && parseDate(o.end_date) < new Date(now.getFullYear(), now.getMonth(), now.getDate())) return false;
  return true;
};

export const useOpportunities = ({ search = '', category = 'all', origin = null, limit }: Options = {}) => {
  const q = sanitizeSearch(search);

  const query = useQuery({
    queryKey: [OPPORTUNITIES_KEY, { q, category, limit }],
    staleTime: 60 * 1000,
    queryFn: async () => {
      let request = supabase
        .from('opportunities')
        .select('*, organization:organizations ( name, id )')
        .eq('is_active', true)
        .eq('opportunity_type', 'volunteer')
        .order('posted_at', { ascending: false });

      if (category && category !== 'all') request = request.eq('category', category);
      if (q) request = request.or(`title.ilike.%${q}%,description.ilike.%${q}%,location.ilike.%${q}%`);
      if (limit) request = request.limit(limit);

      const { data, error } = await request;
      if (error) throw error;
      return ((data ?? []) as unknown as (Opportunity & { expires_at: string | null })[]).filter(isStillOpen);
    },
  });

  // Distances resolve after the list renders, so results never wait on geocoding.
  const [distances, setDistances] = useState<Record<string, number>>({});
  const originKey = origin ? `${origin.latitude.toFixed(3)},${origin.longitude.toFixed(3)}` : '';

  useEffect(() => {
    if (!origin || !query.data?.length) {
      setDistances({});
      return;
    }
    let cancelled = false;
    (async () => {
      const next: Record<string, number> = {};
      for (const opp of query.data) {
        const place = await geocode(opp.location);
        if (cancelled) return;
        if (place) next[opp.id] = distanceKm(origin, place);
      }
      if (!cancelled) setDistances(next);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originKey, query.data]);

  const opportunities = useMemo(
    () => (query.data ?? []).map((o) => (o.id in distances ? { ...o, distance: distances[o.id] } : o)),
    [query.data, distances]
  );

  return {
    opportunities,
    loading: query.isLoading,
    error: query.error ? 'We couldn’t load opportunities right now.' : null,
    refetch: query.refetch,
  };
};

export const useOpportunity = (id?: string) =>
  useQuery({
    queryKey: [OPPORTUNITIES_KEY, 'detail', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*, organization:organizations ( name, id, description, website, city, state )')
        .eq('id', id!)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as (Opportunity & {
        organization: { name: string; id: string; description: string | null; website: string | null; city: string; state: string } | null;
      }) | null;
    },
  });

export type SortKey = 'newest' | 'closest';

export const sortOpportunities = (list: Opportunity[], sort: SortKey) => {
  const copy = [...list];
  if (sort === 'closest') {
    return copy.sort((a, b) => {
      if (a.distance !== undefined && b.distance !== undefined) return a.distance - b.distance;
      if (a.distance !== undefined) return -1;
      if (b.distance !== undefined) return 1;
      return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime();
    });
  }
  return copy.sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime());
};
