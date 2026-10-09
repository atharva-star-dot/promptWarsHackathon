import { useState, useEffect } from 'react';
import { Place } from '../types';
import { fetchCityPlaces } from '../services/overpass';

export function usePlaces(cityName: string, lat: number, lng: number) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchCityPlaces(cityName, lat, lng)
      .then((res) => {
        if (isMounted) {
          setPlaces(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch places');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [cityName, lat, lng]);

  return { places, loading, error };
}
