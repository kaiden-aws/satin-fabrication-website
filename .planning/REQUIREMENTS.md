# Requirements: Satin Fabrication Website

**Defined:** 2026-03-03
**Core Value:** The website must instantly convey that Satin Fabrication is a premium, trustworthy craftsman — every visitor should feel the quality before reading a word.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Design System

- [ ] **DSGN-01**: Site uses dark luxury aesthetic — matte black (#0A0A0A), charcoal (#1A1A1A), brushed gold accent (#C9A96E), off-white text (#F5F0EB), warm gray secondary (#8A8278)
- [ ] **DSGN-02**: Playfair Display (serif headings) + Raleway (sans-serif body/UI) typography pairing loaded via next/font (self-hosted, display: swap)
- [ ] **DSGN-03**: Subtle grain/noise texture overlay across entire site using static PNG at 3-5% opacity via CSS pseudo-element
- [ ] **DSGN-04**: Scroll-triggered reveal animations with Framer Motion — fade in + translateY 30px, duration 0.7s, cubic-bezier easing [0.25, 0.1, 0.25, 1], children staggered 0.1-0.15s
- [ ] **DSGN-05**: Reduced motion support via MotionConfig reducedMotion="user" for AODA compliance
- [ ] **DSGN-06**: CSS design tokens for palette, spacing, typography scale, and luxury easing curve — enforced through Tailwind theme

### Navigation

- [ ] **NAV-01**: Fixed/sticky navbar that is transparent over hero, transitions to solid dark (#0A0A0A with backdrop-blur) on scroll
- [ ] **NAV-02**: Full-screen mobile menu overlay with large centered nav links, staggered fade-in animation, and 2-line hamburger that animates to X
- [ ] **NAV-03**: Skip-to-content accessibility link for keyboard navigation
- [ ] **NAV-04**: Desktop nav links (WORK, SERVICES, PROCESS, CONTACT) with gold underline that animates in from left on hover

### Hero

- [ ] **HERO-01**: Full-viewport (100vh) hero with dark cinematic background — video placeholder or looping dark gradient animation fallback with 60% black overlay
- [ ] **HERO-02**: Staggered text entrance animation — "SATIN FABRICATION" in Playfair 7xl-8xl with gold accent on "SATIN", tagline in Raleway uppercase
- [ ] **HERO-03**: Gold-outlined CTA button ("VIEW OUR WORK") with smooth gold fill on hover transition
- [ ] **HERO-04**: Animated scroll indicator at bottom (pulsing thin line or chevron)

### Services

- [ ] **SRVC-01**: 4 service cards in 2x2 grid (single column mobile): Railings & Staircases, Gates & Fencing, Custom Furniture & Fixtures, Fireplace Surrounds & Features
- [ ] **SRVC-02**: Each card has dark background (#111111), subtle gold border, placeholder image (16:10), Playfair title, Raleway description, gold "Learn More →" link — staggered scroll reveal
- [ ] **SRVC-03**: Card hover state: border brightens to full gold opacity, image scales to 1.03x with overflow hidden
- [ ] **SRVC-04**: Dedicated /services sub-page with expanded detail for each service offering

### Portfolio

- [ ] **PORT-01**: Masonry-style grid gallery — 3 columns desktop, 2 tablet, 1 mobile — showing 8-10 project images
- [ ] **PORT-02**: Image hover overlay showing project name and category in elegant typography with smooth fade-in
- [ ] **PORT-03**: Scroll-driven exploded-to-assembled animation — scattered metalwork parts converge into finished product as user scrolls through section, using Framer Motion useScroll + useTransform
- [ ] **PORT-04**: Curated Unsplash metalwork placeholder images with consistent dark tone (metal stairs, gates, fireplaces, railings, architectural details)

### Process

- [ ] **PROC-01**: 5-step horizontal timeline on desktop (vertical on mobile): Consultation, Design, Material Selection, Fabrication, Installation
- [ ] **PROC-02**: Steps appear sequentially on scroll with animated connecting gold line using Framer Motion pathLength
- [ ] **PROC-03**: Large step numbers (01-05) in Playfair Display 6xl with low-opacity gold behind text

### Contact

- [ ] **CNTC-01**: Split layout — "LET'S CREATE SOMETHING EXTRAORDINARY" headline left, quote request form right
- [ ] **CNTC-02**: Form fields: Name (text), Email (email), Phone (tel), Project Type (select: Railings & Staircases, Gates & Fencing, Custom Furniture & Fixtures, Fireplace Surrounds, Other), Project Description (textarea)
- [ ] **CNTC-03**: Transparent input backgrounds with bottom-border only (gold at low opacity), off-white text, focus state animates border to full gold
- [ ] **CNTC-04**: Client-side validation using Zod schema + react-hook-form
- [ ] **CNTC-05**: Success state animation on form submit (frontend only, no backend)

### Interactive

- [ ] **INTR-01**: Custom cursor (desktop only) — small gold dot (8px) following mouse with slight lag (lerp via requestAnimationFrame), expands to 40px gold ring on interactive elements, shows "VIEW" text on image hover
- [ ] **INTR-02**: Parallax effects — hero background at 0.5x scroll speed, portfolio images at 0.9x, using Framer Motion useScroll + useTransform
- [ ] **INTR-03**: Micro-interactions — button gold glow (box-shadow), link underline slides in from left (scaleX + transform-origin), form focus border transitions

### Footer

- [ ] **FOOT-01**: Company name, tagline, copyright, and "Proudly serving Southern Ontario's finest homes" text
- [ ] **FOOT-02**: Social media icon links (Instagram, Facebook, LinkedIn) — small, gold on hover
- [ ] **FOOT-03**: Smooth scroll back-to-top link
- [ ] **FOOT-04**: Phone number and email prominently visible

### SEO & Performance

- [ ] **SEO-01**: Semantic HTML5 structure — proper header, main, section, footer, nav, article elements with single H1 per page and logical heading hierarchy
- [ ] **SEO-02**: Page title "Satin Fabrication | Custom Architectural Metalwork — Southern Ontario" and meta description
- [ ] **SEO-03**: Open Graph tags (title, description, image, type) and Twitter Card meta tags
- [ ] **SEO-04**: JSON-LD structured data — LocalBusiness/HomeAndConstructionBusiness schema with services array, areaServed: Southern Ontario (deploy when NAP confirmed)
- [ ] **SEO-05**: Core Web Vitals compliance — next/image for all images, lazy loading, font display swap, explicit dimensions, minimal Framer Motion bundle via LazyMotion
- [ ] **SEO-06**: ARIA labels on interactive elements, focus-visible gold ring styles, alt text on all images, color contrast WCAG AAA compliance

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Content Integration

- **CONT-01**: Email integration for form submissions (Resend or SendGrid via Next.js Server Action)
- **CONT-02**: Real project photography replacing Unsplash placeholders
- **CONT-03**: Real client testimonials replacing placeholder quotes
- **CONT-04**: Testimonial/social proof section on homepage (large quote, attribution, parallax background)

### Enhanced Features

- **ENHC-01**: Individual portfolio project detail pages with multiple photos and descriptions
- **ENHC-02**: Google Analytics or Plausible analytics integration
- **ENHC-03**: Service-specific SEO landing pages (e.g., "Custom Metal Railings Toronto")

### Infrastructure

- **INFR-01**: Headless CMS integration (Sanity or Contentful) for content management
- **INFR-02**: Google Business Profile / Houzz integration

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| E-commerce / online payments | High-trust custom fabrication sold through conversation, not checkout flows |
| Live chat widget | Third-party script weight + expectation of instant response a small shop can't sustain |
| Social media feed embeds | JS weight, layout shift, freshness depends on posting discipline |
| Appointment booking / calendar | Overkill for high-touch business where initial consult requires qualifying scope first |
| Client portal / project tracker | Full application build — out of scope for marketing website |
| Multi-language support | Southern Ontario metalwork clients operate in English |
| Blog / CMS for v1 | Content rarely gets produced; kills launch velocity. Add CMS only if content production actually happens |
| About/team page | Not needed for launch — credibility established through portfolio and process sections |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| — | — | Populated during roadmap creation |

**Coverage:**
- v1 requirements: 37 total
- Mapped to phases: 0
- Unmapped: 37 ⚠️

---
*Requirements defined: 2026-03-03*
*Last updated: 2026-03-03 after initial definition*
