# Tasks: CityPulse - Smart Interactive City Exploration Web App

**Input**: Design documents from `/specs/001-citypulse/`

## Phase 1: Scaffold, Dependencies & Layout Shell (0 - 20 min) [P0]

- [ ] T001 [P0] Initialize Vite React TypeScript project and configure package.json dependencies (Tailwind, Lucide, Framer Motion, Leaflet, Recharts, Three/R3F, Zustand).
- [ ] T002 [P0] Configure Tailwind CSS with glassmorphism styles, dark theme background gradients, and animation keyframes.
- [ ] T003 [P0] Define core TypeScript types in `src/types/index.ts` (City, WeatherData, Place, CitizenReport, ComparisonMetrics).
- [ ] T004 [P0] Create Zustand store in `src/store/useCityStore.ts` for selected city state, active tab, map filters, and community reports.
- [ ] T005 [P0] Build layout shell in `src/App.tsx` with sticky Header, desktop tab navigation, and mobile bottom navigation bar.

---

## Phase 2: Geocoding, Live Weather & Overview Tab (20 - 60 min) [P0] 🎯 MVP

- [ ] T006 [P0] Implement Open-Meteo Geocoding API wrapper in `src/services/geocode.ts` with sessionStorage caching and 400ms debouncing.
- [ ] T007 [P0] Build `SearchBar` in `src/components/ui/SearchBar.tsx` with live autocomplete dropdown and quick-demo city chips (Pune, Mumbai, Delhi, Paris, Tokyo).
- [ ] T008 [P0] Implement Open-Meteo Weather API wrapper in `src/services/weather.ts` (current conditions, 5-day forecast, severe weather codes).
- [ ] T009 [P0] Build `WeatherCard` and Overview dashboard section in `src/components/dashboard/OverviewTab.tsx` displaying live temperature, humidity, wind, UV index, weather alert banner, and local time.
- [ ] T010 [P0] Add loading skeleton loaders (`src/components/ui/Skeletons.tsx`) and error fallbacks for the Overview section.

---

## Phase 3: Overpass Places, Explore, History & Interactive Map (60 - 110 min) [P0]

- [ ] T011 [P0] Implement Overpass API service in `src/services/overpass.ts` with batched queries for places/safety proxies and fallback mirror (`overpass.kumi.systems`).
- [ ] T012 [P0] Build `ExploreTab` in `src/components/dashboard/ExploreTab.tsx` with category tabs (Attractions, Food, Hotels), budget inference, and card filters.
- [ ] T013 [P0] Implement Wikipedia API service in `src/services/wikipedia.ts` for city summary text & thumbnail image.
- [ ] T014 [P0] Build `HistoryTab` in `src/components/dashboard/HistoryTab.tsx` featuring city historical summary, culture cards, and heritage sites.
- [ ] T015 [P0] Build interactive `MapView` in `src/components/map/MapView.tsx` using Leaflet & `react-leaflet`, custom SVG markers, layer toggles, and "Near me" geolocation button.

---

## Phase 4: Safety Score, Citizen Reports, Compare & AI Insights (110 - 150 min) [P0]

- [ ] T016 [P0] Build `scoring.ts` in `src/lib/scoring.ts` to compute Estimated Safety Score (0-100), budget inference, and comparison metrics.
- [ ] T017 [P0] Build `SafetyPanel` in `src/components/dashboard/SafetyPanel.tsx` with safety gauge, safe route hints, and safety markers on map.
- [ ] T018 [P0] Build `ReportForm` modal in `src/components/reports/ReportForm.tsx` with map click location, issue selector, photo upload, and MediaRecorder voice recording saved to localStorage.
- [ ] T019 [P0] Build `ComparePanel` in `src/components/dashboard/ComparePanel.tsx` featuring Recharts Radar comparison for places/cities with "Estimated" badges.
- [ ] T020 [P0] Build rule-based NLP insight engine in `src/lib/nlpEngine.ts` and `InsightsPanel` in `src/components/dashboard/InsightsPanel.tsx` featuring plain-English recommendations and traffic time-of-day curve ("Demo data").

---

## Phase 5: 3D Scene, Motion Polish, Mobile Responsiveness & Skeletons (150 - 175 min) [P2]

- [ ] T021 [P2] Build lazy-loaded 3D Hero scene in `src/components/3d/Hero3D.tsx` with React Three Fiber (rotating globe/skyline reacting to cursor) and 2D gradient fallback.
- [ ] T022 [P2] Add Framer Motion page transitions, tab switch animations, and micro-interactions throughout the dashboard.
- [ ] T023 [P2] Mobile responsiveness audit (360px breakpoint check, bottom navigation bar, card vertical stacking).

---

## Phase 6: Final Verification, Testing & Vercel Deploy (175 - 180 min) [P0]

- [ ] T024 [P0] Run full TypeScript typecheck and Vite production build (`npm run build`).
- [ ] T025 [P0] Verify search and dashboard on 3 distinct cities (e.g. Pune, Paris, Tokyo).
- [ ] T026 [P0] Create project documentation in `README.md` with live demo link and setup instructions.
