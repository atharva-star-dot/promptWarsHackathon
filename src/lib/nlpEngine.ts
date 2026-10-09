import { WeatherData, Place, CitizenReport } from '../types';
import { SafetyAnalysis } from './scoring';

export interface AIInsight {
  id: string;
  category: 'Weather & Travel' | 'Safety & Mobility' | 'Hospitality & Dining' | 'Urban Alert';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'success';
}

export function generateAIInsights(
  cityName: string,
  weather: WeatherData | null,
  places: Place[],
  safety: SafetyAnalysis,
  reports: CitizenReport[]
): AIInsight[] {
  const insights: AIInsight[] = [];

  // 1. Weather Rule
  if (weather) {
    if (weather.weatherCode >= 95 || weather.weatherCode >= 61) {
      insights.push({
        id: 'weather-rain',
        category: 'Weather & Travel',
        title: 'Precipitation & Drainage Notice',
        description: `Heavy rain (${weather.conditionText}) detected in ${cityName}. Avoid low-lying underpasses, carry water-resistant gear, and expect +15 min transit delays.`,
        severity: 'warning',
      });
    } else if (weather.temp >= 35) {
      insights.push({
        id: 'weather-heat',
        category: 'Weather & Travel',
        title: 'High Heat Index Advisory',
        description: `Current temperature is ${weather.temp}°C (${weather.feelsLike}°C feels like). Stay hydrated, seek shade in public parks, and restrict outdoor treks between 12 PM - 4 PM.`,
        severity: 'warning',
      });
    } else {
      insights.push({
        id: 'weather-ideal',
        category: 'Weather & Travel',
        title: 'Optimal Exploration Conditions',
        description: `Mild ${weather.temp}°C weather with ${weather.conditionText}. Perfect conditions for outdoor heritage walks and street food tours in ${cityName}.`,
        severity: 'success',
      });
    }
  }

  // 2. Safety Rule
  if (safety.score >= 80) {
    insights.push({
      id: 'safety-high',
      category: 'Safety & Mobility',
      title: 'Strong Public Infrastructure',
      description: `${cityName} maintains high civic security (${safety.score}/100) with accessible police checkpoints and emergency medical hubs within 1.5 km of city center.`,
      severity: 'success',
    });
  } else {
    insights.push({
      id: 'safety-caution',
      category: 'Safety & Mobility',
      title: 'Nighttime Mobility Recommendation',
      description: `${safety.safeRouteHint} Prefer ride-hailing services after 10 PM.`,
      severity: 'info',
    });
  }

  // 3. Hospitality & Food Rule
  const budgetFood = places.filter((p) => p.category === 'food' && p.budget === 'Budget').length;
  if (budgetFood > 0) {
    insights.push({
      id: 'food-budget',
      category: 'Hospitality & Dining',
      title: 'High Density of Budget Dining',
      description: `Discovered ${budgetFood}+ highly-rated budget food stalls & cafes nearby offering local traditional cuisine.`,
      severity: 'info',
    });
  }

  // 4. Community Reports Rule
  const recentReports = reports.filter((r) => r.cityId === cityName || true).slice(0, 3);
  if (recentReports.length > 0) {
    const types = Array.from(new Set(recentReports.map((r) => r.type))).join(', ');
    insights.push({
      id: 'community-alert',
      category: 'Urban Alert',
      title: 'Citizen Community Updates',
      description: `${recentReports.length} live community reports logged nearby (${types}). Check interactive map markers before commuting.`,
      severity: 'warning',
    });
  }

  return insights;
}

export function analyzeReportSentiment(text: string): 'Critical' | 'Warning' | 'Neutral' {
  const lower = text.toLowerCase();
  if (lower.includes('severe') || lower.includes('danger') || lower.includes('accident') || lower.includes('flooding') || lower.includes('emergency')) {
    return 'Critical';
  }
  if (lower.includes('unsafe') || lower.includes('pothole') || lower.includes('broken') || lower.includes('dark') || lower.includes('water')) {
    return 'Warning';
  }
  return 'Neutral';
}
