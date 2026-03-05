---
phase: 02-global-chrome
plan: 02
subsystem: ui
tags: [custom-cursor, lerp, requestAnimationFrame, pointer-detection, css-transitions, performance]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Design tokens (gold, ease-luxury), LazyMotion Providers wrapper, GrainOverlay
  - phase: 02-01
    provides: CURSOR_LERP_SPEED constant, layout.tsx structure with Providers, z-index layer strategy
provides:
  - Custom cursor component with rAF + lerp physics-based tracking (CustomCursor)
  - JS-driven fine-pointer detection via matchMedia + .cursor-active class on html
  - Cursor hover expansion system via event delegation and data-cursor attribute
  - Z-index layer z-[9999] for cursor above all UI layers
affects: [04-homepage-sections, 05-seo-launch]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "rAF + lerp cursor pattern — requestAnimationFrame loop with linear interpolation for smooth 60fps cursor tracking without React re-renders"
    - "JS pointer detection pattern — matchMedia('(pointer: fine)') check replaces CSS @media (pointer) due to Tailwind v4 Lightning CSS stripping those queries"
    - "Event delegation hover pattern — document-level mouseover/mouseout with closest() for cursor expansion on interactive elements"
    - "data-cursor attribute system — [data-cursor='pointer'] and [data-cursor='view'] selectors ready for Phase 4 portfolio image hover"

key-files:
  created:
    - src/components/layout/CustomCursor.tsx
  modified:
    - src/app/globals.css
    - src/app/layout.tsx

key-decisions:
  - "Replaced @media (pointer: fine/coarse) with JS-driven .cursor-active class due to Tailwind v4 Lightning CSS stripping pointer media queries"
  - "CustomCursor uses raw rAF + lerp for position tracking — not Motion animate or React state — to avoid re-render overhead"
  - "Cursor renders inside Providers after children to maintain React tree lifecycle and future LazyMotion context access"

patterns-established:
  - "JS pointer detection: use matchMedia instead of CSS @media (pointer) in Tailwind v4 projects using Lightning CSS"
  - "Performance-critical animation: bypass React render cycle by writing directly to element.style.transform in rAF loop"
  - "Cursor expansion: event delegation with closest() selector matching a, button, [data-cursor] elements"

requirements-completed: [INTR-01]

# Metrics
duration: ~12min
completed: 2026-03-05
---

# Phase 2 Plan 2: Custom Cursor Summary

**Gold dot cursor with rAF + lerp physics tracking, 40px ring expansion on interactive hover via event delegation, and JS-driven fine-pointer detection replacing Lightning CSS-stripped media queries**

## Performance

- **Duration:** ~12 min (across two sessions with checkpoint verification)
- **Started:** 2026-03-05T01:50:00Z
- **Completed:** 2026-03-05T02:21:00Z
- **Tasks:** 3 (2 implementation + 1 verification checkpoint)
- **Files modified:** 3

## Accomplishments
- Custom cursor component with 60fps rAF + lerp tracking that writes directly to DOM style.transform, avoiding React re-renders
- 8px gold dot default state that expands to 40px gold ring outline on interactive element hover using CSS transitions with luxury easing
- JS-driven fine-pointer detection using matchMedia that adds .cursor-active class to html element, gating all cursor styles
- Event delegation system using document-level mouseover/mouseout with closest() matching a, button, and data-cursor attribute elements
- Cursor is completely hidden on touch/coarse-pointer devices (no frozen gold dot)
- Default browser cursor hidden on desktop when custom cursor is active

## Task Commits

Each task was committed atomically:

1. **Task 1: Create CustomCursor component with rAF + lerp tracking** - `5f61a9d` (feat)
2. **Task 2: Add cursor CSS and wire CustomCursor into layout** - `4bebef5` (feat)
3. **Task 3: Verify custom cursor behavior** - `e89e7ab` (fix — Lightning CSS workaround committed after user verification)

**Plan metadata:** (pending — docs commit)

## Files Created/Modified
- `src/components/layout/CustomCursor.tsx` - Client component with rAF + lerp cursor tracking, matchMedia pointer detection, event delegation hover expansion, z-[9999] positioning
- `src/app/globals.css` - Custom cursor CSS: .cursor-active class gating cursor:none and dot/ring styles, cursor-expanded transition
- `src/app/layout.tsx` - Added CustomCursor import and render inside Providers after children

## Decisions Made
- Replaced @media (pointer: fine/coarse) with JS-driven .cursor-active class approach because Tailwind v4's Lightning CSS pipeline strips pointer media queries from compiled output
- Used raw requestAnimationFrame + lerp for position tracking instead of Motion's animate prop or React state to ensure 60fps without re-render overhead
- CustomCursor rendered inside Providers after children (not outside) to maintain React tree lifecycle and potential future LazyMotion context access
- data-cursor attribute system supports both "pointer" and "view" variants — Phase 4 portfolio images will use data-cursor="view" for custom hover

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Replaced @media (pointer) with JS matchMedia + .cursor-active class**
- **Found during:** Task 3 (verification checkpoint)
- **Issue:** Tailwind v4's Lightning CSS pipeline was stripping `@media (pointer: fine)` and `@media (pointer: coarse)` wrappers from compiled CSS output, causing cursor styles to never apply and the gold dot to be invisible
- **Fix:** Removed CSS pointer media queries. Added `matchMedia('(pointer: fine)')` check in CustomCursor useEffect that adds `.cursor-active` class to `<html>`. All cursor styles (cursor:none, dot display, ring expansion) are now gated on `.cursor-active` parent selector. `.custom-cursor` starts with `display: none`; `.cursor-active .custom-cursor` sets `display: block`.
- **Files modified:** src/app/globals.css, src/components/layout/CustomCursor.tsx
- **Verification:** `npm run build` passes; user verified cursor works correctly on desktop and is hidden on touch devices
- **Committed in:** e89e7ab (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking issue)
**Impact on plan:** Essential fix — without it, the custom cursor was completely non-functional. The JS-driven approach is actually more robust than CSS media queries since it uses the same detection mechanism at both the style and behavior layers. No scope creep.

## Issues Encountered
- Lightning CSS (used by Tailwind v4) strips `@media (pointer: fine/coarse)` media queries from compiled output. This is a known Tailwind v4 compatibility concern. Future pointer-dependent styles in this project should use the JS `.cursor-active` class pattern rather than CSS pointer media queries.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Custom cursor is complete and functional across all planned behaviors
- data-cursor attribute system is ready for Phase 4 portfolio image hover effects (data-cursor="view")
- Z-index layer stack is fully populated: navbar z-40, grain z-50, mobile menu z-[60], hamburger z-[70], cursor z-[9999]
- Global chrome phase (02) is now complete — all navigation and cursor components are in place
- Phase 3 (UI primitives) can proceed with full layout shell available

## Self-Check: PASSED

- All 3 source files: FOUND
- Commit 5f61a9d (Task 1): FOUND
- Commit 4bebef5 (Task 2): FOUND
- Commit e89e7ab (Task 3): FOUND
- Summary file 02-02-SUMMARY.md: FOUND

---
*Phase: 02-global-chrome*
*Completed: 2026-03-05*
