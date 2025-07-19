import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Application {
  id: string;
  opportunity_id: string;
  user_id: string;
  applicant_email: string;
  applicant_name: string;
  message: string | null;
  resume_url: string | null;
  status: string;
  applied_at: string;
  updated_at: string;
  opportunity?: {
    title: string;
    organization: {
      name: string;
    };
  };
}

export const useApplications = (opportunityId?: string) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user, opportunityId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities (
            title,
            organization:organizations (
              name
            )
          )
        `)
        .order('applied_at', { ascending: false });

      if (opportunityId) {
        query = query.eq('opportunity_id', opportunityId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setApplications(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const applyToOpportunity = async (
    opportunityId: string,
    applicantName: string,
    applicantEmail: string,
    message?: string,
    resumeUrl?: string | null
  ) => {
    if (!user) {
      throw new Error('You must be logged in to apply');
    }

    try {
      const { data, error } = await supabase
        .from('applications')
        .insert({
          opportunity_id: opportunityId,
          user_id: user.id,
          applicant_name: applicantName,
          applicant_email: applicantEmail,
          message: message || null,
          resume_url: resumeUrl || null,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('You have already applied to this opportunity');
        }
        throw error;
      }

      await fetchApplications();
      return data;
    } catch (err) {
      console.error('Error applying to opportunity:', err);
      throw err;
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) {
        throw error;
      }

      await fetchApplications();
    } catch (err) {
      console.error('Error updating application status:', err);
      throw err;
    }
  };

  const hasApplied = (opportunityId: string) => {
    return applications.some(app => app.opportunity_id === opportunityId && app.user_id === user?.id);
  };

  return {
    applications,
    loading,
    error,
    applyToOpportunity,
    updateApplicationStatus,
    hasApplied,
    refetch: fetchApplications,
  };
};