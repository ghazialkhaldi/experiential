import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/components/layout/AuthLayout';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type VolunteerCategory = Database['public']['Enums']['volunteer_category'];

const takeNext = () => {
  try {
    const next = localStorage.getItem('authNext');
    localStorage.removeItem('authNext');
    return next && next.startsWith('/') && !next.startsWith('//') ? next : '/';
  } catch {
    return '/';
  }
};

/**
 * Where email confirmation and Google sign-in land. Finishes any sign-up
 * details saved before confirmation, then routes to setup or onward.
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [failed, setFailed] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      // The session is parsed from the URL asynchronously; give it a moment.
      let session = (await supabase.auth.getSession()).data.session;
      for (let i = 0; !session && i < 10; i++) {
        await new Promise((r) => setTimeout(r, 300));
        session = (await supabase.auth.getSession()).data.session;
      }
      if (!session) {
        setFailed(true);
        return;
      }
      const userId = session.user.id;

      let pending: { preferences?: string[]; organizationData?: Record<string, unknown> | null } | null = null;
      try {
        pending = JSON.parse(localStorage.getItem('pendingSignupData') || 'null');
      } catch {
        pending = null;
      }

      if (pending?.preferences?.length) {
        const { error } = await supabase
          .from('volunteer_preferences')
          .insert(pending.preferences.map((category) => ({ user_id: userId, category: category as VolunteerCategory })));
        if (error) console.error('Error saving preferences:', error);
      }

      if (pending?.organizationData) {
        const { data: existing } = await supabase.from('organizations').select('id').eq('user_id', userId).maybeSingle();
        if (!existing) {
          const { error } = await supabase
            .from('organizations')
            .insert({ user_id: userId, ...(pending.organizationData as Database['public']['Tables']['organizations']['Insert']) });
          if (error) {
            console.error('Error saving organization:', error);
            // CompleteProfile picks this up and pre-fills the form.
            localStorage.setItem('incompleteOrgData', JSON.stringify(pending.organizationData));
          }
        }
      }
      localStorage.removeItem('pendingSignupData');

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
      await queryClient.invalidateQueries({ queryKey: ['profile'] });

      const next = takeNext();
      if (!profile?.role || localStorage.getItem('incompleteOrgData')) {
        navigate(`/complete-profile?next=${encodeURIComponent(next)}`, { replace: true });
      } else {
        navigate(next, { replace: true });
      }
    })().catch((err) => {
      console.error('Auth callback failed:', err);
      setFailed(true);
    });
  }, [navigate, queryClient]);

  if (failed) {
    return (
      <AuthLayout title="That link didn’t work" description="It may have expired or already been used. Sign in, or request a new link.">
        <Button asChild className="w-full" size="lg">
          <Link to="/auth">Go to sign in</Link>
        </Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Signing you in">
      <p className="flex items-center gap-2 text-muted-foreground" role="status">
        <Loader2 className="h-4 w-4 animate-spin" />
        Setting up your account…
      </p>
    </AuthLayout>
  );
};

export default AuthCallback;
