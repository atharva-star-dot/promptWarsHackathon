# Feature Specification: CityPulse - Smart Interactive City Exploration Web App

**Feature Branch**: `001-citypulse`  
**Created**: 2026-10-09  
**Status**: Approved  
**Input**: User description: "Build 'CityPulse': a smart, interactive city exploration web app."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Landing, Search & Overview (Priority: P1) 🎯 MVP
As a city explorer, I want to search for any city globally or select a quick-demo chip (e.g. Pune, Mumbai, Delhi, Paris, Tokyo) and view a comprehensive Overview dashboard with live weather, coordinates, local time, and forecasts.

### User Story 2 - Interactive Map & Explore / Hospitality (Priority: P1)
As a tourist or resident, I want to browse places to visit, eat, and stay filtered by category and budget, and locate them on an interactive map.

### User Story 3 - Safety Score, Safe Routes & Citizen Reporting (Priority: P1)
As a safety-conscious traveler, I want to see an estimated Safety Score for the city, view safe points (police/hospitals) on the map, and report local urban issues with optional photo & voice notes.

### User Story 4 - History, Culture & Wikipedia Deep-Dive (Priority: P2)
As a culture enthusiast, I want to read about the historical background, heritage sites, and local traditions of the city.

### User Story 5 - Best vs Worst Comparison Tool (Priority: P2)
As a decision-maker comparing locations or cities, I want a side-by-side comparison tool with radar charts comparing safety, cleanliness, affordability, ratings, and accessibility.

### User Story 6 - Smart City AI Insights & Traffic Curve (Priority: P2)
As an urban commuter, I want to view simulated traffic patterns and AI-generated plain-English recommendations based on weather and city data.

## Requirements *(mandatory)*
- **FR-001**: Open-Meteo debounced search & weather.
- **FR-002**: React Three Fiber 3D hero scene with 2D fallback.
- **FR-003**: 6 Dashboard sections (Overview, Explore, History, Safety, Compare, Insights).
- **FR-004**: Safety score calculation & Safe Route hints.
- **FR-005**: Citizen reporting with photo + voice recording via MediaRecorder API.
- **FR-006**: Leaflet interactive map with marker clustering & layers.
- **FR-007**: Recharts Radar comparison tool.
- **FR-008**: Rule-based NLP recommendations engine.
- **FR-009**: Clear "Estimated" and "Demo data" labelling throughout.

## Success Criteria *(mandatory)*
- SC-001: All dashboard sections load in <5s.
- SC-002: Mobile to desktop responsiveness (360px - 1440px+).
- SC-003: 100% honest data labelling.
- SC-004: Resilient UI with loading skeletons & fallback states.
- SC-005: Public static deploy on Vercel.
