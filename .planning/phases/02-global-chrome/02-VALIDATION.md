---
phase: 2
slug: global-chrome
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-04
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual verification (visual + interaction testing) |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run dev` |
| **Estimated runtime** | ~15 seconds (build) |

---

## Sampling Rate

- **After every task commit:** Run `npm run build` (must pass without errors)
- **After every plan wave:** Run `npm run build` + manual browser verification of all success criteria
- **Before `/gsd:verify-work`:** Full suite must be green, all 5 success criteria verified visually
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | NAV-01 | manual | `npm run build` | n/a manual | ⬜ pending |
| 02-01-02 | 01 | 1 | NAV-04 | manual | `npm run build` | n/a manual | ⬜ pending |
| 02-01-03 | 01 | 1 | NAV-02 | manual | `npm run build` | n/a manual | ⬜ pending |
| 02-01-04 | 01 | 1 | NAV-03 | manual | `npm run build` | n/a manual | ⬜ pending |
| 02-02-01 | 02 | 1 | INTR-01 | manual | `npm run build` | n/a manual | ⬜ pending |
| 02-02-02 | 02 | 1 | INTR-03 | manual | `npm run build` | n/a manual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

No automated test framework is needed for Phase 2 — all requirements are visual/interactive and verified via build success + manual browser testing.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Navbar transparent at top, solid dark with backdrop-blur on scroll | NAV-01 | Visual transition cannot be automated without Playwright | Load page, verify transparent navbar, scroll down, verify solid dark background with blur |
| Gold underline slides in from left on desktop nav link hover | NAV-04 | Hover animation requires visual confirmation | Hover each nav link on desktop viewport, verify gold underline slides from left |
| Full-screen mobile menu with staggered fade-in, hamburger-to-X | NAV-02 | Mobile interaction + animation timing | Resize to mobile, tap hamburger, verify overlay + stagger animation, tap X to close |
| Skip-to-content link visible on Tab, moves focus to main | NAV-03 | Keyboard interaction + focus management | Tab from address bar, verify skip link appears, press Enter, verify focus moves to main |
| Gold dot follows cursor with lag, expands to ring on hover | INTR-01 | Cursor tracking requires real mouse movement | Move cursor across page, verify gold dot follows with lag, hover interactive elements, verify 40px ring expansion |
| Button gold glow, underline slide-in, form focus borders | INTR-03 | Micro-interaction animations require visual check | Interact with styled elements, verify gold glow, underline, and focus transitions |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
