import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
}

const EMPTY: SubscriptionStatus = { subscribed: false, subscription_tier: null, subscription_end: null };

export const useSubscription = () => {
  const { user, session } = useAuth();

  const query = useQuery({
    queryKey: ['subscription', user?.id],
    enabled: !!user && !!session,
    staleTime: 10 * 60 * 1000,
    retry: false,
    queryFn: async (): Promise<SubscriptionStatus> => {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: { Authorization: `Bearer ${session!.access_token}` },
      });
      if (error) throw error;
      return {
        subscribed: !!data?.subscribed,
        subscription_tier: data?.subscription_tier ?? null,
        subscription_end: data?.subscription_end ?? null,
      };
    },
  });

  const openStripe = async (fn: 'create-checkout' | 'customer-portal', failure: string) => {
    if (!user || !session) {
      toast({ title: 'Sign in first', description: 'You need an account to manage Pro.', variant: 'destructive' });
      return;
    }
    // Open the tab synchronously so popup blockers allow it, then point it at Stripe.
    const tab = window.open('', '_blank');
    try {
      const { data, error } = await supabase.functions.invoke(fn, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error || !data?.url) throw error ?? new Error('No URL returned');
      if (tab) tab.location.href = data.url;
      else window.location.href = data.url;
    } catch (error) {
      tab?.close();
      console.error(`Error calling ${fn}:`, error);
      toast({ title: failure, description: 'Please try again in a moment.', variant: 'destructive' });
    }
  };

  return {
    ...(query.data ?? EMPTY),
    loading: !!user && query.isLoading,
    checkSubscription: () => query.refetch(),
    createCheckoutSession: () => openStripe('create-checkout', "Couldn't start checkout"),
    manageSubscription: () => openStripe('customer-portal', "Couldn't open billing portal"),
  };
};
