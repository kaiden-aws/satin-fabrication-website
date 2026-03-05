# Phase 1: Foundation - Research

**Researched:** 2026-03-04
**Domain:** Next.js 15 project scaffolding, CSS design tokens (Tailwind v4), self-hosted fonts (`next/font`), animation infrastructure (Motion/LazyMotion), grain texture overlay
**Confidence:** HIGH

## Summary

Phase 1 establishes the technical foundation that every downstream component depends on. The phase covers six requirements (DSGN-01 through DSGN-06) that span four distinct technical domains: project scaffolding with Next.js 15 + Tailwind CSS v4, a CSS custom property design token system, self-hosted Google Font loading via `next/font`, and Motion (formerly Framer Motion) animation infrastructure with LazyMotion bundle optimization and reduced motion compliance.

The critical insight for this phase is that all four domains must be established correctly from day one because they are expensive or impossible to retrofit. LazyMotion with `strict` mode cannot be added after components use the full `motion` import -- every animated component would need rewriting. Design tokens defined incorrectly propagate wrong colors through every component built in later phases. Font loading configured incorrectly causes flash-of-unstyled-text that is visible on every page load. The grain texture overlay, if implemented as a live SVG filter instead of a static PNG, causes performance degradation across the entire site.

The existing project-level research (`.planning/research/`) provides verified stack versions and architecture patterns. This phase-specific research narrows focus to the exact configuration details, import paths, known bugs, and integration patterns needed for implementation.

**Primary recommendation:** Scaffold the project with `create-next-app@latest`, configure Tailwind v4 `@theme` tokens and `next/font` variables in `globals.css`, create a `Providers` client component wrapping `LazyMotion` + `MotionConfig`, and add the grain texture as a static PNG overlay -- all before writing any visual components.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DSGN-01 | Dark luxury color palette: void (#0A0A0A), charcoal (#1A1A1A), gold (#C9A96E), off-white (#F5F0EB), warm gray (#8A8278) | Tailwind v4 `@theme` directive with `--color-*` namespace; CSS variables auto-generated; verified color token naming and utility class generation |
| DSGN-02 | Playfair Display + Raleway via `next/font` (self-hosted, display: swap) | `next/font/google` import pattern verified; CSS variable injection on `<html>` element; `@theme` font-family mapping required for Tailwind v4 integration |
| DSGN-03 | Grain/noise texture overlay at 3-5% opacity via CSS pseudo-element | Static PNG approach (not SVG feTurbulence); `pointer-events: none`, `position: fixed`, `mix-blend-mode: overlay`; reduced motion CSS override |
| DSGN-04 | Scroll-triggered reveal animation infrastructure (Framer Motion LazyMotion + domAnimation) | `LazyMotion` with `domAnimation` features + `strict` prop; `m` component imported from `"motion/react"` (not `"motion/react-m"` -- known bug); ~15kb vs ~34kb |
| DSGN-05 | Reduced motion support via `MotionConfig reducedMotion="user"` | Wraps at root layout level inside Providers client component; auto-disables transform/layout animations while preserving opacity; AODA compliance |
| DSGN-06 | CSS design tokens for palette, spacing, typography scale, and luxury easing curve via Tailwind theme | `@theme` directive in `globals.css` defines all tokens; custom `--ease-luxury` cubic-bezier; font scale mapped to Tailwind utilities |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.x (latest stable) | App Router framework | `create-next-app@latest` scaffolds with React 19, TypeScript, Tailwind v4, ESLint flat config out of the box |
| React | 19.x | UI runtime | Required for Next.js 15 App Router; React 18 only works with Pages Router |
| TypeScript | 5.x | Type safety | Included in scaffold; `strict: true` enabled by default |
| Tailwind CSS | 4.x | Utility-first CSS with design tokens | CSS-first `@theme` config replaces `tailwind.config.js`; native CSS variables; `@import "tailwindcss"` single directive |
| Motion | 12.x | Animation library | Rebranded from `framer-motion`; install as `motion`, import from `motion/react` |

### Supporting (Phase 1 only)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `clsx` | ^2.x | Conditional class composition | Any component with dynamic class names |
| `tailwind-merge` | ^2.x | Merge Tailwind classes safely | Pair with `clsx` into a `cn()` utility |
| `sharp` | ^0.33.x | Image optimization for local builds | Silences `next build` warning; Vercel handles it in prod |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tailwind v4 `@theme` | `tailwind.config.ts` (v3 style) | v3 config still works but misses native CSS variable generation and ~70% smaller output |
| `motion` package | `framer-motion` package | Same library, but `motion` is the canonical name since late 2024; `framer-motion` is legacy |
| `next/font/google` | `@fontsource/playfair-display` | `next/font` self-hosts at build time with zero external requests and zero layout shift; Fontsource requires manual CSS variable setup |

**Installation:**
```bash
# Scaffold project
npx create-next-app@latest satin-fabrication --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Animation
npm install motion

# Class utilities
npm install clsx tailwind-merge

# Image processing (local builds)
npm install sharp
```

## Architecture Patterns

### Recommended Project Structure (Phase 1 scope)

```
src/
├── app/
│   ├── layout.tsx               # Root layout: fonts, metadata, Providers wrapper
│   ├── page.tsx                 # Minimal placeholder page (verifies scaffold works)
│   └── globals.css              # @import "tailwindcss", @theme tokens, base styles
│
├── components/
│   └── layout/
│       └── GrainOverlay.tsx     # Fixed noise texture overlay (pure CSS, no JS)
│
├── providers/
│   └── Providers.tsx            # 'use client' — LazyMotion + MotionConfig wrapper
│
├── lib/
│   └── utils.ts                 # cn() utility (clsx + tailwind-merge)
│
└── public/
    └── textures/
        └── grain.png            # Pre-rendered tileable noise texture (~200x200px)
```

### Pattern 1: Server Layout + Client Providers Split

**What:** `app/layout.tsx` remains a Server Component. A separate `providers/Providers.tsx` file marked `'use client'` wraps `LazyMotion` and `MotionConfig` around `{children}`. The layout imports and renders `<Providers>` around the page content.

**When to use:** Always. This is mandatory for Next.js 15 App Router -- making the root layout a Client Component kills SSR benefits and bloats the initial bundle.

**Example:**
```typescript
// providers/Providers.tsx
'use client'

import { LazyMotion, domAnimation, MotionConfig } from 'motion/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </LazyMotion>
  )
}
```

```typescript
// app/layout.tsx (Server Component -- NO 'use client')
import { Playfair_Display, Raleway } from 'next/font/google'
import { Providers } from '@/providers/Providers'
import { GrainOverlay } from '@/components/layout/GrainOverlay'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '700'],
})

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${raleway.variable}`}>
      <body className="bg-void text-cream antialiased font-body">
        <Providers>
          {children}
        </Providers>
        <GrainOverlay />
      </body>
    </html>
  )
}
```

### Pattern 2: Tailwind v4 CSS-First Design Tokens

**What:** All design tokens defined in `globals.css` using the `@theme` directive. No `tailwind.config.ts` needed for colors, fonts, or easing. Tailwind v4 auto-generates CSS variables and utility classes from `@theme` declarations.

**When to use:** Always for this project. The `@theme` block is the single source of truth for the entire design system.

**Critical integration note:** `next/font` injects CSS variables on the `<html>` element at runtime. Tailwind v4 cannot resolve these variables during build unless they are explicitly redeclared in `@theme`. The pattern is to reference the next/font variable inside the @theme declaration.

**Example:**
```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Typography — reference next/font CSS variables */
  --font-display: var(--font-playfair), "Playfair Display", Georgia, serif;
  --font-body: var(--font-raleway), "Raleway", "Helvetica Neue", sans-serif;

  /* Color palette — DSGN-01 */
  --color-void: #0A0A0A;
  --color-charcoal: #1A1A1A;
  --color-surface: #111111;
  --color-gold: #C9A96E;
  --color-gold-light: #D4B87A;
  --color-gold-dim: #8A7544;
  --color-cream: #F5F0EB;
  --color-warm-gray: #8A8278;

  /* Easing — DSGN-04 luxury cubic-bezier */
  --ease-luxury: cubic-bezier(0.25, 0.1, 0.25, 1);

  /* Animation timing */
  --animate-reveal: reveal 0.7s var(--ease-luxury) both;
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Base styles */
body {
  font-family: var(--font-body);
  background-color: var(--color-void);
  color: var(--color-cream);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
}
```

### Pattern 3: Static Grain Texture Overlay

**What:** A pre-rendered tileable PNG (approximately 200x200px, ~8-15kb) applied as a fixed overlay via CSS `background-image` with very low opacity. No JavaScript, no SVG filters, no runtime computation.

**When to use:** Always use the static PNG approach for this project. Never use `feTurbulence` SVG filters -- they cause continuous GPU recomputation on every scroll frame.

**Example:**
```typescript
// components/layout/GrainOverlay.tsx (Server Component -- no 'use client' needed)
export function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.04]"
      style={{
        backgroundImage: 'url(/textures/grain.png)',
        backgroundRepeat: 'repeat',
        mixBlendMode: 'overlay',
      }}
      aria-hidden="true"
    />
  )
}
```

Add reduced motion override in `globals.css`:
```css
@media (prefers-reduced-motion: reduce) {
  .grain-overlay {
    display: none;
  }
}
```

### Anti-Patterns to Avoid

- **Making `app/layout.tsx` a Client Component:** Adding `'use client'` to the root layout forces the entire component tree into a client bundle. Use a separate `Providers` wrapper instead.
- **Importing `motion` instead of `m`:** The full `motion` component bundles ~34kb of features. With `LazyMotion strict`, this throws a build error -- which is the point. Always use `m` from `motion/react`.
- **Using `"motion/react-m"` subpath import:** There is a known unresolved bug (GitHub issue #3091) where `import * as m from "motion/react-m"` causes module mismatching in motion v12.4.3+. Import `{ m }` directly from `"motion/react"` instead.
- **Defining colors as raw hex values in components:** Use Tailwind utility classes (`bg-void`, `text-gold`, `border-gold`) mapped to CSS variables. Raw hex values (`bg-[#0A0A0A]`) bypass the token system and make palette changes impossible.
- **Loading all font weights:** Each extra weight is an additional blocking network request. Load only weights actually used: Playfair Display 400+700, Raleway 300+400+500+600.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Class name merging with Tailwind conflicts | Custom string concatenation | `cn()` utility wrapping `clsx` + `tailwind-merge` | Handles Tailwind's conflicting utility resolution (e.g., `bg-red-500 bg-blue-500`) correctly |
| Self-hosted Google Fonts | Manual font file downloads + `@font-face` declarations | `next/font/google` | Handles subsetting, display swap, CSS variable injection, build-time download, and zero external requests automatically |
| Motion bundle size optimization | Manual dynamic imports and tree-shaking config | `LazyMotion` with `domAnimation` + `strict` prop | Reduces initial bundle from ~34kb to ~15kb and throws errors if the full `motion` component leaks in |
| Reduced motion detection | Manual `window.matchMedia('(prefers-reduced-motion: reduce)')` | `MotionConfig reducedMotion="user"` | Single wrapper auto-disables transform/layout animations while preserving opacity across all child components |
| Grain texture generation | CSS `feTurbulence` SVG filter at runtime | Pre-rendered static PNG with `background-repeat` | SVG filter triggers GPU recomputation on every scroll frame; static PNG is zero ongoing GPU cost |
| Design token system | Custom CSS variable management + manual utility class creation | Tailwind v4 `@theme` directive | Auto-generates both CSS variables and utility classes from a single declaration |

**Key insight:** Phase 1 is entirely about configuring existing tools correctly, not building custom solutions. Every requirement maps to a built-in feature of Next.js, Tailwind, or Motion.

## Common Pitfalls

### Pitfall 1: Tailwind v4 Cannot Resolve next/font CSS Variables at Build Time

**What goes wrong:** Font variables injected by `next/font` on the `<html>` element are not visible to Tailwind v4's `@theme` resolution during the build step. Using `font-display` or `font-body` utility classes produces no output.

**Why it happens:** Tailwind v4 processes `@theme` at build time, but `next/font` injects its CSS variables at runtime. The variables don't exist during the CSS build.

**How to avoid:** Explicitly reference the `next/font` variable inside the `@theme` declaration with a fallback font stack:
```css
@theme {
  --font-display: var(--font-playfair), "Playfair Display", Georgia, serif;
  --font-body: var(--font-raleway), "Raleway", "Helvetica Neue", sans-serif;
}
```
The CSS variable reference (`var(--font-playfair)`) resolves at runtime when the `next/font` variable is injected. The fallback fonts prevent flash-of-unstyled-text if resolution fails.

**Warning signs:** `font-display` class has no visible effect; fonts render in system default; DevTools computed style shows the fallback font stack only.

### Pitfall 2: Font Variables Applied to `<body>` Instead of `<html>`

**What goes wrong:** `next/font` CSS variables are not inherited by Tailwind's `@theme` because they are scoped to `<body>` rather than the document root.

**Why it happens:** Some examples show applying `className={font.variable}` to `<body>`. CSS custom properties scope to the element they're defined on -- `@theme` expects them at the `:root` / `<html>` level.

**How to avoid:** Always apply font variable classes to the `<html>` element:
```tsx
<html lang="en" className={`${playfair.variable} ${raleway.variable}`}>
```

**Warning signs:** Fonts work inline but not through Tailwind utility classes.

### Pitfall 3: Using `motion` Component Inside LazyMotion strict

**What goes wrong:** Build error when any component imports and uses `motion.div` (or any `motion.*` component) while `LazyMotion strict` is active at the root.

**Why it happens:** The `strict` prop on `LazyMotion` deliberately throws errors when the full `motion` component is detected, because it defeats the purpose of lazy-loading features. This is intentional -- it is a guard rail, not a bug.

**How to avoid:** Always use `m.div`, `m.span`, etc. from `motion/react` inside any component that will render within the LazyMotion tree. Import as `import { m } from 'motion/react'`.

**Warning signs:** Build error message referencing `motion` component inside `LazyMotion`. This is the `strict` prop working correctly.

### Pitfall 4: Gold (#C9A96E) Fails WCAG Contrast on Dark Backgrounds for Text

**What goes wrong:** Gold used as text color on void (#0A0A0A) or charcoal (#1A1A1A) backgrounds fails WCAG AA (4.5:1) contrast ratio. Gold reads as legible to the eye but measures poorly.

**Why it happens:** Yellow-spectrum hues have high perceived luminance issues at lower saturation.

**How to avoid:** Use gold ONLY as accent -- borders, hover states, small decorative highlights. Never for body text or paragraph content. For any gold on text, verify 4.5:1 contrast ratio. Define a separate `--color-gold-light` (#D4B87A or lighter) specifically for the rare cases where gold must appear on text, and document its contrast ratio.

**Warning signs:** Gold being used on labels, descriptions, or any text smaller than 24px / 19px bold.

### Pitfall 5: Grain Overlay Intercepts Pointer Events

**What goes wrong:** The grain overlay `<div>` sits on top of all content (z-50, fixed, inset-0) and captures clicks, hovers, and touch events, making the entire site uninteractable.

**Why it happens:** Developers forget to add `pointer-events: none` to the overlay element.

**How to avoid:** Always include `pointer-events-none` (Tailwind) or `pointer-events: none` (CSS) on the grain overlay. Also add `aria-hidden="true"` for screen readers.

**Warning signs:** Nothing on the page is clickable after adding the grain overlay.

### Pitfall 6: Missing `suppressHydrationWarning` on `<html>` Element

**What goes wrong:** React hydration warning in the console because `next/font` injects class names on the `<html>` element after server render, creating a mismatch between server HTML and client hydration.

**Why it happens:** Server-rendered `<html>` has no font classes; client hydration adds them.

**How to avoid:** Add `suppressHydrationWarning` to the `<html>` element:
```tsx
<html lang="en" className={`${playfair.variable} ${raleway.variable}`} suppressHydrationWarning>
```

**Warning signs:** Console hydration mismatch warning mentioning `<html>` className.

## Code Examples

### cn() Utility

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Complete globals.css

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Typography — maps next/font CSS variables to Tailwind utilities */
  --font-display: var(--font-playfair), "Playfair Display", Georgia, serif;
  --font-body: var(--font-raleway), "Raleway", "Helvetica Neue", sans-serif;

  /* Color palette — DSGN-01 tokens */
  --color-void: #0A0A0A;
  --color-charcoal: #1A1A1A;
  --color-surface: #111111;
  --color-gold: #C9A96E;
  --color-gold-light: #D4B87A;
  --color-gold-dim: #8A7544;
  --color-cream: #F5F0EB;
  --color-warm-gray: #8A8278;

  /* Easing — DSGN-04 specified cubic-bezier */
  --ease-luxury: cubic-bezier(0.25, 0.1, 0.25, 1);

  /* Animation — DSGN-04 reveal animation */
  --animate-reveal: reveal 0.7s var(--ease-luxury) both;
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Reduced motion — DSGN-05 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Base layer */
body {
  font-family: var(--font-body);
  background-color: var(--color-void);
  color: var(--color-cream);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
}
```

### Providers Wrapper

```typescript
// src/providers/Providers.tsx
'use client'

import { LazyMotion, domAnimation, MotionConfig } from 'motion/react'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </LazyMotion>
  )
}
```

### Root Layout

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Playfair_Display, Raleway } from 'next/font/google'
import { Providers } from '@/providers/Providers'
import { GrainOverlay } from '@/components/layout/GrainOverlay'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '700'],
})

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Satin Fabrication | Custom Architectural Metalwork',
  description: 'Premium custom metal fabrication for Southern Ontario\'s finest homes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${raleway.variable}`} suppressHydrationWarning>
      <body className="bg-void text-cream antialiased font-body">
        <Providers>
          {children}
        </Providers>
        <GrainOverlay />
      </body>
    </html>
  )
}
```

### Grain Overlay Component

```typescript
// src/components/layout/GrainOverlay.tsx
export function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] motion-reduce:hidden"
      style={{
        backgroundImage: 'url(/textures/grain.png)',
        backgroundRepeat: 'repeat',
        mixBlendMode: 'overlay',
      }}
      aria-hidden="true"
    />
  )
}
```

### Placeholder Page

```typescript
// src/app/page.tsx
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-display text-6xl text-cream">
        SATIN <span className="text-gold">FABRICATION</span>
      </h1>
      <p className="mt-4 font-body text-warm-gray text-lg tracking-wide uppercase">
        Custom Architectural Metalwork
      </p>
    </main>
  )
}
```

### next.config.ts (Unsplash Remote Patterns)

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` with JS object | `@theme` directive in CSS (`globals.css`) | Tailwind v4 (Jan 2025) | No JS config file needed; CSS variables auto-generated; ~70% smaller CSS output |
| `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss";` | Tailwind v4 (Jan 2025) | Single import replaces three directives |
| `import { motion } from "framer-motion"` | `import { m } from "motion/react"` with `LazyMotion` | Motion v12 (late 2024) | Package renamed; `m` + `LazyMotion` cuts bundle from ~34kb to ~15kb |
| `import * as m from "motion/react-m"` | `import { m } from "motion/react"` | Ongoing (bug #3091) | The `react-m` subpath has a module mismatch bug in v12.4.3+; direct import from `motion/react` is the safe path |
| `@next/font` package | `next/font` (built-in) | Next.js 13+ | Old package path deprecated; `next/font` is the canonical import |
| SVG `feTurbulence` grain filter | Static PNG with `background-repeat` | Best practice | SVG filter recalculates on every scroll frame; PNG is zero GPU cost |

**Deprecated/outdated:**
- `framer-motion` package name: Still works but `motion` is canonical going forward
- `@next/font`: Deprecated, use `next/font/google` or `next/font/local`
- `tailwind.config.js` / `tailwind.config.ts`: Still functional in v4 but the CSS-first `@theme` approach is preferred
- Three-directive Tailwind import (`@tailwind base/components/utilities`): Replaced by single `@import "tailwindcss"`

## Open Questions

1. **Grain texture asset generation**
   - What we know: A tileable PNG (~200x200px) is needed at `public/textures/grain.png`
   - What's unclear: Whether to generate this programmatically, download from a free resource (e.g., fffuel.co/nnnoise), or create manually
   - Recommendation: Generate using an online tool like noisetexturegenerator.com or fffuel.co/nnnoise during implementation. Export as transparent PNG with black noise, ~200x200px, suitable for `mix-blend-mode: overlay` on dark backgrounds

2. **Exact Playfair Display weight coverage**
   - What we know: The requirements specify serif headings. The font supports weights 400-900
   - What's unclear: Whether only 400+700 are sufficient or if 600 (semi-bold) or 900 (black) are needed for specific heading sizes
   - Recommendation: Start with 400+700 (regular + bold). Add weights only if specific design comp demands them -- each additional weight increases initial load

3. **Tailwind v4 `@theme` namespace for non-standard tokens**
   - What we know: `--color-*`, `--font-*`, `--ease-*` namespaces generate utility classes automatically
   - What's unclear: Whether custom spacing or typography scale tokens need explicit `--spacing-*` or `--text-*` namespaces or can use the defaults
   - Recommendation: Use Tailwind v4's built-in spacing and font-size scale. Only define custom tokens if the design requires values outside the default scale

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual verification (no automated test framework in Phase 1) |
| Config file | none -- see Wave 0 |
| Quick run command | `npm run dev` (verify dev server starts) |
| Full suite command | `npm run build` (verify production build succeeds) |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DSGN-01 | Gold, charcoal, void, off-white tokens available as CSS vars and Tailwind utilities | smoke | `npm run build` (build succeeds with token references) | n/a Wave 0 |
| DSGN-02 | Playfair Display + Raleway render without FOUT, no external font requests | manual | Browser Network tab -- filter by font; verify self-hosted | n/a manual |
| DSGN-03 | Grain texture visible at low opacity across viewport | manual | Visual inspection in browser | n/a manual |
| DSGN-04 | LazyMotion with domAnimation + strict active at root | smoke | `npm run build` succeeds; importing `motion.div` in a test component throws error | n/a Wave 0 |
| DSGN-05 | MotionConfig reducedMotion="user" active | manual | Enable OS "Reduce motion", verify no Motion animations play | n/a manual |
| DSGN-06 | Design tokens accessible throughout app via CSS variables and Tailwind utilities | smoke | `npm run build` + visual inspection of placeholder page | n/a Wave 0 |

### Sampling Rate

- **Per task commit:** `npm run build` (must pass without errors)
- **Per wave merge:** `npm run build` + manual browser verification of all success criteria
- **Phase gate:** All 5 success criteria verified before marking Phase 1 complete

### Wave 0 Gaps

- No automated test framework is needed for Phase 1 (purely infrastructure/configuration)
- All validation is via build success + manual browser verification
- If the planner introduces automated tests in a future phase, the framework setup (Vitest or Playwright) should be added then, not now

## Sources

### Primary (HIGH confidence)

- [Tailwind CSS v4 `@theme` directive](https://tailwindcss.com/docs/theme) -- CSS-first token configuration, utility class generation
- [Tailwind CSS v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4) -- CSS-first config, PostCSS plugin, `@import "tailwindcss"`
- [Tailwind CSS font-family docs](https://tailwindcss.com/docs/font-family) -- `--font-*` namespace in `@theme`
- [Tailwind CSS transition-timing-function docs](https://tailwindcss.com/docs/transition-timing-function) -- `--ease-*` namespace in `@theme`
- [Next.js font optimization](https://nextjs.org/docs/app/getting-started/fonts) -- `next/font/google` API, self-hosting, CSS variables
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) -- Provider pattern for App Router
- [Motion LazyMotion docs](https://motion.dev/docs/react-lazy-motion) -- `features`, `strict` prop, `m` component
- [Motion reduce bundle size](https://motion.dev/docs/react-reduce-bundle-size) -- domAnimation vs domMax, import patterns
- [Motion MotionConfig docs](https://motion.dev/docs/react-motion-config) -- `reducedMotion="user"` pattern
- [Motion accessibility docs](https://motion.dev/docs/react-accessibility) -- reduced motion behavior, useReducedMotion
- [Next.js image remote patterns](https://nextjs.org/docs/app/api-reference/config/next-config-js/images) -- `remotePatterns` config for Unsplash
- [Next.js create-next-app CLI](https://nextjs.org/docs/app/api-reference/cli/create-next-app) -- scaffold flags

### Secondary (MEDIUM confidence)

- [Tailwind v4 + next/font integration discussion](https://github.com/tailwindlabs/tailwindcss/discussions/15923) -- `@theme` must explicitly reference next/font variables
- [Tailwind + Next.js Setup Guide 2026](https://designrevision.com/blog/tailwind-nextjs-setup) -- confirmed create-next-app installs Tailwind v4
- [Vercel common mistakes with App Router](https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them) -- Provider wrapping pattern

### Tertiary (LOW confidence)

- [Motion LazyMotion bug #3091](https://github.com/motiondivision/motion/issues/3091) -- `motion/react-m` subpath import causes module mismatch in v12.4.3+; open issue as of Dec 2025; workaround is to use `import { m } from "motion/react"` directly

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- versions verified via npm, official docs, and release notes; create-next-app confirmed to scaffold Tailwind v4
- Architecture: HIGH -- Provider pattern is official Next.js guidance; LazyMotion + MotionConfig wrapping is documented in Motion official docs
- Pitfalls: HIGH -- font variable resolution issue confirmed via Tailwind GitHub discussion; LazyMotion bug confirmed via Motion GitHub issue; gold contrast documented in WCAG guidelines

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (stable stack; 30-day window appropriate)
