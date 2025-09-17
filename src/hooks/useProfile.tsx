import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  role: 'volunteer' | 'volunteer_searcher' | 'admin';
}

interface Organization {
  id: string;
  name: string;
  description?: string;
  website?: string;
  phone?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
}

export const useProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setProfile(null);
      setOrganization(null);
      setLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchProfileData = async () => {
      try {
        // Use maybeSingle() instead of single() to handle case where profile doesn't exist yet
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (isCancelled) return;

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setProfile(null);
        } else {
          setProfile(profileData);
        }

        // Fetch organization if user is volunteer_searcher
        if (profileData?.role === 'volunteer_searcher') {
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (!isCancelled) {
            if (orgError) {
              console.error('Error fetching organization:', orgError);
              setOrganization(null);
            } else {
              setOrganization(orgData);
            }
          }
        } else {
          setOrganization(null);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error in fetchProfileData:', error);
          setProfile(null);
          setOrganization(null);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfileData();

    return () => {
      isCancelled = true;
    };
  }, [user?.id, isAuthenticated]);

  const getDisplayName = () => {
    if (organization) {
      return organization.name;
    }
    if (profile) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return user?.email || '';
  };

  // Check for incomplete organization setup
  const hasIncompleteOrganization = () => {
    return profile?.role === 'volunteer_searcher' && !organization;
  };

  // Check for incomplete organization data in localStorage
  const hasIncompleteOrgData = () => {
    return !!localStorage.getItem('incompleteOrgData');
  };

  return {
    profile,
    organization,
    loading,
    getDisplayName,
    isOrganization: !!organization,
    hasIncompleteOrganization: hasIncompleteOrganization(),
    hasIncompleteOrgData: hasIncompleteOrgData()
  };
};