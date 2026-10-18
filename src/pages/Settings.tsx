import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PageShell, PageHeader, RequireAuth, ListSkeleton } from '@/components/layout/PageShell';
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

interface Preferences {
  new_opportunities: boolean;
  application_updates: boolean;
  reminders: boolean;
  achievements: boolean;
  email_notifications: boolean;
}

const DEFAULT_PREFS: Preferences = {
  new_opportunities: true,
  application_updates: true,
  reminders: true,
  achievements: true,
  email_notifications: true,
};

const PREF_ROWS: { key: keyof Preferences; title: string; description: string }[] = [
  { key: 'application_updates', title: 'Application updates', description: 'When an organization accepts or reviews your application.' },
  { key: 'new_opportunities', title: 'New opportunities', description: 'When opportunities matching your interests are posted.' },
  { key: 'reminders', title: 'Reminders', description: 'Upcoming start dates and deadlines.' },
  { key: 'achievements', title: 'Milestones', description: 'When you reach an hour goal.' },
  { key: 'email_notifications', title: 'Email me too', description: 'Send important updates to your inbox as well as in the app.' },
];

const Section = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
  <section className="grid gap-6 border-t border-border py-8 md:grid-cols-[14rem_1fr] md:gap-10">
    <div>
      <h2 className="font-sans text-base font-semibold tracking-tight">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
    <div className="min-w-0">{children}</div>
  </section>
);

const SettingsBody = () => {
  const { user } = useAuth();
  const { profile, organization, isOrganization, loading, refetch } = useProfile();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.first_name ?? '');
    setLastName(profile.last_name ?? '');
    if (profile.notification_preferences && typeof profile.notification_preferences === 'object') {
      setPrefs({ ...DEFAULT_PREFS, ...(profile.notification_preferences as Partial<Preferences>) });
    }
  }, [profile]);

  if (loading) return <ListSkeleton rows={3} />;

  const saveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingName(true);
    const { error } = await supabase
      .from('profiles')
      .update({ first_name: firstName.trim(), last_name: lastName.trim() })
      .eq('id', user!.id);
    setSavingName(false);
    if (error) return toast({ title: 'Couldn’t save your name', variant: 'destructive' });
    refetch();
    toast({ title: 'Name updated' });
  };

  // Each switch saves immediately; revert on failure.
  const togglePref = async (key: keyof Preferences, value: boolean) => {
    const previous = prefs;
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    const { error } = await supabase
      .from('profiles')
      .update({ notification_preferences: next as unknown as Record<string, boolean> })
      .eq('id', user!.id);
    if (error) {
      setPrefs(previous);
      toast({ title: 'Couldn’t save that setting', description: 'Please try again.', variant: 'destructive' });
    }
  };

  const nameChanged = firstName.trim() !== (profile?.first_name ?? '') || lastName.trim() !== (profile?.last_name ?? '');

  return (
    <div>
      <Section title="Profile" description="How organizations see you when you apply.">
        <form onSubmit={saveName} className="max-w-md space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="set-first">First name</Label>
              <Input id="set-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="set-last">Last name</Label>
              <Input id="set-last" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="set-email">Email</Label>
            <Input id="set-email" value={user?.email ?? ''} disabled />
          </div>
          <Button type="submit" variant="secondary" disabled={!nameChanged || savingName}>
            {savingName ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </Section>

      {isOrganization && (
        <Section title="Organization" description="Shown on every opportunity you post.">
          {organization ? (
            <div className="max-w-md text-sm">
              <p className="font-semibold">{organization.name}</p>
              <p className="mt-1 text-muted-foreground">
                {organization.address_line1}, {organization.city}, {organization.state} {organization.zip_code}
              </p>
            </div>
          ) : (
            <Button asChild>
              <Link to="/complete-profile">Add organization details</Link>
            </Button>
          )}
        </Section>
      )}

      <Section title="Notifications" description="Changes save automatically.">
        <ul className="max-w-xl divide-y divide-border">
          {PREF_ROWS.map((row) => (
            <li key={row.key} className="flex items-start justify-between gap-6 py-4 first:pt-0">
              <div>
                <Label htmlFor={`pref-${row.key}`} className="text-sm font-medium">
                  {row.title}
                </Label>
                <p className="mt-0.5 text-sm text-muted-foreground">{row.description}</p>
              </div>
              <Switch id={`pref-${row.key}`} checked={prefs[row.key]} onCheckedChange={(v) => togglePref(row.key, v)} />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Security">
        {user?.app_metadata?.provider === 'google' ? (
          <p className="text-sm text-muted-foreground">You sign in with Google, so there’s no password to manage here.</p>
        ) : (
          <ChangePasswordDialog>
            <Button variant="outline">Change password</Button>
          </ChangePasswordDialog>
        )}
      </Section>

      <Section title="Plan & billing">
        <Link
          to="/billing"
          className="flex max-w-md items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary/40"
        >
          Manage your plan
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </Section>
    </div>
  );
};

const Settings = () => (
  <PageShell width="narrow">
    <PageHeader title="Settings" />
    <RequireAuth message="Sign in to manage your account.">
      <SettingsBody />
    </RequireAuth>
  </PageShell>
);

export default Settings;
