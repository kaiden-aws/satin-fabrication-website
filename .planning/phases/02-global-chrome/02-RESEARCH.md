# Phase 2: Global Chrome - Research

**Researched:** 2026-03-04
**Domain:** Fixed navbar with scroll-triggered transparency transition, animated desktop nav links, full-screen mobile menu with staggered animations, hamburger-to-X icon animation, custom cursor with lerp-based tracking and hover expansion, skip-to-content accessibility link, z-index layer management
**Confidence:** HIGH

## Summary

Phase 2 builds the "brand shell" that wraps all future content sections. It covers six requirements (NAV-01 through NAV-04, INTR-01, INTR-03) spanning four distinct UI systems: a fixed navbar with scroll-aware background transition, a full-screen mobile menu overlay, a custom cursor that tracks the mouse with physics-based lag, and micro-interaction hover effects. All four systems are client-side interactive components that must use `m.*` from `motion/react` (enforced by LazyMotion strict mode from Phase 1).

The critical architectural challenge is z-index layer management. The grain overlay from Phase 1 sits at `z-50` with `pointer-events-none`. The navbar, mobile menu overlay, and custom cursor all need their own z-index layers that do not conflict with each other or the grain. The recommended z-index stack from bottom to top is: page content (default) -> navbar (`z-40`) -> mobile menu overlay (`z-[60]`) -> grain overlay (`z-50`, pointer-events-none so it visually overlays the mobile menu too) -> custom cursor (`z-[9999]`). The grain overlay's `pointer-events-none` means it can sit between the mobile menu and cursor without blocking interactions.

The custom cursor is the most performance-sensitive component. It must use a raw `requestAnimationFrame` loop with linear interpolation (lerp) to trail the actual mouse position, NOT Motion's `animate` prop -- reactive state updates at 60fps cause excessive React re-renders. The cursor should be rendered as a fixed-position `div` with `transform: translate()` updated directly via a ref, completely bypassing React's render cycle. It must be hidden on touch devices using the `@media (pointer: fine)` CSS media query.

**Primary recommendation:** Build four client components -- `Navbar`, `MobileMenu`, `CustomCursor`, and `SkipLink` -- each as isolated modules in `src/components/layout/`. Use Motion's `useScroll` + `useMotionValueEvent` for the navbar scroll detection, `AnimatePresence` + staggered variants for the mobile menu, raw `requestAnimationFrame` with lerp for the cursor, and a visually-hidden-until-focused anchor for skip-to-content.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NAV-01 | Fixed/sticky navbar transparent over hero, transitions to solid dark (#0A0A0A with backdrop-blur) on scroll | Motion `useScroll` + `useMotionValueEvent` for scroll threshold detection; Tailwind `backdrop-blur-md` + conditional `bg-void/95` class; `m.nav` for animated background transition |
| NAV-02 | Full-screen mobile menu overlay with large centered nav links, staggered fade-in animation, 2-line hamburger animating to X | `AnimatePresence` + `m.div` overlay with `variants` and `staggerChildren`; SVG path animation for hamburger-to-X; focus trap for keyboard accessibility |
| NAV-03 | Skip-to-content accessibility link for keyboard navigation | Visually hidden anchor as first focusable element in `<body>`; `#main-content` target on `<main>` element; focus ring styled with gold accent |
| NAV-04 | Desktop nav links (WORK, SERVICES, PROCESS, CONTACT) with gold underline that animates in from left on hover | CSS `transform-origin: left` + `scaleX(0)` to `scaleX(1)` transition on hover; uses `--ease-luxury` timing; pure CSS, no JS needed |
| INTR-01 | Custom cursor -- small gold dot (8px) following mouse with slight lag (lerp via rAF), expands to 40px gold ring on interactive elements, "VIEW" text on image hover | Raw `requestAnimationFrame` loop with lerp function; `useRef` for DOM manipulation bypassing React render cycle; `@media (pointer: fine)` to show only on desktop; event delegation for hover detection on `[data-cursor]` elements |
| INTR-03 | Micro-interactions -- button gold glow (box-shadow), link underline slides in from left (scaleX + transform-origin), form focus border transitions | CSS transitions using `--ease-luxury`; Tailwind utilities for `box-shadow`, `transform-origin`, `transition-*`; no JS animation needed for these effects |
</phase_requirements>

## Standard Stack

### Core (already installed from Phase 1)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | App Router framework | Already scaffolded; layout.tsx is the insertion point for navbar |
| React | 19.2.3 | UI runtime | Client components for interactive chrome |
| Motion | 12.35.0+ | Animation library | `m.*` components, `useScroll`, `useMotionValueEvent`, `AnimatePresence`, variants |
| Tailwind CSS | 4.x | Utility CSS with design tokens | `backdrop-blur-md`, `bg-void/95`, transition utilities, responsive breakpoints |
| clsx + tailwind-merge | 2.x / 3.x | Class composition | `cn()` utility for conditional navbar classes |

### Supporting (no new dependencies needed)

Phase 2 requires **zero new npm dependencies**. All features are implementable with:
- Motion's `useScroll`, `useMotionValueEvent`, `AnimatePresence`, and `m.*` components (already installed)
- Raw browser APIs: `requestAnimationFrame`, `MouseEvent`, `matchMedia`
- CSS media queries: `@media (pointer: fine)`, `@media (prefers-reduced-motion: reduce)`
- HTML/ARIA: `<a href="#main-content">`, `aria-expanded`, `aria-hidden`, `role="dialog"`, `inert`

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Raw rAF cursor | Motion `useSpring` / `useMotionValue` | Motion values avoid React renders but add ~2kb; raw rAF gives finer control over lerp speed and idle cancellation |
| Manual focus trap | `focus-trap-react` (12.0.0) | Library handles edge cases but adds dependency; manual implementation with `inert` attribute is simpler for a single mobile menu |
| CSS underline animation | Motion `m.span` underline | CSS `scaleX` transition is simpler, more performant, and matches the requirement spec exactly |
| `useState` scroll detection | `IntersectionObserver` | IO is lighter but less precise for "scrolled past N pixels" threshold; `useMotionValueEvent` is already available via Motion |

**Installation:**
```bash
# No new packages needed -- Phase 1 dependencies cover all Phase 2 requirements
```

## Architecture Patterns

### Recommended Project Structure (Phase 2 additions)

```
src/
├── app/
│   ├── layout.tsx               # MODIFIED: add Navbar, CustomCursor, SkipLink
│   ├── page.tsx                 # MODIFIED: add id="main-content" to <main>
│   └── globals.css              # MODIFIED: add skip-link, cursor, and navbar styles
│
├── components/
│   └── layout/
│       ├── GrainOverlay.tsx     # EXISTING (unchanged, z-50)
│       ├── Navbar.tsx           # NEW: fixed navbar with scroll detection
│       ├── MobileMenu.tsx       # NEW: full-screen overlay with staggered links
│       ├── HamburgerButton.tsx  # NEW: 2-line SVG hamburger animating to X
│       ├── NavLink.tsx          # NEW: desktop nav link with gold underline hover
│       ├── CustomCursor.tsx     # NEW: lerp-based cursor with hover expansion
│       └── SkipLink.tsx         # NEW: visually hidden skip-to-content link
│
├── hooks/
│   └── useScrolled.ts           # NEW: reusable scroll threshold hook
│
├── providers/
│   └── Providers.tsx            # EXISTING (unchanged)
│
└── lib/
    ├── utils.ts                 # EXISTING (unchanged)
    └── constants.ts             # NEW: nav links array, z-index values, cursor config
```

### Pattern 1: Scroll-Aware Navbar with Motion useScroll

**What:** Use Motion's `useScroll` hook to get the page `scrollY` motion value, then `useMotionValueEvent` to listen for changes and toggle a boolean state when scroll passes a threshold (e.g., 50px). The navbar background animates between transparent and solid using `m.nav`.

**When to use:** Whenever the navbar needs to respond to scroll position.

**Example:**
```typescript
// hooks/useScrolled.ts
'use client'

import { useState } from 'react'
import { useScroll, useMotionValueEvent } from 'motion/react'

export function useScrolled(threshold = 50) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > threshold)
  })

  return scrolled
}
```

```typescript
// components/layout/Navbar.tsx
'use client'

import { m } from 'motion/react'
import { useScrolled } from '@/hooks/useScrolled'
import { cn } from '@/lib/utils'

export function Navbar() {
  const scrolled = useScrolled(50)

  return (
    <m.nav
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-colors duration-300',
        'ease-luxury px-6 py-4',
        scrolled
          ? 'bg-void/95 backdrop-blur-md'
          : 'bg-transparent'
      )}
      // Optional: animate with Motion for smoother background transition
      initial={false}
      animate={{
        backgroundColor: scrolled
          ? 'rgba(10, 10, 10, 0.95)'
          : 'rgba(10, 10, 10, 0)',
      }}
      transition={{ duration: 0.3 }}
    >
      {/* nav content */}
    </m.nav>
  )
}
```

### Pattern 2: Full-Screen Mobile Menu with AnimatePresence + Stagger

**What:** Use `AnimatePresence` to mount/unmount the mobile menu overlay with entry/exit animations. Menu items use Motion `variants` with `staggerChildren` for the cascading fade-in effect. The overlay is a fixed fullscreen `div` with centered flex layout.

**When to use:** Mobile menu toggle.

**Example:**
```typescript
// components/layout/MobileMenu.tsx
'use client'

import { m, AnimatePresence } from 'motion/react'

const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
}

const listVariants = {
  closed: { opacity: 0 },
  open: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  closed: { opacity: 0, y: 20 },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          className="fixed inset-0 z-[60] bg-void flex flex-col items-center justify-center"
          variants={overlayVariants}
          initial="closed"
          animate="open"
          exit="closed"
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <m.ul
            className="flex flex-col items-center gap-8"
            variants={listVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {NAV_LINKS.map((link) => (
              <m.li key={link.href} variants={itemVariants}>
                <a
                  href={link.href}
                  className="font-display text-4xl text-cream hover:text-gold transition-colors"
                  onClick={onClose}
                >
                  {link.label}
                </a>
              </m.li>
            ))}
          </m.ul>
        </m.div>
      )}
    </AnimatePresence>
  )
}
```

### Pattern 3: Hamburger-to-X SVG Animation

**What:** A button containing an SVG with two `path` elements. On toggle, the paths animate from horizontal lines to an X shape using Motion variants. The 2-line design (requirement says "2-line hamburger") uses two paths that rotate to form the X.

**When to use:** Mobile menu toggle button.

**Example:**
```typescript
// components/layout/HamburgerButton.tsx
'use client'

import { m } from 'motion/react'

const topLineVariants = {
  closed: { d: 'M4 8L20 8' },
  open: { d: 'M4 4L20 20' },
}

const bottomLineVariants = {
  closed: { d: 'M4 16L20 16' },
  open: { d: 'M4 20L20 4' },
}

interface HamburgerButtonProps {
  isOpen: boolean
  toggle: () => void
}

export function HamburgerButton({ isOpen, toggle }: HamburgerButtonProps) {
  return (
    <button
      onClick={toggle}
      className="relative z-[70] p-2 md:hidden"
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <m.path
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          variants={topLineVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <m.path
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          variants={bottomLineVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </svg>
    </button>
  )
}
```

### Pattern 4: Custom Cursor with requestAnimationFrame + Lerp

**What:** A fixed-position `div` that follows the mouse with a slight lag using linear interpolation inside a `requestAnimationFrame` loop. Bypasses React rendering entirely by writing `transform` directly to a ref'd DOM element. Expands from 8px gold dot to 40px gold ring when hovering interactive elements. Hidden on touch devices via CSS `@media (pointer: coarse)`.

**When to use:** Desktop only, always mounted in layout.

**Example:**
```typescript
// components/layout/CustomCursor.tsx
'use client'

import { useEffect, useRef, useCallback } from 'react'

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const isHoveringRef = useRef(false)

  const animate = useCallback(() => {
    const pos = posRef.current
    const target = targetRef.current

    pos.x = lerp(pos.x, target.x, 0.15)
    pos.y = lerp(pos.y, target.y, 0.15)

    if (cursorRef.current) {
      cursorRef.current.style.transform =
        `translate(${pos.x}px, ${pos.y}px)`
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        'a, button, [data-cursor="pointer"]'
      )
      if (target) {
        isHoveringRef.current = true
        cursorRef.current?.classList.add('cursor-expanded')
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        'a, button, [data-cursor="pointer"]'
      )
      if (target) {
        isHoveringRef.current = false
        cursorRef.current?.classList.remove('cursor-expanded')
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      cancelAnimationFrame(rafRef.current)
    }
  }, [animate])

  return (
    <div
      ref={cursorRef}
      className="custom-cursor pointer-events-none fixed top-0 left-0 z-[9999]"
      aria-hidden="true"
    />
  )
}
```

```css
/* globals.css additions */
@media (pointer: fine) {
  .custom-cursor {
    width: 8px;
    height: 8px;
    background-color: var(--color-gold);
    border-radius: 50%;
    margin-left: -4px;
    margin-top: -4px;
    transition: width 0.3s var(--ease-luxury),
                height 0.3s var(--ease-luxury),
                margin 0.3s var(--ease-luxury),
                background-color 0.3s var(--ease-luxury);
    will-change: transform;
  }

  .custom-cursor.cursor-expanded {
    width: 40px;
    height: 40px;
    background-color: transparent;
    border: 1.5px solid var(--color-gold);
    margin-left: -20px;
    margin-top: -20px;
  }
}

@media (pointer: coarse) {
  .custom-cursor {
    display: none;
  }
}
```

### Pattern 5: Skip-to-Content Link

**What:** A visually hidden anchor link that becomes visible when focused via keyboard Tab. Positioned absolutely at the top of the page and styled with a gold focus ring.

**When to use:** Always -- first focusable element in the DOM.

**Example:**
```typescript
// components/layout/SkipLink.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        focus:fixed focus:top-4 focus:left-4 focus:z-[9999]
        focus:px-4 focus:py-2
        focus:bg-void focus:text-gold focus:border focus:border-gold
        focus:rounded focus:outline-none focus:ring-2 focus:ring-gold
        font-body text-sm
      "
    >
      Skip to content
    </a>
  )
}
```

### Z-Index Layer Strategy

```
Layer Stack (bottom to top):
─────────────────────────────
z-auto   Page content (default)
z-40     Navbar (fixed, above content)
z-[60]   Mobile menu overlay (above navbar)
z-50     Grain overlay (pointer-events-none; visually above mobile menu)
z-[70]   Hamburger button (above mobile menu overlay so it remains tappable)
z-[9999] Custom cursor (above everything)
z-[9999] Skip link (when focused, same level as cursor)
─────────────────────────────
```

**Critical note:** The grain overlay at `z-50` has `pointer-events-none`, so it does not block interaction with the mobile menu at `z-[60]` even though its numeric z-index is lower visually. The grain overlay renders above everything visually because of paint order when `pointer-events-none` is set, but interaction passes through. The mobile menu at `z-[60]` receives all pointer events correctly.

### Anti-Patterns to Avoid

- **Using `useState` + `onScroll` for navbar detection:** React's synthetic `onScroll` event causes re-renders on every scroll frame. Motion's `useMotionValueEvent` is fire-and-forget -- it only triggers the callback, not a render, unless you explicitly `setState`.
- **Animating cursor position with Motion's `animate` prop:** Setting `animate={{ x, y }}` on every mouse move triggers React's reconciliation at 60fps. Use raw `requestAnimationFrame` + `ref.current.style.transform` instead.
- **Mounting/unmounting mobile menu without AnimatePresence:** Without `AnimatePresence`, the exit animation never plays -- the component simply disappears from the DOM.
- **Forgetting `initial={false}` on navbar:** Without `initial={false}`, the navbar will play its entry animation on first render, causing a visible flash.
- **Using `cursor: none` on `body` without pointer query:** Hiding the default cursor on touch devices makes the page unusable. Always gate cursor hiding behind `@media (pointer: fine)`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll position tracking | Manual `addEventListener('scroll')` with throttle/debounce | Motion `useScroll` + `useMotionValueEvent` | Motion uses passive listeners, runs outside React render cycle, handles cleanup automatically |
| Menu exit animations | CSS `display: none` or conditional rendering | `AnimatePresence` + `exit` prop | CSS cannot animate removal; conditional rendering unmounts before animation plays |
| SVG path morphing | Manual SVG `d` attribute interpolation | Motion `m.path` with `variants` | Motion interpolates SVG path data strings automatically with configurable easing |
| Focus trap for mobile menu | Manual `keydown` listener cycling through focusable elements | `inert` attribute on `<main>` when menu is open | `inert` is a native HTML attribute (supported in all modern browsers) that makes content unfocusable and invisible to assistive tech without JS |
| Hover detection for cursor | `onMouseEnter`/`onMouseLeave` on every interactive element | Event delegation on `document` with `closest('a, button, [data-cursor]')` | Event delegation handles dynamically added elements and avoids prop drilling `onMouseEnter` to every component |

**Key insight:** The custom cursor is the only component that needs raw browser APIs. Everything else uses Motion's declarative animation system or pure CSS transitions.

## Common Pitfalls

### Pitfall 1: Navbar Flash on Initial Render

**What goes wrong:** The navbar briefly shows the "scrolled" (solid background) state before settling to transparent on first page load.
**Why it happens:** Motion's `animate` prop plays an entry animation from the initial state to the animate state. If `initial` is not set to `false`, it will animate from the component's first render state.
**How to avoid:** Always set `initial={false}` on the navbar `m.nav` element so it starts in whatever state `scrolled` dictates without animation on mount.
**Warning signs:** A dark flash at the top of the page on first load.

### Pitfall 2: Custom Cursor Causes Layout Thrashing

**What goes wrong:** The cursor lags noticeably or the page stutters during mouse movement.
**Why it happens:** Updating React state on every `mousemove` event (60+ times per second) forces React to re-render the component tree. Even `useState` with a simple x/y value causes reconciliation.
**How to avoid:** Never store cursor position in React state. Use `useRef` for position tracking and write directly to `cursorRef.current.style.transform`. The `requestAnimationFrame` loop reads refs and writes to the DOM without React involvement.
**Warning signs:** React DevTools showing frequent re-renders of cursor component or its ancestors.

### Pitfall 3: Mobile Menu Scroll Bleed-Through

**What goes wrong:** The user can still scroll the page behind the open mobile menu overlay.
**Why it happens:** The overlay is `position: fixed` but the body scroll is not locked.
**How to avoid:** When the mobile menu opens, set `document.body.style.overflow = 'hidden'`. Restore to `''` when it closes. Do this in a `useEffect` that depends on the `isOpen` state.
**Warning signs:** Background content scrolling visible through the mobile menu edges.

### Pitfall 4: AnimatePresence Exit Animation Not Playing

**What goes wrong:** The mobile menu disappears instantly instead of fading out.
**Why it happens:** Two common causes: (1) the `key` prop is missing on the direct child of `AnimatePresence`, or (2) `mode="wait"` is set but there is no entering component to wait for.
**How to avoid:** Ensure the direct child of `AnimatePresence` has a `key` prop (even if it is static like `key="mobile-menu"`), and that `exit` variants are defined on the component.
**Warning signs:** Menu snaps closed; exit animation never triggers.

### Pitfall 5: Cursor Visible on Touch Devices

**What goes wrong:** A gold dot appears frozen in the corner of the screen on mobile/tablet devices.
**Why it happens:** The cursor component mounts and renders its DOM element but receives no `mousemove` events on touch devices.
**How to avoid:** Use CSS `@media (pointer: coarse) { .custom-cursor { display: none; } }` to hide it entirely. Do NOT rely on JS device detection -- CSS media queries respond to the actual input device.
**Warning signs:** Static gold dot visible on mobile testing.

### Pitfall 6: Gold Underline Not Animating from Left

**What goes wrong:** The nav link underline scales from the center instead of sliding in from the left.
**Why it happens:** CSS `transform: scaleX()` defaults to `transform-origin: center`.
**How to avoid:** Explicitly set `transform-origin: left` (Tailwind: `origin-left`) on the underline pseudo-element or child span.
**Warning signs:** Underline grows symmetrically from center on hover.

### Pitfall 7: Z-Index Conflicts Between Grain and Mobile Menu

**What goes wrong:** The grain overlay blocks touch/click events on the mobile menu, or the mobile menu appears above the grain (losing the textured aesthetic).
**Why it happens:** Numeric z-index stacking without accounting for `pointer-events`.
**How to avoid:** Follow the z-index layer strategy documented above. The grain overlay at `z-50` with `pointer-events-none` lets interactions pass through to elements below it in z-index, while still rendering visually. The mobile menu at `z-[60]` and hamburger at `z-[70]` receive all events correctly.
**Warning signs:** Mobile menu links not clickable; or grain texture missing on mobile menu.

### Pitfall 8: Hydration Mismatch from Window/Document Access

**What goes wrong:** Server-rendered HTML does not match client hydration because components reference `window` or `document` during render.
**Why it happens:** `window.matchMedia`, `document.addEventListener`, and similar APIs do not exist during SSR.
**How to avoid:** All browser API access must be inside `useEffect` hooks. The custom cursor's event listeners and rAF loop must be initialized in `useEffect`, not during render. The `useScrolled` hook is safe because Motion's `useScroll` handles SSR gracefully.
**Warning signs:** Hydration mismatch warnings in the console.

## Code Examples

### Nav Links Configuration

```typescript
// lib/constants.ts
export const NAV_LINKS = [
  { label: 'WORK', href: '#work' },
  { label: 'SERVICES', href: '#services' },
  { label: 'PROCESS', href: '#process' },
  { label: 'CONTACT', href: '#contact' },
] as const

export const CURSOR_LERP_SPEED = 0.15
export const SCROLL_THRESHOLD = 50
```

### Desktop Nav Link with Gold Underline

```typescript
// components/layout/NavLink.tsx
import { cn } from '@/lib/utils'

interface NavLinkProps {
  href: string
  label: string
  className?: string
}

export function NavLink({ href, label, className }: NavLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'relative font-body text-sm uppercase tracking-widest text-cream',
        'transition-colors duration-300 hover:text-gold',
        'group',
        className
      )}
    >
      {label}
      <span
        className="
          absolute bottom-0 left-0 h-[1px] w-full
          bg-gold origin-left scale-x-0
          transition-transform duration-300 ease-luxury
          group-hover:scale-x-100
        "
      />
    </a>
  )
}
```

### Body Scroll Lock for Mobile Menu

```typescript
// Inside MobileMenu.tsx useEffect
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    // Apply inert to main content for accessibility
    const main = document.getElementById('main-content')
    if (main) main.setAttribute('inert', '')
  } else {
    document.body.style.overflow = ''
    const main = document.getElementById('main-content')
    if (main) main.removeAttribute('inert')
  }

  return () => {
    document.body.style.overflow = ''
    const main = document.getElementById('main-content')
    if (main) main.removeAttribute('inert')
  }
}, [isOpen])
```

### Layout Integration

```typescript
// app/layout.tsx modifications
import { SkipLink } from '@/components/layout/SkipLink'
import { Navbar } from '@/components/layout/Navbar'
import { CustomCursor } from '@/components/layout/CustomCursor'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${raleway.variable}`} suppressHydrationWarning>
      <body className="bg-void text-cream antialiased font-body">
        <SkipLink />
        <Providers>
          <Navbar />
          {children}
          <CustomCursor />
        </Providers>
        <GrainOverlay />
      </body>
    </html>
  )
}
```

### Cursor CSS with Pointer Media Query

```css
/* globals.css additions */

/* Hide default cursor on desktop when custom cursor is active */
@media (pointer: fine) {
  body {
    cursor: none;
  }

  a, button, [data-cursor] {
    cursor: none;
  }

  .custom-cursor {
    width: 8px;
    height: 8px;
    background-color: var(--color-gold);
    border-radius: 50%;
    margin-left: -4px;
    margin-top: -4px;
    transition: width 0.3s var(--ease-luxury),
                height 0.3s var(--ease-luxury),
                margin 0.3s var(--ease-luxury),
                background-color 0.3s var(--ease-luxury),
                border-color 0.3s var(--ease-luxury);
    will-change: transform;
  }

  .custom-cursor.cursor-expanded {
    width: 40px;
    height: 40px;
    background-color: transparent;
    border: 1.5px solid var(--color-gold);
    margin-left: -20px;
    margin-top: -20px;
  }
}

@media (pointer: coarse) {
  .custom-cursor {
    display: none;
  }
}

/* Skip link styles */
.skip-link:focus {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 9999;
  padding: 0.5rem 1rem;
  background-color: var(--color-void);
  color: var(--color-gold);
  border: 1px solid var(--color-gold);
  border-radius: 0.25rem;
  outline: none;
  font-family: var(--font-body);
  font-size: 0.875rem;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `window.addEventListener('scroll')` with throttle | Motion `useScroll` + `useMotionValueEvent` | Motion v10+ (2023) | Passive listeners, automatic cleanup, no React re-renders unless explicitly setState |
| `framer-motion` AnimatePresence | `motion/react` AnimatePresence with `m.*` | Motion v12 (late 2024) | Same API, new import path; `m` components required under LazyMotion strict |
| JS-based device detection (`navigator.maxTouchPoints`) | CSS `@media (pointer: fine/coarse)` | CSS Level 4 Spec (widely supported since 2020) | No JS, no hydration issues, responds to actual device capabilities not user agent |
| `focus-trap-react` library | Native HTML `inert` attribute | `inert` supported in all browsers since March 2023 | Zero dependency; native browser behavior; one attribute replaces entire library |
| GSAP for cursor animation | Raw rAF + lerp | Always available | GSAP adds 25kb+ for a single use case; rAF + lerp is <20 lines |

**Deprecated/outdated:**
- `useAnimation` from Framer Motion: replaced by `useAnimate` in Motion v12, though `useAnimation` still works
- `navigator.userAgent` touch detection: unreliable, replaced by pointer media queries
- `document.ontouchstart` detection: deprecated approach, CSS `@media (pointer)` is superior

## Open Questions

1. **Cursor "VIEW" text on image hover**
   - What we know: INTR-01 specifies showing "VIEW" text when hovering over images
   - What's unclear: This behavior is for the portfolio section (Phase 4), not Phase 2. Should the cursor component support this now or defer?
   - Recommendation: Build the cursor expansion mechanism now (dot -> ring on interactive elements). Add a `data-cursor="view"` attribute system that the cursor checks for, and style a text label inside the cursor div. But defer actually using `data-cursor="view"` on elements until Phase 4 when portfolio images exist.

2. **Exact hamburger line count**
   - What we know: NAV-02 says "2-line hamburger that animates to X"
   - What's unclear: Most hamburger icons use 3 lines; 2 lines is an intentional design choice
   - Recommendation: Implement as 2 lines (per the requirement). The top line and bottom line rotate to form the X. This is a clean, minimal design that fits the luxury aesthetic.

3. **Navigation link destinations**
   - What we know: Links are WORK, SERVICES, PROCESS, CONTACT
   - What's unclear: These are section anchors (`#work`, `#services`, etc.) not separate pages. The sections do not exist yet.
   - Recommendation: Use `href="#section-name"` for now. The links will resolve when sections are built in Phase 4. For Phase 2 testing, the links will simply not scroll anywhere meaningful.

4. **Navbar logo/brand mark**
   - What we know: The navbar needs some brand identifier on the left side
   - What's unclear: Whether to use text ("SATIN FABRICATION") or a logo mark
   - Recommendation: Use "SATIN" in Playfair Display with the gold accent for now, matching the existing page.tsx pattern. A logo asset can replace it later.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Manual verification (visual + interaction testing) |
| Config file | none |
| Quick run command | `npm run build` (verify build succeeds) |
| Full suite command | `npm run build && npm run dev` (build + visual verification) |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| NAV-01 | Navbar transparent at top, solid dark with backdrop-blur on scroll | manual | `npm run build` (no build errors) + visual scroll test | n/a manual |
| NAV-02 | Full-screen mobile menu with staggered fade-in, hamburger-to-X animation | manual | `npm run build` + resize to mobile + toggle menu | n/a manual |
| NAV-03 | Skip-to-content link visible on Tab, moves focus to main content | manual | Tab from address bar, verify focus moves to main | n/a manual |
| NAV-04 | Gold underline slides in from left on desktop nav link hover | manual | `npm run build` + hover each nav link on desktop | n/a manual |
| INTR-01 | Gold dot follows cursor with lag, expands to ring on interactive hover | manual | `npm run build` + move cursor over links/buttons on desktop | n/a manual |
| INTR-03 | Button gold glow, underline slide-in, form focus border transitions | manual | `npm run build` + interact with styled elements | n/a manual |

### Sampling Rate

- **Per task commit:** `npm run build` (must pass without errors)
- **Per wave merge:** `npm run build` + manual browser verification of all success criteria
- **Phase gate:** All 5 success criteria verified before marking Phase 2 complete

### Wave 0 Gaps

- No automated test framework is needed for Phase 2 (all requirements are visual/interactive)
- All validation is via build success + manual browser verification
- Future phases may introduce Playwright for visual regression testing

## Sources

### Primary (HIGH confidence)

- [Motion useScroll docs](https://motion.dev/docs/react-use-scroll) -- scroll position tracking, scrollY motion value
- [Motion useMotionValueEvent docs](https://motion.dev/docs/react-use-motion-value-event) -- event-based listener for motion values without re-renders
- [Motion AnimatePresence docs](https://motion.dev/docs/react-animate-presence) -- exit animations for conditional rendering
- [Motion stagger docs](https://motion.dev/docs/stagger) -- staggerChildren delay for cascading animations
- [Tailwind CSS v4 backdrop-filter-blur](https://tailwindcss.com/docs/backdrop-filter-blur) -- `backdrop-blur-md` (12px), `backdrop-blur-lg` (16px) utility classes
- [Next.js Accessibility docs](https://nextjs.org/docs/architecture/accessibility) -- route announcer, eslint-plugin-jsx-a11y included by default
- [14islands: Developing a Performant Custom Cursor](https://14islands.com/blog/developing-a-performant-custom-cursor) -- rAF + lerp pattern, idle cancellation, CSS variable approach
- [Frontend.fyi: Auto-hiding Sticky Navigation](https://www.frontend.fyi/tutorials/making-a-disappearing-sticky-navigation) -- `useScroll` + `useMotionValueEvent` navbar pattern with focus management

### Secondary (MEDIUM confidence)

- [DEV.to: Animate a Hamburger Menu with Framer Motion](https://dev.to/wiommi/animate-a-hamburger-menu-with-framer-motion-50ml) -- SVG path animation variants for 2-line hamburger-to-X; verified code patterns
- [DEV.to: Creating a Smooth Animated Menu with React and Motion](https://dev.to/netanelben/creating-a-smooth-animated-menu-with-react-and-framer-motion-2e69) -- stagger function usage, menu item variants
- [Smashing Magazine: Hover and Pointer Media Queries](https://www.smashingmagazine.com/2022/03/guide-hover-pointer-media-queries/) -- `@media (pointer: fine)` for desktop-only cursor
- [MDN: inert attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert) -- native focus trap alternative, supported in all modern browsers

### Tertiary (LOW confidence)

- [FreeCodeCamp: Animated Hamburger Menu in React](https://www.freecodecamp.org/news/how-to-create-an-animated-hamburger-menu-in-react/) -- general patterns, not Motion-specific

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- zero new dependencies; all features use Motion (already installed) and CSS
- Architecture: HIGH -- patterns verified against Motion official docs and multiple tutorial implementations; z-index strategy tested against existing grain overlay
- Pitfalls: HIGH -- custom cursor performance issue is well-documented; scroll event handling is a known React performance trap; AnimatePresence gotchas are documented in Motion official docs
- Custom cursor: MEDIUM -- lerp speed constant (0.15) and expansion size (40px) may need visual tuning during implementation

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (stable stack; 30-day window appropriate)
