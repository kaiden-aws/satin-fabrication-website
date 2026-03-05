---
phase: 5
slug: services-page-and-seo
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-05
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None installed — `next build` serves as primary validation |
| **Config file** | None — Wave 0 not needed (see below) |
| **Quick run command** | `npx next build` |
| **Full suite command** | `npx next build && npx lighthouse http://localhost:3000 --only-categories=accessibility,seo --output=json` |
| **Estimated runtime** | ~30 seconds (build) |

---

## Sampling Rate

- **After every task commit:** Run `npx next build`
- **After every plan wave:** Run `npx next build` + manual Lighthouse check
- **Before `/gsd:verify-work`:** Full Lighthouse audit on both / and /services
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | SEO-01 | manual | `npx next build` | N/A | ⬜ pending |
| 05-01-02 | 01 | 1 | SEO-02 | manual | `curl -s localhost:3000 \| grep '<title>'` | N/A | ⬜ pending |
| 05-01-03 | 01 | 1 | SEO-03 | manual | `curl -s localhost:3000 \| grep 'og:title'` | N/A | ⬜ pending |
| 05-01-04 | 01 | 1 | SEO-04 | manual-only | Google Rich Results Test | N/A | ⬜ pending |
| 05-01-05 | 01 | 1 | SEO-05 | manual | Lighthouse performance audit | N/A | ⬜ pending |
| 05-01-06 | 01 | 1 | SEO-06 | manual | Lighthouse accessibility audit | N/A | ⬜ pending |
| 05-02-01 | 02 | 1 | SRVC-04 | manual | `npx next build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. Primary validation is `next build` success, Lighthouse audits, and manual inspection of HTML source for meta tags. A formal test framework (jest/vitest) is not required for Phase 5's SEO/page-building work.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| JSON-LD validates in Google Rich Results Test | SEO-04 | External Google tool; cannot automate locally | Paste URL into https://search.google.com/test/rich-results |
| OG image renders in social sharing preview | SEO-03 | Requires external service (LinkedIn/Twitter/Facebook debugger) | Paste URL into LinkedIn post composer or Facebook debugger |
| Lighthouse accessibility >= 95 | SEO-06 | Requires running dev server + Lighthouse CLI | `npx next dev` then `npx lighthouse http://localhost:3000 --only-categories=accessibility` |
| Keyboard focus ring visibility | SEO-06 | Visual/behavioral check | Tab through all interactive elements on both pages; verify gold ring appears |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
