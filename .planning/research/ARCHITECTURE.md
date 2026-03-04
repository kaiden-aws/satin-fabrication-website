# Architecture Research

**Domain:** Premium single-page marketing website (dark-luxury editorial, metal fabrication)
**Researched:** 2026-03-03
**Confidence:** HIGH — sourced from official Next.js docs (current as of 2026-02-27) and verified patterns

---

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    Browser (Client)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Navbar  │  │  Cursor  │  │  Grain   │  │  Page    │     │
│  │ (client) │  │ (client) │  │ Overlay  │  │Providers │     │
│  └────┬─────┘  └────┬─────┘  └──────────┘  └────┬─────┘     │
│       │              │                            │           │
│  ┌────┴──────────────┴────────────────────────────┴───────┐  │
│  │            Root Layout  (app/layout.tsx)                │  │
│  │   - Providers wrapper (cursor context, scroll context)  │  │
│  │   - Global grain overlay                                │  │
│  │   - Font loading                                        │  │
│  └─────────────────────────┬───────────────────────────────┘  │
└────────────────────────────┼──────────────────────────────────┘
                             │
┌────────────────────────────┼──────────────────────────────────┐
│              Page Layer (Server Components)                    │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  app/page.tsx  (Homepage — assembles sections in order)  │ │
│  │  app/services/page.tsx  (Services page)                  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Page renders section components as static children:          │
│  HeroSection → ServicesSection → PortfolioSection →           │
│  ProcessSection → TestimonialSection → ContactSection         │
└────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────┼──────────────────────────────────┐
│              Section Layer (Client Components)                 │
│  Each section is 'use client' because Framer Motion           │
│  requires browser APIs for scroll detection.                  │
│                                                                │
│  ┌────────────┐ ┌──────────────┐ ┌───────────────┐           │
│  │   Hero     │ │   Services   │ │   Portfolio   │           │
│  │  Section   │ │   Section    │ │   Section     │           │
│  └────────────┘ └──────────────┘ └───────────────┘           │
│  ┌────────────┐ ┌──────────────┐ ┌───────────────┐           │
│  │  Process   │ │ Testimonial  │ │    Contact    │           │
│  │  Section   │ │   Section    │ │    Section    │           │
│  └────────────┘ └──────────────┘ └───────────────┘           │
└────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────┼──────────────────────────────────┐
│              UI Primitives Layer (Shared Components)           │
│                                                                │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐        │
│  │MotionWrapper │ │ GoldDivider  │ │  SectionLabel  │        │
│  │(fade-in-up)  │ │(accent line) │ │(eyebrow text)  │        │
│  └──────────────┘ └──────────────┘ └────────────────┘        │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐        │
│  │  ImageFrame  │ │  GoldButton  │ │   FormField    │        │
│  └──────────────┘ └──────────────┘ └────────────────┘        │
└────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| `app/layout.tsx` | Root layout: fonts, global metadata, providers, grain overlay | Server Component wrapping client providers |
| `app/page.tsx` | Homepage: assembles sections in visual order | Server Component (thin shell) |
| `app/services/page.tsx` | Services detail page: expands each offering | Server Component (thin shell) |
| `components/layout/Navbar.tsx` | Fixed nav, transparent-to-solid scroll, mobile overlay | Client Component (scroll + state) |
| `components/layout/Footer.tsx` | Contact info, copyright, links | Server Component |
| `components/layout/CustomCursor.tsx` | Custom cursor tracking + contextual states (desktop only) | Client Component (window events) |
| `components/layout/GrainOverlay.tsx` | Fixed noise texture over entire site | Server Component (pure CSS) |
| `components/sections/HeroSection.tsx` | Full-viewport hero, headline, CTA, parallax background | Client Component (Framer Motion) |
| `components/sections/ServicesSection.tsx` | Service cards grid with hover reveals | Client Component (Framer Motion) |
| `components/sections/PortfolioSection.tsx` | Masonry gallery + before/after slider | Client Component (Framer Motion + interaction) |
| `components/sections/ProcessSection.tsx` | Animated numbered timeline | Client Component (Framer Motion scroll-linked) |
| `components/sections/TestimonialSection.tsx` | Single featured quote | Client Component (Framer Motion) |
| `components/sections/ContactSection.tsx` | Quote request form + validation + success state | Client Component (form state) |
| `components/ui/MotionWrapper.tsx` | Reusable fade-in-up scroll-triggered animation shell | Client Component |
| `components/ui/BeforeAfterSlider.tsx` | Drag handle image comparison | Client Component (pointer events) |
| `components/ui/MasonryGrid.tsx` | Responsive masonry layout with hover overlays | Client Component |
| `components/ui/ProcessTimeline.tsx` | Scroll-animated step sequence | Client Component |
| `providers/CursorProvider.tsx` | React context for cursor state across site | Client Component (context) |
| `lib/seo.ts` | generateMetadata helpers, JSON-LD schema builders | Server-only utilities |
| `lib/content.ts` | Static content data (text, placeholder image URLs, testimonials) | Server-only, placeholder-ready |

---

## Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx               # Root layout: fonts, metadata, providers
│   ├── page.tsx                 # Homepage: imports + assembles section components
│   ├── globals.css              # CSS custom properties (design tokens), Tailwind base
│   ├── services/
│   │   └── page.tsx             # /services route
│   └── api/
│       └── contact/
│           └── route.ts         # (Future) form submission API route
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx           # Fixed navigation, scroll behavior, mobile overlay
│   │   ├── Footer.tsx           # Site footer
│   │   ├── CustomCursor.tsx     # Custom cursor component (desktop)
│   │   └── GrainOverlay.tsx     # Fixed noise texture
│   ├── sections/
│   │   ├── HeroSection.tsx      # Full-viewport hero
│   │   ├── ServicesSection.tsx  # Service cards
│   │   ├── PortfolioSection.tsx # Masonry gallery + before/after
│   │   ├── ProcessSection.tsx   # Animated process timeline
│   │   ├── TestimonialSection.tsx
│   │   └── ContactSection.tsx   # Quote request form
│   └── ui/
│       ├── MotionWrapper.tsx    # Reusable scroll-triggered fade-in
│       ├── BeforeAfterSlider.tsx
│       ├── MasonryGrid.tsx
│       ├── ProcessTimeline.tsx
│       ├── GoldButton.tsx       # CTA button with gold accent
│       ├── GoldDivider.tsx      # Thin gold horizontal rule
│       └── SectionLabel.tsx     # Eyebrow/overline text component
│
├── providers/
│   └── CursorProvider.tsx       # React context for cursor state
│
├── hooks/
│   ├── useScrolled.ts           # Detects scroll position (navbar transition)
│   ├── useCursorState.ts        # Cursor context consumer hook
│   └── useReducedMotion.ts      # Respects prefers-reduced-motion
│
├── lib/
│   ├── seo.ts                   # Metadata generators, JSON-LD builders
│   └── content.ts               # Static site content (text, image URLs)
│
└── types/
    └── index.ts                 # Shared TypeScript types
```

### Structure Rationale

- **`components/sections/`:** One file per homepage section keeps build order obvious and allows independent work on each section without merge conflicts.
- **`components/ui/`:** Primitives used across sections (MotionWrapper, BeforeAfterSlider). These must be built before sections that depend on them.
- **`components/layout/`:** Global chrome (Navbar, Cursor, GrainOverlay) that wraps all pages. Built first, before any sections.
- **`providers/`:** Cursor context must live outside `components/` because it is consumed by both layout (Navbar) and sections (any section that changes cursor state on hover).
- **`lib/content.ts`:** All placeholder text and image URLs centralized here. When real content arrives, only this file changes — no hunting through components.
- **No `pages/` directory:** Fully committed to App Router. Mixing routers creates subtle bugs.

---

## Architectural Patterns

### Pattern 1: Thin Server Shell, Fat Client Sections

**What:** `app/page.tsx` is a server component that only imports and arranges section components. It contains no logic. Each `components/sections/` component is a Client Component (`'use client'`) because they all use Framer Motion's `useInView`, `whileInView`, or `useScroll`.

**When to use:** Always. This is the right split for a marketing site — pages have no server-side data fetching needs, but sections need browser APIs for animation.

**Trade-offs:** Slightly larger initial JS bundle than a fully static site. Acceptable because the animations are the product.

**Example:**
```typescript
// app/page.tsx — Server Component, pure composition
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import PortfolioSection from '@/components/sections/PortfolioSection'
import ProcessSection from '@/components/sections/ProcessSection'
import TestimonialSection from '@/components/sections/TestimonialSection'
import ContactSection from '@/components/sections/ContactSection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <ProcessSection />
      <TestimonialSection />
      <ContactSection />
    </main>
  )
}
```

### Pattern 2: Reusable MotionWrapper for Scroll Reveals

**What:** A single `MotionWrapper` client component wraps any content that needs a scroll-triggered fade-in-up animation. Instead of duplicating `whileInView` / `variants` across every section, sections compose this wrapper.

**When to use:** Every element that should animate on scroll entry (section headings, cards, images). Not for the hero — that animates on mount, not scroll.

**Trade-offs:** Slight indirection. Worth it: consistent easing across every reveal without copy-paste drift. The `once: true` viewport flag prevents re-animation on scroll-up.

**Example:**
```typescript
// components/ui/MotionWrapper.tsx
'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface MotionWrapperProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export function MotionWrapper({ children, delay = 0, className }: MotionWrapperProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={reducedMotion ? {} : variants}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

### Pattern 3: CSS Custom Properties as Design Tokens

**What:** All brand colors defined as CSS custom properties in `globals.css`, mapped to Tailwind via `tailwind.config.ts`. Section components use semantic class names (`bg-surface`, `text-gold`, `border-gold`) rather than hardcoded Tailwind color values.

**When to use:** Always on this project. Satin Fabrication has a specific palette (matte black, charcoal, brushed gold) that must be consistent. Semantic tokens make global color changes trivial.

**Trade-offs:** Slightly more setup than raw Tailwind color names. Eliminates the risk of `bg-yellow-400` appearing somewhere gold should be.

**Example:**
```css
/* app/globals.css */
:root {
  --color-void: #0a0a0a;       /* near-black backgrounds */
  --color-surface: #111111;    /* card/section backgrounds */
  --color-charcoal: #1a1a1a;   /* subtle elevation */
  --color-gold: #b8922a;       /* primary accent */
  --color-gold-light: #d4a843; /* hover state */
  --color-text-primary: #f0ece4;
  --color-text-muted: #8a8278;
}
```

```typescript
// tailwind.config.ts
extend: {
  colors: {
    void: 'var(--color-void)',
    surface: 'var(--color-surface)',
    charcoal: 'var(--color-charcoal)',
    gold: 'var(--color-gold)',
    'gold-light': 'var(--color-gold-light)',
    'text-primary': 'var(--color-text-primary)',
    'text-muted': 'var(--color-text-muted)',
  }
}
```

### Pattern 4: Context Provider for Cursor State

**What:** A `CursorProvider` wraps the app in `layout.tsx`. Any section that needs to change cursor appearance on hover calls `useCursorState()` to set the cursor type. The `CustomCursor` component reads from the same context.

**When to use:** Whenever multiple disconnected components need to influence the cursor. Avoids prop-drilling through layout hierarchy.

**Trade-offs:** Adds a client-side context provider at the root. Minimal overhead — it is only a string in state.

**Example:**
```typescript
// providers/CursorProvider.tsx
'use client'

import { createContext, useContext, useState } from 'react'

type CursorType = 'default' | 'view' | 'drag' | 'link'

const CursorContext = createContext<{
  cursorType: CursorType
  setCursorType: (type: CursorType) => void
}>({ cursorType: 'default', setCursorType: () => {} })

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [cursorType, setCursorType] = useState<CursorType>('default')
  return (
    <CursorContext.Provider value={{ cursorType, setCursorType }}>
      {children}
    </CursorContext.Provider>
  )
}

export const useCursorState = () => useContext(CursorContext)
```

### Pattern 5: Content-as-Data in lib/content.ts

**What:** All site content (headline text, service descriptions, team info, testimonial text, placeholder image URLs) lives in a single typed TypeScript file, not hardcoded inline in components.

**When to use:** Whenever content will be swapped before launch. Per the project brief, real assets replace placeholders — this pattern makes the swap a single-file operation.

**Trade-offs:** Extra abstraction layer. Completely worth it for this project's explicit "placeholder-ready architecture" requirement.

**Example:**
```typescript
// lib/content.ts
export const HERO_CONTENT = {
  headline: 'Crafted in Metal.',
  subheadline: 'Precision fabrication for Southern Ontario\'s most discerning homes.',
  ctaText: 'Request a Quote',
  backgroundImage: 'https://images.unsplash.com/photo-...',
}

export const SERVICES = [
  {
    id: 'railings',
    title: 'Custom Railings',
    description: '...',
    image: 'https://images.unsplash.com/photo-...',
  },
  // ...
]
```

---

## Data Flow

### Request Flow (Static Marketing Site — No Backend)

```
User visits /
    |
Next.js (Vercel Edge) serves pre-rendered HTML
    |
Browser parses HTML immediately (fast FCP)
    |
React hydrates Client Components
    |
Framer Motion registers scroll listeners
    |
User scrolls → MotionWrapper detects viewport entry → animations fire
    |
User hovers portfolio item → setCursorType('view') → CustomCursor updates
    |
User submits form → client-side validation → (v1) success state shown
                                           → (future) POST /api/contact
```

### State Management

There is no global state management library (no Zustand, no Redux). This project has two pieces of cross-component state:

```
CursorContext (CursorProvider)
    |
    ├── CustomCursor reads cursorType → renders cursor visual
    └── Sections call setCursorType on hover enter/leave

NavbarScrollState (local useState + useScrolled hook)
    |
    └── Navbar reads scrolled boolean → applies bg transition
```

Form state lives entirely in `ContactSection.tsx` using `useState`. It is not shared with anything else.

### Key Data Flows

1. **Content flow:** `lib/content.ts` → imported by section components → rendered as JSX. No fetch, no CMS, no runtime data fetching.

2. **Animation flow:** Framer Motion `whileInView` / `useScroll` in each section component → driven by browser scroll position → `MotionWrapper` centralizes the variant definitions.

3. **Cursor flow:** Any section component → `useCursorState().setCursorType('view')` on `onMouseEnter` → `CursorProvider` updates state → `CustomCursor` re-renders with new appearance.

4. **SEO flow:** `lib/seo.ts` helpers → called in `app/layout.tsx` (global metadata) and `app/page.tsx` / `app/services/page.tsx` (page-specific metadata) → Next.js Metadata API emits `<meta>` tags server-side.

---

## Suggested Build Order

Dependencies between components make this the correct sequence:

| Step | What to Build | Why This Order |
|------|---------------|----------------|
| 1 | `globals.css` (design tokens) + `tailwind.config.ts` | Everything downstream depends on color tokens being defined |
| 2 | `lib/content.ts` (all placeholder content) | Sections need content data from day one; centralizing it first prevents scattered hardcoding |
| 3 | `app/layout.tsx` (root layout, font loading, GrainOverlay) | Wraps everything; must exist before any page renders correctly |
| 4 | `providers/CursorProvider.tsx` + `components/layout/CustomCursor.tsx` | Global chrome; must be in layout before sections reference cursor state |
| 5 | `components/layout/Navbar.tsx` (including mobile overlay) | Top-of-page chrome; validates design language before building sections |
| 6 | `components/ui/MotionWrapper.tsx` + `hooks/useReducedMotion.ts` | All sections depend on this animation wrapper; build once, reuse everywhere |
| 7 | `components/sections/HeroSection.tsx` | First visible section; sets the editorial tone and validates the full stack |
| 8 | `components/sections/ServicesSection.tsx` | Simpler card layout; validates the MotionWrapper pattern |
| 9 | `components/ui/MasonryGrid.tsx` + `components/ui/BeforeAfterSlider.tsx` | Complex UI primitives for portfolio; isolated builds before being composed |
| 10 | `components/sections/PortfolioSection.tsx` | Depends on MasonryGrid and BeforeAfterSlider being complete |
| 11 | `components/ui/ProcessTimeline.tsx` + `components/sections/ProcessSection.tsx` | Complex scroll-linked animation; build last among sections |
| 12 | `components/sections/TestimonialSection.tsx` | Simple; validates typography at scale |
| 13 | `components/sections/ContactSection.tsx` | Form with validation; no dependencies on other sections |
| 14 | `components/layout/Footer.tsx` | Last piece of chrome |
| 15 | `app/page.tsx` (final composition) | Assembles all sections in order |
| 16 | `app/services/page.tsx` | Second page; reuses established patterns |
| 17 | `lib/seo.ts` + metadata wiring | Add structured data and Open Graph after content is finalized |

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Static site (v1) | Current architecture is correct. No server needed. Vercel serves pre-rendered HTML globally. |
| Add email on contact form | Add `app/api/contact/route.ts` as a Next.js Route Handler. No architectural change to frontend. |
| Add CMS | Replace `lib/content.ts` with a headless CMS fetch. Section components do not change — only the data source changes. |
| Add portfolio detail pages | Add `app/portfolio/[slug]/page.tsx`. The masonry grid links to slugs. This is a defined "out of scope for v1" item. |

### Scaling Priorities

1. **First bottleneck:** Image optimization. Unsplash placeholders should already use `next/image` so the `src` swap to real photos is trivial. Ensure `sizes` attributes are correct.
2. **Second bottleneck:** Animation performance on low-end devices. Framer Motion runs animations off-thread when possible. The `useReducedMotion` hook is the safety valve.

---

## Anti-Patterns

### Anti-Pattern 1: Making the Root Layout a Client Component

**What people do:** Add `'use client'` to `app/layout.tsx` because they want to use context there.

**Why it's wrong:** The entire component tree becomes a client bundle. Server-side rendering benefits are lost. First Contentful Paint slows significantly.

**Do this instead:** Create a thin `Providers` client component that wraps only the children prop. Import it into the server layout. The layout itself stays a Server Component. (See Context Providers section in Next.js official docs.)

### Anti-Pattern 2: Hardcoding Content Strings in Section Components

**What people do:** Write `<h2>Custom Railings</h2>` directly in `ServicesSection.tsx`.

**Why it's wrong:** When real content arrives, every section component needs editing. String hunting across 6 files is error-prone and fragile.

**Do this instead:** Import from `lib/content.ts`. Real content swap = one file change.

### Anti-Pattern 3: Animating Everything with Springs

**What people do:** Use Framer Motion's default spring physics because it feels reactive.

**Why it's wrong:** The project brief explicitly requires smooth cubic-bezier easing only. Springs produce bouncing that reads as playful/consumer-grade — the opposite of luxury automotive brand energy.

**Do this instead:** Set `transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.6 }}` on all animations. This cubic-bezier is a "ease-out-expo" curve — fast start, graceful deceleration.

### Anti-Pattern 4: Per-Section Scroll Listener Setup

**What people do:** Independently call `useScroll()` or add window event listeners in every section.

**Why it's wrong:** Multiple scroll listeners on the same page degrade performance. Framer Motion's `whileInView` shares a single IntersectionObserver instance; manual listeners do not.

**Do this instead:** Use `whileInView` with `viewport={{ once: true }}` for entrance animations via `MotionWrapper`. Use `useScroll` only for the hero parallax, where a continuous scroll value is genuinely needed.

### Anti-Pattern 5: Using Gold as Backgrounds or Large Fills

**What people do:** Set `bg-gold` on section backgrounds or buttons to emphasize the brand color.

**Why it's wrong:** Large gold areas read as gaudy, not premium. The design brief explicitly states "accent only — borders, hovers, small highlights. Never backgrounds or large fills."

**Do this instead:** Gold appears on `border` classes, `underline` decorations, icon strokes, and `hover:text-gold` state changes only. Backgrounds stay in the void/surface/charcoal token range.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Vercel (deployment) | Push to main → auto-deploy via Vercel Git integration | No configuration needed beyond connecting repo |
| Unsplash (placeholder images) | Static URLs in `lib/content.ts`, loaded via `next/image` | Swap URLs when real photos arrive; component code unchanged |
| Google Fonts (fallback) | Self-host via `next/font/google` — fonts downloaded at build time, served from Vercel | Eliminates third-party font request; critical for Core Web Vitals |
| Email API (future) | Resend or SendGrid called from `app/api/contact/route.ts` Route Handler | API key in `.env.local`, never in client bundle |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `lib/content.ts` → Sections | Direct import (static data, no props needed) | Content is not dynamic; no context or state required |
| `CursorProvider` → `CustomCursor` | React context (`useCursorState`) | Cursor component reads context; sections write to it |
| `CursorProvider` → Sections | React context (`useCursorState().setCursorType`) | Sections call setCursorType on hover; no two-way binding needed |
| `app/layout.tsx` → All pages | `children` prop | Standard Next.js layout nesting |
| `MotionWrapper` → Section components | `children` prop + optional `delay` | Sections wrap individual elements, not themselves |

---

## Sources

- [Next.js App Router: Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) — Official, current as of 2026-02-27
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — Official, current as of 2026-02-27
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) — Official
- [Motion (Framer Motion): Scroll Animations](https://motion.dev/docs/react-scroll-animations) — Official
- [Motion: useInView](https://motion.dev/docs/react-use-in-view) — Official
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode) — Official
- [Tailwind CSS Theme Variables](https://tailwindcss.com/docs/theme) — Official
- [Custom cursor in Next.js — DEV Community](https://dev.to/preetsuthar17/custom-cursor-in-next-js-4l0c) — MEDIUM confidence (community article, consistent with official patterns)

---

*Architecture research for: Premium dark-luxury marketing website (Satin Fabrication)*
*Researched: 2026-03-03*
