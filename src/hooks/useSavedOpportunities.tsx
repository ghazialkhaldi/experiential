import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface SavedOpportunity {
  id: string;
  opportunity_id: string;
  created_at: string;
  opportunity: {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    time_commitment: string;
    posted_at: string;
    organization: {
      name: string;
      id: string;
    };
  };
}

export const useSavedOpportunities = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedOpportunities, setSavedOpportunities] = useState<SavedOpportunity[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch saved opportunities
  useEffect(() => {
    const fetchSavedOpportunities = async () => {
      if (!user) {
        setSavedOpportunities([]);
        return;
      }

      setLoading(true);
      try {
        const { data: savedData, error } = await supabase
          .from('saved_opportunities')
          .select('id, opportunity_id, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (savedData && savedData.length > 0) {
          // Get opportunity details for each saved opportunity
          const opportunityIds = savedData.map(saved => saved.opportunity_id);
          const { data: opportunities, error: opError } = await supabase
            .from('opportunities')
            .select(`
              id,
              title,
              description,
              category,
              location,
              time_commitment,
              posted_at,
              organizations (
                name,
                id
              )
            `)
            .in('id', opportunityIds);

          if (opError) throw opError;

          // Combine saved data with opportunity details
          const savedWithDetails = savedData.map(saved => {
            const opportunity = opportunities?.find(op => op.id === saved.opportunity_id);
            if (!opportunity) return null;
            
            return {
              ...saved,
              opportunity: {
                ...opportunity,
                organization: opportunity.organizations
              }
            };
          }).filter(saved => saved !== null);

          setSavedOpportunities(savedWithDetails as SavedOpportunity[]);
        } else {
          setSavedOpportunities([]);
        }
      } catch (error) {
        console.error('Error fetching saved opportunities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedOpportunities();
  }, [user]);

  const isSaved = (opportunityId: string) => {
    return savedOpportunities.some(saved => saved.opportunity_id === opportunityId);
  };

  const toggleSave = async (opportunityId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save opportunities",
        variant: "destructive",
      });
      return;
    }

    try {
      const isCurrentlySaved = isSaved(opportunityId);

      if (isCurrentlySaved) {
        // Remove save
        const { error } = await supabase
          .from('saved_opportunities')
          .delete()
          .eq('user_id', user.id)
          .eq('opportunity_id', opportunityId);

        if (error) throw error;

        setSavedOpportunities(prev => 
          prev.filter(saved => saved.opportunity_id !== opportunityId)
        );
        toast({ title: "Removed from saved opportunities" });
      } else {
        // Add save
        const { error } = await supabase
          .from('saved_opportunities')
          .insert({
            user_id: user.id,
            opportunity_id: opportunityId
          });

        if (error) throw error;
        
        toast({ title: "Saved opportunity" });
        
        // Refetch saved opportunities to get updated list
        const { data: savedData, error: fetchError } = await supabase
          .from('saved_opportunities')
          .select('id, opportunity_id, created_at')
          .eq('user_id', user.id)
          .eq('opportunity_id', opportunityId)
          .single();

        if (fetchError) throw fetchError;

        // Get opportunity details
        const { data: opportunityData, error: opError } = await supabase
          .from('opportunities')
          .select(`
            id,
            title,
            description,
            category,
            location,
            time_commitment,
            posted_at,
            organizations (
              name,
              id
            )
          `)
          .eq('id', opportunityId)
          .single();

        if (opError) throw opError;
        
        const newSavedOpportunity = {
          ...savedData,
          opportunity: {
            ...opportunityData,
            organization: opportunityData.organizations
          }
        };
        
        setSavedOpportunities(prev => [newSavedOpportunity as SavedOpportunity, ...prev]);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      toast({
        title: "Error",
        description: "Failed to update save status",
        variant: "destructive",
      });
    }
  };

  const removeSaved = async (opportunityId: string) => {
    await toggleSave(opportunityId);
  };

  return {
    savedOpportunities,
    loading,
    isSaved,
    toggleSave,
    removeSaved,
    canSave: !!user
  };
};