import { Place, PlaceCategory } from '../types';
import { getCached, setCached } from '../lib/apiCache';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function inferBudget(tags: Record<string, string>): 'Budget' | 'Mid' | 'Premium' {
  if (tags.price_level === '1' || tags.amenity === 'fast_food' || tags.tourism === 'hostel') return 'Budget';
  if (tags.price_level === '3' || tags.price_level === '4' || tags.stars === '4' || tags.stars === '5') return 'Premium';
  return 'Mid';
}

function generateFallbackPlaces(cityName: string, lat: number, lng: number): Place[] {
  return [
    {
      id: 'fb-attraction-1',
      name: `${cityName} City Center & Central Plaza`,
      category: 'attraction',
      subCategory: 'Tourist Attraction',
      lat: lat + 0.005,
      lng: lng + 0.004,
      distance: 0.6,
      budget: 'Budget',
      openNow: true,
      address: `Main Square, ${cityName}`,
      wheelchair: true,
      rating: 4.7
    },
    {
      id: 'fb-attraction-2',
      name: `${cityName} Botanical Gardens & Lake Park`,
      category: 'attraction',
      subCategory: 'Park / Nature',
      lat: lat - 0.012,
      lng: lng + 0.008,
      distance: 1.4,
      budget: 'Budget',
      openNow: true,
      address: `Park Avenue, ${cityName}`,
      wheelchair: true,
      rating: 4.6
    },
    {
      id: 'fb-food-1',
      name: `Grand Central Café & Street Food Market`,
      category: 'food',
      subCategory: 'Restaurant / Cafe',
      lat: lat + 0.002,
      lng: lng - 0.003,
      distance: 0.3,
      budget: 'Budget',
      openNow: true,
      address: `Heritage Lane, ${cityName}`,
      wheelchair: true,
      rating: 4.5
    },
    {
      id: 'fb-food-2',
      name: `The Royal Dining Hall`,
      category: 'food',
      subCategory: 'Fine Dining',
      lat: lat - 0.004,
      lng: lng - 0.006,
      distance: 0.8,
      budget: 'Premium',
      openNow: true,
      address: `Station Road, ${cityName}`,
      wheelchair: true,
      rating: 4.8
    },
    {
      id: 'fb-hotel-1',
      name: `${cityName} Grand Heritage Hotel`,
      category: 'hotel',
      subCategory: 'Hotel',
      lat: lat + 0.008,
      lng: lng - 0.009,
      distance: 1.1,
      budget: 'Premium',
      openNow: true,
      address: `Boulevard, ${cityName}`,
      wheelchair: true,
      rating: 4.9
    },
    {
      id: 'fb-hotel-2',
      name: `City Backpackers Hostel`,
      category: 'hotel',
      subCategory: 'Hostel',
      lat: lat - 0.007,
      lng: lng + 0.005,
      distance: 0.9,
      budget: 'Budget',
      openNow: true,
      address: `University Rd, ${cityName}`,
      wheelchair: false,
      rating: 4.2
    },
    {
      id: 'fb-heritage-1',
      name: `${cityName} Historical Fort & Museum`,
      category: 'heritage',
      subCategory: 'Monument / Museum',
      lat: lat + 0.015,
      lng: lng + 0.010,
      distance: 1.8,
      budget: 'Budget',
      openNow: true,
      address: `Old City Gate, ${cityName}`,
      wheelchair: false,
      rating: 4.8
    },
    {
      id: 'fb-heritage-2',
      name: `Ancient Temple & Cultural Shrine`,
      category: 'heritage',
      subCategory: 'Place of Worship',
      lat: lat - 0.009,
      lng: lng - 0.012,
      distance: 1.5,
      budget: 'Budget',
      openNow: true,
      address: `Temple St, ${cityName}`,
      wheelchair: true,
      rating: 4.7
    },
    {
      id: 'fb-safety-1',
      name: `Central Police Headquarters`,
      category: 'safety',
      subCategory: 'Police Station',
      lat: lat + 0.003,
      lng: lng + 0.002,
      distance: 0.4,
      budget: 'Budget',
      openNow: true,
      address: `Civic Center, ${cityName}`,
      wheelchair: true,
      rating: 4.3
    },
    {
      id: 'fb-safety-2',
      name: `City General Emergency Hospital`,
      category: 'safety',
      subCategory: 'Hospital',
      lat: lat - 0.005,
      lng: lng + 0.007,
      distance: 0.9,
      budget: 'Budget',
      openNow: true,
      address: `Medical Enclave, ${cityName}`,
      wheelchair: true,
      rating: 4.6
    }
  ];
}

export async function fetchCityPlaces(cityName: string, lat: number, lng: number): Promise<Place[]> {
  const cacheKey = `places_${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const cached = getCached<Place[]>(cacheKey);
  if (cached) return cached;

  const radius = 3500; // 3.5km radius
  const query = `
    [out:json][timeout:10];
    (
      node["tourism"](around:${radius},${lat},${lng});
      node["amenity"~"restaurant|cafe|fast_food|police|hospital|pub|bar"](around:${radius},${lat},${lng});
      node["historic"](around:${radius},${lat},${lng});
    );
    out body 40;
  `;

  const mirrors = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter'
  ];

  for (const endpoint of mirrors) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(endpoint, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      if (!res.ok) continue;

      const data = await res.json();
      if (!data.elements || !Array.isArray(data.elements) || data.elements.length === 0) continue;

      const places: Place[] = [];
      data.elements.forEach((el: any) => {
        const tags = el.tags || {};
        const name = tags.name || tags['name:en'] || tags.brand;
        if (!name) return;

        let category: PlaceCategory = 'attraction';
        let subCategory = 'Place';

        if (tags.amenity === 'police' || tags.amenity === 'hospital') {
          category = 'safety';
          subCategory = tags.amenity === 'police' ? 'Police Station' : 'Hospital';
        } else if (tags.historic || tags.amenity === 'place_of_worship' || tags.tourism === 'museum') {
          category = 'heritage';
          subCategory = tags.historic ? 'Historic Site' : tags.tourism === 'museum' ? 'Museum' : 'Place of Worship';
        } else if (tags.tourism === 'hotel' || tags.tourism === 'hostel' || tags.tourism === 'guest_house') {
          category = 'hotel';
          subCategory = tags.tourism.charAt(0).toUpperCase() + tags.tourism.slice(1);
        } else if (tags.amenity === 'restaurant' || tags.amenity === 'cafe' || tags.amenity === 'fast_food' || tags.amenity === 'pub' || tags.amenity === 'bar') {
          category = 'food';
          subCategory = tags.amenity.charAt(0).toUpperCase() + tags.amenity.slice(1);
        } else if (tags.tourism) {
          category = 'attraction';
          subCategory = tags.tourism.charAt(0).toUpperCase() + tags.tourism.slice(1);
        }

        const pLat = el.lat;
        const pLng = el.lon;
        const dist = calculateDistance(lat, lng, pLat, pLng);

        places.push({
          id: `osm-${el.id}`,
          name,
          category,
          subCategory,
          lat: pLat,
          lng: pLng,
          distance: dist,
          budget: inferBudget(tags),
          openNow: tags.opening_hours ? !tags.opening_hours.includes('closed') : true,
          address: tags['addr:street'] ? `${tags['addr:street']} ${tags['addr:housenumber'] || ''}` : undefined,
          wheelchair: tags.wheelchair === 'yes' ? true : tags.wheelchair === 'no' ? false : null,
          rating: 4.0 + (el.id % 10) / 10
        });
      });

      if (places.length > 0) {
        setCached(cacheKey, places);
        return places;
      }
    } catch (e) {
      console.warn(`Overpass fetch failed on mirror ${endpoint}:`, e);
    }
  }

  // Fallback to offline realistic places if API fails or returns empty
  const fallback = generateFallbackPlaces(cityName, lat, lng);
  setCached(cacheKey, fallback);
  return fallback;
}
