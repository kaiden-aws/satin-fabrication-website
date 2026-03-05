# Phase 3: UI Primitives - Research

**Researched:** 2026-03-04
**Domain:** Reusable animation components (scroll-triggered reveal, CSS columns masonry, before/after slider with pointer events, SVG pathLength timeline), all built on Motion v12 with LazyMotion domAnimation
**Confidence:** HIGH

## Summary

Phase 3 builds four independent, reusable components that Phase 4 will compose into homepage sections. The components span three distinct technical domains: (1) Motion scroll animations using `whileInView`, `useScroll`, and `useTransform` for the MotionWrapper and parallax effects; (2) pure CSS `column-count` masonry for the portfolio grid; and (3) native Pointer Events for the before/after slider drag interaction. The process timeline component combines Motion scroll tracking with SVG `pathLength` animation.

The critical discovery during research is that the project uses `LazyMotion` with `domAnimation` (configured in Phase 1), which does NOT include Motion's `drag` feature -- that requires `domMax` (+10kb). This means the before/after slider cannot use Motion's `drag` prop and must use native Pointer Events (`onPointerDown`, `onPointerMove`, `onPointerUp`) with `setPointerCapture` for unified mouse+touch handling. This is actually the better approach: zero bundle cost, full control over behavior, and native accessibility support.

All four components must be `'use client'` components since they depend on browser APIs (IntersectionObserver, scroll events, pointer events, DOM refs). Each must use `m.*` components (not `motion.*`) to comply with `LazyMotion strict` mode. Each must respect `MotionConfig reducedMotion="user"` where applicable -- MotionWrapper and timeline animations should be completely suppressed under reduced motion; the masonry grid and before/after slider are not motion-dependent.

**Primary recommendation:** Build each component in isolation with a test harness page (`/dev/primitives`), verify independently, then export from `src/components/ui/` for Phase 4 composition. Use `whileInView` with `viewport={{ once: true }}` for the MotionWrapper, CSS `columns` with `break-inside-avoid` for masonry, native Pointer Events with `clipPath` for the slider, and `useScroll` + `useTransform` mapped to `pathLength` for the timeline.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INTR-02 | Parallax effects -- hero background at 0.5x scroll speed, portfolio images at 0.9x, using Motion useScroll + useTransform | useScroll with target ref returns scrollYProgress; useTransform maps [0,1] to pixel offsets for parallax multipliers; standalone hooks work with domAnimation (no domMax needed); must be 'use client' component |
| PORT-03 | Scroll-driven exploded-to-assembled animation -- scattered parts converge as user scrolls, using Motion useScroll + useTransform | useScroll tracks element scroll progress with configurable offset; useTransform maps progress to x/y/rotate/scale values for each piece; offset controls animation start/end relative to viewport |
| PROC-02 | Steps appear sequentially on scroll with animated connecting gold line using Motion pathLength | m.path with pathLength style animated via useScroll + useTransform; strokeDasharray="0 1" prevents SSR flash; useTransform maps scrollYProgress to [0,1] pathLength; gold stroke color from design tokens |
</phase_requirements>

## Standard Stack

### Core (already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Motion | ^12.35.0 | Scroll animations, pathLength SVG, whileInView | Already installed; provides useScroll, useTransform, m.* components, whileInView prop |
| Next.js | 16.1.6 | App Router framework | Already installed; components are client-side ('use client') within existing LazyMotion tree |
| Tailwind CSS | ^4 | Responsive breakpoints, columns utility, spacing | Already installed; `columns-2 md:columns-3` for masonry, responsive classes |
| React | 19.2.3 | Component runtime, refs, hooks | Already installed; useRef for scroll targets, useState for slider position |

### Supporting (no new dependencies)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `clsx` + `tailwind-merge` | installed | Class composition via `cn()` | Dynamic class toggling on masonry column counts, slider states |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS `columns` masonry | `react-masonry-css` or CSS Grid masonry | CSS columns has zero JS, no hydration mismatch, no dependency; CSS Grid masonry still experimental (not production-ready). Decision locked in roadmap. |
| Native Pointer Events (slider) | Motion `drag` prop | Motion `drag` requires `domMax` (+10kb bundle); Pointer Events are zero-cost, cross-device, and offer finer control |
| `useScroll` + `useTransform` (parallax) | `react-scroll-parallax` library | Motion hooks already installed; no new dependency needed; same API quality |
| `whileInView` (MotionWrapper) | Custom IntersectionObserver | Motion's whileInView is a thin wrapper over IntersectionObserver with animation integration; no reason to hand-roll |

**Installation:**
```bash
# No new packages needed -- all dependencies already installed
```

## Architecture Patterns

### Recommended Project Structure (Phase 3 scope)

```
src/
├── components/
│   ├── layout/              # Existing -- Navbar, GrainOverlay, etc.
│   └── ui/                  # NEW -- Phase 3 primitives
│       ├── MotionWrapper.tsx     # Scroll-triggered fade+translateY reveal
│       ├── ParallaxWrapper.tsx   # useScroll + useTransform parallax at configurable speed
│       ├── MasonryGrid.tsx       # CSS columns masonry grid
│       ├── BeforeAfterSlider.tsx # Pointer Events drag slider
│       └── ProcessTimeline.tsx   # SVG pathLength scroll-animated timeline
├── app/
│   ├── dev/
│   │   └── primitives/
│   │       └── page.tsx     # Test harness page for visual verification
│   └── ...
└── ...
```

### Pattern 1: MotionWrapper -- Scroll-Triggered Reveal

**What:** A reusable wrapper component that fades + translates any child element into view when it scrolls into the viewport. Uses Motion's `whileInView` prop with the project's standard easing curve.

**When to use:** Wrap any section content or element that should reveal on scroll. Supports staggered children via `delay` prop.

**Example:**
```typescript
// src/components/ui/MotionWrapper.tsx
'use client'

import { m } from 'motion/react'
import type { ReactNode } from 'react'

interface MotionWrapperProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function MotionWrapper({ children, delay = 0, className }: MotionWrapperProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </m.div>
  )
}
```

**Key details:**
- `viewport={{ once: true }}` -- animation fires only once (no re-triggering on scroll back)
- `margin: '-100px'` -- triggers slightly before element is fully visible (feels natural)
- Easing `[0.25, 0.1, 0.25, 1]` matches DSGN-04 luxury cubic-bezier
- `MotionConfig reducedMotion="user"` (from Providers) automatically suppresses the animation when OS reduced motion is enabled
- Uses `m.div` (not `motion.div`) for LazyMotion strict compliance

### Pattern 2: ParallaxWrapper -- Scroll-Speed Multiplier

**What:** A wrapper that moves its child at a different scroll speed relative to the viewport, creating depth. Uses `useScroll` + `useTransform` to compute a y-offset based on scroll progress.

**When to use:** Hero background (0.5x), portfolio images (0.9x), any element needing parallax depth.

**Example:**
```typescript
// src/components/ui/ParallaxWrapper.tsx
'use client'

import { m, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

interface ParallaxWrapperProps {
  children: ReactNode
  speed?: number   // 0.5 = half speed, 1.0 = normal, 1.5 = faster
  className?: string
}

export function ParallaxWrapper({ children, speed = 0.5, className }: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Map scroll progress [0,1] to pixel offset
  // speed < 1 moves slower (background), speed > 1 moves faster (foreground)
  const yOffset = (1 - speed) * 200 // pixels of travel
  const y = useTransform(scrollYProgress, [0, 1], [-yOffset, yOffset])

  return (
    <m.div ref={ref} style={{ y }} className={className}>
      {children}
    </m.div>
  )
}
```

**Key details:**
- `offset: ['start end', 'end start']` tracks from when element bottom enters viewport to when element top exits
- `useScroll` and `useTransform` are standalone hooks -- they work with `domAnimation`, no `domMax` needed
- Motion values (`y`) are applied via `style` prop, bypassing React re-renders for 60fps performance
- Uses `will-change: transform` internally (Motion handles this)

### Pattern 3: CSS Columns Masonry

**What:** A pure CSS masonry layout using `column-count` with responsive breakpoints. Items flow top-to-bottom within each column. No JavaScript layout calculation, no hydration issues.

**When to use:** Portfolio gallery grid displaying images of varying heights.

**Example:**
```typescript
// src/components/ui/MasonryGrid.tsx
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface MasonryGridProps {
  children: ReactNode
  className?: string
}

export function MasonryGrid({ children, className }: MasonryGridProps) {
  return (
    <div
      className={cn(
        'columns-1 sm:columns-2 lg:columns-3 gap-4',
        className
      )}
    >
      {children}
    </div>
  )
}

// Individual items need break-inside-avoid
interface MasonryItemProps {
  children: ReactNode
  className?: string
}

export function MasonryItem({ children, className }: MasonryItemProps) {
  return (
    <div className={cn('break-inside-avoid mb-4', className)}>
      {children}
    </div>
  )
}
```

**Key details:**
- Server Component compatible -- no `'use client'` needed (pure CSS layout)
- `break-inside-avoid` prevents items from splitting across column boundaries
- `columns-1 sm:columns-2 lg:columns-3` matches requirement (1 mobile, 2 tablet, 3 desktop)
- No hydration mismatch because layout is CSS-only (no JS measurement)
- Items flow top-to-bottom per column (natural reading for galleries)
- `gap-4` sets consistent spacing between columns and items

### Pattern 4: Before/After Slider with Pointer Events

**What:** A draggable image comparison slider using native Pointer Events for unified mouse+touch handling. Uses `clipPath` to reveal/hide the "after" image.

**When to use:** Before/after project comparison in portfolio section.

**Example:**
```typescript
// src/components/ui/BeforeAfterSlider.tsx
'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface BeforeAfterSliderProps {
  beforeSrc: string
  afterSrc: string
  beforeAlt: string
  afterAlt: string
  className?: string
}

export function BeforeAfterSlider({
  beforeSrc, afterSrc, beforeAlt, afterAlt, className
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    setPosition(Math.max(0, Math.min(100, x)))
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn('relative select-none overflow-hidden', className)}
      onPointerDown={handlePointerDown}
      onPointerMove={(e) => {
        if (e.buttons > 0 || e.pressure > 0) handlePointerMove(e)
      }}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuenow={Math.round(position)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') setPosition(p => Math.max(0, p - 5))
        if (e.key === 'ArrowRight') setPosition(p => Math.min(100, p + 5))
      }}
    >
      {/* "Before" image -- full width, always visible */}
      <Image src={beforeSrc} alt={beforeAlt} fill className="object-cover" />

      {/* "After" image -- clipped to reveal from right */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <Image src={afterSrc} alt={afterAlt} fill className="object-cover" />
      </div>

      {/* Drag handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-gold z-10"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-gold bg-void/80 flex items-center justify-center">
          <span className="text-gold text-xs select-none" aria-hidden="true">&harr;</span>
        </div>
      </div>
    </div>
  )
}
```

**Key details:**
- `setPointerCapture` ensures drag continues even if pointer leaves the container
- `e.buttons > 0 || e.pressure > 0` checks that a button/finger is actively pressed during move
- `clipPath: inset(0 0 0 ${position}%)` clips the "after" image from the left
- `role="slider"` + `aria-valuenow` + keyboard support (arrow keys) for accessibility
- No Motion dependency -- zero bundle cost for the drag interaction
- `select-none` prevents text selection during drag
- Next.js `Image` with `fill` for optimized image loading

### Pattern 5: Process Timeline with SVG pathLength

**What:** A vertical timeline with numbered steps connected by a gold SVG line that draws itself as the user scrolls. Uses `useScroll` targeting the timeline container and `useTransform` to map scroll progress to `pathLength`.

**When to use:** Process section showing sequential steps.

**Example:**
```typescript
// src/components/ui/ProcessTimeline.tsx
'use client'

import { m, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

interface TimelineStep {
  number: string
  title: string
  description: string
}

interface ProcessTimelineProps {
  steps: TimelineStep[]
  className?: string
}

export function ProcessTimeline({ steps, className }: ProcessTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end center'],
  })

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={containerRef} className={className}>
      <div className="relative">
        {/* SVG connecting line */}
        <svg
          className="absolute left-6 top-0 h-full w-1"
          viewBox="0 0 2 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Background track */}
          <line
            x1="1" y1="0" x2="1" y2="100"
            stroke="var(--color-charcoal)"
            strokeWidth="2"
          />
          {/* Animated gold line */}
          <m.line
            x1="1" y1="0" x2="1" y2="100"
            stroke="var(--color-gold)"
            strokeWidth="2"
            style={{ pathLength }}
            strokeDasharray="0 1"
          />
        </svg>

        {/* Steps */}
        {steps.map((step, i) => (
          <m.div
            key={step.number}
            className="relative pl-16 pb-16 last:pb-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: i * 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {/* Step dot on line */}
            <div className="absolute left-4 top-0 w-5 h-5 rounded-full border-2 border-gold bg-void" />
            {/* Step content */}
            <span className="font-display text-6xl text-gold/10">{step.number}</span>
            <h3 className="font-display text-xl text-cream -mt-8">{step.title}</h3>
            <p className="mt-2 text-warm-gray">{step.description}</p>
          </m.div>
        ))}
      </div>
    </div>
  )
}
```

**Key details:**
- `strokeDasharray="0 1"` on `m.line` prevents SSR flash -- the line is invisible until Motion sets `pathLength` via JS
- `pathLength` is a Motion style prop that maps to `stroke-dashoffset` internally
- `useScroll` with `offset: ['start end', 'end center']` starts drawing when the container bottom enters viewport and finishes when container center aligns with viewport center
- SVG uses `preserveAspectRatio="none"` to stretch the line to full container height
- Steps use `whileInView` with staggered delay for sequential reveal
- CSS variables (`var(--color-gold)`) maintain design token consistency in SVG
- `aria-hidden="true"` on decorative SVG line

### Anti-Patterns to Avoid

- **Using `motion.*` instead of `m.*`:** LazyMotion strict mode throws a build error. Always import `{ m }` from `motion/react`.
- **Using Motion `drag` prop with `domAnimation`:** The drag feature requires `domMax`. Use native Pointer Events for drag interactions instead.
- **JavaScript-based masonry layout:** CSS `columns` achieves the same visual result with zero JS, zero hydration risk, and zero CLS. Do not use `react-masonry-css` or compute positions manually.
- **`whileInView` without `once: true`:** Without `once`, elements re-animate every time they scroll in/out of view. For a luxury portfolio site, reveals should fire once.
- **Applying `useScroll` to window without a target ref:** For element-specific parallax, always pass a `target` ref. Window-level scroll tracking causes every parallax element to animate based on total page scroll, not its own position.
- **Omitting `strokeDasharray="0 1"` on SVG pathLength animations:** Without this, the full path is visible on SSR/initial render before Motion measures and hides it, causing a flash.
- **Setting parallax speed to negative values or values > 2:** Extreme parallax multipliers cause elements to move unnaturally. Keep background elements at 0.3-0.7x, foreground at 0.8-1.2x.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-triggered reveal | Custom IntersectionObserver + useState + CSS transitions | Motion `whileInView` prop | Built-in reduced motion support, animation composability, once/margin options |
| Scroll-linked value mapping | Manual scroll listener + math + requestAnimationFrame | Motion `useScroll` + `useTransform` | Hardware-accelerated via ScrollTimeline API where available; motion values bypass React re-renders |
| Masonry layout calculation | JavaScript column height balancing algorithm | CSS `column-count` + `break-inside-avoid` | Zero JS, zero hydration mismatch, zero layout shift, responsive via Tailwind breakpoints |
| Unified mouse+touch handling | Separate `onMouseDown`/`onTouchStart` handlers | Pointer Events API (`onPointerDown`/`onPointerMove`/`onPointerUp`) | Single handler for mouse, touch, and pen; `setPointerCapture` for drag continuation; no library needed |
| SVG path draw animation | Manual `stroke-dashoffset` calculation + scroll listener | Motion `pathLength` style + `useTransform` | Motion handles total path length measurement, SSR compatibility, and reduced motion; maps directly to scroll progress |

**Key insight:** Phase 3 has zero new dependencies because Motion's hooks (`useScroll`, `useTransform`, `whileInView`) and the Pointer Events API cover all interaction requirements. CSS `columns` handles the masonry layout without any JavaScript at all.

## Common Pitfalls

### Pitfall 1: Motion `drag` Requires `domMax`, Not `domAnimation`

**What goes wrong:** Using `<m.div drag="x">` or any drag-related prop throws a silent failure or error because the drag feature is not loaded in the `domAnimation` feature bundle.

**Why it happens:** The project uses `LazyMotion features={domAnimation}` (Phase 1 decision). `domAnimation` includes: animation, exit, tap/hover/focus gestures, and whileInView. It does NOT include `drag` or `layout` features -- those are only in `domMax`.

**How to avoid:** Never use Motion's `drag`, `dragConstraints`, `onDrag`, `onDragStart`, `onDragEnd` props. For any drag interaction (like the before/after slider), use native Pointer Events (`onPointerDown`, `onPointerMove`, `onPointerUp`) with `setPointerCapture`.

**Warning signs:** Drag interaction silently does nothing; no error in console but element doesn't move.

### Pitfall 2: CSS Columns Item Ordering is Top-to-Bottom, Not Left-to-Right

**What goes wrong:** Items in a CSS `columns` layout flow top-to-bottom within each column, then overflow to the next column. In a 3-column grid with items 1-9: column 1 gets items 1-3, column 2 gets 4-6, column 3 gets 7-9. This differs from CSS Grid where items flow left-to-right.

**Why it happens:** CSS multi-column layout was designed for text flow, not grid layouts.

**How to avoid:** For a portfolio gallery, this is actually acceptable -- the visual result looks natural since varying image heights create organic placement. If strict left-to-right ordering is required, use CSS Grid instead (but lose the masonry effect). The roadmap decision explicitly chose CSS columns for hydration safety.

**Warning signs:** Images appear in unexpected order when compared to a regular grid.

### Pitfall 3: SVG pathLength Flash on Initial Render (SSR)

**What goes wrong:** The SVG path is fully visible for a brief moment before Motion's JavaScript measures the path length and starts the animation, causing a flash of the complete line.

**Why it happens:** Motion needs JavaScript to compute `getTotalLength()` on the SVG path element. During SSR or before JS hydration, the path renders at its natural full-stroke state.

**How to avoid:** Add `strokeDasharray="0 1"` to the `m.path` or `m.line` element. This makes the path invisible by default (dash of length 0, gap of length 1). Motion then overrides this via the `pathLength` style.

**Warning signs:** Gold timeline line flashes fully drawn on page load, then snaps to 0 and animates from scroll.

### Pitfall 4: `useScroll` Returning Zero Progress Without Target Ref

**What goes wrong:** `scrollYProgress` stays at 0 or behaves unexpectedly because `useScroll` is tracking the entire page scroll rather than a specific element.

**Why it happens:** Without a `target` ref, `useScroll` tracks `window.scrollY`. For element-specific animations (parallax, timeline), you need to track the element's progress through the viewport.

**How to avoid:** Always pass `target: ref` to `useScroll` for element-specific animations:
```typescript
const ref = useRef<HTMLDivElement>(null)
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ['start end', 'end start'],
})
```

**Warning signs:** All parallax elements animate identically regardless of their position on the page.

### Pitfall 5: Pointer Events Not Working on Mobile Safari Without touch-action

**What goes wrong:** The before/after slider doesn't respond to touch on iOS Safari, or the page scrolls instead of the slider responding to the drag.

**Why it happens:** Mobile browsers use touch events for scrolling. Without `touch-action: none` on the slider container, the browser intercepts the touch for scroll and doesn't fire pointer events.

**How to avoid:** Add `touch-action: none` (or Tailwind's `touch-none`) to the slider container element:
```typescript
<div className="relative select-none overflow-hidden touch-none" ...>
```

**Warning signs:** Slider works on desktop but page scrolls instead of slider dragging on mobile.

### Pitfall 6: Hydration Mismatch from Conditional Rendering Based on Window Width

**What goes wrong:** Using `window.innerWidth` in initial render to determine column count causes hydration mismatch because the server doesn't know the viewport width.

**Why it happens:** Server renders one state (e.g., 3 columns), client hydrates with a different state (e.g., 2 columns on tablet).

**How to avoid:** Use CSS-only responsive breakpoints for the masonry grid (`columns-1 sm:columns-2 lg:columns-3`). Never use JavaScript `window.innerWidth` for initial layout decisions. CSS media queries are evaluated after hydration, so both server and client render identical DOM.

**Warning signs:** React hydration warning in console mentioning class name or style mismatch.

### Pitfall 7: Before/After Slider Layout Shift from Unsized Images

**What goes wrong:** Images in the slider don't have explicit dimensions, causing layout shift (CLS) as they load.

**Why it happens:** Next.js `Image` with `fill` requires the parent container to have explicit dimensions (via aspect ratio or explicit height/width). Without this, the container collapses to 0 height.

**How to avoid:** Set a fixed aspect ratio on the slider container:
```typescript
<div className="relative aspect-[16/10] overflow-hidden touch-none select-none" ...>
```

**Warning signs:** Slider container appears collapsed or zero-height until images load.

## Code Examples

Verified patterns from research -- see Architecture Patterns section above for complete component implementations.

### useScroll Offset Reference

```typescript
// Tracks from when element bottom enters viewport (start end)
// to when element top exits viewport (end start)
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ['start end', 'end start'], // full element traversal
})

// Tracks from element entering to element centered in viewport
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ['start end', 'end center'], // good for timeline
})

// Offset format: "targetPoint containerPoint"
// targetPoint: where on the target element (start=top, center=middle, end=bottom)
// containerPoint: where on the viewport (start=top, center=middle, end=bottom)
// Also accepts numbers (0-1) and pixel values ("100px")
```

### useTransform for Parallax Multipliers

```typescript
// Hero background at 0.5x scroll speed (INTR-02)
const y = useTransform(scrollYProgress, [0, 1], ['-25%', '25%'])
// Net travel: 50% of scroll distance (effectively 0.5x speed)

// Portfolio images at 0.9x scroll speed (INTR-02)
const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])
// Net travel: 10% of scroll distance (effectively 0.9x speed)
```

### Pointer Events for Drag Interaction

```typescript
// Unified mouse + touch drag handling
const handlePointerDown = (e: React.PointerEvent) => {
  // Capture all future pointer events to this element
  (e.target as HTMLElement).setPointerCapture(e.pointerId)
  setDragging(true)
}

const handlePointerMove = (e: React.PointerEvent) => {
  // Only process if actively pressing/touching
  if (e.buttons === 0 && e.pressure === 0) return
  // Calculate position from pointer coordinates
  const rect = containerRef.current!.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  setPosition(Math.max(0, Math.min(100, x)))
}

const handlePointerUp = () => {
  setDragging(false)
}
```

### MasonryGrid with Tailwind Responsive Columns

```typescript
// The CSS-only pattern -- no JavaScript measurement
<div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
  {images.map((img) => (
    <div key={img.id} className="break-inside-avoid mb-4">
      <Image
        src={img.src}
        alt={img.alt}
        width={img.width}
        height={img.height}
        className="w-full rounded"
      />
    </div>
  ))}
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` scroll listener + IntersectionObserver | Motion `whileInView` prop | Motion v5+ (2022) | Built-in viewport detection with `once`, `margin`, custom `root` options |
| `react-intersection-observer` + manual animation | Motion `whileInView` | Motion v5+ | Eliminates separate intersection detection library |
| JavaScript masonry libraries (Masonry.js, react-masonry-css) | CSS `column-count` | Evergreen CSS | Zero JS, zero CLS, zero hydration risk |
| Separate `onMouseDown`/`onTouchStart` handlers | Pointer Events API | All modern browsers | Single unified handler; `setPointerCapture` for drag; pen/stylus support |
| Manual `stroke-dashoffset` calculation for SVG draw | Motion `pathLength` style prop | Motion v3+ | Automatic total length measurement; scroll-linked via `useTransform`; SSR-safe with `strokeDasharray="0 1"` |
| `import { motion } from 'framer-motion'` | `import { m } from 'motion/react'` with LazyMotion | Motion v12 (late 2024) | Package renamed; `m` + LazyMotion cuts bundle ~34kb to ~15kb |

**Deprecated/outdated:**
- `react-masonry-css`: Unnecessary JS overhead for CSS-achievable layout
- `framer-motion` package: Still works but `motion` is canonical name
- Separate mouse/touch event handlers: Pointer Events API unifies these

## Open Questions

1. **SVG line vs SVG path for timeline connector**
   - What we know: `m.line` supports `pathLength` for straight vertical lines; `m.path` supports it for curved paths
   - What's unclear: Whether the timeline design calls for a perfectly straight vertical line or a slightly curved connector between steps
   - Recommendation: Start with `m.line` (simpler). Switch to `m.path` with a vertical bezier curve if the design requires it. Both support `pathLength` animation identically.

2. **Test harness page routing**
   - What we know: A `/dev/primitives` page is needed for visual verification of all components in isolation
   - What's unclear: Whether this should be excluded from production builds or left as a hidden route
   - Recommendation: Create at `app/dev/primitives/page.tsx`. In Phase 6 (QA), decide whether to remove or gate behind an environment variable. It has negligible bundle impact.

3. **Before/after slider image pair availability**
   - What we know: STATE.md notes this is "gated on a matched before/after image pair from a real project"
   - What's unclear: Whether placeholder images exist for Phase 3 development
   - Recommendation: Use two contrasting Unsplash metalwork images as placeholders. The component should work with any two images of the same aspect ratio.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual verification (no automated test framework) |
| Config file | none -- see Wave 0 |
| Quick run command | `npm run dev` (verify dev server + test harness page) |
| Full suite command | `npm run build` (verify production build succeeds) |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INTR-02 | ParallaxWrapper moves child at configurable scroll speed | manual | Visual verification: scroll test harness, observe parallax depth difference | n/a manual |
| PORT-03 | Scroll-driven assembly animation using useScroll + useTransform | manual | Visual verification: scattered elements converge on scroll in test harness | n/a manual |
| PROC-02 | Gold SVG line draws progressively as user scrolls through timeline | manual | Visual verification: scroll through timeline section, line advances step-by-step | n/a manual |
| SC-01 | MotionWrapper fades+translates child on scroll into view | manual | Visual verification: elements reveal as they scroll into view on test harness | n/a manual |
| SC-02 | MasonryGrid renders 3 cols desktop, 2 tablet, no hydration error | smoke | `npm run build` (no hydration warnings) + resize browser to verify column count | n/a manual |
| SC-03 | BeforeAfterSlider draggable on desktop, swipeable on mobile | manual | Drag slider handle with mouse; test on mobile device or DevTools touch emulation | n/a manual |
| SC-04 | ProcessTimeline gold line advances on scroll via pathLength | manual | Visual verification: scroll through timeline, observe gold line drawing progress | n/a manual |
| SC-01-RM | MotionWrapper suppresses animation under reduced motion | manual | Enable OS "Reduce motion"; verify elements appear without animation | n/a manual |

### Sampling Rate

- **Per task commit:** `npm run build` (must pass without errors)
- **Per wave merge:** `npm run build` + manual browser verification of test harness page
- **Phase gate:** All 4 success criteria verified on test harness before marking Phase 3 complete

### Wave 0 Gaps

- [ ] `app/dev/primitives/page.tsx` -- test harness page rendering all 4+ components with placeholder content
- No automated test framework needed for Phase 3 (all verification is visual/manual)

## Sources

### Primary (HIGH confidence)

- [Motion `domAnimation` source code](node_modules/framer-motion/dist/es/render/dom/features-animation.mjs) -- Verified domAnimation includes: animation, exit, InViewFeature (whileInView), tap, focus, hover. Does NOT include drag or layout.
- [Motion `domMax` source code](node_modules/framer-motion/dist/es/render/dom/features-max.mjs) -- Verified domMax = domAnimation + drag + layout
- [Motion useScroll docs](https://motion.dev/docs/react-use-scroll) -- Scroll progress tracking with target ref and offset options
- [Motion scroll animations overview](https://motion.dev/docs/react-scroll-animations) -- whileInView, useScroll, useTransform usage patterns
- [Motion SVG animation docs](https://motion.dev/docs/react-svg-animation) -- pathLength, pathSpacing, pathOffset; works on path, line, circle, rect, polygon
- [Motion LazyMotion docs](https://motion.dev/docs/react-lazy-motion) -- domAnimation vs domMax feature bundles
- [Motion reduce bundle size docs](https://motion.dev/docs/react-reduce-bundle-size) -- domAnimation (~15kb), domMax (~25kb)
- [MDN Pointer Events API](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) -- setPointerCapture, unified mouse/touch/pen
- [Tailwind CSS columns docs](https://tailwindcss.com/docs/columns) -- columns-* utilities for CSS multi-column layout
- Runtime verification: `m.svg`, `m.path`, `useScroll`, `useTransform`, `useInView` all confirmed available in `motion/react` v12.35.0

### Secondary (MEDIUM confidence)

- [Scroll SVG Path with Framer Motion](https://dev.to/heres/scroll-svg-path-with-framer-motion-54el) -- Complete scroll-linked pathLength implementation example
- [Building an Accessible Before/After Slider in React](https://jsdev.space/react-before-after-slider/) -- Pointer Events + ARIA slider pattern
- [Responsive Masonry Layout with TailwindCSS](https://dev.to/kdrbek/responsive-masonry-layout-with-tailwindcss-in-2-steps-4kkj) -- CSS columns masonry with break-inside-avoid
- [CSS Masonry layouts](https://w3bits.com/css-masonry/) -- Pure CSS column-count masonry patterns

### Tertiary (LOW confidence)

- SSR pathLength flash fix via `strokeDasharray="0 1"` -- Referenced in multiple blog posts but not in official Motion docs. Behavior confirmed conceptually (CSS hides path, Motion overrides via JS), but exact implementation should be validated during development.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- No new dependencies; all hooks and components verified available in installed Motion v12.35.0 via runtime check
- Architecture: HIGH -- domAnimation feature set verified via source code inspection; Pointer Events API is a web standard; CSS columns is evergreen CSS
- Pitfalls: HIGH -- domAnimation/domMax distinction verified in source; CSS columns ordering behavior is well-documented; pointer-events touch-action requirement is a known mobile web pattern
- Code examples: MEDIUM -- Patterns synthesized from official docs + verified blog posts; exact scroll offset values may need tuning during implementation

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (stable stack; 30-day window appropriate)
