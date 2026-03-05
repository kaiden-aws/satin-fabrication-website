# Phase 5: Services Page and SEO - Research

**Researched:** 2026-03-05
**Domain:** Next.js 16 multi-page routing, SEO metadata, Open Graph, JSON-LD structured data, accessibility (WCAG AAA)
**Confidence:** HIGH

## Summary

Phase 5 adds the second (and final) page to the site -- a dedicated `/services` route with expanded detail for each of the four service offerings -- and wires up complete SEO coverage across both pages. The SEO work spans four distinct concerns: (1) page-level metadata via Next.js Metadata API, (2) Open Graph and Twitter Card social sharing tags, (3) JSON-LD structured data for Google Rich Results, and (4) accessibility hardening to achieve Lighthouse 95+.

The project already runs Next.js 16.1.6 with App Router, so per-page metadata is accomplished through static `metadata` exports in each `page.tsx` -- no `generateMetadata` needed since content is static. JSON-LD is injected via a `<script type="application/ld+json">` tag directly in page components (the official Next.js pattern). Open Graph images can be generated dynamically using the `opengraph-image.tsx` file convention with `ImageResponse` from `next/og`, producing branded dark-luxury images without requiring static files.

The JSON-LD structured data for LocalBusiness / HomeAndConstructionBusiness is gated on confirmed NAP (Name, Address, Phone) details from the site owner, per the project blocker documented in STATE.md. The component and data structure should be built with placeholder values, but must not deploy to production with fake business details.

**Primary recommendation:** Use Next.js static `metadata` exports for per-page SEO, `opengraph-image.tsx` file convention for dynamic OG images, and a reusable `JsonLd` component for structured data injection. Build the /services page as `src/app/services/page.tsx` reusing the existing `SERVICES` data from constants.ts with expanded content.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SRVC-04 | Dedicated /services sub-page with expanded detail for each service offering | App Router file-based routing (`src/app/services/page.tsx`), reuse SERVICES constant data extended with expanded descriptions, reuse MotionWrapper/design patterns |
| SEO-01 | Semantic HTML5 structure -- proper header, main, section, footer, nav, article elements with single H1 per page and logical heading hierarchy | Audit existing components for semantic correctness; ensure /services page uses `<main>`, `<section>`, single `<h1>`, logical `h2`/`h3` nesting |
| SEO-02 | Page title "Satin Fabrication \| Custom Architectural Metalwork -- Southern Ontario" and meta description | Next.js `metadata` export in root layout and per-page overrides; use `title.template` in layout for consistency |
| SEO-03 | Open Graph tags (title, description, image, type) and Twitter Card meta tags | `openGraph` and `twitter` fields in metadata exports; `opengraph-image.tsx` file convention for branded OG images |
| SEO-04 | JSON-LD structured data -- LocalBusiness/HomeAndConstructionBusiness schema with services array, areaServed: Southern Ontario | `<script type="application/ld+json">` in page component per Next.js guide; gated on confirmed NAP from owner |
| SEO-05 | Core Web Vitals compliance -- next/image for all images, lazy loading, font display swap, explicit dimensions, minimal Framer Motion bundle via LazyMotion | Already using next/image, LazyMotion + domAnimation; audit all images for explicit width/height and priority props on above-fold images |
| SEO-06 | ARIA labels on interactive elements, focus-visible gold ring styles, alt text on all images, color contrast WCAG AAA compliance | Add focus-visible ring utility class, audit all interactive elements for aria-label, verify contrast ratios (see pitfalls section for specific findings) |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | App Router, Metadata API, file-based OG images | Already installed; metadata exports are the official SEO pattern |
| next/og (ImageResponse) | built-in | Dynamic OG image generation | Ships with Next.js; uses satori + resvg; no extra deps |
| schema-dts | latest | TypeScript types for JSON-LD structured data | Community-recommended by Next.js docs for type-safe JSON-LD |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| motion | 12.35.0 | Scroll-triggered animations on services page | Already installed; use m.* via LazyMotion for service detail reveals |
| lucide-react | 0.577.0 | Icons for service detail features | Already installed; can use for feature list icons on services page |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| schema-dts | Manual typing | schema-dts provides 400+ schema.org types with full IntelliSense; manual typing risks missing required fields |
| opengraph-image.tsx (ImageResponse) | Static PNG file in /public | Dynamic generation ensures OG image always matches page content; static PNG requires manual updates |
| next-seo (npm package) | Built-in metadata API | next-seo was useful in Pages Router era; App Router metadata API covers all use cases natively -- no third-party needed |

**Installation:**
```bash
npm install schema-dts
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  app/
    layout.tsx               # Root metadata with title.template, OG defaults, metadataBase
    page.tsx                  # Homepage with JSON-LD script tag
    opengraph-image.tsx       # Root OG image (shared unless overridden)
    twitter-image.tsx         # Root Twitter card image (can reuse OG)
    robots.ts                 # robots.txt via file convention
    sitemap.ts                # sitemap.xml via file convention
    services/
      page.tsx                # /services page with own metadata + JSON-LD
      opengraph-image.tsx     # (optional) Services-specific OG image
  lib/
    constants.ts             # Extended SERVICES data with expanded descriptions
    metadata.ts              # Shared metadata constants (company name, description, etc.)
    jsonld.ts                # JSON-LD builder functions for LocalBusiness schema
```

### Pattern 1: Root Layout Metadata with Title Template
**What:** Define shared metadata in root layout with `title.template` so child pages automatically get consistent formatting
**When to use:** Multi-page sites where every page should share a brand suffix
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// src/app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://satinfabrication.com'), // update when domain confirmed
  title: {
    default: 'Satin Fabrication | Custom Architectural Metalwork — Southern Ontario',
    template: '%s | Satin Fabrication',
  },
  description: "Premium custom metal fabrication for Southern Ontario's finest homes. Railings, gates, furniture, and fireplace surrounds crafted to perfection.",
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'Satin Fabrication',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
}
```

### Pattern 2: Per-Page Metadata Override
**What:** Each page.tsx exports its own metadata that merges with (or overrides) the root layout
**When to use:** Every page that needs unique title/description
**Example:**
```typescript
// src/app/services/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services', // Renders as "Services | Satin Fabrication" via template
  description: 'Custom railings, gates, furniture, and fireplace surrounds. Explore our full range of architectural metalwork services for Southern Ontario homes.',
  openGraph: {
    title: 'Our Services | Satin Fabrication',
    description: 'Custom railings, gates, furniture, and fireplace surrounds.',
  },
}
```

### Pattern 3: JSON-LD as Script Tag in Page Component
**What:** Render JSON-LD structured data as a `<script type="application/ld+json">` tag inside the page component (NOT in `<head>`, NOT via metadata API)
**When to use:** Every page that needs structured data for Google Rich Results
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/guides/json-ld
import type { WithContext, HomeAndConstructionBusiness } from 'schema-dts'

const jsonLd: WithContext<HomeAndConstructionBusiness> = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: 'Satin Fabrication',
  description: "Premium custom metal fabrication for Southern Ontario's finest homes.",
  url: 'https://satinfabrication.com',
  telephone: '+1-555-123-4567',       // PLACEHOLDER — replace with confirmed NAP
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Main Street',  // PLACEHOLDER
    addressLocality: 'Hamilton',       // PLACEHOLDER
    addressRegion: 'ON',
    addressCountry: 'CA',
    postalCode: 'L8P 1A1',           // PLACEHOLDER
  },
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Southern Ontario',
  },
  makesOffer: [
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Railings & Staircases',
        description: 'Custom railings and staircases...',
      },
    },
    // ... repeat for each service
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <main id="main-content">
        {/* sections */}
      </main>
    </>
  )
}
```

### Pattern 4: Dynamic OG Image with ImageResponse
**What:** Generate a branded OG image at build time using JSX + CSS via the `opengraph-image.tsx` file convention
**When to use:** Every route that needs a social sharing preview image
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A0A0A',
          color: '#F5F0EB',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 72, color: '#C9A96E' }}>SATIN</div>
        <div style={{ fontSize: 72 }}>FABRICATION</div>
        <div
          style={{
            fontSize: 24,
            marginTop: 20,
            letterSpacing: '0.2em',
            color: '#8A8278',
          }}
        >
          CUSTOM ARCHITECTURAL METALWORK
        </div>
        <div
          style={{
            width: 100,
            height: 2,
            backgroundColor: '#C9A96E',
            marginTop: 30,
          }}
        />
      </div>
    ),
  )
}
```

### Pattern 5: Services Page Content Architecture
**What:** Extend the SERVICES constant with expanded detail data, build the /services page as a single-scroll layout with full-width sections per service
**When to use:** The /services page
**Example:**
```typescript
// src/lib/constants.ts — extended service data
export const SERVICES_EXPANDED = [
  {
    id: 'railings-staircases',
    title: 'Railings & Staircases',
    tagline: 'Elevate every level of your home',
    description: 'Elegant custom railings and staircases...',
    features: [
      'Spiral and straight configurations',
      'Glass, cable, and traditional balusters',
      'Interior and exterior applications',
      'Code-compliant engineering',
    ],
    image: 'https://images.unsplash.com/...?w=1200&h=800&fit=crop&q=80',
    imageAlt: 'Custom metal staircase railing with glass panels in a modern home',
  },
  // ... repeat for each service
] as const
```

### Anti-Patterns to Avoid
- **Duplicating OG fields from top-level metadata:** Open Graph and Twitter fields do NOT auto-inherit from top-level `title`/`description` -- they must be explicitly set in the `openGraph` and `twitter` objects
- **Using `motion.*` instead of `m.*`:** The project uses LazyMotion strict mode which will throw at runtime if `motion.div` is used instead of `m.div`
- **Putting JSON-LD in the metadata export:** Next.js metadata API does not support JSON-LD -- it must go in the component JSX as a `<script>` tag
- **Lazy loading above-fold images:** The hero and first visible service images must use `priority` prop on `next/image` to avoid hurting LCP
- **Deploying JSON-LD with placeholder NAP:** Per STATE.md blocker, structured data must not ship with fake business details

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Meta tags | Manual `<meta>` tags in `<head>` | Next.js `metadata` export | App Router automatically generates correct `<head>` tags with deduplication and merging |
| OG images | Static PNG in /public | `opengraph-image.tsx` with `ImageResponse` | Dynamic generation ensures brand consistency; auto-generates correct meta tags |
| JSON-LD typing | Manual TypeScript interfaces | `schema-dts` package | 400+ schema.org types with full property validation; prevents invalid structured data |
| Sitemap | Manual sitemap.xml | `sitemap.ts` file convention | Next.js auto-generates from route tree; stays in sync with pages |
| Robots.txt | Manual robots.txt | `robots.ts` file convention | Type-safe, co-located with app code, auto-served at /robots.txt |
| Focus ring styles | Per-element focus CSS | Tailwind `focus-visible:ring-2 focus-visible:ring-gold` utility | Consistent across all interactive elements; respects focus-visible heuristic |

**Key insight:** Next.js 16 App Router has built-in solutions for every SEO concern in this phase. No third-party SEO libraries are needed.

## Common Pitfalls

### Pitfall 1: OpenGraph Fields Don't Inherit from Top-Level Metadata
**What goes wrong:** Developer sets `title` and `description` at the top level of the metadata object and assumes OG tags will use the same values. They don't -- social sharing previews show no title or description.
**Why it happens:** The `openGraph` object is a separate namespace in the metadata API. It does NOT auto-copy from top-level fields.
**How to avoid:** Always explicitly set `openGraph.title`, `openGraph.description`, and `openGraph.images` in the metadata export.
**Warning signs:** Blank preview when pasting URL into LinkedIn/Twitter/Facebook.

### Pitfall 2: warm-gray (#8A8278) Text Fails WCAG AAA on Dark Backgrounds
**What goes wrong:** The warm-gray secondary text color has a contrast ratio of 5.23:1 against void (#0A0A0A) and 4.99:1 against surface (#111111). This passes WCAG AA (4.5:1) for normal text but FAILS WCAG AAA (7:1) for normal text.
**Why it happens:** The requirement (SEO-06) calls for "WCAG AAA compliance." Warm-gray at normal text sizes does not meet this standard.
**How to avoid:** Use warm-gray ONLY for large text (18px+ or 14px+ bold) where AAA threshold is 4.5:1. For normal-size secondary text, use cream (#F5F0EB) or gold (#C9A96E) which both pass AAA. Alternatively, lighten warm-gray for body text contexts (e.g., #A09A90 would get closer to 7:1).
**Warning signs:** Lighthouse accessibility audit flagging contrast failures on small gray text.

**Full contrast ratio matrix (calculated):**
| Color Pair | Ratio | AA Normal | AA Large | AAA Normal | AAA Large |
|------------|-------|-----------|----------|------------|-----------|
| gold (#C9A96E) on void (#0A0A0A) | 8.85:1 | PASS | PASS | PASS | PASS |
| cream (#F5F0EB) on void (#0A0A0A) | 17.48:1 | PASS | PASS | PASS | PASS |
| warm-gray (#8A8278) on void (#0A0A0A) | 5.23:1 | PASS | PASS | FAIL | PASS |
| gold-dim (#8A7544) on void (#0A0A0A) | 4.44:1 | FAIL | PASS | FAIL | FAIL |
| gold-light (#D4B87A) on void (#0A0A0A) | 10.31:1 | PASS | PASS | PASS | PASS |
| cream (#F5F0EB) on charcoal (#1A1A1A) | 15.37:1 | PASS | PASS | PASS | PASS |
| gold (#C9A96E) on surface (#111111) | 8.44:1 | PASS | PASS | PASS | PASS |
| warm-gray (#8A8278) on surface (#111111) | 4.99:1 | PASS | PASS | FAIL | PASS |

### Pitfall 3: gold-dim (#8A7544) Fails Even WCAG AA
**What goes wrong:** The gold-dim color used for subtle borders (e.g., `border-gold-dim/30`) has a 4.44:1 ratio against void. If used for text, it fails AA.
**Why it happens:** gold-dim was designed for decorative borders, not text.
**How to avoid:** Never use gold-dim for text content. It is acceptable for decorative borders only (which are not subject to contrast requirements).
**Warning signs:** Any text-gold-dim usage in TSX files.

### Pitfall 4: Missing alt Text on Decorative vs Content Images
**What goes wrong:** Lighthouse flags missing alt text, but some images (grain overlay, gradient backgrounds) are decorative and should have `alt=""` with `aria-hidden="true"`, not descriptive alt text.
**Why it happens:** Confusion between decorative and informational images.
**How to avoid:** Content images (portfolio, service photos) get descriptive alt text. Decorative images get `alt=""` and `aria-hidden="true"`. The existing codebase already handles this correctly for the gradient background (`aria-hidden="true"`).
**Warning signs:** Lighthouse alt-text warnings on decorative elements.

### Pitfall 5: LCP Image Gets Lazy-Loaded
**What goes wrong:** The above-fold hero or first service image uses default `loading="lazy"` behavior, delaying the Largest Contentful Paint.
**Why it happens:** next/image defaults to lazy loading. Developers forget to add `priority` to above-fold images.
**How to avoid:** Add `priority` prop to the first visible image on each page (hero section images, first service image on /services page).
**Warning signs:** Lighthouse flagging "Largest Contentful Paint image was lazily loaded."

### Pitfall 6: JSON-LD Deployed with Placeholder NAP
**What goes wrong:** Google Rich Results Test returns errors or misleading business information because structured data contains fake address/phone.
**Why it happens:** Developer forgets the deployment gate documented in STATE.md.
**How to avoid:** Build JSON-LD with clearly marked PLACEHOLDER values. Add a code comment and STATE.md cross-reference. The JSON-LD script should be conditionally rendered or wrapped in a feature flag that defaults to off until NAP is confirmed.
**Warning signs:** Google Search Console structured data errors after deployment.

### Pitfall 7: Navbar Navigation Links Break on /services Page
**What goes wrong:** NAV_LINKS use anchor hrefs (#work, #services, etc.) which work on the homepage but break on the /services page because those sections don't exist there.
**Why it happens:** Single-page anchor navigation doesn't work across pages.
**How to avoid:** Update NAV_LINKS to use absolute paths (`/#work`, `/#services`, `/#process`, `/#contact`) which will navigate back to the homepage and then scroll to the section. Alternatively, update SERVICES href to `/services` for the dedicated page.
**Warning signs:** Clicking nav links on /services page does nothing or jumps to wrong position.

### Pitfall 8: Missing focus-visible Styles on Custom Interactive Elements
**What goes wrong:** Custom cursor button clicks, form inputs, and service card links lack visible keyboard focus indicators, dropping Lighthouse accessibility score.
**Why it happens:** Custom styling overrides browser default focus rings without providing alternatives.
**How to avoid:** Add a consistent `focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-void` utility to all interactive elements (links, buttons, inputs, selects).
**Warning signs:** Tabbing through the page with keyboard shows no visible focus indicator.

## Code Examples

Verified patterns from official sources:

### robots.ts File Convention
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
// src/app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://satinfabrication.com/sitemap.xml',
  }
}
```

### sitemap.ts File Convention
```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://satinfabrication.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://satinfabrication.com/services',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
```

### Focus-Visible Gold Ring Utility
```css
/* Add to globals.css */
/* Focus-visible gold ring for keyboard navigation — SEO-06 */
.focus-gold {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-void;
}
```

### Semantic HTML5 Page Structure
```tsx
// Correct semantic structure for /services page
export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{...}} />
      <main id="main-content">
        <section aria-labelledby="services-heading">
          <h1 id="services-heading">Our Services</h1>
          {/* Service detail sections */}
          {SERVICES_EXPANDED.map((service) => (
            <section key={service.id} aria-labelledby={`service-${service.id}`}>
              <h2 id={`service-${service.id}`}>{service.title}</h2>
              {/* content */}
            </section>
          ))}
        </section>
      </main>
    </>
  )
}
```

### Updated NAV_LINKS for Multi-Page Navigation
```typescript
// src/lib/constants.ts — updated for multi-page support
export const NAV_LINKS = [
  { label: 'WORK', href: '/#work' },
  { label: 'SERVICES', href: '/services' },
  { label: 'PROCESS', href: '/#process' },
  { label: 'CONTACT', href: '/#contact' },
] as const
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| next-seo package | Built-in metadata API | Next.js 13.2+ (2023) | No third-party dep needed; type-safe metadata |
| Manual `<Head>` component | metadata export in page.tsx | Next.js 13+ App Router | Automatic `<head>` tag generation with merging |
| Static OG image files | `opengraph-image.tsx` with ImageResponse | Next.js 13.3+ | Dynamic branded images, auto-correct meta tags |
| next/head for viewport | generateViewport export | Next.js 14+ | viewport and themeColor split from metadata |
| motion.div components | m.div with LazyMotion | motion 11+ | 30KB smaller initial bundle |

**Deprecated/outdated:**
- `viewport` and `themeColor` in metadata object: Deprecated since Next.js 14; use `generateViewport` instead
- `colorScheme` in metadata: Deprecated since Next.js 14
- `next-seo` package: Unnecessary with App Router metadata API; adds bundle weight for no benefit

## Open Questions

1. **metadataBase URL**
   - What we know: The domain is not yet purchased (documented in PROJECT.md)
   - What's unclear: The exact production URL for metadataBase
   - Recommendation: Use `https://satinfabrication.com` as a placeholder in metadataBase; update when domain is confirmed. OG images will use relative paths that compose with metadataBase.

2. **OG Image Font Loading**
   - What we know: ImageResponse supports custom fonts but has a 500KB bundle limit
   - What's unclear: Whether Playfair Display can be loaded in the OG image generator within the bundle limit
   - Recommendation: Try loading Playfair Display as a font file in the OG image generator. If bundle limit is exceeded, fall back to system serif font. The dark luxury aesthetic is conveyed primarily through the color scheme, which works with any serif.

3. **JSON-LD Conditional Rendering**
   - What we know: NAP details are not confirmed; JSON-LD must not deploy with placeholders
   - What's unclear: When NAP will be confirmed; whether to use env vars, feature flag, or simply commented code
   - Recommendation: Build the JSON-LD data structure with clearly marked PLACEHOLDER comments. Use an environment variable (e.g., `NEXT_PUBLIC_ENABLE_JSONLD=true`) to conditionally render the script tag. Default to disabled.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed |
| Config file | None -- see Wave 0 |
| Quick run command | `npx next build` (type checking + build validation) |
| Full suite command | `npx next build && npx lighthouse http://localhost:3000 --only-categories=accessibility,seo --output=json` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SRVC-04 | /services page renders 4 expanded service sections | manual | `npx next build` (build succeeds) | N/A |
| SEO-01 | Semantic HTML5 structure with single H1 per page | manual | Lighthouse accessibility audit | N/A |
| SEO-02 | Page title and meta description present | manual | `curl -s http://localhost:3000 \| grep '<title>'` | N/A |
| SEO-03 | OG and Twitter Card tags in page source | manual | `curl -s http://localhost:3000 \| grep 'og:title'` | N/A |
| SEO-04 | JSON-LD validates in Rich Results Test | manual-only | Google Rich Results Test (external tool) | N/A |
| SEO-05 | Core Web Vitals pass (images, fonts, bundle) | manual | Lighthouse performance audit | N/A |
| SEO-06 | Lighthouse accessibility >= 95 | manual | `npx lighthouse http://localhost:3000 --only-categories=accessibility` | N/A |

### Sampling Rate
- **Per task commit:** `npx next build` (ensures no TypeScript errors or build failures)
- **Per wave merge:** `npx next build` + manual Lighthouse check
- **Phase gate:** Full Lighthouse audit on both / and /services pages

### Wave 0 Gaps
- No test framework is installed (jest/vitest) -- however, for this phase the primary validation is `next build` success, Lighthouse audits, and manual verification of meta tags in page source. A formal test framework is not required for Phase 5's SEO/page-building work.
- Lighthouse CLI (`npx lighthouse`) is available without installation for manual audits.

## Sources

### Primary (HIGH confidence)
- [Next.js 16.1.6 Metadata and OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) -- static metadata, generateMetadata, file-based OG images, streaming metadata
- [Next.js generateMetadata API Reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) -- full metadata fields reference, title templates, openGraph, twitter, robots, metadataBase
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) -- official script tag pattern, schema-dts typing, XSS prevention
- [Next.js opengraph-image File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) -- ImageResponse usage, size, contentType exports
- [Schema.org HomeAndConstructionBusiness](https://schema.org/HomeAndConstructionBusiness) -- parent types, properties, service description pattern
- [Google LocalBusiness Structured Data](https://developers.google.com/search/docs/appearance/structured-data/local-business) -- required/recommended properties, validation with Rich Results Test

### Secondary (MEDIUM confidence)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) -- WCAG AAA requires 7:1 normal text, 4.5:1 large text; contrast calculations verified via manual computation
- [Chrome Lighthouse Accessibility Scoring](https://developer.chrome.com/docs/lighthouse/accessibility/scoring) -- weighted audit scoring, common failure categories
- [Motion LazyMotion docs](https://motion.dev/docs/react-lazy-motion) -- domAnimation reduces bundle to 4.6kb initial; already configured in project

### Tertiary (LOW confidence)
- None -- all findings verified against primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed except schema-dts; Next.js metadata API is stable and well-documented
- Architecture: HIGH -- patterns directly from official Next.js 16.1.6 documentation (version-matched to project)
- Pitfalls: HIGH -- contrast ratios computed mathematically; navigation issue identified from codebase analysis; all others from official best practices

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (stable domain; Next.js metadata API is mature)
