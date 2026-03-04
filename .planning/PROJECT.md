# Satin Fabrication Website

## What This Is

A premium, production-ready website for Satin Fabrication — a real custom metal fabrication company serving high-end residential clients in Southern Ontario. The site must communicate craftsmanship, precision, and luxury through dark editorial aesthetics, intentional typography, and polished motion design. Think $20,000 agency build, not template.

## Core Value

The website must instantly convey that Satin Fabrication is a premium, trustworthy craftsman — every visitor should feel the quality before reading a word.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Homepage with hero, services, portfolio, process, testimonial, and contact sections
- [ ] Dedicated services page expanding on each offering
- [ ] Dark luxury editorial aesthetic (matte black, charcoal, brushed gold accents)
- [ ] Playfair Display + Raleway typography pairing
- [ ] Scroll-triggered animations via Framer Motion
- [ ] Custom cursor with contextual states (desktop)
- [ ] Before/after slider for featured project
- [ ] Masonry portfolio gallery with hover overlays
- [ ] Animated process timeline
- [ ] Quote request form with client-side validation and success state
- [ ] Email integration for form submissions (follow-up phase)
- [ ] Fixed navbar with transparent-to-solid scroll transition
- [ ] Full-screen mobile navigation overlay
- [ ] Subtle grain/noise texture overlay across entire site
- [ ] SEO: semantic HTML, meta tags, Open Graph, JSON-LD structured data
- [ ] Performance: Next.js Image, self-hosted fonts, minimal bundle
- [ ] Accessibility: ARIA labels, focus styles, reduced motion support
- [ ] Mobile-first responsive design that feels equally premium
- [ ] Vercel deployment ready

### Out of Scope

- Individual portfolio project detail pages — homepage gallery is sufficient for v1
- About/team page — not needed for launch
- Blog/content management — no CMS integration
- E-commerce or payments — not applicable
- Backend API — form email integration is the only server-side need (deferred)
- Multi-language support — English only

## Context

- Real operating business with existing logo/branding and business details (address, phone, email, service area)
- Project photos and testimonials not yet available — use curated Unsplash placeholders with consistent dark/metalwork tone
- Real content will be swapped in before launch (not shipping with placeholders)
- Owner wants the site structure and polish locked in first, content integrated after
- Southern Ontario service area — SEO should target this region
- Deploying to Vercel (natural fit for Next.js)
- Domain not yet purchased

## Constraints

- **Tech stack**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion — non-negotiable per brief
- **Aesthetic**: Dark luxury editorial only — no generic AI aesthetics, no template energy, no purple-blue schemes
- **Gold usage**: Accent only — borders, hovers, small highlights. Never backgrounds or large fills
- **Motion**: Smooth cubic-bezier easing only — no spring physics, no bouncing. Think luxury car commercial
- **Content**: Placeholder-ready architecture — real assets swap in without code changes
- **Performance**: Must pass Core Web Vitals on Vercel deployment

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single-page homepage + services sub-page | Keeps v1 focused while allowing service detail depth | — Pending |
| Playfair Display + Raleway font pairing | Editorial luxury feel, proven pairing for high-end brands | — Pending |
| Framer Motion over CSS-only animations | Complex scroll-triggered and path animations needed (process timeline, parallax) | — Pending |
| Form UI now, email integration later | Ship structure fast, hook up Resend/SendGrid as follow-up | — Pending |
| Unsplash placeholders with swap-ready architecture | Real photos not yet available, owner wants structure locked first | — Pending |
| Vercel deployment | Native Next.js support, free tier, edge functions for future form API | — Pending |

---
*Last updated: 2026-03-03 after initialization*
