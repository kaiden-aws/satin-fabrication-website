# Phase 6: Polish, Accessibility, and Pre-Launch QA - Research

**Researched:** 2026-03-05
**Domain:** Lighthouse performance optimization, WCAG AAA contrast compliance, prefers-reduced-motion verification, mobile touch interaction QA, form submission capture, cross-device QA
**Confidence:** HIGH

## Summary

Phase 6 is a verification and fix phase -- not a feature-building phase. Every v1 requirement has been implemented in Phases 1-5. This phase systematically verifies that the production build meets five concrete success criteria: Lighthouse 90+ mobile performance, touch-friendly interactions on iOS/Android, complete reduced motion suppression, a working form submission mechanism, and WCAG AAA contrast compliance for gold accent usage.

The codebase audit reveals several concrete issues that will need fixing. The portfolio hover overlays use `group-hover:opacity-100` which does not activate on tap for touch devices -- this needs a CSS media query or JS solution. The `text-gold` color (#C9A96E) is used for small text in at least three locations (service taglines on /services, "Learn More" links, portfolio category labels) where it serves a communicative purpose and must pass contrast. The contact form currently logs to console only -- it needs either Formspree integration or a documented interim capture plan. The hero section's gradient animation (`heroGradient 20s ease infinite`) runs continuously via CSS `@keyframes` and while the global reduced motion override kills its duration, verification is needed to confirm no flash occurs. Several Motion-driven animations (ProcessTimeline steps, MotionWrapper reveals, ParallaxWrapper scroll transforms, ScrollAssembly convergence) rely on `MotionConfig reducedMotion="user"` which suppresses transform animations but preserves opacity -- the success criteria demand "complete suppression" with "no partial animations, no flashes."

The primary technical risk is the reduced motion requirement. `MotionConfig reducedMotion="user"` preserves opacity animations by design. If the success criteria truly require zero visible animation (not even opacity fading), the codebase will need explicit `useReducedMotion()` guards that return static content, which is a more invasive change than simply relying on MotionConfig.

**Primary recommendation:** Structure this phase as three focused waves: (1) performance audit + Lighthouse fixes, (2) accessibility and reduced motion hardening, (3) form capture mechanism + cross-device QA checklist.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| Cross-cutting | Lighthouse Performance >= 90 on mobile (production Vercel build) | next/image already used throughout; fonts self-hosted via next/font; LazyMotion + domAnimation configured; needs bundle analysis and production Lighthouse audit |
| Cross-cutting | Touch interactions work on iOS/Android (portfolio overlays via tap, slider drags, cursor hidden) | Portfolio uses group-hover:opacity-100 (hover-only); needs @media (hover: hover) guard or focus-within fallback; BeforeAfterSlider uses Pointer Events (touch-compatible); CustomCursor checks (pointer: fine) |
| Cross-cutting | Reduced motion completely suppresses all animations | MotionConfig reducedMotion="user" active but preserves opacity by design; CSS global override kills CSS animations/transitions; need to verify no visible flash from Motion's opacity preservation behavior |
| Cross-cutting | Form submits successfully in production (not silently dropped) | Currently console.log only; needs Formspree integration or Next.js Server Action with email, or documented interim capture plan |
| Cross-cutting | Gold accent passes WCAG AAA contrast -- decorative only, no gold text on dark that fails | Gold (#C9A96E) on void (#0A0A0A) = 8.85:1 (passes AAA); gold text IS used for communicative purposes in some locations; need audit to confirm all gold text is either decorative or passes contrast |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | Production build, Vercel deployment | Already installed; `next build` is the primary validation tool |
| Lighthouse CLI | latest | Performance, accessibility, SEO scoring | `npx lighthouse` available without installation; standard audit tool |
| motion | 12.35.0 | useReducedMotion hook for animation guards | Already installed; provides programmatic reduced motion detection |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @formspree/react | latest | Form submission backend (zero-backend option) | If Formspree is chosen for interim form capture |
| @next/bundle-analyzer | latest | Visualize JS bundle composition | If Lighthouse flags large JS bundle on mobile |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Formspree | Next.js Server Action + Resend | Server Action requires API key management and email service config; Formspree is zero-config but adds a third-party dependency; Server Action is cleaner long-term (v2 plan) |
| Formspree | Web3Forms | Similar zero-backend approach; less ecosystem integration than Formspree |
| Lighthouse CLI | PageSpeed Insights API | PSI uses real-world Chrome UX Report data but requires deployed URL; CLI runs against any local/preview URL |

**Installation (conditional):**
```bash
# Only if Formspree is chosen for form capture:
npm install @formspree/react

# Only if bundle analysis is needed:
npm install -D @next/bundle-analyzer
```

## Architecture Patterns

### Phase 6 is a Fix Phase, Not a Build Phase

This phase does not add new pages, components, or features. It audits the existing production build against five success criteria and makes targeted fixes. The structure is:

1. **Audit** -- Run Lighthouse, test touch devices, verify reduced motion, check contrast
2. **Fix** -- Address each failing criterion with minimal, targeted code changes
3. **Re-audit** -- Verify fixes resolve the issues without regression

### Pattern 1: CSS Media Query for Touch-Friendly Hover Overlays
**What:** Wrap hover-only styles in `@media (hover: hover)` so they only apply on devices with a true hover capability. On touch devices, show the overlay permanently or on tap/focus.
**When to use:** Portfolio image overlays that currently use `group-hover:opacity-100`
**Example:**
```tsx
// Current (hover-only, broken on touch):
<div className="opacity-0 group-hover:opacity-100 transition-opacity">

// Fixed (always visible on touch, hover-triggered on desktop):
<div className="opacity-100 sm:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:[@media(hover:hover)]:opacity-0 md:[@media(hover:hover)]:group-hover:opacity-100 transition-opacity">
```

**Simpler alternative using focus-within:**
```tsx
// Show overlay on focus-within (keyboard nav + tap) AND hover
<div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
```

**Recommended approach for this project:** Use `@media (hover: hover)` to gate `opacity-0` to hover-capable devices only. On touch devices, overlay is always visible (opacity reduced to maintain image visibility).

### Pattern 2: useReducedMotion Guard for Complete Animation Suppression
**What:** Use Motion's `useReducedMotion()` hook to conditionally render static content instead of animated content when reduced motion is preferred.
**When to use:** When MotionConfig's default behavior (preserving opacity) is insufficient for the "complete suppression" requirement.
**Example:**
```tsx
'use client'
import { m, useReducedMotion } from 'motion/react'

export function MotionWrapper({ children, delay = 0, className }: Props) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </m.div>
  )
}
```

### Pattern 3: Formspree Fetch Integration with Existing react-hook-form
**What:** Submit form data to a Formspree endpoint using a simple fetch call inside the existing react-hook-form onSubmit handler. No need to replace the form library.
**When to use:** When adding a zero-backend form submission mechanism to the existing ContactSection.
**Example:**
```tsx
const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ID
  ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`
  : null

async function onSubmit(data: ContactFormData) {
  if (FORMSPREE_ENDPOINT) {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      // Handle error -- show error state to user
      return
    }
  }
  setIsSubmitted(true)
}
```

### Pattern 4: Custom Cursor Visibility on Touch Devices
**What:** The CustomCursor component already checks `window.matchMedia('(pointer: fine)').matches` and only activates on fine-pointer devices. On touch devices, the cursor div is `display: none` (via CSS `.cursor-active .custom-cursor`).
**When to use:** Already implemented correctly. Phase 6 only needs to verify on physical devices.
**Verification:** The cursor should be invisible on iOS/Android. If it appears stuck at (0,0), the `(pointer: fine)` check may be failing on hybrid devices (laptop with touch screen).

### Anti-Patterns to Avoid
- **Using JavaScript to detect touch devices:** `navigator.maxTouchPoints` and `'ontouchstart' in window` are unreliable. CSS `@media (hover: hover)` and `(pointer: fine)` are the correct approach.
- **Removing all animations for reduced motion:** The goal is to suppress scroll-triggered reveals and entrance animations, not to remove functional transitions (e.g., focus ring transitions, mobile menu open/close). Functional state changes should still work.
- **Testing Lighthouse on dev server:** `next dev` serves unoptimized bundles. Always test Lighthouse against `next build && next start` or a Vercel preview deployment.
- **Gold text that serves communicative purpose treated as "decorative":** WCAG exempts only truly decorative text from contrast requirements. If gold text conveys meaning (taglines, labels, categories), it must meet contrast ratios.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form backend | Custom API route + database | Formspree (free tier: 50 submissions/month) or Next.js Server Action with fetch | Zero infrastructure to maintain; captures submissions reliably |
| Touch device detection | JS user-agent sniffing | CSS `@media (hover: hover)` and `(pointer: fine/coarse)` | Standardized, reliable, no JS overhead, works with hybrid devices |
| Reduced motion detection | Manual `matchMedia` listeners | `useReducedMotion()` from `motion/react` | Already integrated with MotionConfig; returns reactive boolean; SSR-safe |
| Contrast ratio checking | Manual calculations | WebAIM Contrast Checker or browser DevTools | Verified ratios; no risk of calculation errors |
| Bundle analysis | Manual inspection | `@next/bundle-analyzer` | Visualizes chunk sizes; identifies the specific module causing bloat |

**Key insight:** Phase 6's value is in verification discipline, not code volume. Most fixes are 1-5 lines of CSS or a single conditional wrapper.

## Common Pitfalls

### Pitfall 1: MotionConfig reducedMotion="user" Preserves Opacity Animations
**What goes wrong:** With reduced motion enabled, elements that use `initial={{ opacity: 0, y: 30 }}` and `whileInView={{ opacity: 1, y: 0 }}` will still fade in (opacity changes) -- only the `y: 30` transform is suppressed. This may be perceived as a "partial animation" or "flash" by users expecting complete suppression.
**Why it happens:** Motion's `reducedMotion="user"` mode is designed to preserve non-motion properties like opacity and backgroundColor while suppressing transforms, scale, and layout animations. This is Motion's default accessibility behavior.
**How to avoid:** Use `useReducedMotion()` hook in MotionWrapper and ProcessTimeline to conditionally skip animation entirely -- render children in their final state (opacity: 1, y: 0) without any Motion wrapper.
**Warning signs:** Elements fading in when OS "Reduce motion" is enabled.

### Pitfall 2: Portfolio Overlay Invisible on Touch Devices
**What goes wrong:** Portfolio image overlays (project name + category) only appear on `:hover`. Touch device users see only the images with no way to discover the overlay content.
**Why it happens:** `group-hover:opacity-100` in the PortfolioSection requires a mouse hover state that touch devices do not provide in the same way. While some browsers simulate hover on first tap, this is inconsistent.
**How to avoid:** Make the overlay always visible (at reduced opacity) on touch devices, or use `@media (hover: hover)` to gate the hover-hidden behavior to hover-capable devices only. Consider showing a subtle gradient and text always on mobile.
**Warning signs:** Tapping a portfolio image on iOS/Android does nothing visible.

### Pitfall 3: Testing Lighthouse on Development Server
**What goes wrong:** Lighthouse scores on `next dev` are dramatically lower than production -- often 40-60 instead of 90+. Developer panics and makes unnecessary optimizations.
**Why it happens:** `next dev` disables minification, serves uncompressed assets, includes React DevTools instrumentation, and does not apply image optimization.
**How to avoid:** Always test Lighthouse against a production build: `next build && next start` locally, or use a Vercel preview deployment. Run in Chrome incognito to avoid extension interference.
**Warning signs:** Lighthouse performance below 60 on a site with no obvious performance issues.

### Pitfall 4: Hero Gradient CSS Animation Flash on Reduced Motion
**What goes wrong:** The heroGradient CSS `@keyframes` animation runs continuously. The global `prefers-reduced-motion: reduce` override in globals.css sets `animation-duration: 0.01ms !important` -- but this causes a single flash frame of the animation before it settles.
**Why it happens:** The animation still technically runs (for 0.01ms) before completing. On some hardware, this produces a visible flicker.
**How to avoid:** For the hero gradient specifically, add a direct `prefers-reduced-motion` override that removes the animation entirely rather than shortening its duration:
```css
@media (prefers-reduced-motion: reduce) {
  /* Hero gradient should be static, not briefly animated */
  [style*="heroGradient"] {
    animation: none !important;
  }
}
```
Or better yet, use the `motion-reduce:` Tailwind variant on the hero element.
**Warning signs:** Brief color shift when loading the hero section with reduced motion enabled.

### Pitfall 5: Gold Text Used for Communicative Content
**What goes wrong:** Gold (#C9A96E) text on dark backgrounds has 8.85:1 contrast on void (#0A0A0A) and 8.44:1 on surface (#111111), which passes WCAG AAA (7:1). However, the success criterion specifically states "gold is decorative only; no gold text on dark backgrounds fails contrast." If the intent is that gold should NEVER be used for text that conveys meaning, some current uses need review.
**Why it happens:** Gold was used for visual hierarchy (taglines, accent words, labels) which is a design choice, not purely decorative.
**How to avoid:** Audit all `text-gold` usage. Verify each instance either: (a) passes AAA contrast (gold on void = 8.85:1, PASSES), or (b) is truly decorative (aria-hidden, no semantic content). The contrast math confirms gold (#C9A96E) on void (#0A0A0A) passes AAA at 8.85:1, so the practical risk is low -- but gold-dim (#8A7544) at 4.44:1 fails even AA and must never be used for text.
**Warning signs:** Any `text-gold-dim` on meaningful text; Lighthouse flagging contrast issues.

### Pitfall 6: Unsplash Remote Images Hurt Mobile Performance
**What goes wrong:** All portfolio and service images are loaded from `images.unsplash.com`. On mobile with 4G, these remote fetches add latency compared to self-hosted images processed through Next.js image optimization pipeline.
**Why it happens:** The project uses Unsplash placeholder images. Next.js can optimize remote images via its Image component, but the initial fetch still goes to Unsplash's CDN.
**How to avoid:** For Lighthouse testing, the Unsplash images will be processed through Next.js `<Image>` component which handles format conversion (WebP), resizing, and lazy loading. Performance should be acceptable. If Lighthouse flags image load time, consider downloading key images to `/public/` for the production deployment.
**Warning signs:** Lighthouse flagging "Reduce unused JavaScript" or slow image load times attributed to remote image fetches.

### Pitfall 7: Form Success State Without Actual Submission Creates False Confidence
**What goes wrong:** The current form shows "Thank You" on valid submission but data goes nowhere (console.log only). In production, this means leads are silently dropped.
**Why it happens:** The v1 spec (CNTC-05) was deliberately frontend-only. But the Phase 6 success criterion requires that submissions are "not silently dropped."
**How to avoid:** Either integrate Formspree (simplest zero-backend option), create a Next.js Server Action, or at minimum document an interim capture method. The chosen approach must be verified in production.
**Warning signs:** Submitting a form on production and receiving no notification or stored data.

## Code Examples

Verified patterns from the current codebase and official sources:

### Touch-Friendly Portfolio Overlay (Fix for PortfolioSection)
```tsx
// src/components/sections/PortfolioSection.tsx — updated overlay
// On touch devices (no hover), overlay is always partially visible
// On hover-capable devices, overlay appears on hover
<div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent
  opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100
  transition-opacity duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
  <span className="font-display text-lg text-cream">{project.title}</span>
  <span className="font-body text-sm text-gold">{project.category}</span>
</div>
```

### Reduced Motion Guard for MotionWrapper
```tsx
// Source: https://motion.dev/docs/react-accessibility
'use client'
import { m, useReducedMotion } from 'motion/react'

export function MotionWrapper({ children, delay = 0, className, as: _as = 'div' }: MotionWrapperProps) {
  const shouldReduceMotion = useReducedMotion()
  const Tag = _as

  // Complete suppression: render static content when reduced motion is preferred
  if (shouldReduceMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  const Component = m[_as as keyof typeof m] as typeof m.div
  return (
    <Component
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </Component>
  )
}
```

### Formspree Integration in ContactSection
```tsx
// Minimal change to existing onSubmit handler
const FORMSPREE_URL = process.env.NEXT_PUBLIC_FORMSPREE_ID
  ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`
  : null

async function onSubmit(data: ContactFormData) {
  try {
    if (FORMSPREE_URL) {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        setSubmitError('Something went wrong. Please try again.')
        return
      }
    }
    setIsSubmitted(true)
  } catch {
    setSubmitError('Network error. Please try again.')
  }
}
```

### Lighthouse CLI Audit Commands
```bash
# Build and serve production locally
next build && next start

# In another terminal, run Lighthouse (mobile performance focus)
npx lighthouse http://localhost:3000 --only-categories=performance --preset=perf --chrome-flags="--headless" --output=json --output-path=./lighthouse-home.json

# Accessibility + SEO audit
npx lighthouse http://localhost:3000 --only-categories=accessibility,seo --chrome-flags="--headless" --output=json --output-path=./lighthouse-a11y.json

# Services page
npx lighthouse http://localhost:3000/services --only-categories=performance,accessibility --chrome-flags="--headless" --output=json --output-path=./lighthouse-services.json
```

### Contrast Ratio Reference (Verified)
```
Gold (#C9A96E) on void (#0A0A0A):      8.85:1  -- AAA PASS (normal + large text)
Gold (#C9A96E) on surface (#111111):    8.44:1  -- AAA PASS (normal + large text)
Gold (#C9A96E) on charcoal (#1A1A1A):   7.78:1  -- AAA PASS (normal + large text)
Cream (#F5F0EB) on void (#0A0A0A):     17.48:1  -- AAA PASS
Warm-gray (#8A8278) on void (#0A0A0A):  5.23:1  -- AA PASS, AAA FAIL (normal), AAA PASS (large)
Gold-dim (#8A7544) on void (#0A0A0A):   4.44:1  -- AA FAIL (normal), AA PASS (large only)
Gold-light (#D4B87A) on void:          10.31:1  -- AAA PASS
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| User-agent sniffing for touch | CSS `@media (hover: hover)` and `(pointer: fine)` | Standard since ~2020 | Reliable, no JS needed, handles hybrid devices |
| `framer-motion` reducedMotion: "always" | `MotionConfig reducedMotion="user"` + `useReducedMotion()` hook | motion v12 | Respects OS setting, provides programmatic escape hatch |
| Custom form backend (Express/API route) | Formspree / Web3Forms / Resend Server Action | 2023+ | Zero-backend form submission for static/hybrid sites |
| Manual `@font-face` declarations | `next/font` self-hosting | Next.js 13+ | Zero external font requests, automatic display: swap |
| CSS `transition: all` for reduced motion | `animation-duration: 0.01ms !important` global override | WCAG 2.1 pattern | Kills all CSS animations; Motion handles JS animations separately |

**Deprecated/outdated:**
- `@media (pointer: fine/coarse)` in Tailwind utility classes: Tailwind v4 Lightning CSS strips `pointer` media queries (per Phase 2 decision). Use CSS `@media (hover: hover)` or JS `matchMedia` instead.
- `navigator.maxTouchPoints` for device detection: Unreliable on hybrid devices (laptops with touchscreens).

## Open Questions

1. **Formspree vs. Next.js Server Action for Form Capture**
   - What we know: The project decision [Roadmap] states "Quote form v1 is frontend-only success state -- email routing (Resend) is v2." But Phase 6 success criterion 4 requires submissions are "not silently dropped."
   - What's unclear: Whether to implement Formspree (quick, no backend, but third-party dependency) or a Next.js Server Action with Resend (closer to v2 architecture, but more setup).
   - Recommendation: Use Formspree for v1 pre-launch. It requires zero backend infrastructure, works on Vercel, integrates with the existing react-hook-form via a simple fetch call, and can be replaced with Resend in v2. Free tier allows 50 submissions/month. Alternative: document that form submissions are captured via console.log + acknowledge this as an interim gap.

2. **"Complete Suppression" vs. MotionConfig Default Behavior**
   - What we know: `MotionConfig reducedMotion="user"` preserves opacity animations. The success criterion says "completely suppresses all scroll-triggered reveals and entrance animations -- no partial animations, no flashes."
   - What's unclear: Whether opacity fading counts as a "partial animation" in the success criteria.
   - Recommendation: Implement `useReducedMotion()` guards that skip animation entirely. This is the safer interpretation and ensures zero visible animation when reduced motion is enabled. Apply to: MotionWrapper, ProcessTimeline steps, HeroSection entrance stagger, MobileMenu stagger, ScrollAssembly convergence, ParallaxWrapper scroll transform.

3. **Portfolio Overlay Mobile Treatment**
   - What we know: The overlay shows project name and category on hover. Touch devices need a tap-based alternative.
   - What's unclear: Whether the overlay should always be visible on mobile, appear on tap, or use focus-within.
   - Recommendation: Make overlay always visible on mobile (always-on gradient + text at bottom of image). This is the most accessible approach and avoids interaction discovery problems. Gate `opacity-0` behind `@media (hover: hover)` so only hover-capable devices get the hide/show behavior.

4. **Dev Primitives Page (/dev/primitives)**
   - What we know: A development test harness page exists at `/dev/primitives` with multiple `text-gold` headings and `text-warm-gray` body text.
   - What's unclear: Whether this page ships to production.
   - Recommendation: Either remove the `/dev/primitives` route before production deployment, or add it to robots.txt disallow list. It is a development tool, not a production page.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed (manual verification + Lighthouse CLI) |
| Config file | None |
| Quick run command | `npm run build` (type checking + build validation) |
| Full suite command | `npm run build && npx next start & sleep 3 && npx lighthouse http://localhost:3000 --only-categories=performance,accessibility,seo --preset=perf --chrome-flags="--headless"` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SC-1 | Lighthouse Performance >= 90 on mobile | manual | `npx lighthouse URL --only-categories=performance --preset=perf --chrome-flags="--headless"` | N/A |
| SC-2 | Touch interactions work (portfolio tap, slider drag, cursor hidden) | manual-only | Physical iOS/Android device testing | N/A |
| SC-3 | Reduced motion completely suppresses animations | manual | Enable OS reduced motion, verify visually + inspect computed styles | N/A |
| SC-4 | Form submissions captured in production | manual | Submit form on Vercel preview, verify Formspree dashboard receives it | N/A |
| SC-5 | Gold accent WCAG AAA contrast compliance | manual | Lighthouse accessibility audit + manual contrast ratio verification | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (must pass without errors)
- **Per wave merge:** Production build + local Lighthouse audit on both / and /services
- **Phase gate:** Full Lighthouse audit on Vercel preview deployment (mobile); physical device testing on iOS and Android

### Wave 0 Gaps
- No automated test framework is installed. Phase 6 is primarily a manual QA and verification phase -- Lighthouse CLI and physical device testing are the primary validation tools.
- Lighthouse CLI is available via `npx lighthouse` without installation.
- If bundle analysis is needed: `npm install -D @next/bundle-analyzer`

## Sources

### Primary (HIGH confidence)
- [Motion accessibility documentation](https://motion.dev/docs/react-accessibility) -- reducedMotion behavior, useReducedMotion hook, MotionConfig settings
- [Motion MotionConfig documentation](https://motion.dev/docs/react-motion-config) -- reducedMotion="user" preserves opacity, suppresses transforms
- [Motion useReducedMotion documentation](https://www.framer.com/motion/use-reduced-motion/) -- reactive boolean hook for programmatic guards
- [Motion LazyMotion documentation](https://motion.dev/docs/react-reduce-bundle-size) -- domAnimation feature set, bundle size impact
- [Next.js production checklist](https://nextjs.org/docs/pages/guides/production-checklist) -- image optimization, font optimization, bundle analysis
- [MDN :hover pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:hover) -- touch device hover behavior, @media (hover: hover) specification
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) -- WCAG AAA 7:1 normal text, 4.5:1 large text thresholds
- [WCAG 2.1 Success Criterion 1.4.6 (Contrast Enhanced - AAA)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced.html) -- decorative text exemption, large text definition

### Secondary (MEDIUM confidence)
- [Formspree React integration guide](https://formspree.io/guides/nextjs/) -- Next.js integration, useForm hook, fetch-based submission
- [Vercel Formspree deployment guide](https://vercel.com/kb/guide/deploying-react-forms-using-formspree-with-vercel) -- environment variable setup, NEXT_PUBLIC_ prefix requirement
- [AODA Website Compliance Requirements](https://www.accessibilitychecker.org/guides/aoda/) -- Ontario businesses with 50+ employees must meet WCAG 2.0 AA; AAA is recommended but not legally required
- [CSS-IRL: Detecting Hover-Capable Devices](https://css-irl.info/detecting-hover-capable-devices/) -- @media (hover: hover) vs (pointer: fine) usage patterns

### Tertiary (LOW confidence)
- None -- all findings verified against primary sources or codebase inspection

## Metadata

**Confidence breakdown:**
- Performance optimization: HIGH -- patterns well-documented; project already follows Next.js best practices (next/image, next/font, LazyMotion); Lighthouse testing is deterministic
- Accessibility/contrast: HIGH -- contrast ratios mathematically verified; WCAG criteria are specification, not opinion; all color pairs computed
- Reduced motion: HIGH -- MotionConfig behavior documented in official Motion docs; useReducedMotion hook is stable API
- Form capture: MEDIUM -- Formspree integration is well-documented but decision between Formspree and Server Action needs user input
- Touch device QA: MEDIUM -- CSS solutions are standards-based but physical device testing is inherently manual and device-dependent

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (stable domain; all referenced APIs are mature)
