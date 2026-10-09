# Feature Specification: Quality Hardening & Compliance Pass

**Feature Branch**: `quality-hardening`  
**Specification Version**: 1.0.0  
**Target Milestone**: Testing Score >= 75/100, Accessibility Score >= 85/100  

## 1. Problem & Context
The initial rapid MVP scored 0/100 on automated testing and 45/100 on accessibility. To establish enterprise-grade quality and ensure full inclusivity for diverse users, CityPulse requires a non-breaking quality hardening pass that equips the application with automated testing, 80%+ coverage on core logic, keyboard and screen-reader accessibility (WCAG 2.1 AA), and robust error handling.

## 2. User Stories

1. **Maintainer Test Suite & Confidence**:
   - *As a maintainer*, I want to run `npm test` and see a passing automated test suite covering core business logic, edge cases, and error handling with a detailed coverage report showing >= 80% coverage.
2. **Keyboard-Only Accessibility**:
   - *As a keyboard-only user*, I want to tab through all controls in a logical order, see an obvious focus ring on every interactive element, navigate search results with arrow keys or tab, and close dialogs with the `Escape` key.
3. **Screen-Reader Accessibility**:
   - *As a screen-reader user*, I want every interactive button, input, dialog, and image to have an explicit accessible name, semantic landmarks (`banner`, `main`, `navigation`, `region`), and dynamic updates announced via `aria-live`.
4. **Low-Vision & High-Zoom Usability**:
   - *As a low-vision user*, I want text to adhere to WCAG 2.1 AA contrast ratios (>= 4.5:1 for normal text, >= 3:1 for large text) and the layout to scale up to 200% zoom without horizontal scrolling or clipping.

## 3. Scope & Non-Goals
- **In-Scope**:
  - Install Vitest + Coverage for zero-friction Vite testing.
  - Automated tests covering `src/lib/scoring.ts`, `src/lib/nlpEngine.ts`, `src/lib/apiCache.ts`, and `src/store/useCityStore.ts`.
  - Fix HTML semantics, landmarks, `<label>` associations, `aria-label`s, `aria-live` announcements, skip links, and focus rings across all components.
  - Update `README.md` with test commands, accessibility checklist, and architecture notes.
- **Out-of-Scope (No Scope Creep)**:
  - No new product features or API integrations.
  - No backend, database, Docker, or AWS infrastructure.
  - No changes to existing user workflows or data schemas.

## 4. Acceptance Criteria
1. Single command `npm test` runs all unit tests and exits with code 0.
2. Core logic modules achieve >= 80% line and branch test coverage.
3. Edge cases tested: empty lists, null weather data, extreme/negative inputs, malformed localStorage, expired cache entries.
4. The page includes a visible/keyboard-accessible "Skip to main content" link.
5. All interactive elements have visible `focus-visible:ring` indicators.
6. The citizen report modal traps keyboard focus, closes on `Escape`, and restores focus.
7. Search input and filters are labeled for screen-readers.
8. Color contrast ratios for text labels exceed 4.5:1.
9. `README.md` accurately documents test execution and verification.
