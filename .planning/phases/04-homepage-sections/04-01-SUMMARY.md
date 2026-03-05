---
phase: 04-homepage-sections
plan: 01
subsystem: ui
tags: [zod, react-hook-form, lucide-react, motion, next-image, hero, services]

# Dependency graph
requires:
  - phase: 03-ui-primitives
    provides: MotionWrapper scroll-reveal component with LazyMotion m.* pattern
  - phase: 02-layout-shell
    provides: Layout with LazyMotion strict mode, Navbar, design tokens in globals.css
provides:
  - HeroSection component with animated gradient background and staggered entrance
  - ServicesSection component with responsive card grid and hover effects
  - SERVICES, PORTFOLIO_PROJECTS, PROCESS_STEPS, SOCIAL_LINKS data arrays in constants.ts
  - contactSchema Zod schema and ContactFormData type in schemas.ts
  - heroGradient CSS keyframes animation
affects: [04-homepage-sections]

# Tech tracking
tech-stack:
  added: [zod@^3.24, react-hook-form, @hookform/resolvers, lucide-react]
  patterns: [section-component-pattern, shared-data-layer, zod-form-validation]

key-files:
  created:
    - src/lib/schemas.ts
    - src/components/sections/HeroSection.tsx
    - src/components/sections/ServicesSection.tsx
  modified:
    - package.json
    - package-lock.json
    - src/lib/constants.ts
    - src/app/globals.css

key-decisions:
  - "All section data arrays defined in constants.ts as single source of truth for Plans 02 and 03"
  - "HeroSection uses direct m.* animation (not MotionWrapper) for entrance stagger timing control"
  - "ServicesSection uses MotionWrapper for scroll-triggered reveal with staggered delays"

patterns-established:
  - "Section components live in src/components/sections/ with 'use client' directive"
  - "Data arrays exported as const from constants.ts for type narrowing"
  - "Zod schemas in schemas.ts with inferred TypeScript types"

requirements-completed: [HERO-01, HERO-02, HERO-03, HERO-04, SRVC-01, SRVC-02, SRVC-03]

# Metrics
duration: 2min
completed: 2026-03-05
---

# Phase 4 Plan 1: Data Layer, Hero, and Services Summary

**Shared data layer with 4 content arrays and Zod contact schema, plus full-viewport HeroSection with animated gradient and staggered entrance, and ServicesSection with responsive 2x2 card grid and hover effects**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-05T21:24:30Z
- **Completed:** 2026-03-05T21:26:41Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Installed 4 new packages (zod, react-hook-form, @hookform/resolvers, lucide-react) for form validation and icons
- Created shared data layer with SERVICES (4), PORTFOLIO_PROJECTS (9), PROCESS_STEPS (5), SOCIAL_LINKS (3) arrays plus Zod contact form schema
- Built HeroSection with animated gradient background, 60% overlay, staggered text entrance (SATIN in gold), gold CTA button, pulsing scroll indicator
- Built ServicesSection with 4 service cards in responsive 2x2/1-col grid, gold border hover brightening, image 1.03x scale, scroll-triggered reveal

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies and create data layer** - `ff79c16` (feat)
2. **Task 2: Build HeroSection and ServicesSection components** - `48e2c49` (feat)

## Files Created/Modified
- `package.json` - Added zod, react-hook-form, @hookform/resolvers, lucide-react dependencies
- `package-lock.json` - Lock file updated with new dependencies
- `src/lib/constants.ts` - Extended with SERVICES, PORTFOLIO_PROJECTS, PROCESS_STEPS, SOCIAL_LINKS arrays
- `src/lib/schemas.ts` - New file with Zod contactSchema and ContactFormData type
- `src/app/globals.css` - Added heroGradient keyframes animation
- `src/components/sections/HeroSection.tsx` - Full-viewport hero with gradient, staggered entrance, CTA, scroll indicator
- `src/components/sections/ServicesSection.tsx` - Responsive service cards grid with hover effects and scroll reveal

## Decisions Made
- All section data arrays defined in constants.ts as single source of truth for Plans 02 and 03
- HeroSection uses direct m.* animation (not MotionWrapper) for entrance stagger timing control -- viewport-based MotionWrapper would delay hero text until scroll, but hero should animate on page load
- ServicesSection uses MotionWrapper for scroll-triggered reveal with staggered delays per card

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Data layer complete: PORTFOLIO_PROJECTS, PROCESS_STEPS, SOCIAL_LINKS arrays ready for Plans 02 and 03
- Section component pattern established in src/components/sections/
- contactSchema ready for ContactSection form in Plan 03
- heroGradient keyframes available for hero background animation

## Self-Check: PASSED

All 7 files verified present. Both commit hashes (ff79c16, 48e2c49) confirmed in git log. All 9 exports verified (SERVICES, PORTFOLIO_PROJECTS, PROCESS_STEPS, SOCIAL_LINKS, contactSchema, ContactFormData, heroGradient, HeroSection, ServicesSection).

---
*Phase: 04-homepage-sections*
*Completed: 2026-03-05*
