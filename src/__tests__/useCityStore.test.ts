import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCityStore } from '../store/useCityStore';
import { City, CitizenReport } from '../types';

describe('useCityStore', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset store state
    useCityStore.setState({
      activeTab: 'overview',
      reports: [],
      mapFilters: {
        attraction: true,
        food: true,
        hotel: true,
        heritage: true,
        safety: true,
      },
    });
  });

  it('initializes with default city as Pune', () => {
    const state = useCityStore.getState();
    expect(state.selectedCity.name).toBe('Pune');
    expect(state.selectedCity.country).toBe('India');
    expect(state.activeTab).toBe('overview');
  });

  it('updates selected city', () => {
    const newCity: City = {
      id: 'mumbai-india',
      name: 'Mumbai',
      country: 'India',
      latitude: 19.076,
      longitude: 72.8777,
      population: 12442373,
    };

    useCityStore.getState().setSelectedCity(newCity);
    expect(useCityStore.getState().selectedCity.name).toBe('Mumbai');
  });

  it('switches active dashboard tab', () => {
    useCityStore.getState().setActiveTab('safety');
    expect(useCityStore.getState().activeTab).toBe('safety');

    useCityStore.getState().setActiveTab('compare');
    expect(useCityStore.getState().activeTab).toBe('compare');
  });

  it('toggles map filters accurately', () => {
    expect(useCityStore.getState().mapFilters.safety).toBe(true);
    useCityStore.getState().toggleMapFilter('safety');
    expect(useCityStore.getState().mapFilters.safety).toBe(false);
    useCityStore.getState().toggleMapFilter('safety');
    expect(useCityStore.getState().mapFilters.safety).toBe(true);
  });

  it('adds citizen reports and persists them to localStorage', () => {
    const report: CitizenReport = {
      id: 'test-rep-1',
      cityId: 'Pune',
      type: 'pothole',
      description: 'Major road hazard near bridge',
      lat: 18.52,
      lng: 73.85,
      createdAt: new Date().toISOString(),
    };

    useCityStore.getState().addReport(report);
    const state = useCityStore.getState();
    expect(state.reports).toHaveLength(1);
    expect(state.reports[0].id).toBe('test-rep-1');

    // Verify localStorage item
    const saved = localStorage.getItem('citypulse_citizen_reports');
    expect(saved).not.toBeNull();
    const parsed = JSON.parse(saved!);
    expect(parsed[0].description).toBe('Major road hazard near bridge');
  });

  it('handles localStorage errors gracefully during report persistence', () => {
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('StorageQuotaExceeded');
    });

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const report: CitizenReport = {
      id: 'test-rep-fail',
      cityId: 'Pune',
      type: 'unsafe',
      description: 'Dark alley',
      lat: 18.52,
      lng: 73.85,
      createdAt: new Date().toISOString(),
    };

    expect(() => useCityStore.getState().addReport(report)).not.toThrow();
    expect(consoleSpy).toHaveBeenCalledWith('LocalStorage report save failed', expect.any(Error));
  });
});
