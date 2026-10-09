import { City } from '../types';
import { getCached, setCached } from '../lib/apiCache';

export const DEMO_CITIES: City[] = [
  { id: 'pune', name: 'Pune', country: 'India', latitude: 18.5204, longitude: 73.8567, population: 3124458, admin1: 'Maharashtra' },
  { id: 'mumbai', name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777, population: 12442373, admin1: 'Maharashtra' },
  { id: 'delhi', name: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, population: 11034555, admin1: 'Delhi' },
  { id: 'bengaluru', name: 'Bengaluru', country: 'India', latitude: 12.9716, longitude: 77.5946, population: 8443675, admin1: 'Karnataka' },
  { id: 'paris', name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, population: 2161000, admin1: 'Île-de-France' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, population: 13960000, admin1: 'Tokyo' },
];

export async function searchCities(query: string): Promise<City[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed || trimmed.length < 2) return [];

  const cacheKey = `geo_${trimmed}`;
  const cached = getCached<City[]>(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=8&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding HTTP ${res.status}`);
    const data = await res.json();

    if (!data.results || !Array.isArray(data.results)) return [];

    const cities: City[] = data.results.map((item: any) => ({
      id: `${item.id || item.name}-${item.country_code}`,
      name: item.name,
      country: item.country || '',
      latitude: item.latitude,
      longitude: item.longitude,
      population: item.population,
      timezone: item.timezone,
      admin1: item.admin1,
    }));

    setCached(cacheKey, cities);
    return cities;
  } catch (err) {
    console.error('Error fetching geocoding data:', err);
    // Fallback to local filtering of demo cities
    return DEMO_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(trimmed) ||
        c.country.toLowerCase().includes(trimmed)
    );
  }
}
