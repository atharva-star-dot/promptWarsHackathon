# Implementation Plan: CityPulse - Smart Interactive City Exploration Web App

**Branch**: `001-citypulse` | **Date**: 2026-10-09 | **Spec**: [spec.md](file:///E:/OneMoreTime/promptWars/Project/promptWarsHackathon/specs/001-citypulse/spec.md)

**Input**: Feature specification from `/specs/001-citypulse/spec.md`

## Summary

Build **CityPulse**, a client-side React + TypeScript web app for smart city exploration combining weather, places, safety scores, citizen reports, history, comparison tools, and rule-based AI insights using free public APIs.

## Technical Context

**Language/Version**: TypeScript 5+ / React 18  
**Primary Dependencies**: Vite, Tailwind CSS, Framer Motion, Three.js (`@react-three/fiber`, `@react-three/drei`), Leaflet (`react-leaflet`, `leaflet.markercluster`), Recharts, Zustand, Lucide React icons  
**Storage**: `sessionStorage` (API query caching), `localStorage` (Citizen reports)  
**Testing**: Build verification (`npm run build`), TypeScript typecheck (`tsc --noEmit`)  
**Target Platform**: Web browsers (Desktop & Mobile, 360px+)  
**Project Type**: Single-Page Web Application (SPA)  
**Performance Goals**: Dashboard rendering <500ms post API fetch; Lazy-loaded R3F scene and Leaflet map  
**Constraints**: 100% Client-side execution; Zero backend, zero Docker, zero paid API keys  

## Constitution Check

- [x] **Ship-First**: Scope defined for 3-hour build; P0 MVP tasks prioritized.
- [x] **Frontend-Only**: Pure SPA (Vite + React + TS) deploying to Vercel.
- [x] **Free APIs**: Open-Meteo, Overpass API, Wikipedia REST API.
- [x] **Honest Data**: "Estimated" & "Demo data" tags on heuristic metrics.
- [x] **Resilience**: Skeletons, error boundaries, empty states per module.
- [x] **Design Quality**: Dark glassmorphism, Framer Motion animations, mobile responsive.
- [x] **Performance**: Lazy-loading heavy modules, sessionStorage caching, 400ms debounce.
- [x] **Code Quality**: Strongly-typed React components, modular services & custom hooks.

## Project Structure

```text
src/
├── assets/             # Static icons & graphics
├── components/         # React UI Components
│   ├── 3d/             # R3F Canvas & 3D Hero/Weather Scene
│   ├── dashboard/      # Overview, Explore, History, Safety, Compare, Insights Tabs
│   ├── map/            # Leaflet Map, Cluster Markers, Layers, Controls
│   ├── reports/        # Citizen Reporting Modal, Photo & Voice Recorder
│   ├── ui/             # Glassmorphism Cards, Badges, Buttons, Navigation, Skeletons
│   └── Header.tsx      # Sticky Top bar with Search & Autocomplete
├── hooks/              # Custom Data Fetching Hooks
│   ├── useCity.ts
│   ├── useWeather.ts
│   ├── usePlaces.ts
│   ├── useWiki.ts
│   └── useReports.ts
├── lib/                # Utility & Scoring Logic
│   ├── apiCache.ts     # sessionStorage Caching Helper
│   ├── nlpEngine.ts    # Rule-based Plain-English Insight Generator
│   └── scoring.ts      # Safety score, Budget Inference, Compare Radar Scores
├── services/           # Keyless Public API Wrappers
│   ├── geocode.ts      # Open-Meteo Geocoding
│   ├── overpass.ts     # OpenStreetMap Overpass (Batched query + mirror fallback)
│   ├── weather.ts      # Open-Meteo Weather & Forecast
│   └── wikipedia.ts    # Wikipedia REST API Summary & Thumbnail
├── store/              # Zustand Store
│   └── useCityStore.ts # Selected City, Active Tab, Map Filters, Local Reports
├── types/              # TypeScript Interfaces & Definitions
│   └── index.ts
├── App.tsx             # Main App Layout & Tab Routing
├── index.css           # Tailwind Directives & Custom Glassmorphism Styles
└── main.tsx            # App Entry Point
```

**Structure Decision**: Single project Vite + React SPA architecture.

## API Integration Architecture

1. **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search?name={query}&count=5`
2. **Weather**: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
3. **Overpass Places**: `https://overpass-api.de/api/interpreter` (Fallback: `https://overpass.kumi.systems/api/interpreter`)
   - Batched query fetching amenities (police, hospital, restaurant, hotel, tourism, historic) within city bounding box / radius.
4. **Wikipedia Summary**: `https://en.wikipedia.org/api/rest_v1/page/summary/{city}`
