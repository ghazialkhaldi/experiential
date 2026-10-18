import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, FileText, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApplications, type Application, type ApplicationStatus } from '@/hooks/useApplications';
import { useToast } from '@/hooks/use-toast';
import { formatTimeAgo } from '@/lib/opportunities';
import { StatusBadge } from '@/pages/MyApplications';
import { cn } from '@/lib/utils';

/** One applicant, as an organization sees them. */
const ApplicationCard = ({ application: a }: { application: Application }) => {
  const { updateApplicationStatus } = useApplications();
  const { toast } = useToast();
  const [pending, setPending] = useState<ApplicationStatus | null>(null);
  const [expanded, setExpanded] = useState(false);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const [overflows, setOverflows] = useState(false);

  // Offer "Read full note" only when the clamped note is actually cut off.
  useLayoutEffect(() => {
    const el = messageRef.current;
    if (!el || expanded) return;
    const check = () => setOverflows(el.scrollHeight > el.clientHeight + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [a.message, expanded]);

  const decide = async (status: ApplicationStatus) => {
    setPending(status);
    try {
      await updateApplicationStatus(a.id, status);
      toast({
        title: status === 'accepted' ? `Accepted ${a.applicant_name}` : `Declined ${a.applicant_name}`,
        description: 'They’ll be notified in the app.',
      });
    } catch {
      toast({ title: 'Couldn’t update this application', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setPending(null);
    }
  };

  return (
    <li className="py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{a.applicant_name}</h3>
            {a.is_pro_user && <Badge variant="accent">Pro</Badge>}
            <StatusBadge status={a.status} />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {a.opportunity ? (
              <Link to={`/opportunity/${a.opportunity.id}`} className="hover:text-foreground hover:underline">
                {a.opportunity.title}
              </Link>
            ) : (
              'Removed opportunity'
            )}{' '}
            · applied {formatTimeAgo(a.applied_at)}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <a href={`mailto:${a.applicant_email}`} className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
              <Mail className="h-3.5 w-3.5" />
              {a.applicant_email}
            </a>
            {a.resume_url && (
              <a
                href={a.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                <FileText className="h-3.5 w-3.5" />
                Resume
              </a>
            )}
          </div>
        </div>

        {a.status === 'pending' && (
          <div className="flex shrink-0 gap-2">
            <Button size="sm" variant="outline" onClick={() => decide('rejected')} disabled={!!pending}>
              <X />
              {pending === 'rejected' ? 'Declining…' : 'Decline'}
            </Button>
            <Button size="sm" onClick={() => decide('accepted')} disabled={!!pending}>
              <Check />
              {pending === 'accepted' ? 'Accepting…' : 'Accept'}
            </Button>
          </div>
        )}
      </div>

      {a.message && (
        <div className="mt-3 max-w-[68ch] rounded-md bg-muted/60 px-4 py-3">
          <p ref={messageRef} className={cn('whitespace-pre-line text-sm leading-6', !expanded && 'line-clamp-3')}>
            {a.message}
          </p>
          {(overflows || expanded) && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary"
              aria-expanded={expanded}
            >
              {expanded ? 'Show less' : 'Read full note'}
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-180')} />
            </button>
          )}
        </div>
      )}
    </li>
  );
};

export default ApplicationCard;
