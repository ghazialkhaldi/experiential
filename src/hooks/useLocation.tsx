import { useCallback, useEffect, useState } from 'react';
import { geocode, type Place } from '@/lib/geo';

const STORAGE_KEY = 'exp.location.v1';
const EVENT = 'exp-location-change';

const read = (): Place | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Place) : null;
  } catch {
    return null;
  }
};

const write = (place: Place | null) => {
  try {
    if (place) localStorage.setItem(STORAGE_KEY, JSON.stringify(place));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Non-persistent fallback is fine.
  }
  window.dispatchEvent(new Event(EVENT));
};

export const describePlace = (place: Place | null) =>
  place ? [place.city, place.state].filter(Boolean).join(', ') : '';

/**
 * The visitor's search location. Remembered in this browser and shared
 * between every component that uses the hook.
 */
export const useLocation = () => {
  const [location, setLocation] = useState<Place | null>(read);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setLocation(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Your browser can’t share its location. Type a city instead.');
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        let city = '';
        let state = '';
        let country = '';
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
          );
          const data = await res.json();
          city = data.city || data.locality || '';
          state = data.principalSubdivision || '';
          country = data.countryName || '';
        } catch {
          // Coordinates alone still give us distances.
        }
        write({ latitude: coords.latitude, longitude: coords.longitude, city: city || 'Current location', state, country });
        setLoading(false);
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location access is blocked. Allow it in your browser settings, or type a city.'
            : 'We couldn’t find your location. Try typing a city.'
        );
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 }
    );
  }, []);

  const setManualLocation = useCallback(async (input: string) => {
    const text = input.trim();
    if (!text) return false;
    setLoading(true);
    setError(null);
    const place = await geocode(text);
    setLoading(false);
    if (!place) {
      setError(`We couldn’t find “${text}”. Try a city name, like “Austin”.`);
      return false;
    }
    write(place);
    return true;
  }, []);

  const clearLocation = useCallback(() => write(null), []);

  return { location, loading, error, detectLocation, setManualLocation, clearLocation };
};
