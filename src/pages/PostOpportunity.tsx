import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { PageShell, PageHeader, EmptyState, RequireAuth, ListSkeleton } from '@/components/layout/PageShell';
import OpportunityForm, { emptyOpportunity, toOpportunityRow } from '@/components/OpportunityForm';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { OPPORTUNITIES_KEY } from '@/hooks/useOpportunities';

const PostForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { organization, isOrganization, loading } = useProfile();

  if (loading) return <ListSkeleton rows={2} />;

  if (!isOrganization) {
    return (
      <EmptyState
        title="Posting is for organization accounts"
        description="Your account is set up as a volunteer. Organizations sign up separately to post opportunities and review applicants."
        action={
          <Button variant="outline" asChild>
            <Link to="/search">Browse opportunities instead</Link>
          </Button>
        }
      />
    );
  }

  if (!organization) {
    return (
      <EmptyState
        title="Add your organization first"
        description="We need your organization’s name and address before you can post."
        action={
          <Button asChild>
            <Link to="/complete-profile">Add organization details</Link>
          </Button>
        }
      />
    );
  }

  const defaultLocation = [organization.address_line1, organization.city, `${organization.state} ${organization.zip_code}`.trim()]
    .filter(Boolean)
    .join(', ');

  return (
    <OpportunityForm
      initial={emptyOpportunity(defaultLocation)}
      submitLabel="Publish opportunity"
      submittingLabel="Publishing…"
      onCancel={() => navigate(-1)}
      onSubmit={async (values) => {
        const { data, error } = await supabase
          .from('opportunities')
          .insert({ ...toOpportunityRow(values), organization_id: organization.id, opportunity_type: 'volunteer' })
          .select('id')
          .single();
        if (error) {
          console.error('Error posting opportunity:', error);
          toast({ title: 'Couldn’t publish', description: 'Please check the form and try again.', variant: 'destructive' });
          return;
        }
        queryClient.invalidateQueries({ queryKey: [OPPORTUNITIES_KEY] });
        toast({ title: 'Opportunity published', description: 'Students can find and apply to it now.' });
        navigate(`/opportunity/${data.id}`);
      }}
    />
  );
};

const PostOpportunity = () => {
  const { organization } = useProfile();
  return (
    <PageShell width="narrow">
      <PageHeader
        title="Post an opportunity"
        description={organization ? `Publishing as ${organization.name}.` : 'Reach students looking to volunteer nearby.'}
      />
      <RequireAuth message="Sign in with your organization account to post opportunities.">
        <PostForm />
      </RequireAuth>
    </PageShell>
  );
};

export default PostOpportunity;
