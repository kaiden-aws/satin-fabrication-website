---
phase: 06-polish-accessibility-prelaunch-qa
plan: 01
subsystem: ui
tags: [motion/react, useReducedMotion, accessibility, prefers-reduced-motion, animation]

# Dependency graph
requires:
  - phase: 03-interactive-components
    provides: MotionWrapper, ParallaxWrapper, ProcessTimeline, ScrollAssembly primitives
  - phase: 04-home-page-assembly
    provides: HeroSection with entrance animations, MobileMenu with stagger
provides:
  - Complete reduced motion suppression across all animated components
  - useReducedMotion guard pattern for conditional static rendering
  - CSS animation-play-state paused rule for CSS-level animations
affects: [06-02, 06-03]

# Tech tracking
tech-stack:
  added: []
  patterns: [useReducedMotion conditional render guard, static fallback for animated components]

key-files:
  created: []
  modified:
    - src/components/ui/MotionWrapper.tsx
    - src/components/ui/ParallaxWrapper.tsx
    - src/components/ui/ProcessTimeline.tsx
    - src/components/ui/ScrollAssembly.tsx
    - src/components/sections/HeroSection.tsx
    - src/components/layout/MobileMenu.tsx
    - src/app/globals.css

key-decisions:
  - "MotionWrapper uses early return with static Tag element (not m.* wrapper) for complete suppression"
  - "Hooks called unconditionally in ParallaxWrapper/ScrollAssembly/ProcessTimeline -- guard applied at style/JSX level only"
  - "MobileMenu keeps m.* elements but sets transition duration to 0 for instant functional state changes"
  - "Hero gradient animation set to none via inline style (JS guard) plus CSS animation-play-state paused (CSS guard) for defense in depth"

patterns-established:
  - "useReducedMotion guard pattern: import hook, call at component top, render static alternative or suppress motion styles"
  - "Defense-in-depth: both JS (useReducedMotion) and CSS (prefers-reduced-motion) guards for animation suppression"

requirements-completed: [SC-3]

# Metrics
duration: 3min
completed: 2026-03-05
---

# Phase 6 Plan 1: Reduced Motion Hardening Summary

**Complete useReducedMotion() guards on all 6 animated components plus CSS animation-play-state paused for zero-animation under OS reduced motion preference**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-05T22:50:08Z
- **Completed:** 2026-03-05T22:53:15Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- All 6 animated components (MotionWrapper, ParallaxWrapper, ProcessTimeline, ScrollAssembly, HeroSection, MobileMenu) now import and use useReducedMotion from motion/react
- When OS prefers-reduced-motion is enabled: zero scroll-triggered reveals, zero entrance animations, zero opacity fades, zero parallax transforms, zero SVG pathLength animations
- Functional transitions (menu open/close) still work but execute instantly (duration: 0)
- CSS animation-play-state: paused added to prefers-reduced-motion media query to freeze CSS animations on first frame

## Task Commits

Each task was committed atomically:

1. **Task 1: Add useReducedMotion guards to UI primitives** - `ac2d3f2` (feat)
2. **Task 2: Add useReducedMotion guards to HeroSection, MobileMenu, and fix CSS** - `6559340` (feat)

## Files Created/Modified
- `src/components/ui/MotionWrapper.tsx` - Early return with static Tag when reduced motion active
- `src/components/ui/ParallaxWrapper.tsx` - Scroll transform disabled via conditional style prop
- `src/components/ui/ProcessTimeline.tsx` - Static divs replace m.div, pathLength set to 1
- `src/components/ui/ScrollAssembly.tsx` - Pieces render in final assembled position (x:0, y:0, rotate:0, opacity:1)
- `src/components/sections/HeroSection.tsx` - Static h1/p/div replace m.* elements, gradient animation set to none
- `src/components/layout/MobileMenu.tsx` - All transition durations set to 0 for instant open/close
- `src/app/globals.css` - animation-play-state: paused added to prefers-reduced-motion rule

## Decisions Made
- MotionWrapper uses early return with plain Tag element for complete suppression (no m.* wrapper at all)
- ParallaxWrapper, ScrollAssembly, and ProcessTimeline keep hooks unconditional per React rules -- guard applied at style prop or JSX conditional only
- MobileMenu retains m.* elements with AnimatePresence (functional state transition) but overrides all durations to 0
- Hero gradient uses both inline style animation: 'none' (JS) and CSS animation-play-state: paused (CSS) for defense in depth

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All animated components hardened with useReducedMotion guards
- Ready for Plan 02 (accessibility audit) and Plan 03 (pre-launch QA)
- No blockers for continued Phase 6 execution

## Self-Check: PASSED

All 8 files verified present. Both task commits (ac2d3f2, 6559340) confirmed in git log.

---
*Phase: 06-polish-accessibility-prelaunch-qa*
*Completed: 2026-03-05*
