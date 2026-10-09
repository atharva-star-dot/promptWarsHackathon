# Tasks: Quality Hardening & Compliance Pass

## Phase 1: Test Framework & Automated Test Suite (Priority 1)
- [ ] Task 1.1: Install `vitest` and `@vitest/coverage-v8` as development dependencies; update `package.json` scripts with `"test": "vitest run"` and `"test:coverage": "vitest run --coverage"`.
- [ ] Task 1.2: Write comprehensive unit tests for `src/lib/scoring.ts` (`src/__tests__/scoring.test.ts`) covering normal scoring, zero/empty places, small datasets (<5), negative/extreme hashes, wheelchair weights.
- [ ] Task 1.3: Write comprehensive unit tests for `src/lib/nlpEngine.ts` (`src/__tests__/nlpEngine.test.ts`) covering all weather rules (severe rain, heatwave, mild), safety score tiers, budget food rules, community report sentiment classification.
- [ ] Task 1.4: Write comprehensive unit tests for `src/lib/apiCache.ts` (`src/__tests__/apiCache.test.ts`) covering set/get roundtrip, cache expiration TTL, corrupted JSON handling, and sessionStorage failures.
- [ ] Task 1.5: Write comprehensive unit tests for `src/store/useCityStore.ts` (`src/__tests__/useCityStore.test.ts`) covering initial state, city selection, tab switching, map filter toggling, and report persistence.
- [ ] Task 1.6: Execute `npm test` and verify >80% coverage on core logic modules.

## Phase 2: Accessibility (WCAG 2.1 AA) Hardening (Priority 2)
- [ ] Task 2.1: Add "Skip to main content" link and semantic landmarks (`banner`, `main#main-content`, `nav`) in `App.tsx` and `Header.tsx`.
- [ ] Task 2.2: Implement global high-contrast `:focus-visible` styling in `src/index.css` so all interactive elements have visible outlines when navigated with keyboard.
- [ ] Task 2.3: Upgrade `SearchBar.tsx` with accessible `<label>` / `aria-label`, `role="combobox"`, `aria-expanded`, keyboard `ArrowDown`/`ArrowUp`/`Enter`/`Escape` navigation, and an `aria-live="polite"` region.
- [ ] Task 2.4: Accessible Dialog in `ReportForm.tsx`: add `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `Escape` key close handling, and explicit button labels.
- [ ] Task 2.5: Accessible controls in `ExploreTab.tsx`, `SafetyPanel.tsx`, `ComparePanel.tsx`, `MapView.tsx`, and `BottomNav.tsx`: ensure every button, select, and icon has an `aria-label`, readable contrast, and keyboard operability.

## Phase 3: Documentation & Verification (Priority 3)
- [ ] Task 3.1: Update `README.md` with test execution guides, accessibility compliance overview, and zero-secrets verification.
- [ ] Task 3.2: Run production build (`npm run build`) and test suite (`npm test`) to guarantee 100% pass without regressions.
