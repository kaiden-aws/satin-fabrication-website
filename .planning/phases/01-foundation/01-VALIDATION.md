---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-04
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual verification (no automated test framework in Phase 1) |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `npm run dev` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build` + manual browser verification
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | DSGN-01 | smoke | `npm run build` | n/a Wave 0 | ⬜ pending |
| 01-01-02 | 01 | 1 | DSGN-02 | manual | Browser Network tab — verify self-hosted fonts | n/a manual | ⬜ pending |
| 01-01-03 | 01 | 1 | DSGN-03 | manual | Visual inspection — grain texture at low opacity | n/a manual | ⬜ pending |
| 01-01-04 | 01 | 1 | DSGN-04 | smoke | `npm run build` — importing `motion.div` throws error | n/a Wave 0 | ⬜ pending |
| 01-01-05 | 01 | 1 | DSGN-05 | manual | Enable OS "Reduce motion", verify no animations | n/a manual | ⬜ pending |
| 01-01-06 | 01 | 1 | DSGN-06 | smoke | `npm run build` + visual inspection | n/a Wave 0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- No automated test framework needed for Phase 1 (purely infrastructure/configuration)
- All validation is via build success + manual browser verification
- Test framework setup (Vitest or Playwright) deferred to future phases

*Existing infrastructure covers all phase requirements via build commands.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Fonts render without FOUT, no external requests | DSGN-02 | Requires browser Network tab inspection | Open DevTools Network tab, reload page, filter by font — verify all fonts self-hosted |
| Grain texture visible at low opacity | DSGN-03 | Visual/aesthetic verification | Inspect page background — confirm subtle grain overlay visible |
| Reduced motion disables animations | DSGN-05 | Requires OS accessibility setting change | Enable "Reduce motion" in macOS Accessibility, verify Motion animations pause |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
