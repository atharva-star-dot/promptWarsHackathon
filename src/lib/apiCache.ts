const CACHE_PREFIX = 'citypulse_cache_';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface CacheItem<T> {
  timestamp: number;
  data: T;
}

export function getCached<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed: CacheItem<T> = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      sessionStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return parsed.data;
  } catch (e) {
    return null;
  }
}

export function setCached<T>(key: string, data: T): void {
  try {
    const item: CacheItem<T> = {
      timestamp: Date.now(),
      data,
    };
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  } catch (e) {
    console.warn('sessionStorage caching failed:', e);
  }
}
