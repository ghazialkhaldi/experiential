import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ExperientialLogo from '@/components/ExperientialLogo';

/** Focused, chrome-free layout for sign-in and account setup steps. */
const AuthLayout = ({ title, description, children, footer }: { title: string; description?: ReactNode; children: ReactNode; footer?: ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <header className="container flex h-16 items-center">
      <Link to="/" aria-label="Experiential home" className="rounded-sm">
        <ExperientialLogo height={28} />
      </Link>
    </header>
    <main id="main" className="flex flex-1 items-start justify-center px-4 pb-16 pt-6 sm:pt-12">
      <div className="w-full max-w-[26rem]">
        <h1 className="text-[1.75rem] font-semibold leading-tight">{title}</h1>
        {description && <p className="mt-2 text-muted-foreground">{description}</p>}
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </main>
    <footer className="container flex flex-wrap justify-center gap-5 pb-6 text-xs text-muted-foreground">
      <Link to="/terms" className="hover:text-foreground">Terms</Link>
      <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
    </footer>
  </div>
);

export default AuthLayout;
