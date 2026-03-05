---
phase: 4
slug: homepage-sections
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-05
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual verification + build check (no automated test framework) |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` + manual browser verification |
| **Estimated runtime** | ~15 seconds (build) |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build` + manual browser verification of all sections
- **Before `/gsd:verify-work`:** Full build must pass + all 6 success criteria verified in browser
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | HERO-01 | manual | Visual: hero fills viewport, gradient animates | n/a manual | ⬜ pending |
| 04-01-02 | 01 | 1 | HERO-02 | manual | Visual: staggered text entrance with gold accent | n/a manual | ⬜ pending |
| 04-01-03 | 01 | 1 | HERO-03 | manual | Visual: CTA button gold fill on hover | n/a manual | ⬜ pending |
| 04-01-04 | 01 | 1 | HERO-04 | manual | Visual: pulsing scroll indicator | n/a manual | ⬜ pending |
| 04-02-01 | 02 | 1 | SRVC-01 | manual | Visual: 2x2 grid desktop, 1-col mobile | n/a manual | ⬜ pending |
| 04-02-02 | 02 | 1 | SRVC-02 | manual | Visual: card styling + scroll reveal | n/a manual | ⬜ pending |
| 04-02-03 | 02 | 1 | SRVC-03 | manual | Visual: border brightens + image scales on hover | n/a manual | ⬜ pending |
| 04-03-01 | 03 | 1 | PORT-01 | manual | Visual: masonry 3/2/1 cols with 8-10 images | n/a manual | ⬜ pending |
| 04-03-02 | 03 | 1 | PORT-02 | manual | Visual: hover overlay with name + category | n/a manual | ⬜ pending |
| 04-03-03 | 03 | 1 | PORT-04 | smoke | `npm run build` + visual check | n/a manual | ⬜ pending |
| 04-04-01 | 04 | 1 | PROC-01 | manual | Visual: 5 steps render correctly | n/a manual | ⬜ pending |
| 04-04-02 | 04 | 1 | PROC-03 | manual | Visual: large step numbers in low-opacity gold | n/a manual | ⬜ pending |
| 04-05-01 | 05 | 2 | CNTC-01 | manual | Visual: split layout headline/form | n/a manual | ⬜ pending |
| 04-05-02 | 05 | 2 | CNTC-02 | manual | Visual: all 5 form fields present | n/a manual | ⬜ pending |
| 04-05-03 | 05 | 2 | CNTC-03 | manual | Visual: input styling with gold focus | n/a manual | ⬜ pending |
| 04-05-04 | 05 | 2 | CNTC-04 | manual | Submit empty form, observe inline errors | n/a manual | ⬜ pending |
| 04-05-05 | 05 | 2 | CNTC-05 | manual | Fill valid form, observe success animation | n/a manual | ⬜ pending |
| 04-06-01 | 06 | 2 | FOOT-01 | manual | Visual: company info text present | n/a manual | ⬜ pending |
| 04-06-02 | 06 | 2 | FOOT-02 | manual | Visual: social icons gold on hover | n/a manual | ⬜ pending |
| 04-06-03 | 06 | 2 | FOOT-03 | manual | Click back-to-top, observe smooth scroll | n/a manual | ⬜ pending |
| 04-06-04 | 06 | 2 | FOOT-04 | manual | Visual: phone/email with tel:/mailto: links | n/a manual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `npm install zod@"^3.24" react-hook-form @hookform/resolvers lucide-react` — new dependencies
- [ ] `src/lib/schemas.ts` — Zod validation schema for contact form
- [ ] `src/components/sections/` directory — create section component directory
- [ ] `heroGradient` keyframes in `globals.css` — CSS animation for hero background

*No automated test framework needed — all verification is visual/manual + build check.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Hero gradient animation | HERO-01 | Visual animation quality | Load page, observe subtle dark gradient movement |
| Staggered text entrance | HERO-02 | Timing/visual quality | Reload page, observe text animate in sequence |
| CTA hover transition | HERO-03 | Hover interaction | Hover "VIEW OUR WORK" button, observe fill |
| Scroll indicator pulse | HERO-04 | Animation quality | Observe continuous pulsing at hero bottom |
| Service card grid | SRVC-01 | Responsive layout | Resize browser from mobile to desktop |
| Card hover effects | SRVC-03 | Hover interaction | Hover service cards, observe border + scale |
| Masonry layout | PORT-01 | Responsive columns | Resize browser, verify 3/2/1 col breakpoints |
| Portfolio overlay | PORT-02 | Hover interaction | Hover portfolio images, observe overlay fade |
| Process timeline | PROC-01, PROC-03 | Scroll animation | Scroll through process section |
| Form validation | CNTC-04 | User interaction | Submit empty form, check inline errors |
| Form success | CNTC-05 | State transition | Submit valid form, check animation |
| Back-to-top | FOOT-03 | Scroll behavior | Click link, verify smooth scroll to top |

---

## Validation Sign-Off

- [ ] All tasks have manual verify or Wave 0 dependencies
- [ ] Sampling continuity: `npm run build` after every task commit
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
