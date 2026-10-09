import { useState, useEffect } from 'react';
import { WikiData } from '../types';
import { fetchWikiSummary } from '../services/wikipedia';

export function useWiki(cityName: string) {
  const [wiki, setWiki] = useState<WikiData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchWikiSummary(cityName)
      .then((res) => {
        if (isMounted) {
          setWiki(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load Wikipedia summary');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [cityName]);

  return { wiki, loading, error };
}
