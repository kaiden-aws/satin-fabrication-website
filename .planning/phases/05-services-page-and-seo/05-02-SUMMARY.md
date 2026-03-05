---
phase: 05-services-page-and-seo
plan: 02
subsystem: ui
tags: [services-page, json-ld, structured-data, schema-dts, accessibility, aria-labels, focus-visible, next-image]

# Dependency graph
requires:
  - phase: 05-services-page-and-seo
    plan: 01
    provides: "SITE_CONFIG, title.template metadata, focus-gold CSS utility, multi-page NAV_LINKS"
  - phase: 04-homepage-sections
    provides: "Complete homepage with all section components, MotionWrapper, constants.ts data arrays"
provides:
  - "Dedicated /services page with 4 expanded service detail sections"
  - "SERVICES_EXPANDED constant with rich data (id, tagline, description, features, image, imageAlt)"
  - "JSON-LD builder functions (generateLocalBusinessJsonLd, generateServicePageJsonLd)"
  - "JSON-LD structured data on homepage and /services page (gated on NEXT_PUBLIC_ENABLE_JSONLD)"
  - "Full accessibility audit: focus-gold on all interactive elements, aria-labels on all form inputs"
affects: [06-qa-polish]

# Tech tracking
tech-stack:
  added: [schema-dts]
  patterns: [env-gated JSON-LD rendering, alternating grid layout, expanded service data constant]

key-files:
  created:
    - src/app/services/page.tsx
    - src/lib/jsonld.ts
  modified:
    - src/lib/constants.ts
    - src/app/page.tsx
    - src/components/sections/FooterSection.tsx
    - src/components/sections/ContactSection.tsx

key-decisions:
  - "JSON-LD rendering gated on NEXT_PUBLIC_ENABLE_JSONLD env var (default OFF) -- placeholder NAP must be replaced before production"
  - "warm-gray contrast passes AA (5.23:1) for all text and AAA for large text (18px+) -- locked design system decision from Phase 1"
  - "Used CSS direction-rtl approach for alternating image/text layout on desktop rather than duplicate grid templates"

patterns-established:
  - "JSON-LD env gate pattern: conditionally render structured data script tags via NEXT_PUBLIC_ENABLE_JSONLD check"
  - "SERVICES_EXPANDED pattern: rich data constant extending base SERVICES with id, tagline, features, imageAlt for detail pages"
  - "aria-label on placeholder-only inputs: all form fields without visible labels get explicit aria-label attributes"

requirements-completed: [SRVC-04, SEO-01, SEO-04, SEO-05, SEO-06]

# Metrics
duration: 4min
completed: 2026-03-05
---

# Phase 5 Plan 2: Services Page and JSON-LD Summary

**Dedicated /services page with 4 alternating service sections, env-gated JSON-LD structured data (HomeAndConstructionBusiness + Service schemas) on both pages, and full accessibility audit with aria-labels and focus-gold across all interactive elements**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-05T22:10:45Z
- **Completed:** 2026-03-05T22:14:49Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Built /services page with hero banner, 4 alternating service detail sections (image/text), feature lists with Check icons, and CTA linking to contact
- Created JSON-LD builder functions with typed schema-dts for HomeAndConstructionBusiness and Service structured data
- Added env-gated JSON-LD script tags to both homepage and /services page
- Completed accessibility audit: focus-gold on all footer links, aria-labels on all contact form inputs, contrast compliance documented

## Task Commits

Each task was committed atomically:

1. **Task 1: Create expanded service data, JSON-LD builders, and /services page** - `e334678` (feat)
2. **Task 2: Add JSON-LD to homepage and run full accessibility + SEO audit** - `c1bbfc0` (feat)

## Files Created/Modified
- `src/app/services/page.tsx` - Dedicated /services page with hero, 4 service sections, CTA, JSON-LD, and metadata
- `src/lib/jsonld.ts` - JSON-LD builder functions (generateLocalBusinessJsonLd, generateServicePageJsonLd) with placeholder NAP
- `src/lib/constants.ts` - Added SERVICES_EXPANDED array with id, title, tagline, description, features, image, imageAlt for all 4 services
- `src/app/page.tsx` - Added conditionally-rendered JSON-LD script tag importing generateLocalBusinessJsonLd
- `src/components/sections/FooterSection.tsx` - Added focus-gold to phone, email, social media, and back-to-top links
- `src/components/sections/ContactSection.tsx` - Added aria-label to select, all text inputs, and textarea
- `package.json` - Added schema-dts dependency
- `package-lock.json` - Lock file updated

## Decisions Made
- JSON-LD rendering gated on NEXT_PUBLIC_ENABLE_JSONLD env var (default OFF) to prevent deploying placeholder business details to production
- warm-gray (#8A8278) on void (#0A0A0A) contrast ratio is 5.23:1 -- passes WCAG AA for all text sizes and AAA for large text (18px+). Full AAA on normal text would require changing the locked design system color from Phase 1. Documented as acceptable trade-off.
- Used CSS order utilities for alternating image/text layout rather than duplicating grid templates

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added aria-labels to all contact form inputs**
- **Found during:** Task 2 (accessibility audit)
- **Issue:** Plan specified verifying aria-label on select and submit button, but the text inputs (name, email, phone) and textarea also lacked aria-labels. Placeholder text alone is insufficient for screen readers.
- **Fix:** Added explicit aria-label attributes to all 4 text inputs and the textarea
- **Files modified:** src/components/sections/ContactSection.tsx
- **Verification:** Build passes, all form fields now have programmatic labels
- **Committed in:** c1bbfc0 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical accessibility)
**Impact on plan:** Essential for screen reader accessibility compliance. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required. JSON-LD is gated on NEXT_PUBLIC_ENABLE_JSONLD=true (default off).

## Next Phase Readiness
- Phase 5 complete -- both plans delivered
- /services page renders at /services with full service detail, JSON-LD, and metadata
- All accessibility items addressed: focus-gold on all interactive elements, aria-labels on all form inputs
- JSON-LD structured data ready but gated -- requires confirmed NAP details from owner before enabling in production
- Site ready for Phase 6 QA/polish

## Self-Check: PASSED

All 6 source files verified present. Both task commits (e334678, c1bbfc0) verified in git log. Key content verified: SERVICES_EXPANDED constant, two JSON-LD export functions, application/ld+json script tags on both pages, h1 on services page, metadata title, 4 focus-gold classes in footer, 5 aria-labels in contact form.

---
*Phase: 05-services-page-and-seo*
*Completed: 2026-03-05*
