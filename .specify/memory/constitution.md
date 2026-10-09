<!--
### Sync Impact Report
- Version change: 1.0.0 -> 2.0.0
- List of modified principles:
  - Principle 1: Ship-first (Added)
  - Principle 2: Frontend-only Architecture (Added)
  - Principle 3: Free, Key-less Public APIs Only (Added)
  - Principle 4: Honest & Labeled Data (Added)
  - Principle 5: Component Resilience (Added)
  - Principle 6: High Design Quality & Glassmorphism Theme (Added)
  - Principle 7: Performance & Caching (Added)
  - Principle 8: Code Quality & Component Architecture (Added)
- Added sections:
  - Technical Constraints
  - Quality & Governance
- Follow-up TODOs: None
-->

# CityPulse Constitution

## Core Principles

### 1. Ship-First
A deployed, working live web application beats extra incomplete features. Always cut scope before cutting quality.

### 2. Frontend-Only Architecture
Built with Vite + React + TypeScript, Tailwind CSS, Framer Motion, React Three Fiber, and Leaflet. Strict frontend-only execution: no backend server, no Docker, no AWS. Deployed directly to Vercel.

### 3. Free, Key-less Public APIs Only
Rely exclusively on free, publicly available APIs that require no API keys:
- Open-Meteo (Geocoding & Weather)
- OpenStreetMap Overpass API (Points of interest & Safety proxies)
- Wikipedia REST API (History, Culture & Media)

### 4. Honest Data & Transparent Labelling
All heuristic, estimated, or simulated data must be visibly labelled ("Estimated" / "Demo data"). Never present fake or mock data as verified facts.

### 5. Component & Data Resilience
Every data-driven component must handle all lifecycle states gracefully (loading skeleton, error state, empty state). Failure of any single API must never break the page or block other components from rendering.

### 6. Design Quality & Glassmorphism Theme
Dark, modern glassmorphism UI featuring smooth Framer Motion animations. Fully responsive (mobile-first, 360px to 1440px+), accessible (color contrast, keyboard navigation, aria-labels, and respecting `prefers-reduced-motion`).

### 7. Performance & Optimization
Lazy-load heavy assets including 3D scenes and interactive maps. Cache API responses in `sessionStorage` and debounce search inputs to respect API rate limits.

### 8. Code Quality & Clean Architecture
Modular, strongly-typed components. One data-fetching hook per data source. Zero secrets, tokens, or private keys in source code.

## Governance

This constitution supersedes all other architectural decisions for the CityPulse project. Amendments require documentation and semantic version bumps.

**Version**: 2.0.0 | **Ratified**: 2026-10-09 | **Last Amended**: 2026-10-09
