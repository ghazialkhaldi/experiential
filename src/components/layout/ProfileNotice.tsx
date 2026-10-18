import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

/**
 * A single, consistent prompt for accounts that still need setup
 * (usually Google sign-ups with no role yet, or organizations with no
 * organization record). Replaces the sidebar card and dismissable alert.
 */
const ProfileNotice = () => {
  const { needsRole, needsOrganization } = useProfile();
  const { pathname } = useLocation();

  if ((!needsRole && !needsOrganization) || pathname.startsWith('/complete-profile')) return null;

  return (
    <div className="border-b border-warning/20 bg-warning-soft">
      <div className="container flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
        <p className="text-foreground">
          {needsRole
            ? 'Finish setting up your account to apply and track hours.'
            : 'Add your organization details to start posting opportunities.'}
        </p>
        <Link to="/complete-profile" className="inline-flex items-center gap-1 font-semibold text-foreground underline-offset-4 hover:underline">
          Finish setup
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default ProfileNotice;
