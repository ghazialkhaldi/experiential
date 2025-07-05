import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  role: 'volunteer' | 'volunteer_searcher';
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

    const fetchProfileData = async () => {
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          setProfile(profileData);
        }

        // Fetch organization if user is volunteer_searcher
        if (profileData?.role === 'volunteer_searcher') {
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (orgError) {
            console.error('Error fetching organization:', orgError);
          } else {
            setOrganization(orgData);
          }
        }
      } catch (error) {
        console.error('Error in fetchProfileData:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, isAuthenticated]);

  const getDisplayName = () => {
    if (organization) {
      return organization.name;
    }
    if (profile) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return user?.email || '';
  };

  return {
    profile,
    organization,
    loading,
    getDisplayName,
    isOrganization: !!organization
  };
};