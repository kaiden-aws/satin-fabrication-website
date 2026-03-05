---
phase: 01-foundation
plan: 01
subsystem: ui
tags: [next.js, tailwind-v4, design-tokens, next-font, typescript]

# Dependency graph
requires:
  - phase: none
    provides: first plan in project
provides:
  - Next.js 16 project scaffold with TypeScript, Tailwind v4, ESLint, App Router
  - Tailwind v4 @theme design token system with 8 color tokens, 2 font families, easing curve, reveal animation
  - Self-hosted Playfair Display (400, 700) and Raleway (300, 400, 500, 600) via next/font
  - cn() utility (clsx + tailwind-merge) at @/lib/utils
  - Unsplash remote image pattern in next.config.ts
  - Reduced motion CSS override for DSGN-05
affects: [01-02, global-chrome, ui-primitives, homepage-sections]

# Tech tracking
tech-stack:
  added: [next.js 16.1.6, react 19.2.3, tailwindcss 4, motion 12, clsx 2, tailwind-merge 3, sharp 0.34]
  patterns: [tailwind-v4-css-first-theme, next-font-css-variables-on-html, cn-utility]

key-files:
  created:
    - src/lib/utils.ts
  modified:
    - src/app/globals.css
    - src/app/layout.tsx
    - src/app/page.tsx
    - next.config.ts
    - package.json

key-decisions:
  - "Used @theme (not @theme inline) for design token declarations — standard Tailwind v4 pattern"
  - "Scaffolded with Next.js 16.1.6 (latest stable via create-next-app@latest) rather than pinning to 15.x"
  - "Font variables applied to <html> element, not <body>, for correct @theme CSS variable resolution"

patterns-established:
  - "CSS-first design tokens: all palette, font, easing tokens in globals.css @theme block"
  - "Font variable pattern: next/font CSS variables on <html>, referenced in @theme with fallback stacks"
  - "cn() utility at @/lib/utils for conditional class composition with Tailwind conflict resolution"

requirements-completed: [DSGN-01, DSGN-02, DSGN-06]

# Metrics
duration: 4min
completed: 2026-03-05
---

# Phase 1 Plan 01: Scaffold and Design Tokens Summary

**Next.js 16 scaffold with Tailwind v4 @theme design token system, self-hosted Playfair Display + Raleway fonts, and cn() utility**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-05T00:26:41Z
- **Completed:** 2026-03-05T00:30:20Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Scaffolded Next.js 16 project with TypeScript, Tailwind v4, ESLint, and App Router in src directory
- Installed all Phase 1 dependencies: motion, clsx, tailwind-merge, sharp
- Configured complete Tailwind v4 @theme design token system with 8 color tokens (void, charcoal, surface, gold, gold-light, gold-dim, cream, warm-gray), 2 font families, luxury easing curve, and reveal animation preset
- Self-hosted Playfair Display (400, 700) and Raleway (300, 400, 500, 600) via next/font with CSS variables on html element
- Created placeholder page visually verifying all design tokens with color swatches and typography

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Next.js 15 project and install dependencies** - `4cee1e2` (feat)
2. **Task 2: Configure design tokens, fonts, and globals.css** - `016e1b6` (feat)

## Files Created/Modified
- `package.json` - Project dependencies including next, react, motion, clsx, tailwind-merge, sharp
- `tsconfig.json` - TypeScript config with strict mode, path alias @/*
- `next.config.ts` - Unsplash remote image patterns for future portfolio images
- `src/app/globals.css` - Tailwind v4 @theme design tokens, reveal keyframes, reduced motion override, base styles
- `src/app/layout.tsx` - Root Server Component with next/font variables on html, metadata, suppressHydrationWarning
- `src/app/page.tsx` - Placeholder page proving tokens work: Playfair heading, gold accent, 6 color swatches
- `src/lib/utils.ts` - cn() utility wrapping clsx + tailwind-merge
- `eslint.config.mjs` - ESLint flat config from scaffold
- `postcss.config.mjs` - PostCSS config with @tailwindcss/postcss plugin

## Decisions Made
- Used `@theme` (not `@theme inline`) for design token declarations -- standard Tailwind v4 documented pattern
- Scaffolded with Next.js 16.1.6 (latest stable via create-next-app@latest) rather than pinning to 15.x -- functionally equivalent, just newer
- Font variables applied to `<html>` element with `suppressHydrationWarning` per research Pitfall 2 and 6
- Providers wrapper and GrainOverlay deferred to Plan 02 as specified -- layout.tsx is final except for those additions

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Scaffolded in temp directory due to npm naming restriction**
- **Found during:** Task 1 (Scaffold)
- **Issue:** `create-next-app` derives package name from directory name; "SatinFabrication website" has spaces and capitals which violate npm naming rules
- **Fix:** Scaffolded in `/tmp/satin-fabrication` and copied files via rsync (excluding .git) to preserve existing git history
- **Files modified:** All scaffolded files
- **Verification:** `npm run build` passes, git history preserved
- **Committed in:** 4cee1e2 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Workaround necessary due to directory name constraint. No impact on output -- identical result.

## Issues Encountered
- `create-next-app@latest` installed Next.js 16.1.6 rather than 15.x as the plan referenced -- this is expected behavior since `@latest` resolves to the current stable release. All patterns and APIs are compatible.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Design token system is complete and verified via build
- Ready for Plan 02: Animation infrastructure (LazyMotion/MotionConfig), grain overlay, and visual verification
- Layout.tsx needs Providers wrapper and GrainOverlay additions in Plan 02
- All 8 color tokens, 2 font families, easing curve, and reveal animation are available as Tailwind utilities

## Self-Check: PASSED

All files verified present. All commits verified in git log.

---
*Phase: 01-foundation*
*Completed: 2026-03-05*
