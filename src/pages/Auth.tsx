import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/components/layout/AuthLayout';
import PasswordChecklist from '@/components/PasswordChecklist';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CATEGORIES, ORGANIZATION_CATEGORIES } from '@/lib/opportunities';
import { isPasswordValid } from '@/lib/password';
import { cn } from '@/lib/utils';

type Mode = 'signin' | 'signup' | 'forgot';
type Role = 'volunteer' | 'volunteer_searcher';

const safeNext = (next: string | null) => (next && next.startsWith('/') && !next.startsWith('//') ? next : '/');

const ageFrom = (birthday: string) => {
  const b = new Date(birthday);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) age--;
  return age;
};

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const Auth = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const next = safeNext(params.get('next'));
  const mode: Mode = params.get('mode') === 'signup' ? 'signup' : params.get('mode') === 'forgot' ? 'forgot' : 'signin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Sign-up fields
  const [role, setRole] = useState<Role | null>(params.get('role') === 'organization' ? 'volunteer_searcher' : null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [org, setOrg] = useState({ name: '', category: '', description: '', address: '', city: '', state: '', zip: '' });
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate(next, { replace: true });
  }, [authLoading, user, navigate, next]);

  const switchMode = (m: Mode) => {
    setError(null);
    setNotice(null);
    const p = new URLSearchParams(params);
    if (m === 'signin') p.delete('mode');
    else p.set('mode', m);
    setParams(p, { replace: true });
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      setError(
        error.message.toLowerCase().includes('email not confirmed')
          ? 'Confirm your email first. Check your inbox for the link we sent.'
          : 'That email and password don’t match. Try again or reset your password.'
      );
      return;
    }
    navigate(next, { replace: true });
  };

  const google = async () => {
    setError(null);
    setBusy(true);
    try {
      localStorage.setItem('authNext', next);
    } catch {
      // Redirect target will fall back to home.
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setBusy(false);
      setError('Google sign-in didn’t start. Please try again.');
    }
  };

  const forgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) {
      setError('We couldn’t send the reset email. Check the address and try again.');
      return;
    }
    setNotice(`If an account exists for ${email.trim()}, a reset link is on its way.`);
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!role) return setError('Choose how you’ll use Experiential.');
    if (!isPasswordValid(password)) return setError('Your password doesn’t meet the requirements yet.');
    if (role === 'volunteer' && !birthday) return setError('Add your birthday.');
    if (role === 'volunteer_searcher' && (!org.name.trim() || !org.address.trim() || !org.city.trim() || !org.state.trim() || !org.zip.trim()))
      return setError('Fill in your organization’s name and full address.');
    if (!accepted) return setError('Please accept the Terms and Privacy Policy.');

    setBusy(true);
    const userData = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      ...(birthday ? { birthday } : {}),
      role,
      ...(role === 'volunteer' && birthday ? { age: String(ageFrom(birthday)) } : {}),
    };
    // Finished by /auth/callback after the user confirms their email.
    try {
      localStorage.setItem(
        'pendingSignupData',
        JSON.stringify({
          preferences: role === 'volunteer' ? interests : [],
          organizationData:
            role === 'volunteer_searcher'
              ? {
                  name: org.name.trim(),
                  category: org.category || null,
                  description: org.description.trim() || null,
                  address_line1: org.address.trim(),
                  city: org.city.trim(),
                  state: org.state.trim(),
                  zip_code: org.zip.trim(),
                }
              : null,
        })
      );
      localStorage.setItem('authNext', next);
    } catch {
      // Org details can still be added from Complete profile.
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: userData, emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setBusy(false);

    if (error || !data.user) {
      localStorage.removeItem('pendingSignupData');
      setError(error?.message ?? 'Your account couldn’t be created. Please try again.');
      return;
    }
    navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`);
  };

  if (mode === 'forgot') {
    return (
      <AuthLayout
        title="Reset your password"
        description="Enter the email you signed up with and we’ll send a reset link."
        footer={
          <button onClick={() => switchMode('signin')} className="font-semibold text-primary hover:underline">
            Back to sign in
          </button>
        }
      >
        {notice ? (
          <p className="rounded-md bg-success-soft px-4 py-3 text-sm text-success" role="status">
            {notice}
          </p>
        ) : (
          <form onSubmit={forgot} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            <Button type="submit" className="w-full" size="lg" disabled={busy || !email.trim()}>
              {busy ? 'Sending…' : 'Send reset link'}
            </Button>
          </form>
        )}
      </AuthLayout>
    );
  }

  if (mode === 'signin') {
    return (
      <AuthLayout
        title="Welcome back"
        description="Sign in to apply, save opportunities, and log your hours."
        footer={
          <>
            New to Experiential?{' '}
            <button onClick={() => switchMode('signup')} className="font-semibold text-primary hover:underline">
              Create an account
            </button>
          </>
        }
      >
        <Button type="button" variant="outline" size="lg" className="w-full" onClick={google} disabled={busy}>
          <GoogleIcon />
          Continue with Google
        </Button>
        <Divider />
        <form onSubmit={signIn} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button type="button" onClick={() => switchMode('forgot')} className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </button>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Free for students and organizations."
      footer={
        <>
          Already have an account?{' '}
          <button onClick={() => switchMode('signin')} className="font-semibold text-primary hover:underline">
            Sign in
          </button>
        </>
      }
    >
      <form onSubmit={signUp} className="space-y-5" noValidate>
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

        {role === 'volunteer' && (
          <Button type="button" variant="outline" size="lg" className="w-full" onClick={google} disabled={busy}>
            <GoogleIcon />
            Sign up with Google
          </Button>
        )}

        {role && (
          <>
            {role === 'volunteer' && <Divider />}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby="password-rules"
                required
              />
              <PasswordChecklist password={password} id="password-rules" />
            </div>

            {role === 'volunteer' ? (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="birthday">Birthday</Label>
                  <Input
                    id="birthday"
                    type="date"
                    max={new Date().toISOString().slice(0, 10)}
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Some opportunities have age requirements.</p>
                </div>
                <fieldset>
                  <legend className="mb-2 text-sm font-medium">
                    Causes you care about <span className="font-normal text-muted-foreground">(optional)</span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => {
                      const on = interests.includes(c.value);
                      return (
                        <button
                          key={c.value}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setInterests((prev) => (on ? prev.filter((v) => v !== c.value) : [...prev, c.value]))}
                          className={cn(
                            'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                            on ? 'border-primary bg-accent text-accent-foreground' : 'border-input bg-card text-muted-foreground hover:text-foreground'
                          )}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </>
            ) : (
              <fieldset className="space-y-3 border-t border-border pt-5">
                <legend className="sr-only">Organization</legend>
                <p className="text-sm font-semibold">Your organization</p>
                <div className="space-y-1.5">
                  <Label htmlFor="orgName">Name</Label>
                  <Input id="orgName" autoComplete="organization" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="orgCategory">
                    Focus <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Select value={org.category} onValueChange={(v) => setOrg({ ...org, category: v })}>
                    <SelectTrigger id="orgCategory">
                      <SelectValue placeholder="Choose one" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORGANIZATION_CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="orgAddress">Street address</Label>
                  <Input id="orgAddress" autoComplete="address-line1" value={org.address} onChange={(e) => setOrg({ ...org, address: e.target.value })} required />
                </div>
                <div className="grid grid-cols-[1fr_5rem_6rem] gap-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="orgCity">City</Label>
                    <Input id="orgCity" autoComplete="address-level2" value={org.city} onChange={(e) => setOrg({ ...org, city: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="orgState">State</Label>
                    <Input id="orgState" autoComplete="address-level1" value={org.state} onChange={(e) => setOrg({ ...org, state: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="orgZip">ZIP</Label>
                    <Input id="orgZip" autoComplete="postal-code" inputMode="numeric" value={org.zip} onChange={(e) => setOrg({ ...org, zip: e.target.value })} required />
                  </div>
                </div>
              </fieldset>
            )}

            <label htmlFor="terms" className="flex cursor-pointer items-start gap-3 text-sm">
              <Checkbox id="terms" checked={accepted} onCheckedChange={(c) => setAccepted(c === true)} className="mt-0.5" />
              <span className="text-muted-foreground">
                I agree to the{' '}
                <Link to="/terms" target="_blank" className="font-medium text-foreground underline">
                  Terms
                </Link>{' '}
                and{' '}
                <Link to="/privacy" target="_blank" className="font-medium text-foreground underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            <Button type="submit" className="w-full" size="lg" disabled={busy}>
              {busy ? 'Creating account…' : 'Create account'}
            </Button>
          </>
        )}
      </form>
    </AuthLayout>
  );
};

const Divider = () => (
  <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
    <span className="h-px flex-1 bg-border" />
    or with email
    <span className="h-px flex-1 bg-border" />
  </div>
);

export default Auth;
