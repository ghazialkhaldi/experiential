import { useState, useEffect } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
}

interface LocationState {
  location: Location | null;
  loading: boolean;
  error: string | null;
  userDenied: boolean;
}

export const useLocation = () => {
  const [locationState, setLocationState] = useState<LocationState>({
    location: null,
    loading: true,
    error: null,
    userDenied: false,
  });

  const reverseGeocode = async (latitude: number, longitude: number): Promise<Location> => {
    try {
      // Using a CORS-friendly geocoding service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      
      return {
        latitude,
        longitude,
        city: data.city || data.locality || '',
        state: data.principalSubdivision || '',
        country: data.countryName || '',
      };
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      // Return basic location info without geocoding
      return { latitude, longitude };
    }
  };

  const getCurrentLocation = () => {
    setLocationState(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setLocationState({
        location: null,
        loading: false,
        error: 'Geolocation is not supported by this browser.',
        userDenied: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationData = await reverseGeocode(latitude, longitude);
        
        setLocationState({
          location: locationData,
          loading: false,
          error: null,
          userDenied: false,
        });
      },
      (error) => {
        const userDenied = error.code === error.PERMISSION_DENIED;
        setLocationState({
          location: null,
          loading: false,
          error: error.message,
          userDenied,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const setManualLocation = async (locationInput: string) => {
    setLocationState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Using a CORS-friendly geocoding service
      const response = await fetch(
        `https://geocode.maps.co/search?q=${encodeURIComponent(locationInput)}&format=json&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const locationData: Location = {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          city: result.display_name.split(',')[0] || '',
          state: result.display_name.split(',')[1]?.trim() || '',
          country: result.display_name.split(',').pop()?.trim() || '',
        };
        
        setLocationState({
          location: locationData,
          loading: false,
          error: null,
          userDenied: false,
        });
      } else {
        setLocationState(prev => ({
          ...prev,
          loading: false,
          error: 'Location not found',
        }));
      }
    } catch (error) {
      setLocationState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to find location',
      }));
    }
  };

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

  // Don't auto-detect location on mount to avoid overriding manual selections
  // useEffect(() => {
  //   getCurrentLocation();
  // }, []);

  return {
    ...locationState,
    getCurrentLocation,
    setManualLocation,
    calculateDistance,
  };
};