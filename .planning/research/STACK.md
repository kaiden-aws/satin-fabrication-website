# Stack Research

**Domain:** Premium dark-luxury fabrication company website (Next.js App Router)
**Researched:** 2026-03-03
**Confidence:** HIGH (core framework versions verified against official sources and npm; supporting libraries verified via multiple sources)

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 15.x (latest: 15.5) | Full-stack React framework | App Router is production-stable; native Vercel deployment with zero-config; `next/image` + `next/font` eliminate performance pitfalls that kill Core Web Vitals on luxury sites |
| React | 19.x | UI runtime | Required for Next.js 15 App Router; React 19 stable since Next.js 15.1 (Dec 2024). React 18 only works with Pages Router — do not mix |
| TypeScript | 5.x | Type safety | Included in `create-next-app`; catches component prop errors that break placeholders-to-real-content swaps |
| Tailwind CSS | 4.x | Utility-first styling | v4 released Jan 2025; CSS-first `@theme` config replaces `tailwind.config.js`; 3-10x faster builds; native CSS variables mean design tokens are accessible at runtime — critical for the gold accent / charcoal token system this site needs |
| Motion (Framer Motion) | 12.x (latest: 12.34.x) | Animation | Rebranded from `framer-motion` to `motion` in late 2024; same API, drop-in. `useInView`, `whileInView`, `useScroll` cover all required animations: scroll reveals, parallax, process timeline, nav transition |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `motion` | ^12.x | Animations (install as `motion`, import from `motion/react`) | All scroll-triggered reveals, custom cursor, nav scroll state, process timeline — everywhere |
| `clsx` | ^2.x | Conditional class composition | Any component with dynamic class names (e.g., nav transparent → solid) |
| `tailwind-merge` | ^2.x | Merge Tailwind classes without conflicts | Wrap with `clsx` into a `cn()` utility — standard pattern for all class merging |
| `react-hook-form` | ^7.71.x | Form state management | Quote request form — zero re-renders per keystroke, excellent DX |
| `zod` | ^4.x | Schema validation | Pair with react-hook-form via `@hookform/resolvers/zod`; validates quote form client-side; same schema reused server-side when email integration is added |
| `@hookform/resolvers` | ^3.x | Connects Zod schema to react-hook-form | Required bridge package; use `zodResolver` |
| `sonner` | ^2.x | Toast notifications | Form success/error feedback; zero dependencies, Tailwind-native, works from Server Components |
| `sharp` | ^0.33.x | Server-side image processing | Required for Next.js Image Optimization in production outside Vercel (e.g., standalone output). Not needed on Vercel — Vercel handles it. Install anyway to silence the warning during local `next build` |
| `react-compare-slider` | ^3.x | Before/after image comparison | Before/after slider for featured project; zero dependencies, accessible, supports drag and keyboard |
| `next-themes` | ^0.3.x | Theme management | Manages the `dark` class on `<html>` without SSR flicker; needed if a theme toggle is ever added. Also the cleanest way to lock the site to dark-only without a flash of unstyled content |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint (flat config) | Code quality | Next.js 15 ships `eslint.config.mjs` by default; extend with `next/core-web-vitals` and `next/typescript` |
| Prettier | Code formatting | Use `eslint-config-prettier` (not `eslint-plugin-prettier`) — avoids the slower plugin approach. Configure via `.prettierrc` |
| TypeScript strict mode | Type safety | Set `"strict": true` in `tsconfig.json`. Next.js does this by default. Do not disable — it catches the real bugs |
| Vercel CLI | Deployment | `vercel dev` for local parity; `vercel deploy` for preview/production |

---

## Installation

```bash
# Bootstrap (use Next.js 15 with all defaults)
npx create-next-app@latest satin-fabrication --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Tailwind v4 PostCSS plugin (if not auto-installed)
npm install -D @tailwindcss/postcss

# Animation
npm install motion

# Class utilities
npm install clsx tailwind-merge

# Form validation
npm install react-hook-form zod @hookform/resolvers

# Notifications
npm install sonner

# Before/after slider
npm install react-compare-slider

# Theme management
npm install next-themes

# Image processing (for local builds)
npm install sharp
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| `motion` (v12) | `framer-motion` (v12) | Never for new projects — same package, but `motion` is the canonical name going forward. Legacy codebases only |
| Tailwind CSS v4 | Tailwind CSS v3 | Only if you need IE11 or browsers older than 3 years. v4 drops support intentionally. Not relevant for a Vercel-hosted premium site in 2025 |
| `react-hook-form` | `@tanstack/react-form` | TanStack Form is excellent but has fewer tutorials and a smaller ecosystem of resolvers. RHF is the dominant choice for 2025 and has direct Zod integration |
| `zod` v4 | `zod` v3 | Zod v3 is accessible via `import from "zod/v3"` if a dependency hasn't updated yet. Prefer v4 directly — it's a superset with better performance |
| `sonner` | `react-hot-toast` | react-hot-toast is fine but requires more configuration for positioning and styling. Sonner is more opinionated and matches the aesthetic out of the box |
| `react-compare-slider` | Custom CSS clip-path slider | Build custom only if you need very specific interaction behavior. react-compare-slider handles touch, keyboard, and resize correctly — not worth rebuilding |
| `next/font` (built-in) | `@fontsource/*` packages | next/font self-hosts at build time with zero Google requests and zero layout shift. Fontsource is a valid alternative but requires manual CSS variable setup |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `styled-components` / `emotion` | Runtime CSS-in-JS causes hydration issues with App Router, adds bundle weight, and fights Tailwind. The CSS-in-JS model does not compose with Tailwind's purging | Tailwind CSS utility classes with the `cn()` utility |
| `AOS` (Animate on Scroll) | jQuery-era library; adds ~30KB; conflicts with Framer Motion's scroll primitives; no TypeScript support | `motion` `whileInView` and `useInView` hooks — already installed |
| `react-spring` | Spring physics produce bounce behavior — explicitly forbidden in the brief ("no spring physics, no bouncing") | `motion` with cubic-bezier `transition` config |
| `GSAP` (free tier) | GSAP Business License required for commercial use; framer-motion covers all required animations; two animation systems in one project creates confusion | `motion` exclusively |
| `next-seo` (v5) | Outdated pattern for App Router — wraps the old `<Head>` component. App Router has native `generateMetadata()` which handles Open Graph and Twitter cards natively | Next.js `generateMetadata()` API + inline `<script type="application/ld+json">` for JSON-LD |
| `@next/font` (old import) | Deprecated package path; renamed and absorbed into `next/font` in Next.js 13+ | `import { Playfair_Display, Raleway } from "next/font/google"` |
| `react-icons` (full package) | Pulls entire icon sets into bundle. For a site with minimal icon usage this is waste | Use individual SVG components or a single icon from `lucide-react` if needed |
| CSS Modules | Adds file overhead and naming conventions on a project that's already using Tailwind for everything. Mixing systems creates maintenance confusion | Tailwind utilities with `cn()` for all component styling |

---

## Stack Patterns by Variant

**For the `cn()` utility (use in every project):**
```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**For font loading (Playfair Display + Raleway):**
```typescript
// app/layout.tsx
import { Playfair_Display, Raleway } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

// Apply both variables to <html>:
// className={`${playfair.variable} ${raleway.variable}`}
```

**For Tailwind v4 design token setup (CSS-first, not JS config):**
```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --font-display: var(--font-playfair);
  --font-body: var(--font-raleway);

  --color-charcoal-900: #0d0d0d;
  --color-charcoal-800: #141414;
  --color-charcoal-700: #1a1a1a;
  --color-charcoal-600: #242424;
  --color-gold-400: #c9a84c;
  --color-gold-300: #d4b96a;

  --ease-luxury: cubic-bezier(0.16, 1, 0.3, 1);

  --animate-fade-up: fade-up 0.6s var(--ease-luxury) both;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**For Motion scroll-reveal pattern (use on every section):**
```typescript
// components/ui/reveal.tsx
"use client";
import { motion } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
}

export function Reveal({ children, delay = 0 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1], // luxury cubic-bezier
      }}
    >
      {children}
    </motion.div>
  );
}
```

**For reduced motion (wrap MotionConfig at the root):**
```typescript
// app/layout.tsx
import { MotionConfig } from "motion/react";

// Inside the layout:
<MotionConfig reducedMotion="user">
  {children}
</MotionConfig>
```
This automatically respects `prefers-reduced-motion` OS setting — required for WCAG compliance and explicitly called out in the project brief.

**For JSON-LD structured data (LocalBusiness schema):**
```typescript
// app/page.tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Satin Fabrication",
  address: { "@type": "PostalAddress", addressRegion: "ON", addressCountry: "CA" },
  // ...
};

// In the component return:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```
Do not use `next-seo` for this — `generateMetadata()` is the App Router native API.

**If adding email integration (Resend — deferred to follow-up phase):**
```bash
npm install resend @react-email/components
```
Wire to a Next.js Server Action with `"use server"` directive. The quote form's react-hook-form client validation fires first; server action fires on submit.

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Next.js 15.x | React 19.x | React 18 only works with Pages Router in Next.js 15. App Router requires React 19 |
| Tailwind CSS 4.x | PostCSS via `@tailwindcss/postcss` | No longer uses `tailwindcss/nesting` or three `@tailwind` directives. Single `@import "tailwindcss"` |
| `motion` 12.x | React 18 + 19 | Both supported. React 19 compatible as of motion 11+ |
| `react-hook-form` 7.x | React 18 + 19 | v7 is stable and supports React 19; useFormState replaced with React 19 `useActionState` if using server actions |
| `zod` 4.x | `@hookform/resolvers` 3.x | Resolvers v3 added Zod v4 support. Do not use resolvers v2 with Zod v4 |
| `next-themes` 0.3.x | Next.js 15 App Router | Requires `suppressHydrationWarning` on `<html>` and a Client Component wrapper around ThemeProvider |
| `react-compare-slider` 3.x | React 18 + 19 | Last published ~2 years ago but has no breaking dependencies; works in Next.js 15 |

---

## Sources

- [Next.js 15 blog (official)](https://nextjs.org/blog/next-15) — version confirmation, React 19 requirement for App Router
- [Next.js 15.5 release notes](https://nextjs.org/blog/next-15-5) — confirmed 15.5 as latest stable (Aug 2025)
- [motion npm page](https://www.npmjs.com/package/framer-motion) — confirmed v12.34.x as latest (March 2026)
- [motion.dev rebranding announcement](https://motion.dev/docs/react-upgrade-guide) — confirmed `motion` is canonical package, `framer-motion` still valid
- [Tailwind CSS v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first config, `@theme` directive, PostCSS plugin change
- [Tailwind CSS Next.js install guide](https://tailwindcss.com/docs/guides/nextjs) — official setup for v4 + Next.js
- [react-hook-form npm](https://www.npmjs.com/package/react-hook-form) — confirmed v7.71.x (March 2026)
- [zod npm](https://www.npmjs.com/package/zod) — confirmed v4.x as current (Zod 4 released 2025)
- [sonner npm](https://www.npmjs.com/package/sonner) — confirmed v2.0.7
- [motion accessibility docs](https://motion.dev/docs/react-accessibility) — `MotionConfig reducedMotion="user"` pattern
- [Next.js JSON-LD guide](https://nextjs.org/docs/app/guides/json-ld) — official inline script pattern
- [Next.js sharp docs](https://nextjs.org/docs/messages/install-sharp) — sharp required for standalone, optional on Vercel
- [next-themes GitHub](https://github.com/pacocoursey/next-themes) — App Router setup, suppressHydrationWarning
- [react-compare-slider npm](https://www.npmjs.com/package/react-compare-slider) — v3.1.0 confirmed

---
*Stack research for: Satin Fabrication premium luxury website*
*Researched: 2026-03-03*
