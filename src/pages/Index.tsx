import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/layout/SiteHeader';
import ProfileNotice from '@/components/layout/ProfileNotice';
import { EmptyState } from '@/components/layout/PageShell';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import HeroMap from '@/components/hero-map/HeroMap';
import OpportunityCard, { OpportunityCardSkeleton } from '@/components/OpportunityCard';
import { useOpportunities, sortOpportunities } from '@/hooks/useOpportunities';
import { useLocation, describePlace } from '@/hooks/useLocation';
import { useSavedOpportunities } from '@/hooks/useSavedOpportunities';
import { useProfile } from '@/hooks/useProfile';

const STEPS = [
  {
    title: 'Find something local',
    body: 'Search by town and cause. Tutoring, food banks, shelters, clinics, cleanups.',
    to: '/search',
    cta: 'Browse opportunities',
  },
  {
    title: 'Apply in a minute',
    body: 'One short form, with your resume attached when an organization asks for it.',
    to: '/my-applications',
    cta: 'See your applications',
  },
  {
    title: 'Log every hour',
    body: 'Keep a dated record of where you served and for how long, ready to export.',
    to: '/track-hours',
    cta: 'Track hours',
  },
  {
    title: 'Turn it into a resume',
    body: 'Build a clean, one-page resume from the work you’ve done, then download it as a PDF.',
    to: '/resume-builder',
    cta: 'Open resume builder',
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { location } = useLocation();
  const { opportunities, loading, error } = useOpportunities({ origin: location, limit: location ? 30 : 6 });
  const { isSaved, toggleSave } = useSavedOpportunities();
  const { isOrganization } = useProfile();

  const featured = sortOpportunities(opportunities, location ? 'closest' : 'newest').slice(0, 6);
  const place = describePlace(location);

  const handleSearch = (q: string, category: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (category !== 'all') params.set('category', category);
    navigate(`/search${params.toString() ? `?${params}` : ''}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <ProfileNotice />

      <main id="main" className="flex-1">
        {/* Hero: an aerial map of Port Credit fills the section; copy sits over it */}
        <section className="relative isolate overflow-hidden bg-brand-field text-white">
          <HeroMap className="-z-20" />
          {/* Keep the copy legible: solid on the left, opening up over the map to the right */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,hsl(var(--blue-field)/0.92)_0%,hsl(var(--blue-field)/0.72)_45%,hsl(var(--blue-field)/0.15)_100%)] lg:bg-[linear-gradient(90deg,hsl(var(--blue-field))_0%,hsl(var(--blue-field)/0.9)_34%,hsl(var(--blue-field)/0.25)_62%,transparent_80%)]"
          />
          <div className="container pb-[22rem] pt-14 sm:pb-[24rem] md:pt-20 lg:min-h-[44rem] lg:pb-24 lg:pt-28">
            <div className="max-w-xl">
              <h1 className="animate-rise-in text-[2.6rem] font-bold leading-[1.04] tracking-[-0.03em] text-white sm:text-6xl lg:text-[4.5rem]">
                Volunteer work that <span className="brand-period">counts</span>
              </h1>
              <p className="mt-5 animate-rise-in text-lg leading-8 text-ink-foreground/85 [animation-delay:80ms]">
                Find local opportunities, apply in a few clicks, and keep a clean record of your hours for college
                applications.
              </p>
              <SearchBar
                stacked
                onSearch={handleSearch}
                className="mt-9 animate-rise-in border-white/10 shadow-[0_24px_48px_-16px_hsl(var(--blue-field-deep)/0.8)] [animation-delay:160ms]"
              />
            </div>
          </div>
          <p className="absolute bottom-3 right-4 text-[11px] text-white/55">
            Port Credit, Mississauga · Map data ©{' '}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-white hover:underline">
              OpenStreetMap
            </a>
          </p>
        </section>

        {/* Listings */}
        <section className="container py-14 md:py-20" aria-labelledby="latest-heading">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="latest-heading" className="text-2xl font-semibold md:text-3xl">
                {place ? `Near ${place}` : 'Latest opportunities'}
              </h2>
              <p className="mt-1.5 text-muted-foreground">
                {place ? 'Closest first, based on your location.' : 'Set a location in the search bar to see what’s closest.'}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/search">
                View all
                <ArrowRight />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <OpportunityCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <EmptyState title="Opportunities are unavailable" description={`${error} Please check back shortly.`} />
          ) : featured.length === 0 ? (
            <EmptyState
              title="No opportunities posted yet"
              description="New listings from local organizations will appear here."
              action={
                isOrganization ? (
                  <Button asChild>
                    <Link to="/post-opportunity">Post the first one</Link>
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((o) => (
                <OpportunityCard key={o.id} opportunity={o} isSaved={isSaved(o.id)} onToggleSave={toggleSave} />
              ))}
            </div>
          )}
        </section>

        {/* What an account gives you */}
        <section className="border-y border-brand-line/15 bg-brand-wash" aria-labelledby="how-heading">
          <div className="container grid gap-12 py-16 md:py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="max-w-md">
              <h2 id="how-heading" className="text-3xl font-semibold leading-tight md:text-4xl">
                From first shift to application essay
              </h2>
              <p className="mt-4 text-muted-foreground">
                Experiential keeps the whole record in one place, so when an application asks what you did and for how
                long, the answer is already written down.
              </p>
              <Button className="mt-7" size="lg" asChild>
                <Link to="/auth?mode=signup">Create a free account</Link>
              </Button>
            </div>

            <ol className="relative">
              {STEPS.map((step, i) => (
                <li key={step.title} className="relative grid grid-cols-[2.5rem_1fr] gap-x-5 pb-10 last:pb-0">
                  {i < STEPS.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-[1.25rem] top-11 h-[calc(100%-2.75rem)] w-0 -translate-x-1/2 border-l-2 border-dotted border-brand-line/60"
                    />
                  )}
                  <span className="tabular relative grid h-10 w-10 place-items-center rounded-full bg-brand-field text-sm font-semibold text-white ring-4 ring-brand-wash">
                    {i + 1}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-1 text-muted-foreground">{step.body}</p>
                    <Link
                      to={step.to}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      {step.cta}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Organizations */}
        <section className="container py-16 md:py-20" aria-labelledby="org-heading">
          <div className="grid gap-6 border-t border-border pt-10 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-xl">
              <h2 id="org-heading" className="text-2xl font-semibold md:text-3xl">
                Running a nonprofit, library, or shelter?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Post an opportunity for free. Applicants come to one list, with their resumes attached, and you accept or
                decline each one with a click.
              </p>
            </div>
            <Button size="lg" asChild>
              <Link to={isOrganization ? '/post-opportunity' : '/auth?mode=signup&role=organization'}>
                Post an opportunity
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
