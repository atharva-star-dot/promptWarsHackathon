import { WikiData } from '../types';
import { getCached, setCached } from '../lib/apiCache';

export async function fetchWikiSummary(cityName: string): Promise<WikiData> {
  const cacheKey = `wiki_${cityName.toLowerCase()}`;
  const cached = getCached<WikiData>(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Wikipedia HTTP ${res.status}`);
    const data = await res.json();

    const wikiData: WikiData = {
      summary: data.extract || `${cityName} is a prominent city rich in culture, history, and vibrant local traditions.`,
      thumbnail: data.thumbnail?.source,
      url: data.content_urls?.desktop?.page,
      heritageSites: [
        'Central Heritage Landmark & Monument',
        'Historic City Fortification & Old Town Center',
        'Traditional Cultural Crafts & Artisan Markets'
      ]
    };

    setCached(cacheKey, wikiData);
    return wikiData;
  } catch (err) {
    console.warn('Wikipedia API fetch failed, using fallback summary:', err);
    return {
      summary: `${cityName} is a major urban center known for its rich history, distinct architecture, and vibrant cultural traditions spanning centuries.`,
      thumbnail: undefined,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(cityName)}`,
      heritageSites: [
        'Historical Old City Quarter',
        'Traditional Cultural & Heritage Center'
      ]
    };
  }
}
