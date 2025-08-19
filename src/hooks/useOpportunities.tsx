import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMode } from '@/contexts/ModeContext';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  time_commitment: string;
  requirements: string | null;
  location: string;
  posted_at: string;
  opportunity_type: string;
  max_volunteers: number | null;
  current_volunteers: number;
  resume_required?: boolean;
  distance?: number;
  organization: {
    name: string;
    id: string;
  };
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

export const useOpportunities = (searchQuery: string = '', categoryFilter: string = '', userLocation?: UserLocation | null) => {
  const { isInternshipMode } = useMode();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

<<<<<<< HEAD
=======
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }, []);

  const parseLocationCoordinates = useCallback(async (locationString: string): Promise<{lat: number, lon: number} | null> => {
    try {
      // Using a CORS-friendly geocoding service
      const response = await fetch(
        `https://geocode.maps.co/search?q=${encodeURIComponent(locationString)}&format=json&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        };
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
    }
    return null;
  }, []);

>>>>>>> origin/main
  // Memoize user location to prevent unnecessary re-renders
  const memoizedUserLocation = useMemo(() => userLocation, [userLocation?.latitude, userLocation?.longitude]);

  useEffect(() => {
<<<<<<< HEAD
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371; // Radius of the Earth in kilometers
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c; // Distance in kilometers
      return distance;
    };

    const parseLocationCoordinates = async (locationString: string): Promise<{lat: number, lon: number} | null> => {
      try {
        // Using a CORS-friendly geocoding service
        const response = await fetch(
          `https://geocode.maps.co/search?q=${encodeURIComponent(locationString)}&format=json&limit=1`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon)
          };
        }
      } catch (error) {
        console.error('Error geocoding location:', error);
      }
      return null;
    };

    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching opportunities with filters:', {
          searchQuery,
          categoryFilter,
          isInternshipMode,
          userLocation: memoizedUserLocation
        });

=======
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
>>>>>>> origin/main
        let query = supabase
          .from('opportunities')
          .select(`
            *,
            organization:organizations (
              name,
              id
            )
          `)
          .eq('is_active', true)
          .eq('opportunity_type', isInternshipMode ? 'internship' : 'volunteer')
          .order('posted_at', { ascending: false });

        if (categoryFilter && categoryFilter !== 'all') {
          query = query.eq('category', categoryFilter);
        }

        if (searchQuery.trim()) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query;

<<<<<<< HEAD
        console.log('📊 Database query result:', {
          dataCount: data?.length || 0,
          error: error?.message || null,
          sampleData: data?.[0] || 'No data'
        });

=======
>>>>>>> origin/main
        if (error) {
          throw error;
        }

        let processedOpportunities = data || [];

<<<<<<< HEAD
        // Temporarily disable distance calculation to test loading
        // TODO: Re-enable after fixing basic loading
        /*
=======
>>>>>>> origin/main
        // Add distance calculation only if user location has valid coordinates
        if (memoizedUserLocation && memoizedUserLocation.latitude !== 0 && memoizedUserLocation.longitude !== 0 && processedOpportunities.length > 0) {
          const opportunitiesWithDistance = await Promise.all(
            processedOpportunities.map(async (opportunity) => {
              const coords = await parseLocationCoordinates(opportunity.location);
              if (coords) {
                const distance = calculateDistance(
                  memoizedUserLocation.latitude,
                  memoizedUserLocation.longitude,
                  coords.lat,
                  coords.lon
                );
                return { ...opportunity, distance };
              }
              return { ...opportunity, distance: undefined };
            })
          );
          processedOpportunities = opportunitiesWithDistance;
        }
<<<<<<< HEAD
        */

        setOpportunities(processedOpportunities);
        setError(null);
        
        console.log('✅ Opportunities processed successfully:', {
          totalCount: processedOpportunities.length,
          sampleTitles: processedOpportunities.slice(0, 3).map(o => o.title)
        });
      } catch (err) {
        console.error('❌ Error fetching opportunities:', err);
=======

        setOpportunities(processedOpportunities);
        setError(null);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
>>>>>>> origin/main
        setError('Failed to load opportunities');
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
<<<<<<< HEAD
  }, [searchQuery, categoryFilter, memoizedUserLocation, isInternshipMode]);
=======
  }, [searchQuery, categoryFilter, memoizedUserLocation, calculateDistance, parseLocationCoordinates, isInternshipMode]);
>>>>>>> origin/main

  return { opportunities, loading, error };
};