---
phase: 03-ui-primitives
plan: 01
subsystem: ui
tags: [motion, parallax, masonry, css-columns, scroll-animation, framer-motion]

# Dependency graph
requires:
  - phase: 01-scaffolding
    provides: LazyMotion strict + MotionConfig reducedMotion setup, Tailwind v4 design tokens, cn utility
  - phase: 02-global-chrome
    provides: Providers wrapper (LazyMotion/MotionConfig), layout render order
provides:
  - MotionWrapper scroll-triggered reveal component (m.div + whileInView)
  - ParallaxWrapper scroll-speed parallax component (useScroll + useTransform)
  - MasonryGrid + MasonryItem CSS columns masonry layout (server component)
  - /dev/primitives test harness page for visual verification
affects: [04-homepage-sections, portfolio, hero]

# Tech tracking
tech-stack:
  added: []
  patterns: [m.div with whileInView for scroll reveal, useScroll + useTransform for parallax, CSS columns for hydration-safe masonry]

key-files:
  created:
    - src/components/ui/MotionWrapper.tsx
    - src/components/ui/ParallaxWrapper.tsx
    - src/components/ui/MasonryGrid.tsx
    - src/app/dev/primitives/page.tsx
  modified: []

key-decisions:
  - "Used ElementType instead of keyof JSX.IntrinsicElements for MotionWrapper 'as' prop — JSX namespace not available in newer TypeScript without explicit import"
  - "MasonryGrid kept as server component with pure CSS columns — no JS layout, no hydration mismatch risk"

patterns-established:
  - "Scroll reveal pattern: wrap content in MotionWrapper with optional staggered delay"
  - "Parallax depth pattern: nest ParallaxWrapper elements with different speed values (0.5 background, 0.9 foreground)"
  - "Masonry layout pattern: MasonryGrid > MasonryItem with CSS columns-* responsive classes"

requirements-completed: [INTR-02]

# Metrics
duration: 2min
completed: 2026-03-05
---

# Phase 3 Plan 1: UI Animation Primitives Summary

**MotionWrapper scroll-reveal, ParallaxWrapper depth parallax, and MasonryGrid CSS columns layout with /dev/primitives test harness**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-05T03:36:53Z
- **Completed:** 2026-03-05T03:38:40Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- Created MotionWrapper with fade + translateY scroll-triggered reveal using luxury easing cubic-bezier(0.25, 0.1, 0.25, 1)
- Created ParallaxWrapper with configurable speed prop for scroll-depth effects using motion/react useScroll + useTransform
- Created MasonryGrid as a pure server component using CSS columns (1/2/3 responsive) with no hydration mismatch risk
- Built /dev/primitives test harness page demonstrating all three components with placeholder content

## Task Commits

Each task was committed atomically:

1. **Task 1: Create MotionWrapper and ParallaxWrapper components** - `b2da33d` (feat)
2. **Task 2: Create MasonryGrid component** - `4d4027e` (feat)
3. **Task 3: Create test harness page with Plan 01 components** - `96b98c1` (feat)

## Files Created/Modified
- `src/components/ui/MotionWrapper.tsx` - Scroll-triggered reveal wrapper using m.div with whileInView, configurable delay and semantic element support
- `src/components/ui/ParallaxWrapper.tsx` - Scroll-speed parallax wrapper using useScroll + useTransform with configurable speed prop
- `src/components/ui/MasonryGrid.tsx` - CSS columns masonry grid (server component) with MasonryGrid and MasonryItem exports
- `src/app/dev/primitives/page.tsx` - Test harness page at /dev/primitives demonstrating all three components

## Decisions Made
- Used `ElementType` instead of `keyof JSX.IntrinsicElements` for MotionWrapper's `as` prop — JSX namespace requires explicit import in newer TypeScript/Next.js 16, ElementType from React is the idiomatic alternative
- MasonryGrid implemented as server component (no 'use client') — CSS columns handle responsive layout without JS, eliminating hydration mismatch risk entirely

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed JSX.IntrinsicElements type error in MotionWrapper**
- **Found during:** Task 1 (MotionWrapper creation)
- **Issue:** `keyof JSX.IntrinsicElements` type caused "Cannot find namespace 'JSX'" error in Next.js 16 / newer TypeScript
- **Fix:** Replaced with `ElementType` from React, which is the standard way to type polymorphic component props
- **Files modified:** src/components/ui/MotionWrapper.tsx
- **Verification:** npm run build passes clean
- **Committed in:** b2da33d (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Necessary type correction for TypeScript compatibility. No scope creep.

## Issues Encountered
None beyond the JSX namespace type fix documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All three UI primitives ready for Phase 4 homepage section composition
- MotionWrapper can wrap any section content for scroll reveal
- ParallaxWrapper provides depth to hero and portfolio sections
- MasonryGrid ready for portfolio gallery layout
- /dev/primitives page available for ongoing visual verification

## Self-Check: PASSED

All 5 files verified present. All 3 task commits verified in git log.

---
*Phase: 03-ui-primitives*
*Completed: 2026-03-05*
