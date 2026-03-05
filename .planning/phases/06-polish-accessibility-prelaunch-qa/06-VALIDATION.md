---
phase: 6
slug: polish-accessibility-prelaunch-qa
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-05
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None installed (manual verification + Lighthouse CLI) |
| **Config file** | None |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npx next start & sleep 3 && npx lighthouse http://localhost:3000 --only-categories=performance,accessibility,seo --preset=perf --chrome-flags="--headless"` |
| **Estimated runtime** | ~60 seconds (build) + ~30 seconds (Lighthouse) |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run full Lighthouse audit on localhost production build
- **Before `/gsd:verify-work`:** Full suite must be green + physical device testing complete
- **Max feedback latency:** 90 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | SC-1 | manual | `npx lighthouse URL --only-categories=performance --preset=perf --chrome-flags="--headless"` | N/A | ⬜ pending |
| 06-01-02 | 01 | 1 | SC-5 | manual | `npx lighthouse URL --only-categories=accessibility --chrome-flags="--headless"` | N/A | ⬜ pending |
| 06-02-01 | 02 | 2 | SC-3 | manual | Enable OS reduced motion, verify visually | N/A | ⬜ pending |
| 06-02-02 | 02 | 2 | SC-2 | manual-only | Physical iOS/Android device testing | N/A | ⬜ pending |
| 06-03-01 | 03 | 3 | SC-4 | manual | Submit form on Vercel preview, verify Formspree dashboard | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- No automated test framework is installed. Phase 6 is primarily a manual QA and verification phase.
- Lighthouse CLI is available via `npx lighthouse` without installation.
- If bundle analysis is needed: `npm install -D @next/bundle-analyzer`

*Existing infrastructure covers build validation (`npm run build`).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Portfolio overlays work via tap on iOS/Android | SC-2 | Requires physical touch devices | 1. Open site on physical iOS device. 2. Tap portfolio image. 3. Verify overlay text is visible (always-on for touch devices). |
| Before/after slider drags on touch | SC-2 | Requires physical touch device interaction | 1. Open site on physical iOS/Android. 2. Touch and drag the slider handle. 3. Verify smooth drag behavior. |
| Custom cursor invisible on mobile | SC-2 | Requires physical touch device | 1. Open site on physical iOS/Android. 2. Verify no cursor dot appears or gets stuck on screen. |
| Reduced motion suppresses all animations | SC-3 | Requires OS-level setting + visual verification | 1. Enable "Reduce motion" in macOS/iOS/Android settings. 2. Navigate site. 3. Verify zero scroll-triggered reveals, entrance animations, or flashes. |
| Form submission received in production | SC-4 | Requires live Vercel deploy + backend dashboard | 1. Deploy to Vercel preview. 2. Fill and submit form. 3. Verify submission appears in Formspree dashboard. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 90s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
