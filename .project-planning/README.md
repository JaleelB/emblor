# Emblor Project Planning

This directory contains durable decisions, planning sessions, implementation plans, and milestone roadmaps for Emblor.

## Conventions

- `decisions/` records accepted product and architecture choices. Superseded decisions remain in place and link to their replacements.
- `sessions/` captures verified repository state, assumptions, open questions, and planning progress.
- `plans/` contains implementation-ready plans with decision-to-task and verification traceability.
- `roadmaps/` sequences multiple plans and release milestones without prematurely expanding future phases into task-level plans.

The historical project handoff remains at [`../project-status/HANDOFF.md`](../project-status/HANDOFF.md).

## Active Plans

- [`plans/emblor-v2-tag-primitive/plan.md`](plans/emblor-v2-tag-primitive/plan.md) — Phase 1 residual core hardening is locally verified and awaiting the configured Node 24 package and bundled-Chromium CI confirmation.
  - [`decision-manifest.md`](plans/emblor-v2-tag-primitive/decision-manifest.md) — applicable accepted decisions and supersession resolution.
  - [`coverage.md`](plans/emblor-v2-tag-primitive/coverage.md) — 25 residual obligations with passing local direct evidence.
  - [`implementation-review.md`](plans/emblor-v2-tag-primitive/implementation-review.md) — post-review commands, direct evidence, boundary review, and CI-pending verdict.

## Active Roadmaps

- [`roadmaps/emblor-v2-to-stable.md`](roadmaps/emblor-v2-to-stable.md) — complete milestone path from the frozen v2 vertical slice through residual hardening, alpha, docs, beta, and stable `2.0.0`.

## Completed Plans

- [`plans/emblor-v2-vertical-slice/plan.md`](plans/emblor-v2-vertical-slice/plan.md) — completed package vertical slice, visual acceptance lab, and architecture-freeze gate.
