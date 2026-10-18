import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, CalendarDays, Clock, Globe, MapPin, Share2, Tag, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { PageShell, EmptyState } from '@/components/layout/PageShell';
import ResumeUpload from '@/components/ResumeUpload';
import { useOpportunity } from '@/hooks/useOpportunities';
import { useApplications } from '@/hooks/useApplications';
import { useSavedOpportunities } from '@/hooks/useSavedOpportunities';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { categoryLabel, formatDate, formatTimeAgo, parseDate, spotsLeft } from '@/lib/opportunities';
import { cn } from '@/lib/utils';

const OpportunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: opportunity, isLoading, error } = useOpportunity(id);
  const { isSaved, toggleSave } = useSavedOpportunities();
  const { hasApplied } = useApplications();
  const { toast } = useToast();

  useEffect(() => {
    if (opportunity) document.title = `${opportunity.title} · Experiential`;
    return () => {
      document.title = 'Experiential - Find Volunteer Opportunities Near You';
    };
  }, [opportunity]);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: opportunity?.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast({ title: 'Link copied' });
      }
    } catch {
      // Share sheet dismissed.
    }
  };

  if (isLoading) {
    return (
      <PageShell width="narrow">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-6 h-10 w-3/4" />
        <Skeleton className="mt-3 h-5 w-1/3" />
        <Skeleton className="mt-10 h-40 w-full" />
      </PageShell>
    );
  }

  if (error || !opportunity) {
    return (
      <PageShell width="narrow">
        <EmptyState
          title={error ? 'This opportunity couldn’t load' : 'Opportunity not found'}
          description={error ? 'Please try again in a moment.' : 'It may have been filled or removed by the organization.'}
          action={
            <Button asChild>
              <Link to="/search">Browse opportunities</Link>
            </Button>
          }
        />
      </PageShell>
    );
  }

  const o = opportunity;
  const spots = spotsLeft(o);
  const saved = isSaved(o.id);
  const deadline = (o as { expires_at?: string | null }).expires_at;
  const ended = o.end_date ? parseDate(o.end_date) < new Date(new Date().toDateString()) : false;
  const closed = o.is_active === false || spots === 0 || ended || (!!deadline && new Date(deadline) < new Date());

  return (
    <PageShell>
      <button
        onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/search'))}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
        <article className="min-w-0">
          <h1 className="text-3xl font-semibold leading-tight md:text-[2.5rem]">{o.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{o.organization?.name}</p>

          <dl className="mt-6 grid gap-x-6 gap-y-3 border-y border-border py-5 text-sm sm:grid-cols-2">
            <Fact icon={Tag} label="Category">{categoryLabel(o.category)}</Fact>
            <Fact icon={MapPin} label="Location">{o.location}</Fact>
            <Fact icon={Clock} label="Time commitment">{o.time_commitment}</Fact>
            {(o.start_date || o.end_date) && (
              <Fact icon={CalendarDays} label="Dates">
                {o.start_date ? formatDate(o.start_date) : 'Flexible'}
                {o.end_date && ` – ${formatDate(o.end_date)}`}
              </Fact>
            )}
            {deadline && (
              <Fact icon={CalendarDays} label="Apply by">{formatDate(deadline)}</Fact>
            )}
            {spots !== null && (
              <Fact icon={Users} label="Spots">
                <span className={cn('tabular', spots === 0 && 'text-destructive')}>
                  {spots === 0 ? 'Full' : `${spots} of ${o.max_volunteers} open`}
                </span>
              </Fact>
            )}
          </dl>

          <Button asChild size="lg" className="mt-5 w-full lg:hidden">
            <a href="#apply">{hasApplied(o.id) ? 'View application status' : closed ? 'Applications closed' : 'Apply'}</a>
          </Button>

          <section className="mt-8">
            <h2 className="font-sans text-lg font-semibold tracking-tight">About this opportunity</h2>
            <p className="mt-3 max-w-[68ch] whitespace-pre-line leading-7 text-foreground/90">{o.description}</p>
          </section>

          {o.requirements && (
            <section className="mt-8">
              <h2 className="font-sans text-lg font-semibold tracking-tight">Requirements</h2>
              <p className="mt-3 max-w-[68ch] whitespace-pre-line leading-7 text-foreground/90">{o.requirements}</p>
            </section>
          )}

          {o.organization?.description && (
            <section className="mt-8 rounded-lg bg-muted/60 p-5">
              <h2 className="font-sans text-base font-semibold tracking-tight">About {o.organization.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{o.organization.description}</p>
              {o.organization.website && (
                <a
                  href={o.organization.website.startsWith('http') ? o.organization.website : `https://${o.organization.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" />
                  Website
                </a>
              )}
            </section>
          )}

          <p className="mt-8 text-sm text-muted-foreground">Posted {formatTimeAgo(o.posted_at)}</p>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => toggleSave(o.id)}
              aria-pressed={saved}
            >
              <Bookmark className={cn(saved && 'fill-current text-primary')} />
              {saved ? 'Saved' : 'Save'}
            </Button>
            <Button variant="outline" className="flex-1" onClick={share}>
              <Share2 />
              Share
            </Button>
          </div>
          <div id="apply" className="mt-4 scroll-mt-24 rounded-lg border border-border bg-card p-5 shadow-card">
            <ApplyPanel opportunityId={o.id} resumeRequired={!!o.resume_required} closed={closed} />
          </div>
        </aside>
      </div>
    </PageShell>
  );
};

const Fact = ({ icon: Icon, label, children }: { icon: typeof MapPin; label: string; children: React.ReactNode }) => (
  <div className="flex gap-2.5">
    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  </div>
);

const ApplyPanel = ({ opportunityId, resumeRequired, closed }: { opportunityId: string; resumeRequired: boolean; closed: boolean }) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, isOrganization, getDisplayName } = useProfile();
  const { applyToOpportunity, hasApplied, loading } = useApplications();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEmail((e) => e || user.email || '');
      setName((n) => n || (profile ? getDisplayName() : ''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile]);

  if (authLoading || (user && loading)) return <Skeleton className="h-32 w-full" />;

  if (!user) {
    return (
      <div>
        <h2 className="font-sans text-lg font-semibold tracking-tight">Interested?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Create a free account to apply and keep track of your hours.</p>
        <div className="mt-4 grid gap-2">
          <Button asChild>
            <Link to={`/auth?mode=signup&next=/opportunity/${opportunityId}`}>Create account to apply</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to={`/auth?next=/opportunity/${opportunityId}`}>I already have an account</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (hasApplied(opportunityId)) {
    return (
      <div>
        <h2 className="font-sans text-lg font-semibold tracking-tight">You’ve applied</h2>
        <p className="mt-1 text-sm text-muted-foreground">The organization will reach out by email if you’re selected.</p>
        <Button variant="outline" className="mt-4 w-full" asChild>
          <Link to="/my-applications">View my applications</Link>
        </Button>
      </div>
    );
  }

  if (closed) {
    return (
      <div>
        <h2 className="font-sans text-lg font-semibold tracking-tight">Applications closed</h2>
        <p className="mt-1 text-sm text-muted-foreground">This opportunity is full or no longer accepting volunteers.</p>
        <Button variant="outline" className="mt-4 w-full" asChild>
          <Link to="/search">Find similar opportunities</Link>
        </Button>
      </div>
    );
  }

  if (isOrganization) {
    return <p className="text-sm text-muted-foreground">You’re signed in as an organization. Volunteers apply from this page.</p>;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim() || !email.trim()) return setFormError('Add your name and email so the organization can reach you.');
    if (resumeRequired && !resumeUrl) return setFormError('This organization asks for a resume. Attach one below.');
    setSubmitting(true);
    try {
      await applyToOpportunity({ opportunityId, name: name.trim(), email: email.trim(), message: message.trim(), resumeUrl });
      toast({ title: 'Application sent', description: 'We’ll notify you when the organization responds.' });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Your application didn’t go through. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <h2 className="font-sans text-lg font-semibold tracking-tight">Apply</h2>
      <div className="space-y-1.5">
        <Label htmlFor="apply-name">Full name</Label>
        <Input id="apply-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="apply-email">Email</Label>
        <Input id="apply-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="apply-message">
          Note to the organization <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="apply-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Why you’re interested, and when you’re available."
        />
      </div>
      <ResumeUpload onResumeSelect={setResumeUrl} selectedResumeUrl={resumeUrl} required={resumeRequired} />
      {formError && (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      )}
      <Button type="submit" className="w-full" size="lg" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send application'}
      </Button>
    </form>
  );
};

export default OpportunityDetail;
