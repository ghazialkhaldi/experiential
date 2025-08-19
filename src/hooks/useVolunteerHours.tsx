import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface VolunteerHour {
  id: string;
  title: string;
  organization: string;
  hours: number;
  date_completed: string;
  category?: string;
  notes?: string;
  created_at: string;
}

export interface CreateVolunteerHour {
  title: string;
  organization: string;
  hours: number;
  date_completed: string;
  category?: string;
  notes?: string;
}

export const useVolunteerHours = () => {
  const [hours, setHours] = useState<VolunteerHour[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchHours = async () => {
    if (!user) {
      setHours([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('volunteer_hours')
        .select('*')
        .eq('user_id', user.id)
        .order('date_completed', { ascending: false });

      if (error) throw error;
      setHours(data || []);
    } catch (error) {
      console.error('Error fetching volunteer hours:', error);
      toast({
        title: "Error",
        description: "Failed to load volunteer hours",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addHours = async (newHour: CreateVolunteerHour) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to log hours",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('volunteer_hours')
        .insert([
          {
            ...newHour,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setHours(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Volunteer hours logged successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error adding volunteer hours:', error);
      toast({
        title: "Error",
        description: "Failed to log volunteer hours",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchHours();
  }, [user]);

  const totalHours = hours.reduce((sum, hour) => sum + hour.hours, 0);
  const totalOpportunities = hours.length;

  return {
    hours,
    loading,
    addHours,
    refetch: fetchHours,
    totalHours,
    totalOpportunities,
  };
};