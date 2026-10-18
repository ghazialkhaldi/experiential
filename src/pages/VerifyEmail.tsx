import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/components/layout/AuthLayout';
import { supabase } from '@/integrations/supabase/client';

/** Shown right after sign-up: confirm via the emailed link, with a resend option. */
const VerifyEmail = () => {
  const [params] = useSearchParams();
  const email = params.get('email') ?? '';
  const [cooldown, setCooldown] = useState(0);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const resend = async () => {
    setStatus(null);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setStatus('We couldn’t resend just now. Wait a minute and try again.');
      return;
    }
    setStatus('Sent. It can take a minute to arrive.');
    setCooldown(60);
  };

  return (
    <AuthLayout
      title="Check your email"
      description={
        email ? (
          <>
            We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>. Open it to finish
            creating your account.
          </>
        ) : (
          'We sent you a confirmation link. Open it to finish creating your account.'
        )
      }
      footer={
        <Link to="/auth" className="font-semibold text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <div className="rounded-lg border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Don’t see it? Check spam or promotions. The link expires after 24 hours.
        </p>
        {email && (
          <Button variant="outline" className="mt-4 w-full" onClick={resend} disabled={cooldown > 0}>
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend email'}
          </Button>
        )}
        {status && (
          <p className="mt-3 text-sm text-muted-foreground" role="status">
            {status}
          </p>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
