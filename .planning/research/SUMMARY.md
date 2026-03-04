# Project Research Summary

**Project:** Satin Fabrication Website
**Domain:** Premium dark-luxury marketing website — custom metal fabrication, Southern Ontario
**Researched:** 2026-03-03
**Confidence:** HIGH

## Executive Summary

Satin Fabrication requires a premium single-page marketing website that communicates craft and exclusivity before a visitor reads a single word. Research across the industry confirms the pattern: luxury trades clients qualify vendors visually first, then contact. The correct build is a Next.js 15 App Router site with a dark editorial aesthetic (matte black, charcoal, brushed gold accents), scroll-triggered animations via Motion (Framer Motion), and a centralized content architecture that allows real photography and copy to replace placeholders without touching component code. The site exists to generate quote requests — every design and architectural decision should serve that conversion goal.

The recommended approach is a single-page homepage assembling six sections (Hero, Services, Portfolio, Process, Testimonials, Contact) plus a Services detail page, deployed to Vercel. The stack is deliberately minimal: Next.js 15 + React 19 + TypeScript + Tailwind CSS v4 + Motion 12. No CMS, no backend, no e-commerce, no live chat. These are explicitly researched anti-features at this stage — they add complexity and maintenance burden without conversion lift for a high-touch custom fabrication business. The quote form submits to a success state in v1; email routing via Resend is a v1.x follow-up once the site is live and generating inquiries.

The key risks are all performance and accessibility related: Motion bundle bloat kills Core Web Vitals if LazyMotion is not configured from day one; gold accent colors fail WCAG contrast if applied to text rather than decorative elements; the custom cursor causes render jank if implemented with `useState` instead of `useRef`; the masonry gallery causes hydration mismatch if a JS-column-calculation library is used instead of CSS `columns`. All of these pitfalls are preventable at scaffolding time — they become expensive to fix after sections are built. AODA compliance (Ontario accessibility law) is a non-negotiable requirement, not a polish item.

---

## Key Findings

### Recommended Stack

The stack is straightforward and well-validated. Next.js 15 with App Router and React 19 is the correct foundation — it provides pre-rendered HTML for fast First Contentful Paint, native image optimization via `next/image`, self-hosted fonts via `next/font`, and zero-config Vercel deployment. Tailwind CSS v4 (CSS-first `@theme` config) replaces the JS config file and makes design tokens available as native CSS variables at runtime — critical for the gold/charcoal token system. Motion 12 (the canonical rebrand of Framer Motion) handles all scroll-triggered reveals, parallax, navbar state, and the process timeline through a single animation library.

Supporting libraries are also minimal and purposeful: `react-hook-form` + `zod` + `@hookform/resolvers` for the quote form, `sonner` for toast notifications, `react-compare-slider` for the before/after portfolio feature, `next-themes` for dark-mode lock without SSR flicker, and `sharp` for local build image processing. Nothing else belongs in this project.

**Core technologies:**
- Next.js 15.x: Full-stack React framework — App Router is production-stable; zero-config Vercel deployment; native image/font optimization
- React 19.x: UI runtime — required for Next.js 15 App Router; do not mix with Pages Router
- TypeScript 5.x: Type safety — catches prop errors during placeholder-to-real-content swaps
- Tailwind CSS 4.x: Utility-first styling — CSS-first `@theme` config; 3-10x faster builds; native CSS variables for design token system
- Motion 12.x: Animation — `useInView`, `whileInView`, `useScroll` cover all required animations; install as `motion`, import from `motion/react`

**Key version constraint:** Next.js 15 App Router requires React 19. React 18 only works with the Pages Router. Do not mix.

### Expected Features

The feature research divides cleanly into three tiers. The table-stakes tier is what any competent contractor site must have. The differentiator tier is what justifies the "feels like a $20,000 build" positioning. Everything else is explicitly deferred or excluded.

**Must have — table stakes:**
- Hero section with strong value proposition and CTA — establishes brand authority in the first viewport
- Services overview with clear scope — visitors qualify themselves within 10 seconds
- Portfolio gallery (masonry, hover overlays) — visual proof of craft; placeholder images now, real photos before launch
- Quote request form with validation and success state — the primary conversion action
- Phone number and email in header and footer — trades clients call; click-to-call on mobile is non-negotiable
- Testimonials — 3-5 named testimonials with project context; not generic
- Fixed navbar with transparent-to-solid scroll transition — premium wayfinding pattern
- Full-screen mobile navigation overlay — premium mobile UX; not a dropdown drawer
- Mobile-first responsive layout — majority of first visits are on phones
- SEO: semantic HTML, meta tags, Open Graph — organic discoverability
- JSON-LD LocalBusiness + HomeAndConstructionBusiness structured data — local pack visibility (gate: confirmed NAP details)
- ARIA labels and reduced motion support — AODA compliance, not optional

**Should have — differentiators:**
- Dark luxury aesthetic with grain texture — communicates premium positioning before a word is read
- Scroll-triggered reveal animations (Motion/Framer Motion) — cubic-bezier easing only; no spring physics
- Animated process timeline — demonstrates structured approach; reduces new-client friction
- Playfair Display + Raleway typography pairing — editorial luxury voice
- Parallax depth effect on hero section — visual dimension that premium brands use
- Custom cursor with contextual states — desktop only; degrades gracefully on touch
- Before/after comparison slider — gated on a matched before/after image pair existing
- Service area statement above fold — "Serving Greater Toronto Area and Southern Ontario" — qualifies visitors immediately
- Swap-ready content architecture via `lib/content.ts` — real content slots in without touching component code

**Defer to v1.x (after launch):**
- Email integration via Resend — wire the quote form to real delivery
- Real project photography replacing Unsplash placeholders
- Real testimonial copy
- Google Analytics or Plausible for traffic data
- Custom cursor (if not completed in v1 polish pass)
- Before/after slider (if matched imagery not available at launch)

**Defer to v2+:**
- Individual project detail pages — requires real copy and photography per project
- Headless CMS integration (Sanity) — only if content production actually happens
- Service-specific SEO landing pages
- Multi-language support

**Anti-features (do not build):**
- CMS, blog, e-commerce, live chat, social media embeds, appointment booking, client portal — all researched and explicitly excluded at this scope

### Architecture Approach

The architecture is a thin-server / fat-client pattern: `app/page.tsx` is a Server Component that only imports and assembles section components in visual order. Each section (`HeroSection`, `ServicesSection`, `PortfolioSection`, `ProcessSection`, `TestimonialSection`, `ContactSection`) is a Client Component because Motion requires browser APIs for scroll detection. UI primitives (`MotionWrapper`, `BeforeAfterSlider`, `MasonryGrid`, `ProcessTimeline`) are isolated in `components/ui/` and built before the sections that depend on them. Global chrome (`Navbar`, `CustomCursor`, `GrainOverlay`) lives in `components/layout/`. All site content lives in `lib/content.ts` — a single typed TypeScript file that is the only thing that changes when real assets replace placeholders.

State management is intentionally minimal: no Zustand, no Redux. The only cross-component state is cursor type (via `CursorProvider` React context) and navbar scroll position (local `useState` + `useScrolled` hook). Form state lives entirely inside `ContactSection`.

**Major components:**
1. `app/layout.tsx` — Root layout: font loading, global metadata, Providers wrapper, GrainOverlay, MotionConfig
2. `lib/content.ts` — Single source of truth for all text, image URLs, and structured data values
3. `components/ui/MotionWrapper.tsx` — Reusable scroll-triggered fade-in-up wrapper; used by all sections; centralizes easing constants
4. `providers/CursorProvider.tsx` — React context for cursor state; consumed by CustomCursor and any section that changes cursor on hover
5. `components/sections/*` — Six Client Component sections assembled by `app/page.tsx`; each independently testable
6. `lib/seo.ts` — `generateMetadata()` helpers and JSON-LD schema builders; Server-only

**Build order (must respect dependencies):**
Design tokens → `lib/content.ts` → Root layout + Providers → Global chrome (Navbar, Cursor, GrainOverlay) → UI primitives (MotionWrapper, hooks) → HeroSection → remaining sections in visual order → `app/page.tsx` composition → SEO wiring

### Critical Pitfalls

Eight critical pitfalls were identified. The top five that shape phase structure:

1. **Motion bundle bloat** — Use `LazyMotion` + `m` components from day one (Phase 1: scaffolding). `domAnimation` covers all needed features at ~15kb versus the 34kb default import. The `strict` prop on `LazyMotion` throws build-time errors if `motion.*` components sneak in. Recovery cost if missed: 2-4 hours.

2. **Gold accent WCAG contrast failure** — Establish the Tailwind design token palette with pre-documented contrast ratios before writing any components (Phase 1: design tokens). Gold is decoration-only: borders, hover states, underlines. Never body text, never large fills. Run every gold-on-dark pair through a contrast checker. Recovery cost if missed: 2-6 hours depending on how widely gold was used on text.

3. **Custom cursor jank from `useState`** — Implement cursor position tracking with `useRef` + direct DOM mutation from first implementation (Phase 2: global UI). `useState` for x/y coordinates fires 60-120 React re-renders per second, flooding animations with concurrent state updates. Recovery cost: 4-8 hours.

4. **Masonry hydration mismatch** — Choose CSS `columns` masonry (not a JS-column-calculation library) before writing any gallery code (Phase 4: portfolio). JS masonry requires client-side height measurements that differ from SSR output, causing hydration errors and CLS failures. Recovery cost if wrong library chosen: 1-2 days.

5. **Non-compositable CSS animation properties** — Establish an "animate `transform` and `opacity` only" hard rule before any section animations are written (Phase 3: animations). Animating `height`, `width`, `top`, `left`, or `margin` triggers layout reflow on every frame, causing jank on any device. For parallax, use `useScroll` → `useTransform` → `y` (transform), never `top` or `marginTop`.

Additional pitfalls with phase assignments:
- Missing `prefers-reduced-motion` support: Phase 1 (one-line `MotionConfig reducedMotion="user"` in root layout) — AODA legal requirement
- Grain texture as live SVG filter: Phase 2 (use static PNG with `background-image`) — prevents full-page repaint on scroll
- `AnimatePresence` page transitions with App Router: Phase 3 (don't use it) — documented unfixed limitation; use CSS opacity transition instead

---

## Implications for Roadmap

Based on the combined research, the correct phase structure is dependency-driven: design system before components, global chrome before sections, primitives before composites, sections before composition, SEO last when content is finalized.

### Phase 1: Foundation and Scaffolding

**Rationale:** Everything downstream depends on design tokens, content data, and the root layout being in place. Three of the eight critical pitfalls must be addressed here (LazyMotion, reduced-motion, design token contrast ratios) — retrofitting them is expensive.

**Delivers:** A running Next.js 15 project with verified design tokens, font loading, root layout, and animation infrastructure. No visible sections yet, but the architectural skeleton is correct.

**Addresses:** Design token system (gold/charcoal/void palette), Playfair Display + Raleway font loading, `lib/content.ts` with all placeholder content, `LazyMotion` wrapper, `MotionConfig reducedMotion="user"`, `cn()` utility, ESLint/TypeScript strict mode, `next/image` remote patterns for Unsplash, `next.config.ts` baseline

**Avoids:** Motion bundle bloat (LazyMotion from day one), missing reduced-motion support (MotionConfig in root layout), font FOUT/CLS (next/font self-hosting), gold contrast failures (tokens verified before any component uses them)

**Research flag:** Standard patterns — skip phase research. Next.js scaffolding and Tailwind v4 setup are well-documented.

---

### Phase 2: Global Chrome

**Rationale:** The Navbar, CustomCursor, and GrainOverlay wrap all pages and must exist before any section renders correctly. Building them first validates the full design language (dark aesthetic, grain texture, gold accents, navbar scroll transition) before committing to six sections.

**Delivers:** A fully functional site shell with correct dark aesthetic, working navigation (including mobile full-screen overlay), custom cursor, and grain texture. A user could visit the site and see the correct brand.

**Addresses:** Fixed navbar with transparent-to-solid scroll transition, full-screen mobile navigation overlay, custom cursor with contextual states (desktop only), grain texture overlay, `CursorProvider` context

**Avoids:** Custom cursor jank (useRef implementation mandated here), grain texture performance issue (static PNG approach), cursor visible on touch devices (CSS media query guard), root layout as Client Component anti-pattern (thin Providers wrapper pattern)

**Research flag:** Standard patterns — skip phase research. Cursor implementation pattern is documented in PITFALLS.md.

---

### Phase 3: UI Primitives

**Rationale:** `MotionWrapper`, `MasonryGrid`, `BeforeAfterSlider`, `ProcessTimeline`, and shared UI atoms (`GoldButton`, `GoldDivider`, `SectionLabel`) must exist before any section that depends on them. Building primitives in isolation is faster and produces more testable components.

**Delivers:** A complete library of reusable components that sections compose. The `MotionWrapper` here establishes the canonical easing constants and viewport margins for all scroll reveals.

**Addresses:** Reusable scroll-triggered fade-in-up, masonry grid (CSS columns approach), before/after slider with pointer events, process timeline animation primitives, shared UI atoms

**Avoids:** Non-compositable CSS animation properties (establish transform+opacity-only rule in MotionWrapper), masonry hydration mismatch (CSS columns decided here, not JS library), per-section scroll listener proliferation (MotionWrapper centralizes whileInView)

**Research flag:** Masonry approach needs deliberate decision here. CSS `columns` approach is recommended but produces top-to-bottom column order, not left-to-right row order. If row order matters for the portfolio layout, escalate to the CSS Grid + `span` approach documented in PITFALLS.md. Do not introduce a JS masonry library.

---

### Phase 4: Homepage Sections

**Rationale:** With primitives, global chrome, and design tokens in place, the six homepage sections can be built independently in visual order. Each section is a self-contained Client Component that composes from the primitive library.

**Delivers:** Complete homepage with all six sections — Hero (parallax, value proposition, CTA), Services (card grid, hover reveals), Portfolio (masonry gallery, before/after slider), Process (animated numbered timeline), Testimonials (featured quote), Contact (quote request form with validation and success state)

**Addresses:** All P1 features from FEATURES.md. The Contact section includes react-hook-form + zod validation with Sonner success notification. The Portfolio section uses placeholder Unsplash images loaded via `next/image` with dark blurDataURL.

**Avoids:** `AnimatePresence` for section transitions (use whileInView only), spring physics (cubic-bezier easing only on all Motion transitions), hardcoded content strings (all text imported from lib/content.ts), hover-only portfolio overlays on touch (tap-to-reveal fallback via @media hover:none)

**Research flag:** Portfolio section hover/touch behavior needs explicit implementation decision. Before/after slider touch support (Pointer Events API + touch-action: none) must be verified on a physical mobile device, not browser devtools simulation.

---

### Phase 5: Services Page and SEO

**Rationale:** The services detail page reuses all established patterns and is straightforward. SEO wiring (generateMetadata, JSON-LD) is deferred to this phase intentionally — structured data should not be deployed with placeholder NAP (name, address, phone) details, as Google indexes it immediately.

**Delivers:** Complete `/services` page. Full SEO implementation: `generateMetadata()` for both pages, Open Graph tags, JSON-LD LocalBusiness + HomeAndConstructionBusiness schema with confirmed `areaServed: "Southern Ontario"`. Ready for production deployment.

**Addresses:** `app/services/page.tsx`, `lib/seo.ts` helpers, JSON-LD structured data, Open Graph image, canonical URLs

**Avoids:** JSON-LD with placeholder NAP (coordinate confirmed business details with owner before deploying structured data), JSON-LD in Client Components (render in Server Components only to avoid double-indexing), `next-seo` package (deprecated pattern for App Router)

**Research flag:** JSON-LD structured data requires confirmed business details from the site owner before this phase can complete. Gate deployment of structured data on receiving: confirmed business name, phone number, address, and service hours. Do not use placeholder values in JSON-LD in production.

---

### Phase 6: Polish, Accessibility, and Pre-Launch QA

**Rationale:** Accessibility verification, Core Web Vitals testing, and the full "Looks Done But Isn't" checklist from PITFALLS.md require all sections to be complete. This is not a final pass for cutting corners — it is structured verification against known failure modes.

**Delivers:** AODA-compliant, Core Web Vitals-passing, cross-browser-verified site ready for production deployment.

**Addresses:** Full checklist from PITFALLS.md: custom cursor on mobile (real device test), portfolio hover overlays on touch, before/after slider mobile drag, reduce-motion OS setting test, gold accent contrast ratios, font loading on throttled 3G, JSON-LD Rich Results Test validation, navbar transition on Safari, grain overlay paint flashing, form success state verification, Open Graph image rendering on iMessage/Twitter/LinkedIn

**Avoids:** Launching with accessibility failures (AODA legal exposure), launching with Core Web Vitals failures (SEO impact), launching with a form that silently drops submissions

**Research flag:** Standard QA patterns — no additional research needed. PITFALLS.md "Looks Done But Isn't" checklist is the QA script.

---

### Phase Ordering Rationale

- **Design tokens before components:** WCAG contrast ratios for the gold/dark palette must be verified at the token level. If verified post-build, every component using gold needs review.
- **Global chrome before sections:** The navbar and cursor are consumed by sections (cursor state context). Building them first validates the full design language before committing to six sections.
- **Primitives before composites:** `MotionWrapper` sets the canonical animation constants. If sections are built before it exists, animation drift accumulates across components.
- **LazyMotion and reducedMotion in Phase 1:** These are architectural decisions. Adding them later requires touching every animated component (`motion.*` → `m.*` rename).
- **JSON-LD in Phase 5 (not Phase 1):** Structured data must not be deployed with placeholder business details. Gate it on confirmed NAP.
- **QA as a dedicated phase:** The PITFALLS.md checklist has 11 specific verification steps. They cannot be reliably completed as part of section builds.

### Research Flags

Phases needing deeper research during planning:
- **Phase 4 (Portfolio):** Masonry approach decision (CSS columns vs. CSS Grid + span) should be prototyped before committing. Before/after slider touch behavior requires physical device testing, not browser simulation.
- **Phase 5 (SEO):** JSON-LD deployment is gated on receiving confirmed business details from the site owner. Plan for this dependency.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Scaffolding):** Next.js 15 + Tailwind v4 setup is thoroughly documented in official sources.
- **Phase 2 (Global Chrome):** Cursor useRef pattern, grain PNG approach, and navbar scroll transition are all fully specified in STACK.md and PITFALLS.md.
- **Phase 3 (UI Primitives):** MotionWrapper pattern is fully specified with code in ARCHITECTURE.md.
- **Phase 6 (QA):** PITFALLS.md "Looks Done But Isn't" checklist is the complete QA script.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All core versions verified against official sources and npm as of 2026-03-03. Version compatibility matrix verified. |
| Features | HIGH | Table stakes confirmed across multiple competitor sites and industry sources. Differentiators confirmed via Awwwards patterns and luxury trades best practices. |
| Architecture | HIGH | Sourced from official Next.js docs (current 2026-02-27). All patterns are standard App Router idioms. |
| Pitfalls | HIGH | Most findings verified via official docs, GitHub issues, and multiple corroborating sources. AnimatePresence + App Router breakage confirmed via open GitHub issue. |

**Overall confidence:** HIGH

### Gaps to Address

- **Confirmed NAP details:** JSON-LD structured data (Phase 5) cannot be finalized until the business owner confirms the exact name, address, phone number, and service hours. Do not use placeholder values in production structured data.
- **Real photography timeline:** The portfolio section and hero depend on real project photography. Placeholder Unsplash images work for development and soft launch, but the site's conversion effectiveness depends on authentic metalwork imagery. Establish a photography timeline with the owner before or shortly after launch.
- **Before/after image pair:** The `BeforeAfterSlider` component is built in Phase 3 but the portfolio section feature that uses it is gated on a matched before/after image pair from a real project. If no such pair exists at launch, this component ships unused in v1.
- **Email routing:** The quote form success state in v1 shows UI feedback only. Whether form submissions are captured (copy-paste, a simple webhook, or a queued Resend integration) must be decided before launch — "looks submitted but does nothing" is worse than no form.

---

## Sources

### Primary (HIGH confidence)

- [Next.js 15 blog (official)](https://nextjs.org/blog/next-15) — version confirmation, React 19 requirement for App Router
- [Next.js 15.5 release notes](https://nextjs.org/blog/next-15-5) — confirmed 15.5 as latest stable
- [Next.js App Router: Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) — architecture patterns
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — thin shell / fat client pattern
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) — structured data implementation
- [Tailwind CSS v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first config, `@theme` directive
- [Tailwind CSS Next.js install guide](https://tailwindcss.com/docs/guides/nextjs) — official v4 + Next.js setup
- [Motion/Framer Motion — Reduce bundle size](https://motion.dev/docs/react-reduce-bundle-size) — LazyMotion pattern
- [Motion/Framer Motion — Accessibility](https://motion.dev/docs/react-accessibility) — reducedMotion="user" pattern
- [Motion npm page](https://www.npmjs.com/package/framer-motion) — confirmed v12.34.x as latest

### Secondary (MEDIUM confidence)

- [Custom Metal Fabrication Design (LA)](https://custommetalfabricationdesign.com/) — competitor site analysis
- [Meta Designs SLC](https://metadesignsslc.com/) — architectural metalwork site patterns
- [Melnick Metal Works](https://www.melnickmetal.com/) — fabrication site feature inventory
- [MNR Custom Metal — 2025 Architectural Metalwork Trends](https://mnrcustommetal.com/blog/top-trends-in-architectural-metalwork-for-2025-what-designers-need-to-know/) — client demand signals
- [Good Schema Markup for Contractor Websites — Eseo Space](https://eseospace.com/blog/schema-markup-for-contractor-websites/) — JSON-LD implementation
- [Smashing Magazine — Inclusive Dark Mode](https://www.smashingmagazine.com/2025/04/inclusive-dark-mode-designing-accessible-dark-themes/) — dark theme accessibility
- [Paul Irish — What forces layout/reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a) — compositable properties list
- [Masonry Grid SSR/hydration issues — mui/material-ui #32688](https://github.com/mui/material-ui/issues/32688) — CSS columns approach rationale

### Tertiary (MEDIUM-LOW confidence)

- [Next.js — AnimatePresence App Router breakage (GitHub issue #49279)](https://github.com/vercel/next.js/issues/49279) — confirmed open, unfixed; workarounds fragile
- [Custom cursor in Next.js — DEV Community](https://dev.to/preetsuthar17/custom-cursor-in-next-js-4l0c) — community article, consistent with official patterns

---

*Research completed: 2026-03-03*
*Ready for roadmap: yes*
