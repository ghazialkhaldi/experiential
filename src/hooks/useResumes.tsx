import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ResumeSection {
  id: string;
  type: 'personal' | 'education' | 'experience' | 'skills' | 'achievements' | 'statement';
  title: string;
  data: any;
}

export interface SavedResume {
  id: string;
  name: string;
  sections: ResumeSection[];
  created_at: string;
  updated_at: string;
}

export const useResumes = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResumes = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Cast the sections from JSON to ResumeSection[]
      const typedResumes = data?.map(resume => ({
        ...resume,
        sections: resume.sections as unknown as ResumeSection[]
      })) || [];
      
      setResumes(typedResumes);
    } catch (err) {
      console.error('Error fetching resumes:', err);
      setError('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async (name: string, sections: ResumeSection[], resumeId?: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const resumeData = {
        user_id: user.id,
        name,
        sections: sections as any // Cast to any to match JSON type
      };

      let result;
      if (resumeId) {
        // Update existing resume
        result = await supabase
          .from('resumes')
          .update(resumeData)
          .eq('id', resumeId)
          .eq('user_id', user.id)
          .select()
          .single();
      } else {
        // Create new resume
        result = await supabase
          .from('resumes')
          .insert(resumeData)
          .select()
          .single();
      }

      if (result.error) throw result.error;
      
      // Refresh the resumes list
      await fetchResumes();
      
      return {
        ...result.data,
        sections: result.data.sections as unknown as ResumeSection[]
      };
    } catch (err) {
      console.error('Error saving resume:', err);
      setError('Failed to save resume');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (resumeId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Refresh the resumes list
      await fetchResumes();
    } catch (err) {
      console.error('Error deleting resume:', err);
      setError('Failed to delete resume');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getResume = async (resumeId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        sections: data.sections as unknown as ResumeSection[]
      };
    } catch (err) {
      console.error('Error fetching resume:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchResumes();
    }
  }, [user]);

  return {
    resumes,
    loading,
    error,
    saveResume,
    deleteResume,
    getResume,
    fetchResumes
  };
};