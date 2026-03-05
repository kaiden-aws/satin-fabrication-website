# Roadmap: Satin Fabrication Website

## Overview

Six dependency-ordered phases deliver a premium dark-luxury marketing website. Design tokens and animation infrastructure ship first because three critical pitfalls (Motion bundle bloat, gold contrast failures, reduced-motion compliance) become expensive to retrofit. Global chrome and UI primitives follow before any section is built — components cannot compose from things that don't exist. Homepage sections ship as a single phase once all foundations are in place. Services page and SEO wire up last because JSON-LD structured data must not deploy with placeholder business details. A dedicated QA phase closes the loop on AODA compliance and Core Web Vitals before production goes live.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Next.js scaffold, design tokens, fonts, animation infrastructure, and content data layer
- [ ] **Phase 2: Global Chrome** - Navbar, custom cursor, grain overlay, and mobile navigation — the full site shell
- [ ] **Phase 3: UI Primitives** - Reusable animation wrappers, masonry grid, before/after slider, and process timeline components
- [ ] **Phase 4: Homepage Sections** - All six homepage sections composed from primitives — Hero through Contact
- [ ] **Phase 5: Services Page and SEO** - Dedicated /services sub-page and full SEO/structured data wiring
- [ ] **Phase 6: Polish, Accessibility, and Pre-Launch QA** - AODA compliance verification, Core Web Vitals testing, and cross-device QA

## Phase Details

### Phase 1: Foundation
**Goal**: The project runs locally with verified design tokens, self-hosted fonts, content data architecture, and animation infrastructure — every downstream component builds on a correct, pitfall-free base
**Depends on**: Nothing (first phase)
**Requirements**: DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05, DSGN-06
**Success Criteria** (what must be TRUE):
  1. `npm run dev` starts without errors and the browser shows the site root at localhost:3000
  2. Playfair Display and Raleway fonts render without flash-of-unstyled-text on first load (verified in Network tab — no external font requests)
  3. The gold (#C9A96E), charcoal (#1A1A1A), void (#0A0A0A), and off-white (#F5F0EB) tokens are available as CSS variables and Tailwind utilities throughout the app
  4. A `LazyMotion` wrapper with `domAnimation` is in place at the root layout level and the `strict` prop throws a build error if any `motion.*` component (instead of `m.*`) is imported
  5. `MotionConfig reducedMotion="user"` is active in the root layout — verifiable by enabling "Reduce motion" in the OS and confirming Motion animations pause
**Plans:** 2 plans
Plans:
- [ ] 01-01-PLAN.md — Scaffold Next.js 15, design tokens, fonts, and cn() utility
- [ ] 01-02-PLAN.md — Animation infrastructure (LazyMotion/MotionConfig), grain overlay, and visual verification

### Phase 2: Global Chrome
**Goal**: A visitor can open the site and experience the complete brand shell — correct dark aesthetic, working desktop and mobile navigation, gold accent language, grain texture, and custom cursor — before any content sections exist
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, INTR-01, INTR-03
**Success Criteria** (what must be TRUE):
  1. The navbar is transparent over the top of the page and transitions to solid dark (#0A0A0A with backdrop-blur) when the user scrolls down — visible on any placeholder page
  2. On desktop, hovering a nav link produces an animated gold underline that slides in from the left
  3. On mobile, tapping the hamburger icon opens a full-screen dark overlay with centered nav links that stagger in; tapping again (or the X) closes it
  4. On desktop, a small gold dot follows the cursor with a slight lag; it expands to a 40px gold ring when hovering over interactive elements
  5. A subtle grain/noise texture is visible at low opacity across the entire viewport and does not flicker or repaint during scroll
**Plans:** 2 plans
Plans:
- [ ] 02-01-PLAN.md — Navbar, mobile menu, skip-to-content link, desktop nav links, and micro-interaction CSS
- [ ] 02-02-PLAN.md — Custom cursor with rAF + lerp tracking and hover expansion

### Phase 3: UI Primitives
**Goal**: A complete library of reusable components exists — scroll-triggered animation wrapper, masonry grid, before/after slider, and process timeline — each independently verifiable before sections compose them
**Depends on**: Phase 2
**Requirements**: INTR-02, PORT-03, PROC-02
**Success Criteria** (what must be TRUE):
  1. A `MotionWrapper` component scrolls any child element in with a fade + translateY 30px reveal using cubic-bezier [0.25, 0.1, 0.25, 1] easing — visible in a test harness with reduced motion correctly suppressed
  2. A masonry grid component renders a set of images in 3 columns on desktop and 2 on tablet with no hydration mismatch error in the browser console
  3. A before/after slider component is draggable on desktop (mouse) and swipeable on mobile (touch) with no layout shift or pointer-events breakage
  4. A process timeline component draws an animated gold connecting line between steps using Motion `pathLength` — the line advances sequentially as the user scrolls through the section
**Plans**: TBD

### Phase 4: Homepage Sections
**Goal**: The complete homepage is live with all six sections — a visitor can experience the full brand narrative from hero to contact form, including scroll animations, portfolio gallery, process timeline, and a validated quote request form
**Depends on**: Phase 3
**Requirements**: HERO-01, HERO-02, HERO-03, HERO-04, SRVC-01, SRVC-02, SRVC-03, PORT-01, PORT-02, PORT-04, PROC-01, PROC-03, CNTC-01, CNTC-02, CNTC-03, CNTC-04, CNTC-05, FOOT-01, FOOT-02, FOOT-03, FOOT-04
**Success Criteria** (what must be TRUE):
  1. The hero section fills the full viewport with a dark cinematic background, "SATIN FABRICATION" renders in Playfair at large scale with gold accent on "SATIN", and the CTA button fills gold on hover — all text and button entrance animations complete on load
  2. The services section shows 4 cards in a 2x2 grid (desktop) / single column (mobile); each card's gold border brightens and its image scales to 1.03x on hover
  3. The portfolio section shows 8-10 metalwork images in a masonry grid; hovering any image fades in an elegant overlay with project name and category
  4. The process section shows 5 numbered steps with a gold connecting line that animates sequentially as the user scrolls through — step numbers render in low-opacity gold at 6xl behind the text
  5. The contact form accepts all required fields, validates them with Zod on submit, shows inline errors on invalid fields, and transitions to a success state animation on valid submission — no page reload
  6. The footer displays company name, phone, email, social icon links (gold on hover), and a back-to-top link
**Plans**: TBD

### Phase 5: Services Page and SEO
**Goal**: The dedicated /services page is live with expanded service detail, and both pages have complete SEO coverage — semantic HTML, meta tags, Open Graph, and JSON-LD structured data (gated on confirmed business NAP details from the owner)
**Depends on**: Phase 4
**Requirements**: SRVC-04, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06
**Success Criteria** (what must be TRUE):
  1. Navigating to /services renders a full page with expanded detail for each of the 4 service offerings, reusing all established design patterns and scroll animations
  2. The browser tab title reads "Satin Fabrication | Custom Architectural Metalwork — Southern Ontario" and a meta description is present in page source
  3. Pasting the site URL into the LinkedIn/Twitter post composer or Facebook debugger renders the correct Open Graph image, title, and description
  4. Running the Google Rich Results Test against the homepage returns a valid LocalBusiness / HomeAndConstructionBusiness result with no errors (deploy only after confirmed NAP details received from owner)
  5. Lighthouse accessibility score is 95 or above on both pages — all images have alt text, all interactive elements have ARIA labels, and focus-visible gold ring styles are visible on keyboard navigation
**Plans**: TBD

### Phase 6: Polish, Accessibility, and Pre-Launch QA
**Goal**: Every known failure mode from the research pitfall list is verified and resolved — the site passes AODA compliance, Core Web Vitals, and cross-device QA before the domain goes live
**Depends on**: Phase 5
**Requirements**: (Cross-cutting verification — all v1 requirements confirmed correct in production build)
**Success Criteria** (what must be TRUE):
  1. Lighthouse Performance score is 90 or above on mobile in a production Vercel deployment — next/image is used for all images, fonts are self-hosted, and the Framer Motion bundle uses LazyMotion with domAnimation
  2. On a physical iOS and Android device, the portfolio hover overlays work via tap (not hover-only), the before/after slider drags correctly, and the custom cursor is invisible (not stuck on screen)
  3. Enabling "Reduce motion" in the OS completely suppresses all scroll-triggered reveals and entrance animations — no partial animations, no flashes
  4. The quote form submits successfully in a production environment and does not silently drop submissions (either a confirmation mechanism or a documented interim capture method is in place before launch)
  5. All gold accent usage passes WCAG AAA contrast when checked against the dark backgrounds — gold is decorative only; no gold text on dark backgrounds fails contrast
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete | - |
| 2. Global Chrome | 1/2 | In Progress | - |
| 3. UI Primitives | 0/TBD | Not started | - |
| 4. Homepage Sections | 0/TBD | Not started | - |
| 5. Services Page and SEO | 0/TBD | Not started | - |
| 6. Polish, Accessibility, and Pre-Launch QA | 0/TBD | Not started | - |
