# Feature Specification: CityPulse - Smart Interactive City Exploration Web App

**Feature Branch**: `001-citypulse`  
**Created**: 2026-10-09  
**Status**: Approved  
**Input**: User description: "Build 'CityPulse': a smart, interactive city exploration web app."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Landing, Search & Overview (Priority: P1) 🎯 MVP
As a city explorer, I want to search for any city globally or select a quick-demo chip (e.g. Pune, Mumbai, Delhi, Paris, Tokyo) and view a comprehensive Overview dashboard with live weather, coordinates, local time, and forecasts.

**Why this priority**: Core user journey that establishes immediate utility and validates initial API connectivity (Open-Meteo).

**Independent Test**: Search "Pune" or click "Paris" chip -> Dashboard loads with live weather, 5-day forecast, population, coordinates, and local time.

**Acceptance Scenarios**:
1. **Given** landing page, **When** user types 2+ characters in search bar, **Then** show Open-Meteo debounced autocomplete suggestions.
2. **Given** autocomplete suggestion, **When** user selects a city, **Then** view transitions seamlessly to the city dashboard.
3. **Given** city overview tab, **When** weather API returns data, **Then** display temperature, humidity, wind, UV index, 5-day forecast, and severe weather banner if applicable.

---

### User Story 2 - Interactive Map & Explore / Hospitality (Priority: P1)
As a tourist or resident, I want to browse places to visit, eat, and stay filtered by category and budget, and locate them on an interactive map.

**Why this priority**: Crucial for city exploration and location discovery.

**Independent Test**: Open "Explore & Hospitality" tab -> View categorised places fetched from Overpass API, filter by "Budget", click "Show on Map" -> Map centers on selected marker.

**Acceptance Scenarios**:
1. **Given** Explore tab, **When** city data loads, **Then** display cards for attractions, food/street food, and hotels with distance from city centre and inferred budget badges.
2. **Given** interactive map, **When** user toggles layers (Attractions, Food, Hotels), **Then** update map markers dynamically with marker clustering.
3. **Given** "Near me" button on map, **When** user clicks, **Then** prompt for browser geolocation and center map on user coordinates.

---

### User Story 3 - Safety Score, Safe Routes & Citizen Reporting (Priority: P1)
As a safety-conscious traveler, I want to see an estimated Safety Score for the city, view safe points (police/hospitals) on the map, and report local urban issues with optional photo & voice notes.

**Why this priority**: Key differentiator addressing urban safety concerns and community engagement.

**Independent Test**: Open "Safety & Security" tab -> See estimated safety score (0-100), click "Report Issue" -> Record voice note & attach photo -> Report persists in localStorage and appears on map.

**Acceptance Scenarios**:
1. **Given** Safety tab, **When** Overpass data is processed, **Then** calculate and display an Estimated Safety Score (0-100) based on police, hospital, lighting, and venue density.
2. **Given** Citizen Reporting modal, **When** user selects location on map, attaches photo, and records voice note via MediaRecorder API, **Then** store report in localStorage labelled "Community reports (local to your device)".
3. **Given** Map view, **When** "Citizen Reports" layer is active, **Then** display custom markers for community reports with detail popups.

---

### User Story 4 - History, Culture & Wikipedia Deep-Dive (Priority: P2)
As a culture enthusiast, I want to read about the historical background, heritage sites, and local traditions of the city.

**Why this priority**: Enhances educational and cultural value of the platform.

**Independent Test**: Select "History & Culture" tab -> View Wikipedia summary, city thumbnail image, and historic landmark cards (museums, monuments, heritage sites).

**Acceptance Scenarios**:
1. **Given** History tab, **When** tab is selected, **Then** query Wikipedia REST API for summary text and thumbnail image.
2. **Given** Heritage places from OSM, **When** rendered, **Then** display historic landmarks, monuments, and places of worship.

---

### User Story 5 - Best vs Worst Comparison Tool (Priority: P2)
As a decision-maker comparing locations or cities, I want a side-by-side comparison tool with radar charts comparing safety, cleanliness, affordability, ratings, and accessibility.

**Why this priority**: Provides actionable data comparison to help users make informed destination choices.

**Independent Test**: Open "Best vs Worst" tab -> Select two places or cities -> View side-by-side radar chart with category winners clearly highlighted.

**Acceptance Scenarios**:
1. **Given** Comparison tool, **When** 2 or 3 places/cities are selected, **Then** render Recharts Radar Chart mapping safety, cleanliness, affordability, rating, and accessibility.
2. **Given** comparison metrics, **When** displayed, **Then** append visible "Estimated" badge to all proxy scores.

---

### User Story 6 - Smart City AI Insights & Traffic Curve (Priority: P2)
As an urban commuter, I want to view simulated traffic patterns and AI-generated plain-English recommendations based on weather and city data.

**Why this priority**: Transforms raw city data into actionable, easy-to-understand insights.

**Independent Test**: Open "Smart City Insights" tab -> See daily traffic curve ("Demo data"), AI-generated rule-based recommendations, and sentiment-tagged citizen report feed.

**Acceptance Scenarios**:
1. **Given** Insights tab, **When** loaded, **Then** evaluate rule-based NLP engine over current weather/safety/traffic data to produce plain-English recommendations.
2. **Given** Traffic section, **When** rendered, **Then** show interactive time-of-day traffic curve explicitly labelled "Demo data".

---

### Edge Cases
- **API Failure / Rate Limit**: Overpass API times out -> Fallback to mirror or display friendly error state without breaking Weather/Wiki/Map modules.
- **Geolocation Permission Denied**: User declines "Near me" -> Display graceful toast notification and remain at city center.
- **MediaRecorder Unsupported**: Browser lacks voice recording API -> Gracefully disable voice record button with explanatory tooltip.
- **No Internet / Offline**: Show cached data from `sessionStorage` or display offline fallback banner.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST provide debounced city search with autocomplete via Open-Meteo Geocoding API.
- **FR-002**: System MUST render interactive 3D hero scene using React Three Fiber with 2D fallback for prefers-reduced-motion / low-power mode.
- **FR-003**: System MUST display 6 dashboard sections: Overview, Explore & Hospitality, History & Culture, Safety & Security, Best vs Worst, Smart City Insights.
- **FR-004**: System MUST calculate an Estimated Safety Score (0-100) using Overpass amenity density proxies (police, hospitals, lights, late-night venues).
- **FR-005**: System MUST allow citizen reporting with category selection, map location picker, photo upload, and voice recording (MediaRecorder API) persisted to `localStorage`.
- **FR-006**: System MUST feature an interactive Leaflet map with clustering, toggleable layers, custom markers, and geolocation button.
- **FR-007**: System MUST provide a place/city comparison tool with interactive Recharts radar chart visualization.
- **FR-008**: System MUST generate rule-based NLP recommendations based on live weather and city metrics.
- **FR-009**: System MUST label all heuristic, proxy, or simulated data with visible "Estimated" or "Demo data" tags.

### Key Entities
- **City**: `id`, `name`, `country`, `latitude`, `longitude`, `population`, `timezone`
- **WeatherData**: `temp`, `feelsLike`, `humidity`, `windSpeed`, `uvIndex`, `conditionCode`, `forecast[]`, `alertBanner`
- **Place**: `id`, `name`, `category` (attraction|food|hotel|heritage|safety), `lat`, `lng`, `distance`, `budget` (budget|mid|premium), `tags`
- **CitizenReport**: `id`, `cityId`, `type` (accident|unsafe|pothole|flooding), `description`, `photoUrl`, `audioBlobUrl`, `lat`, `lng`, `createdAt`
- **ComparisonMetrics**: `safety`, `cleanliness`, `affordability`, `rating`, `accessibility`

## Success Criteria *(mandatory)*

### Measurable Outcomes
- **SC-001**: Searching any city populates all 6 dashboard sections within 5 seconds under standard network conditions.
- **SC-002**: Fully responsive layout renders without horizontal scroll across devices (360px mobile to 1440px+ desktop).
- **SC-003**: 100% of non-verified data features visible "Estimated" or "Demo data" tags.
- **SC-004**: 0 console crashes or full-page blank screens when any external API fails.
- **SC-005**: Public static deployment available on Vercel with zero environment variable setup.

## Assumptions
- Uses purely client-side state management (Zustand + `localStorage` + `sessionStorage`).
- All external data fetching utilizes keyless public APIs (Open-Meteo, Overpass, Wikipedia).
- Image uploads in citizen reports are stored locally via Base64 / Blob URLs in browser storage.
