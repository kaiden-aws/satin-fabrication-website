# Pitfalls Research

**Domain:** Premium dark-luxury marketing website — metal fabrication / high-end trades
**Researched:** 2026-03-03
**Confidence:** HIGH (most findings verified via official docs, GitHub issues, and multiple corroborating sources)

---

## Critical Pitfalls

### Pitfall 1: Framer Motion Bloats the Bundle by Default

**What goes wrong:**
The default `motion` import from `framer-motion` bundles ~34kb of animation features whether you use them or not. On a marketing site where first impression = brand perception, a bloated JS bundle tanks LCP and delays interactivity — directly contradicting the "feels like a $20k build" goal.

**Why it happens:**
Developers import `motion` components directly (the ergonomically obvious path) without realizing the full feature set — drag, pan, layout animations, shared element transitions — is bundled even when only scroll-triggered fade-ins are needed.

**How to avoid:**
Use `LazyMotion` + `m` component pattern instead of raw `motion`:
```tsx
// In root layout or providers
import { LazyMotion, domAnimation } from "framer-motion";
<LazyMotion features={domAnimation} strict>
  {children}
</LazyMotion>

// In components — use m instead of motion
import { m } from "framer-motion";
<m.div whileInView={{ opacity: 1 }} />
```
`domAnimation` covers: animations, variants, exit animations, tap/hover/focus gestures (~15kb). `domMax` adds drag/layout animations (~25kb). Only upgrade to `domMax` if layout animations are actually needed. The `strict` prop on `LazyMotion` throws a build-time error if any `motion` component sneaks in — use it.

**Warning signs:**
- Bundle analyzer shows `framer-motion` contributing >30kb to a single chunk
- Lighthouse shows high "unused JavaScript" warnings
- LCP score fails (>2.5s) despite fast server response

**Phase to address:**
Phase 1 (project scaffolding) — establish `LazyMotion` wrapper in the root layout before any animation components are written. Retrofitting this later requires touching every animated component.

---

### Pitfall 2: Gold Accent Color Fails WCAG Contrast on Dark Backgrounds

**What goes wrong:**
Gold/amber colors (#C9A84C, #D4AF37, etc.) on matte black or dark charcoal backgrounds frequently fail WCAG 2.1 AA contrast requirements (minimum 4.5:1 for normal text, 3:1 for large text). A luxury brand that fails an accessibility audit looks careless — the opposite of the precision craftsmanship this site communicates.

**Why it happens:**
Designers choose gold by eye on a calibrated display. Gold "reads" as legible at normal brightness but measures poorly in contrast ratio tools because yellow-spectrum hues have high perceived luminance issues at lower saturation. The problem worsens on OLED screens and when gold is used for body-size text or form labels.

**How to avoid:**
- Use gold *only* as accent (borders, hover states, small decorative highlights) — never for body text or large text blocks
- For any gold used on text, verify with a contrast checker: target 4.5:1 minimum. A muted/desaturated gold (#B8963E on #111111 or #1A1A1A) is more likely to pass than a bright saturated gold (#FFD700)
- For body copy: use off-white (#E8E8E8 or #F0F0F0) on dark backgrounds, never pure white (#FFFFFF) which causes halos for users with astigmatism
- Run Tailwind color pairs through https://colour-a11y.vercel.app/ before finalizing the design token palette
- All interactive state colors (hover, focus, active, disabled) must independently pass contrast — not just default text

**Warning signs:**
- Gold being used on paragraph text or secondary labels
- No contrast ratio check in the design system documentation
- Focus ring color not specified (defaults to browser blue, which is invisible on dark backgrounds)

**Phase to address:**
Phase 1 (design tokens / Tailwind config) — establish the token palette with pre-verified contrast ratios. Every color pair in `tailwind.config.ts` should have a documented contrast ratio.

---

### Pitfall 3: Custom Cursor Causes Layout Jank via useState Re-renders

**What goes wrong:**
The intuitive implementation tracks cursor position with `useState`, which triggers React re-renders on every `mousemove` event — firing 60-120 times per second. This floods the component tree with updates, causing jank in animations, scroll effects, and any other concurrent state, especially on lower-end machines.

**Why it happens:**
React state is the first tool developers reach for. `useState` + `onMouseMove` "works" in a demo but doesn't survive real usage with simultaneous Framer Motion animations.

**How to avoid:**
Track position with `useRef` and update the DOM directly, bypassing React's render cycle entirely:
```tsx
const cursorRef = useRef<HTMLDivElement>(null);
const pos = useRef({ x: 0, y: 0 });

useEffect(() => {
  const move = (e: MouseEvent) => {
    pos.current = { x: e.clientX, y: e.clientY };
    if (cursorRef.current) {
      cursorRef.current.style.transform =
        `translate(${e.clientX}px, ${e.clientY}px)`;
    }
  };
  window.addEventListener("mousemove", move);
  return () => window.removeEventListener("mousemove", move);
}, []);
```
For the "follower" lag effect (cursor with inertia), use `requestAnimationFrame` to lerp position — never CSS transitions on `transform` (causes visual frame delay). Additionally, the custom cursor must be hidden completely on touch devices — use CSS `@media (hover: hover) and (pointer: fine)` to conditionally render it at all.

**Warning signs:**
- Custom cursor component using `useState` for x/y coordinates
- React DevTools showing cursor component re-rendering on every frame
- Animation lag correlated with cursor movement
- Cursor visible on mobile (pointing-finger-on-touchscreen artifacts)

**Phase to address:**
Phase 2 (layout and global UI components) — build the cursor correctly from first implementation. The `useRef`-based pattern must be established before any section components depend on cursor context state.

---

### Pitfall 4: AnimatePresence Breaks with Next.js App Router Page Transitions

**What goes wrong:**
`AnimatePresence` used for route/page transition exit animations doesn't work reliably in Next.js App Router. The App Router wraps pages in providers and updates context during navigation, causing components to unmount/remount abruptly — interrupting exit animations mid-play. This is a documented, unfixed limitation as of 2025.

**Why it happens:**
`AnimatePresence` needs stable React context and predictable unmounting to detect when children leave the tree. App Router's internal routing mechanism doesn't expose the lifecycle hooks `AnimatePresence` depends on. Workarounds using `FrozenRouter` rely on undocumented Next.js internals and can break on Next.js minor version updates.

**How to avoid:**
Do not use `AnimatePresence` for page-level route transitions on this project. The site has only two routes (home + services) — the effort-to-reward ratio is poor and the fragility risk is high. Instead:
- Animate section *entries* with `whileInView` (in-page scroll reveals) — fully supported
- Animate the navbar state change (transparent → solid) with CSS transitions or `useScroll` — fully supported
- If page transition feel is desired, animate opacity on the page wrapper using a CSS class toggled on `router.events` — avoid Framer Motion for route-level changes

**Warning signs:**
- Exit animations completing instantly or not at all during navigation
- Console errors about unmounted component state during navigation
- Build working in dev but failing in production build (App Router behavior differs)

**Phase to address:**
Phase 3 (section animations) — document this limitation explicitly so it doesn't get discovered mid-implementation. Scope all Framer Motion usage to within-page animations only.

---

### Pitfall 5: Scroll Animations Animate Non-Compositable CSS Properties (Layout Thrashing)

**What goes wrong:**
Animating properties like `width`, `height`, `top`, `left`, `margin`, or `padding` via Framer Motion or CSS triggers browser layout recalculation on every frame — causing jank, dropped frames, and high CPU usage. On a luxury site where smooth 60fps motion is core to the brand promise, this is fatal.

**Why it happens:**
Developers animate the "natural" property (e.g., `height: 0` → `height: auto` for accordion reveals, or `top/left` for parallax) without realizing these force layout reflow. The browser must recalculate the position of every affected element before it can paint.

**How to avoid:**
Animate exclusively `transform` and `opacity` — these run on the GPU compositor thread and never trigger layout:
```tsx
// WRONG — triggers layout
<m.div animate={{ height: 200, top: 50 }} />

// CORRECT — compositor only
<m.div animate={{ y: 50, scaleY: 1 }} />
```
For parallax effects: use `useScroll` → `useTransform` → `y` (transform), never `top` or `marginTop`. For section reveals: use `opacity` + `y` offset. For the process timeline: animate `scaleX` or `scaleY` for line draws, not `width`/`height`.

**Warning signs:**
- Chrome DevTools Performance panel showing "Layout" events during scroll
- "Forced reflow" warnings in the console
- Animations smooth in dev but janky in production (dev is faster hardware)
- `will-change: transform` applied as a blanket fix (signals the real property was wrong)

**Phase to address:**
Phase 3 (scroll animations) — establish an animation property convention before building any animated sections. Document: "transform + opacity only" as a hard rule.

---

### Pitfall 6: Missing `prefers-reduced-motion` Support

**What goes wrong:**
Users with vestibular disorders, motion sensitivity, or epilepsy can experience physical symptoms from scroll-triggered animations, parallax, and entrance effects. Ignoring `prefers-reduced-motion` is both an accessibility failure (WCAG 2.3.3) and a legal risk in Canadian markets (AODA — Accessibility for Ontarians with Disabilities Act applies to this Ontario-based business).

**Why it happens:**
Animation is added progressively and feels like a polish layer, not a core feature. Reduced motion support gets treated as a "later" concern and never arrives.

**How to avoid:**
Wrap the entire app in a `MotionConfig` with `reducedMotion="user"` — this is a single-line fix that automatically disables transform/layout animations while preserving opacity transitions:
```tsx
// In root layout
import { MotionConfig } from "framer-motion";
<MotionConfig reducedMotion="user">
  {children}
</MotionConfig>
```
For any animation that should completely disappear (not just be reduced), use `useReducedMotion()` hook to conditionally render the static version. The grain texture overlay and parallax effects should also be disabled under reduced motion (CSS `@media (prefers-reduced-motion: reduce)`).

**Warning signs:**
- No `MotionConfig reducedMotion` in root layout
- Animations tested only by developers who haven't set reduced motion in system preferences
- Grain texture overlay has no reduced-motion CSS override

**Phase to address:**
Phase 1 (project scaffolding) — add `MotionConfig reducedMotion="user"` to root layout on day one. Phase 3 (animations) — verify each animation has an acceptable reduced-motion fallback.

---

### Pitfall 7: Masonry Gallery Causes Hydration Mismatch or Layout Shift

**What goes wrong:**
JavaScript-calculated masonry layouts (where column heights are measured client-side to position items) generate a different DOM structure on the server (SSR) than on the client — causing React hydration errors. Even when hydration succeeds, the layout "jumps" after JavaScript runs, causing a visible CLS (Cumulative Layout Shift) failure.

**Why it happens:**
Masonry requires knowing the rendered height of each item to calculate column stacking — information that only exists in the browser, not during SSR. Many popular masonry libraries work this way silently.

**How to avoid:**
Use a CSS-based masonry approach that doesn't require client-side height measurement:
- CSS `columns` property for a simple column-based masonry (order flows top-to-bottom in columns, not left-to-right in rows — acceptable for a portfolio gallery)
- If left-to-right row order matters: use CSS Grid with `grid-auto-rows` and `span` hints baked into item data at build time
- Avoid `react-masonry-css`, `masonic`, or similar JS-column-calculation libraries for SSR projects
- If JS masonry is required: render with `opacity: 0` server-side, calculate and apply layout client-side in `useEffect`, then fade in — prevents hydration mismatch while avoiding visible shift

**Warning signs:**
- "Hydration mismatch" console errors on the portfolio section
- Portfolio gallery "jumps" layout after page load (visible CLS)
- Lighthouse CLS score fails specifically during gallery interaction

**Phase to address:**
Phase 4 (portfolio section) — choose masonry implementation strategy before writing any gallery code. Prototype CSS `columns` approach first; only escalate to JS masonry if column order is unacceptable.

---

### Pitfall 8: Grain Texture Overlay Implemented as Expensive SVG Filter at Runtime

**What goes wrong:**
Using `filter: url(#noise)` with an SVG `feTurbulence` filter applied as a live CSS filter to a full-viewport overlay causes the GPU to recalculate the filter on every frame that anything underneath changes — including scroll and animations. On lower-end hardware this manifests as stutter across the entire page.

**Why it happens:**
The SVG filter approach looks clean and generates authentic procedural noise. Developers implement it without realizing `feTurbulence` is recalculated dynamically when applied as a CSS filter to a large element.

**How to avoid:**
Pre-render the grain as a static asset instead of computing it at runtime:
1. Generate a tileable grain PNG (200x200px, ~8-15kb) using a tool like https://www.fffuel.co/nnnoise/ or Photoshop
2. Apply as a CSS `background-image` with `repeat` and very low opacity (`opacity: 0.03` to `0.06`)
3. Use `mix-blend-mode: overlay` or `multiply` for integration with the dark background
4. Add `pointer-events: none` and `position: fixed` so it floats above content without interfering

This approach is zero GPU cost after initial asset load versus continuous recomputation.

**Warning signs:**
- `filter` property referencing an inline SVG applied to a large DOM element
- Chrome DevTools showing "Paint" events during scroll when nothing should be repainting
- Performance degrades on older MacBooks or mid-range phones

**Phase to address:**
Phase 2 (global layout/aesthetic layer) — implement grain as static PNG from the start. Include the grain asset in the public directory as part of initial setup.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using `motion` instead of `m` + `LazyMotion` | Simpler imports, faster development | +19kb in initial bundle, fails Core Web Vitals | Never — set up LazyMotion from day one |
| `useState` for cursor position | Obvious React pattern | Re-renders 60-120x/second, causes global jank | Never — use `useRef` + direct DOM mutation |
| `once: false` on all `whileInView` animations | Animations replay on scroll back | Repeated animation re-triggers are distracting; performance cost on mobile scroll | Never for entrance animations; only for progress indicators |
| Hardcoded color values instead of CSS variables | Faster to write | Dark theme palette changes require find-and-replace across 40+ files | Only for one-off exceptions |
| Skipping `prefers-reduced-motion` until "polish phase" | Faster initial build | AODA compliance risk; never actually gets done | Never — one-line fix belongs in scaffolding |
| `layout` prop on Framer Motion elements "just in case" | Enables smooth reflow animations | Opts element into expensive FLIP calculations on every render | Only on elements where layout animation is explicitly designed |
| CSS `transition: all` on dark/hover states | Fast to write | Animates properties that shouldn't animate (color, shadow, transform simultaneously) causing jank | Never — always specify exact properties |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `next/font` with Playfair Display | Using Google Fonts CDN link instead of `next/font` | Use `import { Playfair_Display } from "next/font/google"` — self-hosts at build time, eliminates external DNS/network request, prevents FOUT |
| `next/font` with Playfair Display | Loading all weights (400, 500, 600, 700, 800, 900) | Load only weights actually used in design (400 + 700 is likely sufficient) — each extra weight is an additional network request and blocking resource |
| `next/image` with dark background sections | Default placeholder is grey (`#f0f0f0`) — appears as light flash before image loads | Set `placeholder="blur"` with a dark `blurDataURL` (a base64 1x1 pixel in matte black: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`) |
| `next/image` with external Unsplash URLs | Remote images require explicit `remotePatterns` config and no automatic blur placeholder | Add `images.remotePatterns` for `images.unsplash.com` in `next.config.ts`; generate `blurDataURL` manually or use a custom loader |
| JSON-LD structured data | Placing JSON-LD in a Client Component | Render JSON-LD exclusively in Server Components or `layout.tsx` — Client Component JSON-LD gets included twice (SSR + hydration), confusing Google's crawler |
| JSON-LD structured data | Skipping XSS sanitization of dynamic content | Replace `<` with `\u003c` in any string values built from user or CMS content before inserting into JSON-LD `<script>` tag |
| Vercel deployment | Unset `NEXT_PUBLIC_` environment variables | All client-side environment variables must be prefixed `NEXT_PUBLIC_`; forgetting this means they're undefined in production but work fine locally |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Animating non-compositable CSS properties (`height`, `width`, `top`, `left`) | Jank during scroll, high CPU in DevTools, dropped frames on MacBook Air / mid-range phones | Only animate `transform` (x, y, scale, rotate) and `opacity` | Immediately on any device; worse on battery-saver mode |
| Unthrottled scroll listeners outside Framer Motion (e.g., for navbar) | Main thread blocked during scroll, INP failures | Use `useScroll` from Framer Motion (uses IntersectionObserver and passive listeners internally), or add `{ passive: true }` to manual scroll listeners | Immediately on mobile; desktop masks it |
| Too many simultaneous Framer Motion components with `whileInView` | Memory pressure, animation queue backup, frozen animations | Use `viewport={{ once: true }}` for entrance animations; limit concurrent animated elements above the fold | Pages with 6+ sections all animating in simultaneously |
| Loading all font weights/variants of Playfair Display + Raleway | Additional 200-400kb of font data, visible FOUT before font swap | Specify only the exact weights/styles used; use `display: 'swap'` in `next/font` config | Always; worsens on slow 3G |
| Grain overlay as live SVG filter on full viewport element | Continuous repaint on every scroll frame, GPU memory pressure | Pre-render as static PNG asset, use as `background-image` | Immediately on mobile; mid-tier laptops on battery |
| `useParallax`/`useScroll` with `container` prop missing `layoutScroll` | Scroll offset calculated against wrong ancestor, animations trigger at wrong scroll positions | Add `layoutScroll` prop to any scrollable container element that contains scroll-linked animations | Pages with non-window scrolling containers; layout changes after hydration |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Form submission posts to client-side handler that exposes email address in source | Spam bots harvest email; business inbox flooded | Form action should post to a Next.js API Route (or Vercel Edge Function) — never put `mailto:` or raw email in form action or JavaScript |
| JSON-LD with unsanitized dynamic content | XSS via `<script type="application/ld+json">` injection | Replace `<` with `\u003c` in any dynamic values before inserting into JSON-LD; use a library like `schema-dts` for typed, safe construction |
| Unsplash URLs hardcoded without `remotePatterns` config | `next/image` crashes in production build; possible SSRF if URL source becomes user-controlled | Always whitelist domains in `next.config.ts` `images.remotePatterns`; never use `unoptimized: true` as a workaround |
| No rate limiting on the quote request form | Form spam / abuse before email integration is added | Even in "UI only" phase, add honeypot field and basic client-side submission throttle; API route should have rate limiting before launch |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Custom cursor visible on touch/mobile devices | Cursor appears as an extra visual artifact; touch interactions behave unexpectedly; some mobile browsers simulate hover events causing stuck cursor states | Conditionally render cursor component only when `@media (hover: hover) and (pointer: fine)` — pure CSS guard; never rely on JavaScript `isMobile` user-agent detection |
| Hover-only portfolio overlay (caption + CTA) on touch devices | Mobile users see images with no caption or action — portfolio appears broken | Implement hover overlay for mouse, tap-to-reveal for touch; use `@media (hover: none)` to show captions statically on mobile |
| Before/after slider lacks touch support | Mobile users cannot interact with the featured project comparison — primary interactive element is non-functional | Use Pointer Events API (`onPointerDown`, `onPointerMove`, `onPointerUp`) instead of separate mouse/touch handlers; set `touch-action: none` on slider container to prevent scroll conflict |
| Pure black (#000000) background with pure white text | Halation/halo effect for users with astigmatism (estimated 1-in-3 adults); text appears to "bleed" | Use #111111 or #141414 for backgrounds and #E8E8E8 or #F0F0F0 for body text — high contrast without pure extremes |
| Gold as a link or interactive state with no visible focus ring | Keyboard-only users cannot see focus position against dark background | Define explicit `focus-visible` styles using a visible outline (gold or white) with sufficient contrast; never rely on browser default blue focus ring on dark backgrounds |
| Scroll animations trigger while user is on a reduced-battery / low-end device | Dropped frames on the animations meant to convey precision and quality — backfires against brand message | `MotionConfig reducedMotion="user"` handles OS-level preference; additionally consider `matchMedia("(max-device-memory: 1GB)")` to disable parallax on low-memory devices |

---

## "Looks Done But Isn't" Checklist

- [ ] **Custom cursor:** Verify it is completely invisible on touch devices — test on a real iPhone and Android, not browser devtools touch simulation
- [ ] **Portfolio hover overlays:** Test with a finger on mobile — overlay should either always-show or tap-to-reveal, not be permanently inaccessible
- [ ] **Before/after slider:** Test drag on mobile with inertial scrolling — slider should capture the gesture without the page scrolling simultaneously (requires `touch-action: none`)
- [ ] **Scroll animations:** Enable "Reduce Motion" in macOS Accessibility settings and reload — verify no entrance animations play, page is still fully legible and functional
- [ ] **Gold accent contrast:** Run every gold-on-dark text combination through a WCAG contrast checker — 4.5:1 minimum for any text, 3:1 for decorative large text
- [ ] **Font loading:** Hard-reload with DevTools network throttled to "Fast 3G" — verify no FOUT (flash of fallback serif) and no layout shift as Playfair Display loads
- [ ] **JSON-LD:** Validate with Google's Rich Results Test (https://search.google.com/test/rich-results) after deployment — confirm LocalBusiness schema renders without errors
- [ ] **Navbar transition:** Verify transparent-to-solid transition looks correct against the hero image on both Chrome and Safari (Safari composites differently)
- [ ] **Grain overlay:** Disable GPU acceleration in browser flags and verify grain doesn't cause full-page repaint on scroll — check via DevTools Paint Flashing
- [ ] **Form submission:** Verify the quote form shows a clear success state and the data is captured (even if email not yet wired up) — "looks submitted but does nothing" is worse than no form
- [ ] **Open Graph image:** Verify the OG image renders correctly when sharing the URL on iMessage, Twitter/X, and LinkedIn — each platform has different size/crop behavior

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Discovered bundle size too large after build | MEDIUM | Add `LazyMotion` wrapper at root, replace all `motion.*` with `m.*`, run bundle analyzer to verify; likely 2-4 hours |
| Gold text fails contrast audit pre-launch | LOW-MEDIUM | Darken/desaturate gold token in `tailwind.config.ts` and verify design still reads as luxury; adjust opacity on decorative uses; likely 2-6 hours depending on how widely gold is used on text |
| Custom cursor causing jank discovered in QA | MEDIUM | Refactor to `useRef` + direct DOM mutation; remove `useState`; likely 4-8 hours including testing across sections |
| Masonry hydration mismatch discovered mid-build | HIGH | Likely requires replacing the masonry library with a CSS `columns` approach — the DOM structure changes fundamentally; 1-2 days |
| `prefers-reduced-motion` missing at launch (post-launch fix) | LOW | Single `MotionConfig reducedMotion="user"` wrapper in root layout; verify each section still looks correct; likely 1-3 hours |
| Grain texture causing scroll performance issues | LOW | Generate static PNG, update CSS to use `background-image`; likely 1-2 hours |
| AnimatePresence page transitions broken in production | MEDIUM | Remove page-level AnimatePresence, implement CSS-based fade transition via router events; likely 4-8 hours |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Framer Motion bundle size (LazyMotion) | Phase 1: Scaffolding | Run `next build && npx @next/bundle-analyzer` — framer-motion chunk must be <20kb initial |
| Gold contrast failures | Phase 1: Design tokens | Document contrast ratio for every color pair in tailwind.config.ts before writing any components |
| Custom cursor jank | Phase 2: Global UI components | Profile in Chrome DevTools Performance tab — zero re-renders during cursor movement |
| AnimatePresence + App Router breakage | Phase 3: Animations | Test navigation between home and services page in production build (not dev) |
| Non-compositable animation properties | Phase 3: Animations | Chrome DevTools Performance panel shows zero "Layout" events during scroll |
| Missing reduced-motion support | Phase 1: Scaffolding + Phase 3: Animations | Test with OS "Reduce Motion" enabled; all content must be fully accessible without animation |
| Masonry hydration mismatch | Phase 4: Portfolio section | React DevTools shows zero hydration warnings; no visible layout shift on hard reload |
| Grain texture performance | Phase 2: Global layout | DevTools Paint Flashing shows no repaint during scroll |
| Before/after slider touch support | Phase 4: Portfolio section | Test on physical mobile device — slider drag must not trigger page scroll simultaneously |
| Missing reduced-motion on grain + parallax | Phase 3: Animations | CSS `@media (prefers-reduced-motion: reduce)` disables `position: fixed` grain overlay and parallax transforms |
| JSON-LD XSS / duplication | Phase 5: SEO | Validate with Google Rich Results Test; view source and confirm single JSON-LD script tag |
| Font FOUT / layout shift | Phase 1: Scaffolding | Lighthouse CLS score passes (< 0.1) with Playfair Display loading |

---

## Sources

- [Motion/Framer Motion — Reduce bundle size](https://motion.dev/docs/react-reduce-bundle-size)
- [Motion/Framer Motion — LazyMotion](https://motion.dev/docs/react-lazy-motion)
- [Motion/Framer Motion — Accessibility (useReducedMotion)](https://motion.dev/docs/react-accessibility)
- [Motion — Web Animation Performance Tier List](https://motion.dev/magazine/web-animation-performance-tier-list)
- [Next.js — AnimatePresence App Router breakage (GitHub issue #49279)](https://github.com/vercel/next.js/issues/49279)
- [Solving Framer Motion Page Transitions in Next.js App Router — imcorfitz.com](https://www.imcorfitz.com/posts/adding-framer-motion-page-transitions-to-next-js-app-router)
- [Next.js App Router Discussion: Page Transitions #59349](https://github.com/vercel/next.js/discussions/59349)
- [Smashing Magazine — Inclusive Dark Mode: Designing Accessible Dark Themes](https://www.smashingmagazine.com/2025/04/inclusive-dark-mode-designing-accessible-dark-themes/)
- [BOIA — Offering Dark Mode Doesn't Satisfy WCAG Contrast](https://www.boia.org/blog/offering-a-dark-mode-doesnt-satisfy-wcag-color-contrast-requirements)
- [WebAIM — Contrast and Color Accessibility](https://webaim.org/articles/contrast/)
- [Paul Irish — What forces layout/reflow (comprehensive list)](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)
- [DebugBear — How to Fix Forced Reflows and Layout Thrashing](https://www.debugbear.com/blog/forced-reflows)
- [Next.js — Font Optimization](https://nextjs.org/docs/app/getting-started/fonts)
- [TheLinuxCode — Fonts in Next.js 2026: patterns, performance, production pitfalls](https://thelinuxcode.com/fonts-in-nextjs-2026-nextfont-patterns-performance-and-production-pitfalls/)
- [Vercel — Optimizing Core Web Vitals](https://vercel.com/kb/guide/optimizing-core-web-vitals-in-2024)
- [Masonry Grid SSR/hydration issues — mui/material-ui #32688](https://github.com/mui/material-ui/issues/32688)
- [CSS-Tricks — Grainy Gradients (grain texture approach)](https://css-tricks.com/grainy-gradients/)
- [Next.js — JSON-LD Structured Data Guide](https://nextjs.org/docs/app/guides/json-ld)
- [LogRocket — React Scroll Animations with Framer Motion](https://blog.logrocket.com/react-scroll-animations-framer-motion/)
- [Motion — whileInView not triggered on soft navigation (GitHub issue #3079)](https://github.com/motiondivision/motion/issues/3079)
- [CSS Hover Media Queries for touch vs mouse detection — CodeLucky](https://codelucky.com/css-hover-media-queries-touch-mouse/)
- [Next.js Image component API reference](https://nextjs.org/docs/app/api-reference/components/image)

---

*Pitfalls research for: Premium dark-luxury marketing website (Next.js 14+ App Router, TypeScript, Tailwind CSS, Framer Motion)*
*Researched: 2026-03-03*
