import { describe, it, expect } from 'vitest';
import { generateAIInsights, analyzeReportSentiment } from '../lib/nlpEngine';
import { WeatherData, Place, CitizenReport } from '../types';
import { SafetyAnalysis } from '../lib/scoring';

describe('generateAIInsights', () => {
  const dummySafety: SafetyAnalysis = {
    score: 85,
    level: 'High Safety',
    policeCount: 3,
    hospitalCount: 2,
    safeRouteHint: 'Boulevard path safe',
  };

  const samplePlaces: Place[] = [
    { id: '1', name: 'Cheap Eats', category: 'food', subCategory: 'Street Food', lat: 18.5, lng: 73.8, budget: 'Budget', distance: 0.5 },
  ];

  it('generates severe precipitation warning when weather code indicates rain (>=61)', () => {
    const rainWeather: WeatherData = {
      temp: 22,
      feelsLike: 23,
      humidity: 89,
      windSpeed: 20,
      uvIndex: 2,
      weatherCode: 65,
      conditionText: 'Heavy Rain',
      isDay: true,
      forecast: [],
    };

    const insights = generateAIInsights('Pune', rainWeather, samplePlaces, dummySafety, []);
    const rainInsight = insights.find((i) => i.id === 'weather-rain');
    expect(rainInsight).toBeDefined();
    expect(rainInsight?.severity).toBe('warning');
    expect(rainInsight?.title).toBe('Precipitation & Drainage Notice');
    expect(rainInsight?.description).toContain('Heavy rain');
  });

  it('generates high heat index advisory when temperature is >= 35°C', () => {
    const heatWeather: WeatherData = {
      temp: 38,
      feelsLike: 42,
      humidity: 40,
      windSpeed: 10,
      uvIndex: 9,
      weatherCode: 0,
      conditionText: 'Clear sky',
      isDay: true,
      forecast: [],
    };

    const insights = generateAIInsights('Delhi', heatWeather, samplePlaces, dummySafety, []);
    const heatInsight = insights.find((i) => i.id === 'weather-heat');
    expect(heatInsight).toBeDefined();
    expect(heatInsight?.severity).toBe('warning');
    expect(heatInsight?.title).toBe('High Heat Index Advisory');
    expect(heatInsight?.description).toContain('38°C');
  });

  it('generates optimal conditions insight when weather is mild and clear', () => {
    const mildWeather: WeatherData = {
      temp: 24,
      feelsLike: 24,
      humidity: 50,
      windSpeed: 8,
      uvIndex: 4,
      weatherCode: 1,
      conditionText: 'Mainly Clear',
      isDay: true,
      forecast: [],
    };

    const insights = generateAIInsights('Paris', mildWeather, samplePlaces, dummySafety, []);
    const idealInsight = insights.find((i) => i.id === 'weather-ideal');
    expect(idealInsight).toBeDefined();
    expect(idealInsight?.severity).toBe('success');
  });

  it('handles null weather gracefully without generating weather insights or throwing', () => {
    const insights = generateAIInsights('Tokyo', null, samplePlaces, dummySafety, []);
    const weatherInsights = insights.filter((i) => i.category === 'Weather & Travel');
    expect(weatherInsights).toHaveLength(0);
    expect(insights.length).toBeGreaterThan(0);
  });

  it('generates safety caution when safety score is below 80', () => {
    const lowSafety: SafetyAnalysis = {
      score: 55,
      level: 'Exercise Caution',
      policeCount: 0,
      hospitalCount: 0,
      safeRouteHint: 'Stick to well-lit boulevards.',
    };

    const insights = generateAIInsights('Metropolis', null, samplePlaces, lowSafety, []);
    const cautionInsight = insights.find((i) => i.id === 'safety-caution');
    expect(cautionInsight).toBeDefined();
    expect(cautionInsight?.severity).toBe('info');
    expect(cautionInsight?.description).toContain('Prefer ride-hailing services');
  });

  it('generates budget dining insight when budget food places exist', () => {
    const insights = generateAIInsights('Pune', null, samplePlaces, dummySafety, []);
    const foodInsight = insights.find((i) => i.id === 'food-budget');
    expect(foodInsight).toBeDefined();
    expect(foodInsight?.description).toContain('1+');
  });

  it('generates community report alert when recent reports exist', () => {
    const reports: CitizenReport[] = [
      {
        id: 'r1',
        cityId: 'Pune',
        type: 'pothole',
        description: 'Large pothole on main road',
        lat: 18.5,
        lng: 73.8,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'r2',
        cityId: 'Pune',
        type: 'flooding',
        description: 'Water clogging under bridge',
        lat: 18.5,
        lng: 73.8,
        createdAt: new Date().toISOString(),
      },
    ];

    const insights = generateAIInsights('Pune', null, samplePlaces, dummySafety, reports);
    const alertInsight = insights.find((i) => i.id === 'community-alert');
    expect(alertInsight).toBeDefined();
    expect(alertInsight?.severity).toBe('warning');
    expect(alertInsight?.description).toContain('pothole, flooding');
  });
});

describe('analyzeReportSentiment', () => {
  it('classifies severe keywords as Critical priority', () => {
    expect(analyzeReportSentiment('Severe car accident on bridge')).toBe('Critical');
    expect(analyzeReportSentiment('Immediate danger to pedestrians')).toBe('Critical');
    expect(analyzeReportSentiment('Heavy flooding blocked emergency lane')).toBe('Critical');
  });

  it('classifies caution/hazard keywords as Warning priority', () => {
    expect(analyzeReportSentiment('Deep pothole near junction')).toBe('Warning');
    expect(analyzeReportSentiment('Street light is broken and dark area')).toBe('Warning');
    expect(analyzeReportSentiment('Unsafe sidewalk construction')).toBe('Warning');
  });

  it('classifies general descriptions as Neutral priority', () => {
    expect(analyzeReportSentiment('Public bench needs cleaning')).toBe('Neutral');
    expect(analyzeReportSentiment('Park gate open late')).toBe('Neutral');
    expect(analyzeReportSentiment('')).toBe('Neutral');
  });
});
