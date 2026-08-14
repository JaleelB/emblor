# Emblor Project Planning

This directory contains durable decisions, planning sessions, implementation plans, and milestone roadmaps for Emblor.

## Conventions

- `decisions/` records accepted product and architecture choices. Superseded decisions remain in place and link to their replacements.
- `sessions/` captures verified repository state, assumptions, open questions, and planning progress.
- `plans/` contains implementation-ready plans with decision-to-task and verification traceability.
- `roadmaps/` sequences multiple plans and release milestones without prematurely expanding future phases into task-level plans.

The historical project handoff remains at [`../project-status/HANDOFF.md`](../project-status/HANDOFF.md).

## Active Plans

- [`plans/emblor-v2-distribution-readiness/plan.md`](plans/emblor-v2-distribution-readiness/plan.md) — Phase 2 package and distribution readiness from the hardened artifact to a reproducible alpha-ready package gate.
  - [`decision-manifest.md`](plans/emblor-v2-distribution-readiness/decision-manifest.md) — applicable accepted decisions and supersession resolution.
  - [`coverage.md`](plans/emblor-v2-distribution-readiness/coverage.md) — required distribution obligations mapped to implementation and verification.

  - [`implementation-review.md`](plans/emblor-v2-distribution-readiness/implementation-review.md) — local implementation evidence and the remaining clean-checkout/remote CI closure step.

## Active Roadmaps

- [`roadmaps/emblor-v2-to-stable.md`](roadmaps/emblor-v2-to-stable.md) — complete milestone path from the frozen v2 vertical slice through residual hardening, alpha, docs, beta, and stable `2.0.0`.

## Completed Plans

- [`plans/emblor-v2-tag-primitive/plan.md`](plans/emblor-v2-tag-primitive/plan.md) — Phase 1 residual core hardening completed with 25/25 obligations Verified and passing Node 22/24 CI plus bundled Chromium.
  - [`implementation-review.md`](plans/emblor-v2-tag-primitive/implementation-review.md) — final evidence, boundary review, and Phase 1 closure verdict.
- [`plans/emblor-v2-vertical-slice/plan.md`](plans/emblor-v2-vertical-slice/plan.md) — completed package vertical slice, visual acceptance lab, and architecture-freeze gate.
