import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from './useSubscription';
import { OPPORTUNITIES_KEY } from './useOpportunities';

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  opportunity_id: string;
  user_id: string;
  applicant_email: string;
  applicant_name: string;
  message: string | null;
  resume_url: string | null;
  status: string;
  is_pro_user: boolean | null;
  applied_at: string;
  updated_at: string;
  opportunity?: {
    id: string;
    title: string;
    location: string;
    start_date: string | null;
    end_date: string | null;
    organization: { name: string } | null;
  } | null;
}

const APPLICATIONS_KEY = 'applications';

/**
 * Applications visible to the current user. Row-level security scopes this:
 * volunteers see their own; organizations see applications to their postings.
 * The query is shared, so a status change anywhere updates every list.
 */
export const useApplications = () => {
  const { user } = useAuth();
  const { subscribed } = useSubscription();
  const queryClient = useQueryClient();
  const key = [APPLICATIONS_KEY, user?.id];

  const query = useQuery({
    queryKey: key,
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities (
            id, title, location, start_date, end_date,
            organization:organizations ( name )
          )
        `)
        .order('is_pro_user', { ascending: false })
        .order('applied_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Application[];
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [APPLICATIONS_KEY] });

  const applyToOpportunity = async (input: {
    opportunityId: string;
    name: string;
    email: string;
    message?: string;
    resumeUrl?: string | null;
  }) => {
    if (!user) throw new Error('Sign in to apply.');
    const { error } = await supabase.from('applications').insert({
      opportunity_id: input.opportunityId,
      user_id: user.id,
      applicant_name: input.name,
      applicant_email: input.email,
      message: input.message || null,
      resume_url: input.resumeUrl || null,
      is_pro_user: subscribed,
    });
    if (error) {
      if (error.code === '23505') throw new Error('You’ve already applied to this opportunity.');
      throw error;
    }
    await invalidate();
  };

  const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus) => {
    const { error } = await supabase.from('applications').update({ status }).eq('id', applicationId);
    if (error) throw error;
    await invalidate();
    // Accepting changes the volunteer count shown on the opportunity.
    queryClient.invalidateQueries({ queryKey: [OPPORTUNITIES_KEY] });
  };

  const applications = query.data ?? [];

  return {
    applications,
    loading: !!user && query.isLoading,
    error: query.error ? 'We couldn’t load applications.' : null,
    applyToOpportunity,
    updateApplicationStatus,
    hasApplied: (opportunityId: string) =>
      applications.some((a) => a.opportunity_id === opportunityId && a.user_id === user?.id),
    refetch: invalidate,
  };
};
