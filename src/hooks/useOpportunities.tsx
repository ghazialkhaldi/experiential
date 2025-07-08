import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  time_commitment: string;
  requirements: string | null;
  location: string;
  posted_at: string;
  max_volunteers: number | null;
  current_volunteers: number;
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
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationString)}&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
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

  // Memoize user location to prevent unnecessary re-renders
  const memoizedUserLocation = useMemo(() => userLocation, [userLocation?.latitude, userLocation?.longitude]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
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
          .order('posted_at', { ascending: false });

        if (categoryFilter && categoryFilter !== 'all') {
          query = query.eq('category', categoryFilter);
        }

        if (searchQuery.trim()) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        let processedOpportunities = data || [];

        // Add distance calculation if user location is available
        if (memoizedUserLocation && processedOpportunities.length > 0) {
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

        setOpportunities(processedOpportunities);
        setError(null);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError('Failed to load opportunities');
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [searchQuery, categoryFilter, memoizedUserLocation, calculateDistance, parseLocationCoordinates]);

  return { opportunities, loading, error };
};