import { describe, it, expect } from 'vitest';
import { computeSafetyScore, computeComparisonMetrics } from '../lib/scoring';
import { Place } from '../types';

describe('computeSafetyScore', () => {
  it('returns default fallback score of 72 for small datasets (< 5 places)', () => {
    const places: Place[] = [
      { id: '1', name: 'Place 1', category: 'attraction', subCategory: 'Museum', lat: 18.5, lng: 73.8, budget: 'Mid', distance: 1.2 },
      { id: '2', name: 'Place 2', category: 'food', subCategory: 'Restaurant', lat: 18.5, lng: 73.8, budget: 'Budget', distance: 0.5 },
    ];
    const result = computeSafetyScore(places);
    expect(result.score).toBe(72);
    expect(result.level).toBe('Moderate Safety');
    expect(result.policeCount).toBe(1); // Math.max(1, 0)
    expect(result.hospitalCount).toBe(1);
    expect(result.safeRouteHint).toBe('Stick to well-lit main boulevards and avoid isolated alleys late at night.');
  });

  it('correctly calculates score with police stations, hospitals, and wheelchair accessibility', () => {
    const places: Place[] = [
      { id: '1', name: 'Police Station Central', category: 'safety', subCategory: 'Police Station', lat: 18.5, lng: 73.8, budget: 'Budget', distance: 0.8 },
      { id: '2', name: 'General Hospital', category: 'safety', subCategory: 'Hospital Clinic', lat: 18.5, lng: 73.8, budget: 'Budget', distance: 1.1, wheelchair: true },
      { id: '3', name: 'Cafe Corner', category: 'food', subCategory: 'Cafe', lat: 18.5, lng: 73.8, budget: 'Budget', distance: 0.2, wheelchair: true },
      { id: '4', name: 'Grand Hotel', category: 'hotel', subCategory: 'Hotel', lat: 18.5, lng: 73.8, budget: 'Premium', distance: 2.0 },
      { id: '5', name: 'Fort Landmark', category: 'heritage', subCategory: 'Monument', lat: 18.5, lng: 73.8, budget: 'Budget', distance: 3.1 },
      { id: '6', name: 'District Police Post', category: 'safety', subCategory: 'Police Outpost', lat: 18.5, lng: 73.8, budget: 'Budget', distance: 1.5 },
    ];

    const result = computeSafetyScore(places);
    // 2 police * 6 = 12, 1 hospital * 4 = 4, 2 accessible * 2 = 4, base 65 -> 65 + 12 + 4 + 4 = 85
    expect(result.score).toBe(85);
    expect(result.level).toBe('High Safety');
    expect(result.policeCount).toBe(2);
    expect(result.hospitalCount).toBe(1);
    expect(result.safeRouteHint).toContain('Central Police Hub');
  });

  it('clamps safety score between 45 and 96', () => {
    // Zero safety places with >= 5 generic places
    const lowPlaces: Place[] = Array.from({ length: 6 }, (_, i) => ({
      id: `p-${i}`,
      name: `Place ${i}`,
      category: 'food' as const,
      subCategory: 'Diner',
      lat: 18.5,
      lng: 73.8,
      budget: 'Budget' as const,
      distance: 0.5,
    }));
    const lowResult = computeSafetyScore(lowPlaces);
    expect(lowResult.score).toBeGreaterThanOrEqual(45);
    expect(lowResult.score).toBeLessThanOrEqual(96);

    // Over-saturated places to test upper clamp (96)
    const saturatedPlaces: Place[] = Array.from({ length: 20 }, (_, i) => ({
      id: `pol-${i}`,
      name: `Police Station ${i}`,
      category: 'safety' as const,
      subCategory: 'Police HQ',
      lat: 18.5,
      lng: 73.8,
      budget: 'Budget' as const,
      distance: 0.5,
      wheelchair: true,
    }));
    const highResult = computeSafetyScore(saturatedPlaces);
    expect(highResult.score).toBe(96);
    expect(highResult.level).toBe('High Safety');
  });

  it('handles hospital-only route hint when police stations are zero', () => {
    const places: Place[] = [
      { id: '1', name: 'City Hospital', category: 'safety', subCategory: 'Hospital Medical', lat: 18.5, lng: 73.8, budget: 'Budget', distance: 1.0 },
      { id: '2', name: 'Place 2', category: 'food', subCategory: 'Cafe', lat: 18.5, lng: 73.8, budget: 'Budget', distance: 1.0 },
      { id: '3', name: 'Place 3', category: 'hotel', subCategory: 'Inn', lat: 18.5, lng: 73.8, budget: 'Budget', distance: 1.0 },
      { id: '4', name: 'Place 4', category: 'attraction', subCategory: 'Park', lat: 18.5, lng: 73.8, budget: 'Budget', distance: 1.0 },
      { id: '5', name: 'Place 5', category: 'attraction', subCategory: 'Gallery', lat: 18.5, lng: 73.8, budget: 'Budget', distance: 1.0 },
    ];
    const result = computeSafetyScore(places);
    expect(result.safeRouteHint).toContain('primary medical & transit avenues');
  });

  it('handles empty places array safely', () => {
    const result = computeSafetyScore([]);
    expect(result.score).toBe(72);
    expect(result.level).toBe('Moderate Safety');
    expect(result.policeCount).toBe(1);
    expect(result.hospitalCount).toBe(1);
  });
});

describe('computeComparisonMetrics', () => {
  it('computes deterministic hash-based metrics when places are empty or omitted', () => {
    const metrics1 = computeComparisonMetrics('Pune');
    const metrics2 = computeComparisonMetrics('Pune');
    expect(metrics1).toEqual(metrics2);
    expect(metrics1.name).toBe('Pune');
    expect(metrics1.safety).toBeGreaterThanOrEqual(0);
    expect(metrics1.safety).toBeLessThanOrEqual(100);
    expect(metrics1.cleanliness).toBeGreaterThanOrEqual(0);
    expect(metrics1.affordability).toBeGreaterThanOrEqual(0);
    expect(metrics1.rating).toBeGreaterThanOrEqual(0);
    expect(metrics1.accessibility).toBeGreaterThanOrEqual(0);
  });

  it('adjusts metrics when concrete places array is provided', () => {
    const places: Place[] = [
      { id: '1', name: 'Police Point', category: 'safety', subCategory: 'Police', lat: 18.5, lng: 73.8, budget: 'Budget', distance: 0.5, wheelchair: true },
      { id: '2', name: 'Budget Diner', category: 'food', subCategory: 'Diner', lat: 18.5, lng: 73.8, budget: 'Budget', distance: 0.5, wheelchair: true },
    ];
    const metrics = computeComparisonMetrics('Pune', places);
    expect(metrics.name).toBe('Pune');
    expect(metrics.safety).toBeLessThanOrEqual(95);
    expect(metrics.affordability).toBeLessThanOrEqual(95);
    expect(metrics.accessibility).toBeLessThanOrEqual(95);
  });

  it('handles empty string and unusual place names without throwing', () => {
    expect(() => computeComparisonMetrics('')).not.toThrow();
    const emptyResult = computeComparisonMetrics('');
    expect(emptyResult.name).toBe('');
    expect(emptyResult.rating).toBeGreaterThanOrEqual(0);
  });
});
