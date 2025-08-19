import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useLikes = (opportunityId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch like status and count
  useEffect(() => {
    const fetchLikeData = async () => {
      if (!opportunityId) return;

      try {
        // Get like count
        const { data: countData, error: countError } = await supabase
          .rpc('get_opportunity_like_count', { opportunity_id_param: opportunityId });

        if (countError) throw countError;
        setLikeCount(countData || 0);

        // Check if user has liked (only if authenticated)
        if (user) {
          const { data: likedData, error: likedError } = await supabase
            .rpc('has_user_liked_opportunity', { 
              user_id_param: user.id, 
              opportunity_id_param: opportunityId 
            });

          if (likedError) throw likedError;
          setIsLiked(likedData || false);
        }
      } catch (error) {
        console.error('Error fetching like data:', error);
      }
    };

    fetchLikeData();
  }, [opportunityId, user]);

  const toggleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like opportunities",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from('opportunity_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('opportunity_id', opportunityId);

        if (error) throw error;

        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
        toast({ title: "Removed from liked opportunities" });
      } else {
        // Add like
        const { error } = await supabase
          .from('opportunity_likes')
          .insert({
            user_id: user.id,
            opportunity_id: opportunityId
          });

        if (error) throw error;

        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        toast({ title: "Added to liked opportunities" });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    isLiked,
    likeCount,
    toggleLike,
    loading,
    canLike: !!user
  };
};