# Feature Research

**Domain:** Premium custom metal fabrication company website — luxury residential, Southern Ontario
**Researched:** 2026-03-03
**Confidence:** HIGH (table stakes confirmed across multiple competitor sites and industry sources; differentiators confirmed via Awwwards patterns and luxury trades best practices)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features high-end residential clients assume exist. Missing these signals an amateur operation and immediately erodes trust.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero section with strong value proposition | Every premium service site opens with a commanding first impression; no hero = no brand identity | LOW | Full-viewport, dark overlay on metalwork imagery, single focused headline |
| Services overview with clear scope | Visitors need to confirm they've found the right company within 10 seconds | LOW | Descriptive cards or sections per service (railings, stairs, gates, etc.) |
| Portfolio / project gallery | Metalwork is visual — clients must see proof of quality before contacting | MEDIUM | Masonry grid with hover overlays; filterable by project type is a plus |
| Contact / quote request form | Primary conversion action; the site exists to generate inquiries | LOW | Name, project type, message, location — no more than 5 fields |
| Phone number and email visible in header/footer | Trades clients often prefer calling; omitting phone number is disqualifying | LOW | Click-to-call on mobile is non-negotiable |
| Business address and service area | Clients in Southern Ontario need to know they're in range; local trust signal | LOW | Footer at minimum; "Southern Ontario / GTA" stated explicitly |
| Mobile-responsive layout | Majority of first visits are on phones; broken mobile = lost lead | MEDIUM | Mobile-first design discipline throughout, not retrofitted |
| Fixed navigation with clear hierarchy | Users expect consistent wayfinding on scroll; disappearing nav is disorienting | LOW | Transparent-to-solid scroll transition is the premium pattern |
| Testimonials / social proof | Trades clients rely heavily on word-of-mouth signals online | LOW | 3-5 named testimonials with project context; not generic |
| About / company credibility section | Who is this company? How long have they been doing this? Anonymous = untrustworthy | LOW | Founder story or craft philosophy; does not require a full About page |
| Quality photography | Premium fabrication can only be communicated visually; stock or low-res photos destroy perception | LOW | Curated Unsplash metalwork placeholders now; real project photos before launch |
| SEO basics (semantic HTML, meta tags, Open Graph) | Clients search "custom metal railing Southern Ontario" — must be findable | LOW | Semantic structure, title tags, description, OG tags, canonical URLs |

---

### Differentiators (Competitive Advantage)

Features that separate a $20,000 custom site from a generic WordPress template. These are what visitors remember and what causes them to choose Satin over a competitor.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Dark luxury editorial aesthetic (matte black, charcoal, brushed gold accents) | Instantly communicates premium positioning before a word is read; competitors use generic white/blue contractor templates | MEDIUM | Requires discipline: gold as accent only, never background; grain texture overlay adds craft tactility |
| Scroll-triggered reveal animations (Framer Motion) | Creates a sense of craftsmanship and intentionality in the browsing experience; feels like a luxury brand commercial | HIGH | Cubic-bezier easing only; no spring/bounce physics; reduced motion support required |
| Custom cursor with contextual states | Signals bespoke digital craft; immediately distinguishes from template sites | MEDIUM | Desktop only; pointer/grab/view states; must degrade gracefully on touch devices |
| Animated process timeline | Demonstrates a professional, structured approach to projects; reduces "how does this work?" friction for new clients | MEDIUM | Numbered steps with staggered entry animation; reinforces trust in the process |
| Before/after comparison slider | Shows transformation impact in a single interactive element; more powerful than two separate images | MEDIUM | React-based drag slider on featured project; lazy-loaded images |
| Grain/noise texture overlay | Adds analog craft character that reads as artisanal rather than digital; competitors lack this entirely | LOW | CSS pseudo-element or SVG filter; subtle opacity (2–5%); performance-free if done right |
| Playfair Display + Raleway typography pairing | Editorial luxury voice; contrasts the industrial subject matter in a way that signals high design literacy | LOW | Self-hosted fonts for performance; no Google Fonts CDN dependency |
| Parallax depth effects on hero/sections | Creates visual dimension that premium brands use; makes static imagery feel alive | MEDIUM | Framer Motion scroll progress values; must not affect Core Web Vitals |
| Full-screen mobile navigation overlay | Premium mobile UX; cheap sites use dropdown drawers; full-screen reads as intentional and confident | LOW | Staggered link entrance animation; backdrop blur or solid dark fill |
| Structured data (JSON-LD LocalBusiness + HomeAndConstructionBusiness) | Surfaces in Google local pack and knowledge panels; competitors typically omit this | LOW | areaServed: "Southern Ontario"; includes phone, address, services, hours |
| Service area statement in hero or above fold | Immediately qualifies Southern Ontario visitors; reduces bounce from out-of-area traffic | LOW | "Serving the Greater Toronto Area and Southern Ontario" — one line |
| Swap-ready content architecture | Real photos and copy slot in without code changes; prevents a rebuild when launch content arrives | MEDIUM | Centralized constants file or CMS-ready data layer; image components accept src as prop |

---

### Anti-Features (Commonly Requested, Often Problematic)

Features that surface in briefs for premium trades sites but consistently create more problems than they solve at this scope and scale.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| CMS / blog | "We might want to add content later" | Adds backend complexity, ongoing maintenance, and CMS licensing cost for content that rarely gets produced; kills launch velocity | Hardcoded content now; add a headless CMS (Sanity, Contentful) only if content production actually happens in v1.x |
| Individual project detail pages | "Clients want the full story of each project" | Requires real copy and photos per project; placeholder detail pages read as empty and unprofessional; v1 gallery is sufficient | Masonry gallery with hover overlay showing project name and type; full detail pages in v2 when real content exists |
| E-commerce / online deposit | "Accept payments upfront" | High-trust custom fabrication is sold through conversation, not a checkout flow; adding Stripe for a $15K railing order creates friction and distrust | Quote form → email → phone call is the correct sales motion at this price point |
| Live chat widget | "Be immediately available to visitors" | Adds third-party script weight, privacy overhead (GDPR), and creates expectation of instant response that a small fabrication shop cannot sustain | Visible phone number + fast-loading contact form is the correct UX for this business |
| Social media feed embed (Instagram, etc.) | "Show real-time activity" | Third-party embeds add significant JS weight and layout shift; feed freshness depends on posting discipline that most trades businesses don't maintain | Static gallery with curated project photos; social links in footer for visitors who want to follow |
| Appointment booking / calendar scheduling | "Let clients book consultations online" | Overkill for a high-touch custom business where initial consultation requires qualifying scope and location first; adds Calendly/Cal.com dependency | Quote form collects enough information; owner calls back to schedule; a calendar link can be added post-MVP if desired |
| Client portal / project tracker | "Keep clients updated on their project" | Requires authentication, backend, database — a full application build; completely out of scope for a marketing website | Email-based project updates; consider a tool like HoneyBook or Buildertrend as a separate business tool |
| Multiple language support | "What if French speakers visit?" | Southern Ontario metalwork clients operate in English; adding bilingual content doubles content maintenance with minimal conversion lift at this stage | SEO-optimized English content; revisit if analytics show French-language traffic |

---

## Feature Dependencies

```
Portfolio Gallery
    └──requires──> Quality Photography (or credible placeholder system)
                       └──requires──> Swap-ready image architecture

Scroll-triggered Animations
    └──requires──> Framer Motion library
    └──requires──> Reduced Motion support (accessibility)
                       └──requires──> prefers-reduced-motion media query handling

Quote Request Form
    └──requires──> Client-side validation
    └──requires──> Success state / confirmation UI
    └──enhances──> Email integration (Resend/SendGrid — deferred to v1.x)

Custom Cursor
    └──requires──> Desktop detection (touch device fallback)
    └──enhances──> Hover states on portfolio gallery items

Before/After Slider
    └──requires──> Two matched project images (before + after)
    └──requires──> Accessible keyboard/touch controls

JSON-LD Structured Data
    └──requires──> Finalized NAP (name, address, phone) details
    └──enhances──> Local SEO visibility in Google Maps pack

Fixed Navbar (transparent-to-solid)
    └──requires──> Scroll position detection (Framer Motion or IntersectionObserver)

Full-screen Mobile Nav
    └──enhances──> Fixed Navbar (shares state/toggle logic)
    └──conflicts──> Standard dropdown mobile drawer (choose one pattern; full-screen is correct here)

Grain Texture Overlay
    └──requires──> CSS pseudo-element on root layout
    └──conflicts──> Heavy animation layers (both fighting for GPU compositing; grain must be pointer-events: none)
```

### Dependency Notes

- **Portfolio Gallery requires swap-ready image architecture:** Using `next/image` with externalized `src` props means real project photos slot in without touching component code. Critical for placeholder-now / real-content-later strategy.
- **Scroll animations require reduced motion support:** `prefers-reduced-motion` must be respected globally via a Framer Motion `LazyMotion` config or per-component checks. This is not optional — it is both an accessibility requirement and a legal consideration in Ontario under AODA.
- **JSON-LD requires finalized NAP:** Do not hardcode placeholder business details into structured data — Google indexes this. Coordinate with owner to confirm address and phone before deploying structured data to production.
- **Custom cursor conflicts with touch devices:** The cursor component must detect pointer type at runtime and render nothing on mobile/tablet. Failing this causes a "ghost cursor" rendering artifact on some Android browsers.
- **Grain texture and heavy animation layers can conflict:** The noise overlay must use `pointer-events: none` and `will-change` should not be set on it, to avoid creating a new compositing layer that fights with Framer Motion animations.

---

## MVP Definition

### Launch With (v1)

The minimum needed for Satin Fabrication to go live with a site that commands premium positioning and converts inquiries.

- [ ] Hero with value proposition and CTA — establishes immediate brand authority
- [ ] Services section — confirms scope for the right clients
- [ ] Portfolio gallery (masonry, hover overlays, placeholder images) — visual proof of craft
- [ ] Process timeline (animated) — reduces friction for new clients unfamiliar with custom fabrication
- [ ] Testimonials section — social proof from real past clients
- [ ] Quote request form with validation and success state — primary conversion action
- [ ] Phone number and email in header and footer — trades clients call
- [ ] Fixed navbar with transparent-to-solid scroll — premium wayfinding
- [ ] Full-screen mobile navigation — premium mobile UX
- [ ] Dark luxury aesthetic with grain texture — brand perception
- [ ] Playfair + Raleway typography — editorial voice
- [ ] Scroll-triggered reveal animations via Framer Motion — differentiating polish
- [ ] SEO: semantic HTML, meta tags, Open Graph — organic discoverability
- [ ] JSON-LD LocalBusiness structured data — local pack visibility (once NAP is confirmed)
- [ ] Mobile-first responsive layout — non-negotiable baseline
- [ ] Core Web Vitals compliance — performance gate for Vercel deploy
- [ ] ARIA labels and reduced motion support — accessibility and AODA compliance

### Add After Validation (v1.x)

- [ ] Email integration (Resend or SendGrid for form submissions) — trigger: site is live and form submissions need routing beyond copy-paste
- [ ] Real project photos replacing Unsplash placeholders — trigger: owner provides photography
- [ ] Real testimonial copy replacing placeholder text — trigger: owner provides client quotes
- [ ] Custom cursor with contextual states — trigger: already planned; add in polish pass after core sections are complete
- [ ] Before/after comparison slider — trigger: matched before/after image pair exists from real project
- [ ] Google Analytics or privacy-respecting alternative (Plausible) — trigger: need traffic data to optimize

### Future Consideration (v2+)

- [ ] Individual project detail pages — defer until real project copy and photography inventory justifies it
- [ ] Headless CMS integration (Sanity) — defer until owner is actively producing content
- [ ] Service-specific landing pages for SEO (e.g., "Custom Metal Railings Toronto") — defer until initial SEO performance is measured
- [ ] Houzz / Google Business Profile integration — defer to marketing phase

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Hero with value proposition | HIGH | LOW | P1 |
| Services section | HIGH | LOW | P1 |
| Portfolio gallery (placeholder) | HIGH | MEDIUM | P1 |
| Quote request form | HIGH | LOW | P1 |
| Phone + email in header/footer | HIGH | LOW | P1 |
| Mobile-responsive layout | HIGH | MEDIUM | P1 |
| Fixed navbar (transparent-to-solid) | MEDIUM | LOW | P1 |
| Testimonials | HIGH | LOW | P1 |
| Dark luxury aesthetic + grain texture | HIGH | LOW | P1 |
| Playfair + Raleway typography | HIGH | LOW | P1 |
| SEO meta tags + Open Graph | HIGH | LOW | P1 |
| Scroll-triggered animations | HIGH | HIGH | P1 |
| Process timeline (animated) | MEDIUM | MEDIUM | P1 |
| JSON-LD structured data | HIGH | LOW | P1 |
| Reduced motion support | HIGH | LOW | P1 — accessibility, not optional |
| Full-screen mobile nav | MEDIUM | LOW | P1 |
| Custom cursor (desktop) | MEDIUM | MEDIUM | P2 |
| Before/after slider | MEDIUM | MEDIUM | P2 — gated on real imagery |
| Email form integration | HIGH | LOW | P2 — deferred, not complex |
| Real project photography | HIGH | LOW | P2 — content, not code |
| Individual project detail pages | MEDIUM | HIGH | P3 |
| CMS integration | LOW | HIGH | P3 |
| Service-specific SEO landing pages | MEDIUM | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Competitor Feature Analysis

| Feature | Generic Contractor Sites | Mid-tier Fabricators (Melnick, Triple S) | Premium Architectural Metalwork (Meta Designs, Custom Metal Fabrication LA) | Satin Fabrication Approach |
|---------|--------------------------|------------------------------------------|------------------------------------------------------------------------------|---------------------------|
| Portfolio | Grid or slideshow, often low-res | 8-12 gallery images, category links | Full portfolio with category filters (stairs, railings, commercial, kinetics) | Masonry grid with hover overlays; categories via filter tabs in v2 |
| Visual identity | White background, blue accent, stock photos | Branded but generic; photo-heavy, design-light | Considered color palette; typography shows design literacy | Dark editorial aesthetic; grain texture; deliberate whitespace |
| Process presentation | Bullet list or omitted | 3-4 step process paragraph | Numbered steps sometimes; often absent | Animated timeline section — major differentiator vs. most competitors |
| Trust signals | License numbers, years in business | Testimonials, years in business, named clients | Industry associations, architect/designer client roster | Years in business (if applicable), named testimonials, service area specificity |
| Contact / lead capture | Contact page only | Contact page + sometimes inline form | Header CTA + contact form | Inline quote form on homepage + contact details in header + dedicated services CTA |
| Mobile experience | Often broken or retrofitted | Functional but not premium | Variable; some strong, some poor | Mobile-first design; full-screen overlay nav; full parity with desktop premium feel |
| Animation / motion | None | None | Slider autoplay at most | Scroll-triggered reveals; parallax; custom cursor; process timeline animation |
| SEO / structured data | Inconsistent | Basic meta tags | Variable | Semantic HTML + JSON-LD LocalBusiness/HomeAndConstructionBusiness + areaServed |

---

## Sources

- [Custom Metal Fabrication Design (LA)](https://custommetalfabricationdesign.com/) — competitor site analysis
- [Meta Designs SLC](https://metadesignsslc.com/) — architectural metalwork site patterns
- [Melnick Metal Works](https://www.melnickmetal.com/) — fabrication site feature inventory
- [MNR Custom Metal — 2025 Architectural Metalwork Trends](https://mnrcustommetal.com/blog/top-trends-in-architectural-metalwork-for-2025-what-designers-need-to-know/) — client demand signals
- [Home Services CTA Stats — Cube Creative](https://cubecreative.design/blog/small-business-marketing/top-10-cta-stats-home-services) — conversion optimization
- [Guide to High-Converting Home Services Websites — Harford Marketing](https://www.harfordmarketing.com/post/your-guide-to-high-converting-home-services-website-design) — form and CTA best practices
- [Best Construction Portfolio Website Designs — Huemor](https://huemor.rocks/blog/the-best-construction-portfolio-website-designs-what-works-and-why/) — portfolio UX patterns
- [Good Schema Markup for Contractor Websites — Eseo Space](https://eseospace.com/blog/schema-markup-for-contractor-websites/) — JSON-LD implementation
- [HomeAndConstructionBusiness Schema — Schemantra](https://schemantra.com/schema_list/HomeAndConstructionBusiness) — structured data type reference
- [areaServed — Schema.org](https://schema.org/areaServed) — service area property reference
- [TOP 5 Before and After Slider Examples — Elfsight](https://elfsight.com/before-and-after-slider-widget/examples/) — before/after interaction patterns

---

*Feature research for: Premium custom metal fabrication company website (Satin Fabrication)*
*Researched: 2026-03-03*
