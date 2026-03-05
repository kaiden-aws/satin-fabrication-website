---
phase: 3
slug: ui-primitives
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-04
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual verification (no automated test framework) |
| **Config file** | none — Wave 0 creates test harness |
| **Quick run command** | `npm run dev` (verify dev server + test harness page) |
| **Full suite command** | `npm run build` (verify production build succeeds) |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build` + manual browser verification of test harness page
- **Before `/gsd:verify-work`:** Full suite must be green + all manual checks pass
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 0 | SC-ALL | smoke | `npm run build` | ❌ W0 | ⬜ pending |
| 3-01-02 | 01 | 1 | SC-01 | manual | Visual: scroll test harness, observe fade+translate reveal | n/a manual | ⬜ pending |
| 3-01-03 | 01 | 1 | SC-01-RM | manual | Enable OS "Reduce motion"; verify elements appear without animation | n/a manual | ⬜ pending |
| 3-02-01 | 02 | 1 | SC-02 | smoke | `npm run build` (no hydration warnings) + resize browser | n/a manual | ⬜ pending |
| 3-03-01 | 03 | 1 | SC-03 | manual | Drag slider handle with mouse; test DevTools touch emulation | n/a manual | ⬜ pending |
| 3-04-01 | 04 | 2 | SC-04, PROC-02 | manual | Scroll through timeline; observe gold line drawing progress | n/a manual | ⬜ pending |
| 3-05-01 | 05 | 1 | INTR-02 | manual | Scroll test harness, observe parallax depth difference | n/a manual | ⬜ pending |
| 3-06-01 | 06 | 2 | PORT-03 | manual | Scroll scattered elements; verify they converge | n/a manual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `app/dev/primitives/page.tsx` — test harness page rendering all components with placeholder content
- No automated test framework needed for Phase 3 (all verification is visual/manual)

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| MotionWrapper fade+translate reveal on scroll | SC-01 | Visual animation behavior | Scroll test harness; elements reveal with fade + translateY 30px |
| Reduced motion suppression | SC-01-RM | OS accessibility setting | Enable OS "Reduce motion"; verify no animation |
| MasonryGrid responsive columns | SC-02 | Visual layout + browser resize | Resize browser; 3 cols desktop, 2 tablet, no hydration errors in console |
| BeforeAfterSlider drag/swipe | SC-03 | Pointer interaction | Drag handle with mouse; test touch in DevTools emulation |
| ProcessTimeline gold line scroll | SC-04, PROC-02 | Scroll-linked SVG animation | Scroll through timeline; gold line advances step-by-step |
| ParallaxWrapper scroll speed | INTR-02 | Visual depth perception | Scroll test harness; observe elements move at different rates |
| Scroll-driven assembly animation | PORT-03 | Complex scroll interaction | Scroll; scattered elements converge into assembled view |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
