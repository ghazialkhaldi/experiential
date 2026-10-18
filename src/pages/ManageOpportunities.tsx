import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageShell, PageHeader, EmptyState, RequireAuth, ListSkeleton } from '@/components/layout/PageShell';
import ApplicationCard from '@/components/ApplicationCard';
import OpportunityForm, { toOpportunityRow, type OpportunityFormValues } from '@/components/OpportunityForm';
import { supabase } from '@/integrations/supabase/client';
import { useApplications } from '@/hooks/useApplications';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { OPPORTUNITIES_KEY } from '@/hooks/useOpportunities';
import { formatTimeAgo, type Opportunity } from '@/lib/opportunities';

type OrgOpportunity = Opportunity & { expires_at: string | null; applications: { id: string; status: string }[] };

const toFormValues = (o: OrgOpportunity): OpportunityFormValues => ({
  title: o.title,
  category: o.category,
  description: o.description,
  time_commitment: o.time_commitment,
  location: o.location,
  requirements: o.requirements ?? '',
  max_volunteers: o.max_volunteers?.toString() ?? '',
  start_date: o.start_date ?? '',
  end_date: o.end_date ?? '',
  expires_at: o.expires_at ? o.expires_at.slice(0, 10) : '',
  resume_required: !!o.resume_required,
});

const Dashboard = () => {
  const { organization, isOrganization, loading: profileLoading } = useProfile();
  const { applications, loading: appsLoading } = useApplications();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<OrgOpportunity | null>(null);
  const [deleting, setDeleting] = useState<OrgOpportunity | null>(null);

  const key = [OPPORTUNITIES_KEY, 'org', organization?.id];
  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: key,
    enabled: !!organization,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*, applications ( id, status )')
        .eq('organization_id', organization!.id)
        .order('posted_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as OrgOpportunity[];
    },
  });

  if (profileLoading) return <ListSkeleton />;

  if (!isOrganization) {
    return (
      <EmptyState
        title="This page is for organizations"
        description="Track the opportunities you’ve applied to from My applications."
        action={
          <Button asChild>
            <Link to="/my-applications">Go to My applications</Link>
          </Button>
        }
      />
    );
  }

  if (!organization) {
    return (
      <EmptyState
        title="Add your organization first"
        description="Once your organization is set up you can post opportunities and review applicants here."
        action={
          <Button asChild>
            <Link to="/complete-profile">Add organization details</Link>
          </Button>
        }
      />
    );
  }

  const refresh = () => queryClient.invalidateQueries({ queryKey: [OPPORTUNITIES_KEY] });

  const run = async (action: PromiseLike<{ error: unknown }>, success: string) => {
    const { error } = await action;
    if (error) {
      console.error(error);
      toast({ title: 'That didn’t work', description: 'Please try again.', variant: 'destructive' });
      return false;
    }
    toast({ title: success });
    refresh();
    return true;
  };

  const pending = applications.filter((a) => a.status === 'pending');
  const decided = applications.filter((a) => a.status !== 'pending');

  return (
    <>
      <Tabs defaultValue={pending.length ? 'applicants' : 'postings'}>
        <TabsList className="mb-6">
          <TabsTrigger value="applicants">
            Applicants
            {pending.length > 0 && <span className="tabular ml-2 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{pending.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="postings">
            Postings <span className="tabular ml-1.5 text-muted-foreground">{opportunities.length}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applicants">
          {appsLoading ? (
            <ListSkeleton />
          ) : applications.length === 0 ? (
            <EmptyState title="No applicants yet" description="When students apply to your postings, they’ll appear here to review." />
          ) : (
            <div className="space-y-10">
              <section>
                <h2 className="font-sans text-base font-semibold tracking-tight">
                  Waiting for review <span className="tabular font-normal text-muted-foreground">({pending.length})</span>
                </h2>
                {pending.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">You’re caught up. Nothing to review.</p>
                ) : (
                  <ul className="mt-2 divide-y divide-border border-y border-border">
                    {pending.map((a) => (
                      <ApplicationCard key={a.id} application={a} />
                    ))}
                  </ul>
                )}
              </section>
              {decided.length > 0 && (
                <section>
                  <h2 className="font-sans text-base font-semibold tracking-tight">
                    Reviewed <span className="tabular font-normal text-muted-foreground">({decided.length})</span>
                  </h2>
                  <ul className="mt-2 divide-y divide-border border-y border-border">
                    {decided.map((a) => (
                      <ApplicationCard key={a.id} application={a} />
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="postings">
          {isLoading ? (
            <ListSkeleton />
          ) : opportunities.length === 0 ? (
            <EmptyState
              title="No postings yet"
              description="Post your first opportunity and start hearing from students."
              action={
                <Button asChild>
                  <Link to="/post-opportunity">Post an opportunity</Link>
                </Button>
              }
            />
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {opportunities.map((o) => {
                const total = o.applications?.length ?? 0;
                const waiting = o.applications?.filter((a) => a.status === 'pending').length ?? 0;
                return (
                  <li key={o.id} className="flex items-start justify-between gap-4 py-5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link to={`/opportunity/${o.id}`} className="font-semibold hover:text-primary hover:underline">
                          {o.title}
                        </Link>
                        {o.is_active ? <Badge variant="success">Open</Badge> : <Badge variant="muted">Closed</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        <span className="tabular">{total}</span> {total === 1 ? 'applicant' : 'applicants'}
                        {waiting > 0 && (
                          <>
                            {' '}· <span className="tabular font-medium text-foreground">{waiting}</span> waiting
                          </>
                        )}
                        {o.max_volunteers && (
                          <>
                            {' '}· <span className="tabular">{o.current_volunteers ?? 0}/{o.max_volunteers}</span> filled
                          </>
                        )}{' '}
                        · posted {formatTimeAgo(o.posted_at)}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label={`Actions for ${o.title}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/opportunity/${o.id}`}>View public page</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setEditing(o)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            run(
                              supabase.from('opportunities').update({ is_active: !o.is_active }).eq('id', o.id),
                              o.is_active ? 'Applications closed' : 'Opportunity reopened'
                            )
                          }
                        >
                          {o.is_active ? 'Close applications' : 'Reopen'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => setDeleting(o)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                );
              })}
            </ul>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit opportunity</DialogTitle>
            <DialogDescription>Changes appear on the public listing right away.</DialogDescription>
          </DialogHeader>
          {editing && (
            <OpportunityForm
              key={editing.id}
              initial={toFormValues(editing)}
              submitLabel="Save changes"
              submittingLabel="Saving…"
              onCancel={() => setEditing(null)}
              onSubmit={async (values) => {
                const ok = await run(supabase.from('opportunities').update(toOpportunityRow(values)).eq('id', editing.id), 'Changes saved');
                if (ok) setEditing(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{deleting?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the listing and all of its applications. If you only want to stop new applicants, close it instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleting && run(supabase.from('opportunities').delete().eq('id', deleting.id), 'Opportunity deleted')}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const ManageOpportunities = () => {
  const { organization, isOrganization } = useProfile();
  return (
    <PageShell>
      <PageHeader
        title={organization?.name ?? 'Your postings'}
        description="Review applicants and keep your listings up to date."
        actions={
          isOrganization && organization ? (
            <Button asChild>
              <Link to="/post-opportunity">
                <Plus />
                Post opportunity
              </Link>
            </Button>
          ) : undefined
        }
      />
      <RequireAuth message="Sign in with your organization account to manage postings.">
        <Dashboard />
      </RequireAuth>
    </PageShell>
  );
};

export default ManageOpportunities;
