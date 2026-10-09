<!--
### Sync Impact Report
- Version change: 2.0.0 -> 3.0.0
- List of modified principles:
  - Principle 8: Code Quality & Clean Architecture (Updated with testing, zero secrets, sanitized input, documented README)
- Added principles:
  - Principle 9: Automated Testing & High Core Coverage (Added)
  - Principle 10: Rigorous WCAG 2.1 AA Accessibility (Added)
  - Principle 11: Scope Control & Strict Hardening (Added)
- Added sections:
  - Non-Negotiable Quality Principles
- Follow-up TODOs: Implement automated test suite (>80% core logic coverage) and full WCAG 2.1 AA accessibility hardening.
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

### 8. Code Quality, Security & Documentation
Modular, strongly-typed components. Zero hardcoded secrets, tokens, or private keys in source code. All inputs sanitized and validated. No unused dead code. Clear and comprehensive README documenting setup, run, test, and verification commands.

## Non-Negotiable Quality Principles

### 9. Automated Testing & High Core Coverage
Every module containing business logic, heuristic computation, or scoring must have automated unit tests.
- Minimum **80% code coverage** across core logic modules (`scoring.ts`, `nlpEngine.ts`, `apiCache.ts`, `useCityStore.ts`).
- Must thoroughly cover happy paths, edge cases (empty collections, null/undefined properties, negative/oversized numbers, malformed inputs), and error resilience.
- The entire test suite must execute cleanly via a single standard command (`npm test`) and pass with exit code 0 before any task is marked complete.

### 10. Rigorous Accessibility (WCAG 2.1 AA)
The UI must meet WCAG 2.1 AA standards across all viewports and interaction modes:
- **Semantic HTML first**: Use proper semantic HTML elements (`<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<button>`, `<label>`), reserving ARIA attributes for cases where native semantics are insufficient.
- **Keyboard Navigation**: All interactive elements (search, filters, city chips, modals, buttons, forms) must be fully navigable and operable via standard keyboard interactions (`Tab`, `Shift+Tab`, `Enter`, `Escape`), featuring distinct, high-contrast focus rings (`focus-visible`).
- **Accessible Names & ARIA**: Form inputs must have programmatically associated `<label>` or `aria-label`/`aria-labelledby`. Dynamic status changes and errors must announce via `aria-live` or appropriate role alerts.
- **Visual Contrast & Zoom**: Text and icon controls must maintain a minimum 4.5:1 contrast ratio against dark background layers. Layouts must adapt cleanly without clipping or broken flow at 200% zoom and across standard viewport widths (360px to 1440px+).

### 11. Strict Scope Control & Hardening Pass
Do not add arbitrary external features, change defined behaviors, or introduce heavy infrastructure (no Docker, no AWS, no database servers). All efforts in this pass focus strictly on testing, reliability, security, accessibility, and documentation hardening.

## Governance

This constitution supersedes all other architectural decisions for the CityPulse project. Amendments require documentation and semantic version bumps.

**Version**: 3.0.0 | **Ratified**: 2026-10-09 | **Last Amended**: 2026-10-09
