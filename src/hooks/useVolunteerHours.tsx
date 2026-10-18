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
        title: "Couldn't load your hours",
        description: "Please refresh the page.",
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
      toast({ title: `Logged ${data.hours} ${data.hours === 1 ? 'hour' : 'hours'}` });
      return true;
    } catch (error) {
      console.error('Error adding volunteer hours:', error);
      toast({
        title: "Couldn't save those hours",
        description: "Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteHours = async (id: string) => {
    const previous = hours;
    setHours((prev) => prev.filter((h) => h.id !== id));
    const { error } = await supabase.from('volunteer_hours').delete().eq('id', id).eq('user_id', user!.id);
    if (error) {
      console.error('Error deleting volunteer hours:', error);
      setHours(previous);
      toast({ title: "Couldn't delete that entry", description: 'Please try again.', variant: 'destructive' });
      return false;
    }
    return true;
  };

  useEffect(() => {
    fetchHours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const totalHours = hours.reduce((sum, hour) => sum + hour.hours, 0);
  const totalOpportunities = hours.length;

  return {
    hours,
    loading,
    addHours,
    deleteHours,
    refetch: fetchHours,
    totalHours,
    totalOpportunities,
  };
};