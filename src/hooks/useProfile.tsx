import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Organization = Database['public']['Tables']['organizations']['Row'];

export const profileQueryKey = (userId?: string) => ['profile', userId] as const;

/** Profile + organization for the signed-in user, cached and shared app-wide. */
export const useProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: profileQueryKey(user?.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .maybeSingle();
      if (error) throw error;

      let organization: Organization | null = null;
      if (profile?.role === 'volunteer_searcher') {
        const { data } = await supabase
          .from('organizations')
          .select('*')
          .eq('user_id', user!.id)
          .maybeSingle();
        organization = data;
      }
      return { profile, organization };
    },
  });

  const profile = query.data?.profile ?? null;
  const organization = query.data?.organization ?? null;

  const getDisplayName = () => {
    if (organization) return organization.name;
    const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim();
    if (name && name !== 'User') return name;
    const meta = user?.user_metadata ?? {};
    return meta.full_name || meta.name || user?.email || '';
  };

  return {
    profile,
    organization,
    loading: authLoading || (!!user && query.isLoading),
    error: query.error,
    getDisplayName,
    isOrganization: profile?.role === 'volunteer_searcher',
    hasOrganization: !!organization,
    isAdmin: profile?.role === 'admin',
    /** Signed in, profile loaded, but no role chosen yet (typically Google sign-ups). */
    needsRole: !!user && query.isSuccess && !profile?.role,
    /** Organization account without an organization record. */
    needsOrganization: profile?.role === 'volunteer_searcher' && query.isSuccess && !organization,
    refetch: () => queryClient.invalidateQueries({ queryKey: profileQueryKey(user?.id) }),
  };
};
