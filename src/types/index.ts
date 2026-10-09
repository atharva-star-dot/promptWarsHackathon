export interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  population?: number;
  timezone?: string;
  admin1?: string;
}

export interface ForecastDay {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  weatherCode: number;
  conditionText: string;
  isDay: boolean;
  forecast: ForecastDay[];
  alertBanner?: string;
}

export type PlaceCategory = 'attraction' | 'food' | 'hotel' | 'heritage' | 'safety';

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  subCategory: string;
  lat: number;
  lng: number;
  distance: number; // in km from city center
  budget: 'Budget' | 'Mid' | 'Premium';
  openNow?: boolean | null;
  address?: string;
  wheelchair?: boolean | null;
  rating?: number;
}

export type ReportType = 'accident' | 'unsafe' | 'pothole' | 'flooding';

export interface CitizenReport {
  id: string;
  cityId: string;
  type: ReportType;
  description: string;
  photoUrl?: string;
  audioBlobUrl?: string;
  lat: number;
  lng: number;
  createdAt: string;
}

export interface ComparisonMetrics {
  name: string;
  safety: number;
  cleanliness: number;
  affordability: number;
  rating: number;
  accessibility: number;
}

export interface WikiData {
  summary: string;
  thumbnail?: string;
  url?: string;
  heritageSites?: string[];
}

export type DashboardTab = 'overview' | 'explore' | 'history' | 'safety' | 'compare' | 'insights';
