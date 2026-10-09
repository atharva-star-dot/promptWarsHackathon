# Plan: Quality Hardening & Compliance Pass

## Architecture & Technology Choices
1. **Testing Framework**:
   - **Vitest** (`vitest` + `@vitest/coverage-v8`): Since CityPulse is built with Vite, Vitest requires zero additional configuration wrappers, shares `vite.config.ts`, handles TypeScript natively out-of-the-box, and runs in sub-seconds.
   - Test files will live in `src/__tests__/`:
     - `scoring.test.ts` (covers `computeSafetyScore` & `computeComparisonMetrics`)
     - `nlpEngine.test.ts` (covers `generateAIInsights` & `analyzeReportSentiment`)
     - `apiCache.test.ts` (covers `getCached`, `setCached`, cache expiry TTL, and parse error resilience)
     - `useCityStore.test.ts` (covers Zustand store mutations, report additions, and localStorage fallback resilience)
2. **Accessibility (WCAG 2.1 AA) Hardening Strategy**:
   - **Skip Link**: Add an accessible `<a href="#main-content">Skip to main content</a>` at the top of `App.tsx` that appears on focus.
   - **Semantic Landmarks**: Ensure `<header role="banner">`, `<main id="main-content">`, `<nav aria-label="...">`, `<section aria-labelledby="...">` are utilized consistently.
   - **Interactive Elements & Focus Rings**: Add global high-contrast focus rings (`focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none`) across buttons, selects, and inputs in `index.css`.
   - **Labels & Accessible Names**:
     - Ensure all search inputs, file inputs, category chips, modal close buttons, and map filter buttons have clear `aria-label` or `<label>` tags.
   - **Dialog/Modal Accessibility (`ReportForm.tsx`)**:
     - Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby="report-modal-title"`.
     - Implement `Escape` key listener to dismiss the modal.
   - **Screen Reader Live Announcements**:
     - Add `aria-live="polite"` region for search results and city selection transitions.
   - **Contrast Enhancements**:
     - Upgrade any low-contrast muted texts from `text-slate-500` / `text-slate-600` to `text-slate-400` or `text-slate-300` where needed for >= 4.5:1 ratio against dark background `#0B0F17` / `#0F172A`.
3. **Documentation Updates**:
   - Update `README.md` to detail testing commands (`npm test`, `npm run test:coverage`), quality standards, and WCAG accessibility compliance features.
