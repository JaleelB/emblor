# Emblor Project Planning

This directory contains durable decisions, planning sessions, implementation plans, and milestone roadmaps for Emblor.

## Conventions

- `decisions/` records accepted product and architecture choices. Superseded decisions remain in place and link to their replacements.
- `sessions/` captures verified repository state, assumptions, open questions, and planning progress.
- `plans/` contains implementation-ready plans with decision-to-task and verification traceability.
- `roadmaps/` sequences multiple plans and release milestones without prematurely expanding future phases into task-level plans.

The historical project handoff remains at [`../project-status/HANDOFF.md`](../project-status/HANDOFF.md).

## Historical Alpha Preparation (completed)

- [`plans/emblor-v2-alpha-release/plan.md`](plans/emblor-v2-alpha-release/plan.md) — Phase 3 alpha preparation and separately approved Phase 4 `2.0.0-alpha.0` publication runbook.
  - [`decision-manifest.md`](plans/emblor-v2-alpha-release/decision-manifest.md) — release, documentation, compatibility, and frozen-contract decision applicability.
  - [`coverage.md`](plans/emblor-v2-alpha-release/coverage.md) — alpha preparation and publication obligations mapped to tasks and verification.
  - [`implementation-review.md`](plans/emblor-v2-alpha-release/implementation-review.md) — local candidate evidence, boundary review, and remaining release gates.
  - [`transition-runbook.md`](plans/emblor-v2-alpha-release/transition-runbook.md) — actionable v1 preservation, internal backlog classification, manual workflow installation, v2-to-`main` integration, and post-publish issue/PR disposition sequence.

## Active Plans

No implementation plan is currently open. Phase 5 Alpha Iteration remains active at the roadmap level while consumer feedback is collected and the checkpoint/beta-readiness review is prepared.

## Active Roadmaps

- [`roadmaps/emblor-v2-to-stable.md`](roadmaps/emblor-v2-to-stable.md) — complete milestone path from the frozen v2 vertical slice through residual hardening, alpha, docs, beta, and stable `2.0.0`.

## Completed Plans

- [`plans/emblor-v2-alpha1-release-closure/plan.md`](plans/emblor-v2-alpha1-release-closure/plan.md) - alpha.1 package, npm, GitHub metadata, consumer verification, workflow repair, README disposition, and planning closure.
  - [`implementation-review.md`](plans/emblor-v2-alpha1-release-closure/implementation-review.md) - exact release evidence, post-publish failure disposition, and Phase 5 handoff.

- [`plans/emblor-v2-alpha-performance-audit/plan.md`](plans/emblor-v2-alpha-performance-audit/plan.md) - bounded Phase 5 package performance audit with browser evidence and a verified consumer-facing fix.
  - [`findings.md`](plans/emblor-v2-alpha-performance-audit/findings.md) - Vercel rule matrix and classified findings.
  - [`implementation-review.md`](plans/emblor-v2-alpha-performance-audit/implementation-review.md) - before/after evidence, merged PR record, and alpha.1 closure.

- [`plans/emblor-v2-alpha-release/plan.md`](plans/emblor-v2-alpha-release/plan.md) - historical Phase 3/first-alpha preparation runbook; its alpha.0 instructions are superseded by the completed alpha.1 closure.

- [`plans/emblor-v2-distribution-readiness/plan.md`](plans/emblor-v2-distribution-readiness/plan.md) — Phase 2 package and distribution readiness completed with verified tarball, packed consumers, release-path validation, and pushed Node 22/24 CI plus Node 24 Chromium evidence.

  - [`decision-manifest.md`](plans/emblor-v2-distribution-readiness/decision-manifest.md) — applicable accepted decisions and supersession resolution.
  - [`coverage.md`](plans/emblor-v2-distribution-readiness/coverage.md) — all required distribution obligations verified.
  - [`implementation-review.md`](plans/emblor-v2-distribution-readiness/implementation-review.md) — final evidence and Phase 3 recommendation.

- [`plans/emblor-v2-tag-primitive/plan.md`](plans/emblor-v2-tag-primitive/plan.md) — Phase 1 residual core hardening completed with 25/25 obligations Verified and passing Node 22/24 CI plus bundled Chromium.
  - [`implementation-review.md`](plans/emblor-v2-tag-primitive/implementation-review.md) — final evidence, boundary review, and Phase 1 closure verdict.
- [`plans/emblor-v2-vertical-slice/plan.md`](plans/emblor-v2-vertical-slice/plan.md) — completed package vertical slice, visual acceptance lab, and architecture-freeze gate.
