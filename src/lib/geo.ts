/**
 * Geocoding via Open-Meteo (free, CORS-enabled, no key). It resolves place
 * names, so free-form locations ("123 Main St, Austin, TX") are tried
 * segment by segment. Results are cached in localStorage so each place
 * string is looked up at most once per browser.
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Place extends Coordinates {
  city: string;
  state: string;
  country: string;
}

const CACHE_KEY = 'exp.geocode.v1';
type CacheEntry = Place | null;

const readCache = (): Record<string, CacheEntry> => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
};

const writeCache = (cache: Record<string, CacheEntry>) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage full or blocked; caching is an optimization only.
  }
};

const inflight = new Map<string, Promise<Place | null>>();

const lookupName = async (name: string): Promise<Place | null> => {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`
  );
  if (!res.ok) return null;
  const data = await res.json();
  const hit = data?.results?.[0];
  if (!hit) return null;
  return {
    latitude: hit.latitude,
    longitude: hit.longitude,
    city: hit.name ?? name,
    state: hit.admin1 ?? '',
    country: hit.country ?? '',
  };
};

/** Candidate place names, most specific usable segment first. */
const candidates = (location: string) => {
  const parts = location
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  // Skip street-address segments (contain digits) and bare 2-letter state codes.
  const usable = parts.filter((p) => !/\d/.test(p) && !/^[A-Za-z]{2}$/.test(p));
  return usable.length ? usable : parts;
};

export const geocode = async (location: string): Promise<Place | null> => {
  const key = location.trim().toLowerCase();
  if (!key || /^remote|virtual|online/i.test(key)) return null;

  const cache = readCache();
  if (key in cache) return cache[key];
  if (inflight.has(key)) return inflight.get(key)!;

  const task = (async () => {
    let place: Place | null = null;
    try {
      for (const name of candidates(location)) {
        place = await lookupName(name);
        if (place) break;
      }
    } catch {
      // Network failure: do not cache, so a later attempt can succeed.
      return null;
    }
    const next = readCache();
    next[key] = place;
    writeCache(next);
    return place;
  })();

  inflight.set(key, task);
  try {
    return await task;
  } finally {
    inflight.delete(key);
  }
};

export const distanceKm = (a: Coordinates, b: Coordinates) => {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.latitude * Math.PI) / 180) * Math.cos((b.latitude * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};
