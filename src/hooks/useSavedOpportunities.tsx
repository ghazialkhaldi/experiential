import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Opportunity } from '@/lib/opportunities';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface SavedRow {
  id: string;
  opportunity_id: string;
  created_at: string;
  opportunity: Opportunity | null;
}

export const useSavedOpportunities = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const key = ['saved', user?.id];

  const query = useQuery({
    queryKey: key,
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_opportunities')
        .select('id, opportunity_id, created_at, opportunity:opportunities ( *, organization:organizations ( name, id ) )')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as SavedRow[];
    },
  });

  const saved = query.data ?? [];
  const isSaved = (opportunityId: string) => saved.some((s) => s.opportunity_id === opportunityId);

  const toggleSave = async (opportunityId: string) => {
    if (!user) {
      toast({ title: 'Sign in to save opportunities', description: 'Saved opportunities stay with your account.' });
      return;
    }
    const wasSaved = isSaved(opportunityId);

    // Optimistic update so the bookmark responds instantly.
    queryClient.setQueryData<SavedRow[]>(key, (prev = []) =>
      wasSaved
        ? prev.filter((s) => s.opportunity_id !== opportunityId)
        : [{ id: `pending-${opportunityId}`, opportunity_id: opportunityId, created_at: new Date().toISOString(), opportunity: null }, ...prev]
    );

    const { error } = wasSaved
      ? await supabase.from('saved_opportunities').delete().eq('user_id', user.id).eq('opportunity_id', opportunityId)
      : await supabase.from('saved_opportunities').insert({ user_id: user.id, opportunity_id: opportunityId });

    if (error) {
      console.error('Error toggling save:', error);
      toast({ title: 'Couldn’t update saved list', description: 'Please try again.', variant: 'destructive' });
    }
    queryClient.invalidateQueries({ queryKey: key });
  };

  return {
    savedOpportunities: saved.filter((s) => s.opportunity),
    savedCount: saved.length,
    loading: !!user && query.isLoading,
    isSaved,
    toggleSave,
    canSave: !!user,
  };
};
