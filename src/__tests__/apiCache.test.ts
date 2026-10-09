import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCached, setCached } from '../lib/apiCache';

describe('apiCache', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('stores and retrieves cached data correctly', () => {
    const testData = { city: 'Pune', temp: 28 };
    setCached('weather_pune', testData);

    const retrieved = getCached<{ city: string; temp: number }>('weather_pune');
    expect(retrieved).toEqual(testData);
  });

  it('returns null for non-existent cache keys', () => {
    const retrieved = getCached('non_existent_key');
    expect(retrieved).toBeNull();
  });

  it('expires and removes cached items older than TTL (30 mins)', () => {
    const testData = { test: true };
    const expiredTimestamp = Date.now() - 35 * 60 * 1000; // 35 mins ago

    sessionStorage.setItem(
      'citypulse_cache_expired_key',
      JSON.stringify({ timestamp: expiredTimestamp, data: testData })
    );

    const retrieved = getCached('expired_key');
    expect(retrieved).toBeNull();
    // Verify item was cleaned up from sessionStorage
    expect(sessionStorage.getItem('citypulse_cache_expired_key')).toBeNull();
  });

  it('returns valid data when within TTL window', () => {
    const testData = { message: 'fresh data' };
    const freshTimestamp = Date.now() - 10 * 60 * 1000; // 10 mins ago

    sessionStorage.setItem(
      'citypulse_cache_fresh_key',
      JSON.stringify({ timestamp: freshTimestamp, data: testData })
    );

    const retrieved = getCached<{ message: string }>('fresh_key');
    expect(retrieved).toEqual(testData);
  });

  it('handles corrupted JSON in sessionStorage safely without throwing', () => {
    sessionStorage.setItem('citypulse_cache_corrupt', '{bad json');
    expect(() => getCached('corrupt')).not.toThrow();
    expect(getCached('corrupt')).toBeNull();
  });

  it('handles sessionStorage quota errors safely during setCached', () => {
    vi.spyOn(sessionStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => setCached('key', 'val')).not.toThrow();
    expect(consoleSpy).toHaveBeenCalledWith('sessionStorage caching failed:', expect.any(Error));
  });
});
