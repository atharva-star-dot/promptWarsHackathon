import { create } from 'zustand';
import { City, DashboardTab, PlaceCategory, CitizenReport } from '../types';

const DEFAULT_CITY: City = {
  id: 'pune-india',
  name: 'Pune',
  country: 'India',
  latitude: 18.5204,
  longitude: 73.8567,
  population: 3124458,
  timezone: 'Asia/Kolkata',
  admin1: 'Maharashtra'
};

const REPORTS_KEY = 'citypulse_citizen_reports';

const loadReports = (): CitizenReport[] => {
  try {
    const stored = localStorage.getItem(REPORTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

interface CityStore {
  selectedCity: City;
  activeTab: DashboardTab;
  mapFilters: Record<PlaceCategory, boolean>;
  reports: CitizenReport[];
  setSelectedCity: (city: City) => void;
  setActiveTab: (tab: DashboardTab) => void;
  toggleMapFilter: (category: PlaceCategory) => void;
  addReport: (report: CitizenReport) => void;
}

export const useCityStore = create<CityStore>((set) => ({
  selectedCity: DEFAULT_CITY,
  activeTab: 'overview',
  mapFilters: {
    attraction: true,
    food: true,
    hotel: true,
    heritage: true,
    safety: true,
  },
  reports: loadReports(),
  setSelectedCity: (city) => set({ selectedCity: city }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleMapFilter: (category) =>
    set((state) => ({
      mapFilters: {
        ...state.mapFilters,
        [category]: !state.mapFilters[category],
      },
    })),
  addReport: (report) =>
    set((state) => {
      const updated = [report, ...state.reports];
      try {
        localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage report save failed', e);
      }
      return { reports: updated };
    }),
}));
