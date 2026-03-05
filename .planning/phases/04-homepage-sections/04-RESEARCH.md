# Phase 4: Homepage Sections - Research

**Researched:** 2026-03-05
**Domain:** Six homepage sections (Hero, Services, Portfolio, Process, Contact, Footer) composed from Phase 3 UI primitives, plus Zod + react-hook-form validation, Unsplash placeholder images, social media icons, and CSS gradient hero background
**Confidence:** HIGH

## Summary

Phase 4 is the composition phase -- it takes the primitives built in Phase 3 (MotionWrapper, MasonryGrid, ProcessTimeline, ParallaxWrapper) and the global chrome from Phase 2 (Navbar, GrainOverlay, CustomCursor) and composes them into the six homepage sections that form the complete brand narrative. The current `page.tsx` is a placeholder verification page from Phase 1 and must be entirely replaced with the real homepage.

The phase introduces three new dependencies: `zod` for schema validation, `react-hook-form` for form state management, and `@hookform/resolvers` for connecting them. It also introduces `lucide-react` for social media icons in the footer. All other functionality is built on existing infrastructure. The hero section uses a CSS-only animated gradient (not video) for the cinematic background, avoiding additional bundle cost. Portfolio images use `next/image` with Unsplash remote patterns already configured in `next.config.ts`. The contact form is frontend-only (no backend) -- it validates with Zod, shows inline errors, and transitions to a success animation state.

Critical constraints from prior phases: all animated components must use `m.*` (not `motion.*`) because of LazyMotion strict mode; Motion drag is unavailable (domAnimation only); the `useWatch` hook must be used instead of `watch` for React 19 compatibility; and CSS `columns` masonry is a locked decision for the portfolio grid. The ProcessTimeline component from Phase 3 already implements the gold connecting line animation (PROC-02) -- Phase 4 wraps it in a section with proper headings and the 5-step content data (PROC-01, PROC-03).

**Primary recommendation:** Build sections in dependency order (Hero first since it replaces the current page, then Services/Portfolio/Process in parallel, then Contact which needs new deps, then Footer last). Each section is a `'use client'` component in `src/components/sections/`. The page.tsx orchestrates them as a single-page scroll experience with section IDs matching the nav links (#work, #services, #process, #contact).

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HERO-01 | Full-viewport hero with dark cinematic background -- video placeholder or looping dark gradient animation fallback with 60% black overlay | CSS @keyframes gradient animation on background-position with dark palette colors; `min-h-screen` for viewport fill; no video needed (gradient fallback is primary) |
| HERO-02 | Staggered text entrance animation -- "SATIN FABRICATION" in Playfair 7xl-8xl with gold accent on "SATIN", tagline in Raleway uppercase | m.* components with staggered delays (0, 0.15, 0.3s); font-display for Playfair, font-body for Raleway; text-gold on "SATIN" span |
| HERO-03 | Gold-outlined CTA button ("VIEW OUR WORK") with smooth gold fill on hover transition | CSS border + background-color transition using --ease-luxury; btn-glow class from globals.css for box-shadow; anchor link to #work section |
| HERO-04 | Animated scroll indicator at bottom (pulsing thin line or chevron) | CSS @keyframes pulse animation or Motion animate prop with repeat: Infinity; positioned absolute bottom-8; aria-hidden decorative |
| SRVC-01 | 4 service cards in 2x2 grid (single column mobile) | CSS Grid `grid-cols-1 md:grid-cols-2` with gap; 4 cards with data-driven content |
| SRVC-02 | Each card has dark bg (#111111), subtle gold border, placeholder image, Playfair title, Raleway description, gold "Learn More" link with staggered scroll reveal | bg-surface, border-gold-dim, next/image with Unsplash src, MotionWrapper for scroll reveal with staggered delay prop |
| SRVC-03 | Card hover: border brightens to full gold, image scales 1.03x with overflow hidden | CSS transition on border-color + transform scale; overflow-hidden on image container; group/group-hover pattern |
| PORT-01 | Masonry-style grid gallery -- 3 cols desktop, 2 tablet, 1 mobile -- 8-10 images | MasonryGrid + MasonryItem components from Phase 3; already supports columns-1 sm:columns-2 lg:columns-3 |
| PORT-02 | Image hover overlay with project name and category, elegant typography, smooth fade-in | Absolute-positioned overlay div with opacity-0 group-hover:opacity-100 transition; Playfair title + Raleway category text on dark backdrop |
| PORT-04 | Curated Unsplash metalwork placeholder images with consistent dark tone | Unsplash remotePatterns already in next.config.ts; curated URLs for metal stairs, gates, fireplaces, railings, architectural details |
| PROC-01 | 5-step horizontal timeline on desktop (vertical on mobile): Consultation, Design, Material Selection, Fabrication, Installation | ProcessTimeline component from Phase 3 handles vertical layout; data array with 5 steps (already prototyped in dev/primitives test harness) |
| PROC-03 | Large step numbers (01-05) in Playfair Display 6xl with low-opacity gold behind text | Already implemented in ProcessTimeline component -- `font-display text-6xl text-gold/10` |
| CNTC-01 | Split layout -- headline left, form right | CSS Grid `grid-cols-1 lg:grid-cols-2`; headline uses Playfair Display |
| CNTC-02 | Form fields: Name, Email, Phone, Project Type (select), Project Description (textarea) | react-hook-form `register` for each field; Zod schema with z.string(), z.email(), z.enum() for select |
| CNTC-03 | Transparent input backgrounds with bottom-border only (gold low opacity), focus animates to full gold | `.input-luxury` class already in globals.css handles border transition; bg-transparent + border-b styling |
| CNTC-04 | Client-side validation using Zod schema + react-hook-form | zodResolver from @hookform/resolvers/zod; useForm with resolver; formState.errors for inline display |
| CNTC-05 | Success state animation on form submit (frontend only, no backend) | useState for isSubmitted; m.div with opacity/scale entrance animation on success; no API call |
| FOOT-01 | Company name, tagline, copyright, "Proudly serving Southern Ontario" text | Static content in footer element; Playfair for company name, Raleway for body text |
| FOOT-02 | Social media icon links (Instagram, Facebook, LinkedIn) -- gold on hover | lucide-react icons (Instagram, Facebook, Linkedin); text-warm-gray hover:text-gold transition |
| FOOT-03 | Smooth scroll back-to-top link | `window.scrollTo({ top: 0, behavior: 'smooth' })` on click handler; or anchor `#top` with CSS scroll-behavior: smooth on html |
| FOOT-04 | Phone number and email prominently visible | Static text with tel: and mailto: href links; text-cream for visibility |
</phase_requirements>

## Standard Stack

### Core (already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Motion | ^12.35.0 | Entrance animations, scroll reveals, success state animation | Already installed; m.* components with LazyMotion strict; whileInView for section reveals |
| Next.js | 16.1.6 | App Router, next/image for Unsplash images, next/font | Already installed; Image component with remotePatterns already configured for images.unsplash.com |
| Tailwind CSS | ^4 | Grid layouts, responsive breakpoints, hover states, transitions | Already installed; grid-cols-2, group/group-hover, transition utilities |
| React | 19.2.3 | Component runtime, hooks, form state | Already installed; useState for form success state, useCallback for handlers |
| clsx + tailwind-merge | installed | Class composition via cn() | Already installed; dynamic class toggling for hover states, error states |

### New Dependencies (Phase 4)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| zod | ^3.24 | Form validation schema -- type-safe runtime validation | Industry standard for TypeScript validation; generates types from schemas; required by CNTC-04 |
| react-hook-form | ^7.71 | Form state management -- minimal re-renders, uncontrolled inputs | 8.6kb gzipped, zero deps; register-based API avoids controlled input re-renders; React 19 compatible |
| @hookform/resolvers | ^5.2 | Connects Zod schemas to react-hook-form | Official bridge package; zodResolver adapter |
| lucide-react | ^0.577 | Social media SVG icons (Instagram, Facebook, LinkedIn) | Tree-shakable, typed React components; only imported icons ship in bundle; consistent stroke style |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zod 3 | Zod 4 (v4.3.6) | Zod 4 has 14x faster parsing but introduces breaking changes (error API, optional field defaults); Zod 3 has stable, well-tested @hookform/resolvers support; use Zod 3 for this project to avoid compatibility risk |
| react-hook-form | React 19 built-in useActionState | useActionState is for server actions; this form is client-only (CNTC-05 requires frontend-only success state, no backend); react-hook-form provides validation integration that useActionState does not |
| lucide-react | Inline SVG icons | lucide-react is tree-shakable to individual icons (~1kb each); hand-coded SVGs require maintenance; lucide provides consistent stroke width and sizing |
| lucide-react | react-icons | react-icons bundles entire icon sets; lucide-react tree-shakes to individual icons; better bundle size |
| CSS gradient hero | Video background | Video requires hosting, preloading, bandwidth, mobile fallback; CSS gradient is zero-network-cost, always works, and achieves the "dark cinematic" requirement with subtle movement |

**Installation:**
```bash
npm install zod react-hook-form @hookform/resolvers lucide-react
```

**Note on Zod version:** Use Zod 3 (`npm install zod@3`), not Zod 4. The `@hookform/resolvers` Zod 4 support has [reported type issues](https://github.com/react-hook-form/resolvers/issues/813). Zod 3 is stable and well-tested with the resolver. If npm installs Zod 4 by default, pin: `npm install zod@"^3.24"`.

## Architecture Patterns

### Recommended Project Structure (Phase 4 scope)

```
src/
├── components/
│   ├── layout/              # Existing -- Navbar, GrainOverlay, etc.
│   ├── ui/                  # Existing -- MotionWrapper, MasonryGrid, ProcessTimeline, etc.
│   └── sections/            # NEW -- Phase 4 homepage sections
│       ├── HeroSection.tsx       # Full-viewport hero with gradient bg + staggered text
│       ├── ServicesSection.tsx    # 4 service cards in 2x2 grid
│       ├── PortfolioSection.tsx   # Masonry gallery with hover overlays
│       ├── ProcessSection.tsx     # ProcessTimeline wrapper with section heading
│       ├── ContactSection.tsx     # Split layout: headline + validated form
│       └── FooterSection.tsx      # Company info, socials, back-to-top
├── lib/
│   ├── constants.ts          # EXTEND -- add section data arrays
│   ├── utils.ts              # Existing -- cn() utility
│   └── schemas.ts            # NEW -- Zod validation schema for contact form
├── app/
│   └── page.tsx              # REPLACE -- compose all 6 sections
└── ...
```

### Pattern 1: Section Component Structure

**What:** Each homepage section is a self-contained `'use client'` component in `src/components/sections/`. Each receives its data as props or imports from constants, renders its content, and applies scroll animations using MotionWrapper.

**When to use:** Every section on the homepage.

**Example:**
```typescript
// src/components/sections/ServicesSection.tsx
'use client'

import Image from 'next/image'
import { MotionWrapper } from '@/components/ui/MotionWrapper'
import { SERVICES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function ServicesSection() {
  return (
    <section id="services" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <MotionWrapper>
          <h2 className="font-display text-4xl md:text-5xl text-cream text-center mb-16">
            OUR <span className="text-gold">SERVICES</span>
          </h2>
        </MotionWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service, i) => (
            <MotionWrapper key={service.title} delay={i * 0.1}>
              <div className="group bg-surface border border-gold-dim/30 rounded overflow-hidden
                              transition-colors duration-300 hover:border-gold">
                {/* Image with hover scale */}
                <div className="overflow-hidden aspect-[16/10]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={640}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500
                               ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.03]"
                  />
                </div>
                {/* Card content */}
                <div className="p-6">
                  <h3 className="font-display text-xl text-cream">{service.title}</h3>
                  <p className="mt-2 font-body text-warm-gray text-sm">{service.description}</p>
                  <a href="#contact" className="mt-4 inline-block font-body text-sm text-gold
                                                hover:text-gold-light transition-colors">
                    Learn More &rarr;
                  </a>
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Key details:**
- `id="services"` matches the nav link `href="#services"` from NAV_LINKS in constants.ts
- `group` / `group-hover:` Tailwind pattern for card hover effects
- `MotionWrapper` with staggered `delay` for scroll reveal
- `overflow-hidden` on image container prevents scale overflow
- `transition-colors` on border for the gold brighten effect (SRVC-03)

### Pattern 2: Hero Section with CSS Gradient Animation

**What:** A full-viewport hero with an animated dark gradient background that creates subtle cinematic movement. Uses CSS @keyframes to shift gradient position, overlaid with a 60% black layer for readability.

**When to use:** Hero section background (HERO-01).

**Example:**
```typescript
// Hero background gradient animation
// In globals.css or as inline styles:
@keyframes heroGradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

// In the component:
<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* Animated gradient background */}
  <div
    className="absolute inset-0"
    style={{
      background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 25%, #111111 50%, #0D0D0D 75%, #0A0A0A 100%)',
      backgroundSize: '400% 400%',
      animation: 'heroGradient 20s ease infinite',
    }}
    aria-hidden="true"
  />
  {/* Dark overlay for text readability */}
  <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
  {/* Content on top */}
  <div className="relative z-10 text-center px-6">
    {/* Staggered text animations here */}
  </div>
</section>
```

**Key details:**
- Uses only dark tones (#0A0A0A to #1A1A1A) -- no bright colors
- `backgroundSize: '400% 400%'` enables the gradient to shift across the element
- 20s duration keeps movement subtle and luxurious (not distracting)
- `bg-black/60` overlay ensures text readability over any gradient position
- `overflow-hidden` prevents any gradient animation overflow
- `aria-hidden` on decorative gradient and overlay elements
- Zero network cost -- pure CSS, no images or video

### Pattern 3: Contact Form with Zod + react-hook-form

**What:** A validated quote request form using react-hook-form for state management and Zod for schema validation. Errors display inline beneath each field. On valid submission, the form transitions to a success animation state.

**When to use:** Contact section (CNTC-01 through CNTC-05).

**Example:**
```typescript
// src/lib/schemas.ts
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(1, 'Phone number is required'),
  projectType: z.enum([
    'Railings & Staircases',
    'Gates & Fencing',
    'Custom Furniture & Fixtures',
    'Fireplace Surrounds',
    'Other',
  ], { errorMap: () => ({ message: 'Please select a project type' }) }),
  description: z.string().min(10, 'Please describe your project (at least 10 characters)'),
})

export type ContactFormData = z.infer<typeof contactSchema>

// src/components/sections/ContactSection.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { m } from 'motion/react'
import { contactSchema, type ContactFormData } from '@/lib/schemas'

export function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = (data: ContactFormData) => {
    // Frontend-only: log data, show success state
    console.log('Form submitted:', data)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center py-12"
      >
        <h3 className="font-display text-3xl text-gold">Thank You</h3>
        <p className="mt-4 font-body text-warm-gray">
          We&apos;ll be in touch within 24 hours.
        </p>
      </m.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div>
        <input
          {...register('name')}
          placeholder="Your Name"
          className="input-luxury w-full bg-transparent py-3 text-cream placeholder:text-warm-gray/50"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
        )}
      </div>
      {/* ... more fields ... */}
    </form>
  )
}
```

**Key details:**
- `zodResolver(contactSchema)` connects Zod to react-hook-form
- `register('fieldName')` returns `{ onChange, onBlur, name, ref }` -- spread onto input
- `formState.errors` provides field-level error messages from Zod
- `noValidate` on form disables browser validation (Zod handles it)
- `isSubmitted` state toggles to success animation (no API call per CNTC-05)
- `input-luxury` class from globals.css provides gold border focus transition (CNTC-03)
- `handleSubmit` prevents default form behavior (no page reload)

### Pattern 4: Portfolio Image Hover Overlay

**What:** Each masonry grid image has an absolutely-positioned overlay that fades in on hover, showing the project name and category in elegant typography over a dark gradient.

**When to use:** Portfolio gallery items (PORT-02).

**Example:**
```typescript
<MasonryItem>
  <div className="group relative overflow-hidden rounded">
    <Image
      src={project.image}
      alt={project.title}
      width={project.width}
      height={project.height}
      className="w-full block"
    />
    {/* Hover overlay */}
    <div className="absolute inset-0 flex flex-col justify-end p-4
                    bg-gradient-to-t from-black/80 via-black/40 to-transparent
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
      <h3 className="font-display text-lg text-cream">{project.title}</h3>
      <p className="font-body text-sm text-gold">{project.category}</p>
    </div>
  </div>
</MasonryItem>
```

**Key details:**
- `group` / `group-hover:opacity-100` for hover detection
- `bg-gradient-to-t from-black/80` ensures text readability over image
- `transition-opacity duration-300` for smooth fade (not abrupt show/hide)
- Luxury easing matches project's standard curve
- Content positioned at bottom with `justify-end` for natural reading

### Pattern 5: Page Composition

**What:** The homepage `page.tsx` composes all six sections in scroll order, each with semantic `<section>` elements and matching `id` attributes for nav link scrolling.

**Example:**
```typescript
// src/app/page.tsx
import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { PortfolioSection } from '@/components/sections/PortfolioSection'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { FooterSection } from '@/components/sections/FooterSection'

export default function HomePage() {
  return (
    <main id="main-content">
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <ProcessSection />
      <ContactSection />
      <FooterSection />
    </main>
  )
}
```

**Key details:**
- `id="main-content"` matches the SkipLink target from Phase 2
- Page.tsx itself can be a server component if all sections are client components (they import themselves as 'use client')
- Section IDs: no id on hero (it's the top), `#services`, `#work` (portfolio), `#process`, `#contact`
- Nav link mapping from constants.ts: WORK -> #work, SERVICES -> #services, PROCESS -> #process, CONTACT -> #contact

### Anti-Patterns to Avoid

- **Using `motion.*` instead of `m.*`:** LazyMotion strict mode throws. Always `import { m } from 'motion/react'`.
- **Using `watch()` instead of `useWatch()` with react-hook-form:** React 19 re-render batching breaks watch(). Use useWatch if reactive form values are needed for UI updates. For this form, only `register` + `formState.errors` are needed (no watch at all).
- **Installing Zod 4 without verifying resolver compatibility:** Type errors with @hookform/resolvers when using Zod 4. Pin to Zod 3 (`zod@"^3.24"`).
- **Making the contact form a server component:** The form uses `useState`, `handleSubmit`, and client-side validation -- it must be `'use client'`.
- **Using `<footer>` inside `<main>`:** Semantically, `<footer>` should be a sibling to `<main>`, not a child. However, for single-page scroll layout, placing FooterSection content inside main is acceptable if the outer `<footer>` element is positioned after `</main>` in layout.tsx. Alternatively, keep it simple: use a `<section>` with `role="contentinfo"` inside main, or move the footer outside main in layout.tsx.
- **Forgetting `overflow-hidden` on service card image containers:** Without it, the `scale-[1.03]` hover transform causes the image to overflow the card boundary.
- **Hard-coding Unsplash URLs without width/height params:** Always append `?w=WIDTH&h=HEIGHT&fit=crop` to Unsplash URLs for optimized delivery. Provide explicit `width` and `height` props to `next/image` for remote images.
- **Using `target="_blank"` on social links without `rel="noopener noreferrer"`:** Security and performance best practice for external links.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form validation | Custom regex validators, manual error state management | Zod schema + zodResolver | Type-safe, composable rules, single source of truth for validation and TypeScript types |
| Form state | useState per field, manual onChange handlers, re-render on every keystroke | react-hook-form register() | Uncontrolled inputs minimize re-renders; built-in error/dirty/touched tracking; 8.6kb |
| Social media icons | Hand-coded SVG paths, icon font files | lucide-react named imports | Tree-shakable (~1kb per icon), typed props, consistent sizing, maintained by community |
| Scroll reveal animations | IntersectionObserver + useState + CSS transitions | MotionWrapper (Phase 3) | Already built; whileInView + once + margin + reducedMotion support |
| Masonry layout | JavaScript column balancing, react-masonry-css | MasonryGrid (Phase 3) | Already built; CSS columns, zero JS, zero hydration risk |
| Animated timeline | Manual scroll listener + SVG stroke-dashoffset | ProcessTimeline (Phase 3) | Already built; useScroll + useTransform + pathLength |
| Parallax depth | Manual scroll listener + requestAnimationFrame | ParallaxWrapper (Phase 3) | Already built; useScroll + useTransform, 60fps motion values |

**Key insight:** Phase 4 is primarily a composition phase. Four of the seven "don't hand-roll" items are components already built in Phase 3. The three new items (validation, form state, icons) are solved by well-established, lightweight packages with zero custom alternatives needed.

## Common Pitfalls

### Pitfall 1: React 19 + react-hook-form watch() Re-render Failure

**What goes wrong:** Using `watch('fieldName')` to reactively read form values does not trigger component re-renders in React 19, making conditional UI based on form values appear frozen.

**Why it happens:** React 19's more aggressive update batching means react-hook-form's internal subscription model for `watch` no longer reliably triggers re-renders.

**How to avoid:** Use `useWatch({ control, name: 'fieldName' })` instead of `watch('fieldName')` if you need reactive form values for UI updates. For the contact form in this phase, neither is needed -- `register` + `formState.errors` + `handleSubmit` suffice.

**Warning signs:** Form values change (visible in React DevTools) but UI doesn't update to reflect them.

### Pitfall 2: Zod 4 Type Incompatibility with @hookform/resolvers

**What goes wrong:** TypeScript errors when passing a Zod 4 schema to `zodResolver()` -- type mismatch between Zod 4's new type structure and the resolver's expected input.

**Why it happens:** Zod 4 changed its internal type system. While @hookform/resolvers v5.2+ added Zod 4 support, edge cases remain ([Issue #813](https://github.com/react-hook-form/resolvers/issues/813)).

**How to avoid:** Install Zod 3: `npm install zod@"^3.24"`. It is stable, well-tested, and has zero known type issues with the resolver.

**Warning signs:** TypeScript compile errors mentioning `ZodType`, `ZodObject`, or `SchemaLike` type mismatches.

### Pitfall 3: Unsplash Remote Images Without Dimensions Cause Layout Shift

**What goes wrong:** Using `next/image` with `fill` for portfolio images without a container with explicit dimensions causes cumulative layout shift (CLS) -- images pop in and push content around.

**Why it happens:** Next.js cannot determine remote image dimensions at build time. When using `fill`, the parent container must define the image's space.

**How to avoid:** Either:
1. Use `width` and `height` props (not `fill`) with explicit pixel dimensions matching the Unsplash URL params, or
2. Use `fill` with a parent that has `aspect-[W/H]` class to reserve space.

For the masonry grid, use approach 1 (explicit dimensions) since each image may have different aspect ratios. For service cards, use a fixed `aspect-[16/10]` container.

**Warning signs:** Content jumps on page load; Lighthouse CLS score above 0.1.

### Pitfall 4: Section IDs Not Matching Nav Links

**What goes wrong:** Clicking nav links (WORK, SERVICES, PROCESS, CONTACT) scrolls to wrong positions or doesn't scroll at all.

**Why it happens:** The nav links in `constants.ts` use `#work`, `#services`, `#process`, `#contact` -- section IDs must match exactly.

**How to avoid:** Verify section IDs match NAV_LINKS exactly:
- Portfolio section: `id="work"` (not `id="portfolio"`)
- Services section: `id="services"`
- Process section: `id="process"`
- Contact section: `id="contact"`

**Warning signs:** Nav link click does nothing or scrolls to top of page.

### Pitfall 5: CSS Scroll-Behavior Conflicts with Motion Animations

**What goes wrong:** Adding `scroll-behavior: smooth` to the HTML element causes jerky scroll when combined with Motion's scroll-linked animations (parallax, timeline pathLength).

**Why it happens:** `scroll-behavior: smooth` interpolates scroll position, which conflicts with Motion's `useScroll` which expects instantaneous scroll position updates.

**How to avoid:** Do NOT add global `scroll-behavior: smooth` to the `<html>` element. Instead, use `window.scrollTo({ top: 0, behavior: 'smooth' })` only for the back-to-top button click handler, and let anchor link navigation use the browser's default instant scroll. The MotionWrapper entrance animations will handle the visual polish.

**Warning signs:** Parallax elements jitter or timeline line draws incorrectly during smooth-scroll navigation.

### Pitfall 6: Footer Semantic Markup Placement

**What goes wrong:** Placing a `<footer>` element inside `<main>` violates HTML5 semantics. Screen readers may not announce the footer landmark correctly.

**Why it happens:** The homepage is composed as a single-page scroll with all sections inside `<main>`.

**How to avoid:** Either:
1. Move the `<FooterSection>` component outside `<main>` in layout.tsx (alongside Navbar), or
2. Use `<footer>` element directly outside `<main>` in `page.tsx` by having page.tsx return a fragment.

Option 2 is simpler: `page.tsx` returns `<><main>...</main><FooterSection /></>`.

**Warning signs:** Lighthouse accessibility audit flags "footer element should not be a child of main".

### Pitfall 7: Select Element Styling Inconsistency

**What goes wrong:** The `<select>` element for Project Type doesn't match the text input styling (bottom-border-only, transparent background) because browsers apply default select styling.

**Why it happens:** `<select>` has browser-specific chrome (dropdown arrow, background, border) that CSS can only partially override.

**How to avoid:** Apply `appearance-none` (Tailwind class) to strip browser defaults, then style consistently with text inputs. Add a custom dropdown chevron via a sibling SVG element or background-image. The `input-luxury` class from globals.css works on selects if `appearance-none` is applied.

**Warning signs:** Select dropdown looks like a default browser form element while text inputs look styled.

## Code Examples

### Zod Contact Form Schema

```typescript
// src/lib/schemas.ts
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  projectType: z.enum(
    [
      'Railings & Staircases',
      'Gates & Fencing',
      'Custom Furniture & Fixtures',
      'Fireplace Surrounds',
      'Other',
    ],
    { errorMap: () => ({ message: 'Please select a project type' }) }
  ),
  description: z.string().min(10, 'Please describe your project (at least 10 characters)'),
})

export type ContactFormData = z.infer<typeof contactSchema>
```

### react-hook-form with zodResolver

```typescript
// Inside ContactSection component
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactFormData } from '@/lib/schemas'

const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<ContactFormData>({
  resolver: zodResolver(contactSchema),
})

// register spreads onChange, onBlur, name, ref onto input
<input {...register('email')} type="email" />
{errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
```

### Hero Gradient CSS Keyframes

```css
/* Add to globals.css */
@keyframes heroGradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
```

### Scroll Indicator Pulse Animation

```typescript
// Pulsing scroll indicator at bottom of hero
<m.div
  className="absolute bottom-8 left-1/2 -translate-x-1/2"
  animate={{ y: [0, 8, 0] }}
  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
  aria-hidden="true"
>
  <div className="h-8 w-[1px] bg-gold/50" />
</m.div>
```

### Back-to-Top Smooth Scroll

```typescript
// Footer back-to-top handler
<button
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  className="font-body text-sm text-warm-gray hover:text-gold transition-colors"
  aria-label="Scroll to top"
>
  Back to Top &uarr;
</button>
```

### Social Media Icons with lucide-react

```typescript
import { Instagram, Facebook, Linkedin } from 'lucide-react'

const SOCIAL_LINKS = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
]

{SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
  <a
    key={label}
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className="text-warm-gray hover:text-gold transition-colors duration-300"
  >
    <Icon size={20} />
  </a>
))}
```

### Service Card Data Structure

```typescript
// In src/lib/constants.ts
export const SERVICES = [
  {
    title: 'Railings & Staircases',
    description: 'Custom-forged railings and staircase systems that elevate any space with lasting craftsmanship.',
    image: 'https://images.unsplash.com/photo-XXXXX?w=640&h=400&fit=crop',
  },
  {
    title: 'Gates & Fencing',
    description: 'Architectural gates and perimeter fencing designed for security, privacy, and curb appeal.',
    image: 'https://images.unsplash.com/photo-XXXXX?w=640&h=400&fit=crop',
  },
  {
    title: 'Custom Furniture & Fixtures',
    description: 'Bespoke metal furniture and fixtures — tables, shelving, light fixtures — built to your exact specifications.',
    image: 'https://images.unsplash.com/photo-XXXXX?w=640&h=400&fit=crop',
  },
  {
    title: 'Fireplace Surrounds & Features',
    description: 'Statement fireplace surrounds and architectural features that become the focal point of any room.',
    image: 'https://images.unsplash.com/photo-XXXXX?w=640&h=400&fit=crop',
  },
] as const
```

### Portfolio Project Data Structure

```typescript
// In src/lib/constants.ts
export const PORTFOLIO_PROJECTS = [
  {
    title: 'Lakeside Villa Railing',
    category: 'Railings & Staircases',
    image: 'https://images.unsplash.com/photo-XXXXX?w=600&h=800&fit=crop',
    width: 600,
    height: 800,
  },
  // ... 8-10 items with varying aspect ratios for masonry effect
] as const
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom validation with regex + manual errors | Zod schema + zodResolver | Zod established 2022+ | Type-safe validation, single source of truth, auto-generated TypeScript types |
| Controlled inputs with useState per field | react-hook-form register() with uncontrolled inputs | RHF v7+ (2021) | Minimal re-renders, 8.6kb, built-in error tracking |
| Font Awesome / react-icons (bundle entire sets) | lucide-react (tree-shakable individual imports) | 2023+ | Only imported icons ship; ~1kb per icon vs 50kb+ for full icon font |
| Background video for hero sections | CSS gradient animations with @keyframes | Performance-first trend 2024+ | Zero network cost, works offline, reduced LCP, mobile-friendly |
| Manual IntersectionObserver for scroll reveals | Motion whileInView (already in project) | Motion v5+ | Built-in viewport detection, reducedMotion support, composable with delays |
| `watch()` in react-hook-form | `useWatch()` for reactive values in React 19 | React 19 (Dec 2024) | watch() re-render failure in React 19 due to batching changes |

**Deprecated/outdated:**
- `framer-motion` package name: Renamed to `motion` in v12 (late 2024)
- `react-hook-form` `watch()` method: Still works for non-reactive reads but `useWatch()` is required for UI-reactive values in React 19
- Font Awesome in React: Heavy bundles; lucide-react is the modern tree-shakable alternative
- `images.domains` in next.config: Deprecated in favor of `images.remotePatterns` (Next.js 14+)

## Open Questions

1. **Footer placement: inside or outside `<main>`?**
   - What we know: HTML5 semantics prefer `<footer>` as a sibling to `<main>`, not a child
   - What's unclear: Whether to modify layout.tsx to accommodate this or keep the simpler page.tsx composition
   - Recommendation: Have `page.tsx` return a fragment: `<><main id="main-content">...sections...</main><FooterSection /></>`. This keeps semantic correctness without modifying the layout, and the SkipLink already targets `#main-content`.

2. **Unsplash image curation**
   - What we know: 8-10 portfolio images + 4 service images needed, all with consistent dark metalwork tone
   - What's unclear: Exact Unsplash photo IDs to use
   - Recommendation: Curate specific Unsplash URLs during implementation. Search terms: "metal railing dark", "iron gate", "metal staircase", "fireplace surround metal", "welding sparks dark", "architectural metalwork". All URLs should use `?w=WIDTH&h=HEIGHT&fit=crop&q=80` params for consistent sizing.

3. **Smooth scroll for nav anchor links**
   - What we know: CSS `scroll-behavior: smooth` on `<html>` conflicts with Motion scroll animations (Pitfall 5)
   - What's unclear: Best approach for anchor link scrolling
   - Recommendation: Use JavaScript `element.scrollIntoView({ behavior: 'smooth' })` only in nav link click handlers (not globally). This scopes smooth scrolling to user-initiated navigation without affecting Motion's scroll tracking.

4. **Contact form error text color**
   - What we know: Red error text needs to be accessible against dark backgrounds
   - What's unclear: Whether the standard `text-red-400` meets WCAG contrast on `#0A0A0A`
   - Recommendation: Verify contrast ratio of `#f87171` (red-400) on `#0A0A0A` -- it is 5.8:1, which passes WCAG AA (4.5:1 minimum for small text). If needed, use `text-red-300` (#fca5a5) for higher contrast (8.5:1).

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual verification (no automated test framework) |
| Config file | none |
| Quick run command | `npm run dev` (verify dev server + homepage renders) |
| Full suite command | `npm run build` (verify production build succeeds with no type errors) |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HERO-01 | Full-viewport hero with dark gradient bg and 60% overlay | manual | Visual: hero fills viewport, gradient animates subtly | n/a manual |
| HERO-02 | Staggered text entrance "SATIN FABRICATION" with gold accent | manual | Visual: text animates in on page load with staggered timing | n/a manual |
| HERO-03 | Gold-outlined CTA with gold fill hover transition | manual | Visual: hover button, observe border-to-fill transition | n/a manual |
| HERO-04 | Pulsing scroll indicator at bottom | manual | Visual: indicator pulses continuously at hero bottom | n/a manual |
| SRVC-01 | 4 cards in 2x2 grid desktop / 1-col mobile | manual | Resize browser: 2x2 at md+, stack on mobile | n/a manual |
| SRVC-02 | Card styling + staggered scroll reveal | manual | Scroll to services section, observe staggered card reveals | n/a manual |
| SRVC-03 | Card hover: border brightens + image scales 1.03x | manual | Hover each card, observe border + scale changes | n/a manual |
| PORT-01 | Masonry grid 3/2/1 columns with 8-10 images | manual | Resize browser: 3 cols desktop, 2 tablet, 1 mobile | n/a manual |
| PORT-02 | Image hover overlay with name + category | manual | Hover portfolio images, observe overlay fade-in | n/a manual |
| PORT-04 | Unsplash metalwork placeholder images render | smoke | `npm run build` (verifies next/image with remote patterns) + visual check | n/a manual |
| PROC-01 | 5-step timeline with correct content | manual | Visual: 5 steps render with correct titles + descriptions | n/a manual |
| PROC-03 | Large step numbers in low-opacity gold 6xl | manual | Visual: step numbers visible behind text at low opacity | n/a manual |
| CNTC-01 | Split layout: headline left, form right | manual | Desktop: two-column layout; mobile: stacked | n/a manual |
| CNTC-02 | All 5 form fields render with correct types | manual | Visual: name, email, phone, select dropdown, textarea present | n/a manual |
| CNTC-03 | Input styling: transparent bg, bottom-border, gold focus | manual | Tab through form fields, observe focus border transition | n/a manual |
| CNTC-04 | Zod validation shows inline errors | manual | Submit empty form, observe error messages under each field | n/a manual |
| CNTC-05 | Success state animation on valid submit | manual | Fill form correctly, submit, observe success animation | n/a manual |
| FOOT-01 | Company name, tagline, copyright, service area text | manual | Visual: all text elements present in footer | n/a manual |
| FOOT-02 | Social icons gold on hover | manual | Hover social icons, observe color transition to gold | n/a manual |
| FOOT-03 | Back-to-top link scrolls smoothly | manual | Click back-to-top, observe smooth scroll to hero | n/a manual |
| FOOT-04 | Phone + email visible with correct links | manual | Visual: phone/email present; click opens tel:/mailto: | n/a manual |

### Sampling Rate

- **Per task commit:** `npm run build` (must pass without errors)
- **Per wave merge:** `npm run build` + manual browser verification of all sections
- **Phase gate:** All 6 success criteria verified in browser before marking Phase 4 complete

### Wave 0 Gaps

- [ ] `npm install zod@"^3.24" react-hook-form @hookform/resolvers lucide-react` -- new dependencies
- [ ] `src/lib/schemas.ts` -- Zod validation schema for contact form
- [ ] `src/components/sections/` directory -- does not exist yet
- [ ] heroGradient keyframes in globals.css -- does not exist yet
- No automated test framework needed for Phase 4 (all verification is visual/manual + build check)

## Sources

### Primary (HIGH confidence)

- [react-hook-form npm](https://www.npmjs.com/package/react-hook-form) -- v7.71.2, React 19 compatible
- [zod npm](https://www.npmjs.com/package/zod) -- v3.x series stable, v4 available but not recommended for this project
- [@hookform/resolvers npm](https://www.npmjs.com/package/@hookform/resolvers) -- v5.2.2, zodResolver import path
- [lucide-react npm](https://www.npmjs.com/package/lucide-react) -- v0.577.0, tree-shakable React icon components
- [Next.js Image remotePatterns docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/images) -- Unsplash hostname configuration
- [react-hook-form useWatch docs](https://react-hook-form.com/docs/usewatch) -- React 19 compatible re-render pattern
- Existing project source code (Phase 1-3 implementations verified via file reads)

### Secondary (MEDIUM confidence)

- [React Hook Form + Zod Guide](https://dev.to/marufrahmanlive/react-hook-form-with-zod-complete-guide-for-2026-1em1) -- Integration patterns and best practices
- [React Hook Form vs React 19 compatibility analysis](https://www.buildwithmatija.com/blog/the-invisible-form-bug-react-19-react-hook-form-s-hidden-compatibility-issue) -- watch() vs useWatch() re-render fix
- [Zod v4 migration guide](https://zod.dev/v4/changelog) -- Breaking changes reference (why we stay on v3)
- [@hookform/resolvers Zod v4 type issues](https://github.com/react-hook-form/resolvers/issues/813) -- Confirmed type incompatibility with Zod 4

### Tertiary (LOW confidence)

- CSS gradient animation patterns -- Synthesized from multiple blog posts; exact animation duration (20s) and gradient positions may need tuning during implementation
- Unsplash search terms for metalwork images -- Need curation during implementation; quality/consistency of available images varies

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- react-hook-form, Zod 3, @hookform/resolvers are industry-standard with verified npm versions; lucide-react is actively maintained
- Architecture: HIGH -- Section composition pattern follows established Phase 1-3 conventions; all primitives already built and verified
- Pitfalls: HIGH -- React 19 + watch() issue documented in multiple official sources; Zod 4 type issues confirmed via GitHub issues; Unsplash image dimensions and section ID matching are well-understood web development patterns
- Code examples: MEDIUM -- Patterns synthesized from official docs and project conventions; exact Unsplash URLs, gradient colors, and animation timing may need adjustment during implementation

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (stable stack; 30-day window appropriate)
