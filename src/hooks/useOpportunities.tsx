import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  time_commitment: string;
  requirements: string | null;
  location: string;
  posted_at: string;
  max_volunteers: number | null;
  current_volunteers: number;
  organization: {
    name: string;
    id: string;
  };
}

export const useOpportunities = (searchQuery: string = '', categoryFilter: string = '') => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('opportunities')
          .select(`
            *,
            organization:organizations (
              name,
              id
            )
          `)
          .eq('is_active', true)
          .order('posted_at', { ascending: false });

        if (categoryFilter && categoryFilter !== 'all') {
          query = query.eq('category', categoryFilter);
        }

        if (searchQuery.trim()) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        setOpportunities(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError('Failed to load opportunities');
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [searchQuery, categoryFilter]);

  return { opportunities, loading, error };
};