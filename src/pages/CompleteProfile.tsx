import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import AuthLayout from '@/components/layout/AuthLayout';
import OrganizationSetup from '@/components/OrganizationSetup';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Role = 'volunteer' | 'volunteer_searcher';

const splitName = (meta: Record<string, string | undefined>) => {
  if (meta.first_name || meta.given_name) return [meta.first_name || meta.given_name || '', meta.last_name || meta.family_name || ''];
  const full = (meta.full_name || meta.name || '').trim();
  const [first = '', ...rest] = full.split(/\s+/);
  return [first, rest.join(' ')];
};

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next')?.startsWith('/') ? params.get('next')! : '/';
  const { user, loading: authLoading } = useAuth();
  const { profile, needsRole, needsOrganization, loading, refetch } = useProfile();
  const { toast } = useToast();

  const [role, setRole] = useState<Role | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth?next=/complete-profile', { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    const [f, l] = splitName(user.user_metadata ?? {});
    const fromProfile = profile?.first_name && profile.first_name !== user.email?.split('@')[0];
    setFirstName((v) => v || (fromProfile ? profile!.first_name : f));
    setLastName((v) => v || profile?.last_name || l);
  }, [user, profile]);

  // Nothing left to do: move on.
  useEffect(() => {
    if (!loading && user && profile && !needsRole && !needsOrganization) navigate(next, { replace: true });
  }, [loading, user, profile, needsRole, needsOrganization, navigate, next]);

  const saveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!role) return setError('Choose how you’ll use Experiential.');
    if (!firstName.trim()) return setError('Add your first name.');
    setBusy(true);
    const { error } = await supabase.from('profiles').upsert(
      {
        id: user!.id,
        email: user!.email,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        birthday: profile?.birthday ?? '1990-01-01',
        role,
      },
      { onConflict: 'id' }
    );
    setBusy(false);
    if (error) {
      console.error('Profile update failed:', error);
      return setError('We couldn’t save that. Please try again.');
    }
    await refetch();
    if (role === 'volunteer') toast({ title: 'You’re all set', description: 'Start by finding an opportunity near you.' });
  };

  if (authLoading || loading || !user) {
    return (
      <AuthLayout title="Finish setting up">
        <Skeleton className="h-40 w-full" />
      </AuthLayout>
    );
  }

  if (needsOrganization) {
    return (
      <AuthLayout title="Add your organization" description="Students see this on your listings. You can post as soon as it’s saved.">
        <OrganizationSetup
          onComplete={async () => {
            await refetch();
            toast({ title: 'Organization saved', description: 'You can post your first opportunity now.' });
            navigate('/post-opportunity', { replace: true });
          }}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Finish setting up" description="One quick step so we can show you the right tools.">
      <form onSubmit={saveRole} className="space-y-5" noValidate>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">I want to…</legend>
          <div className="grid grid-cols-2 gap-2" role="radiogroup">
            {(
              [
                { value: 'volunteer', label: 'Volunteer', hint: 'Find opportunities and track hours' },
                { value: 'volunteer_searcher', label: 'Recruit volunteers', hint: 'Post opportunities for your organization' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={role === opt.value}
                onClick={() => setRole(opt.value)}
                className={cn(
                  'flex flex-col items-start gap-1 rounded-lg border p-3.5 text-left transition-colors',
                  role === opt.value ? 'border-primary bg-accent ring-1 ring-primary' : 'border-input bg-card hover:border-primary/40'
                )}
              >
                <span className="text-sm font-semibold">{opt.label}</span>
                <span className="text-xs text-muted-foreground">{opt.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="cp-first">First name</Label>
            <Input id="cp-first" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cp-last">Last name</Label>
            <Input id="cp-last" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={busy}>
          {busy ? 'Saving…' : 'Continue'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default CompleteProfile;
