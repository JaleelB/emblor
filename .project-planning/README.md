# Emblor Project Planning

This directory contains durable decisions, planning sessions, implementation plans, and milestone roadmaps for Emblor.

## Conventions

- `decisions/` records accepted product and architecture choices. Superseded decisions remain in place and link to their replacements.
- `sessions/` captures verified repository state, assumptions, open questions, and planning progress.
- `plans/` contains implementation-ready plans with decision-to-task and verification traceability.
- `roadmaps/` sequences multiple plans and release milestones without prematurely expanding future phases into task-level plans.

The historical project handoff remains at [`../project-status/HANDOFF.md`](../project-status/HANDOFF.md).

## Active Plans

No blanket Alpha Iteration plan exists yet. Create small issue-scoped plans only for confirmed alpha findings; frozen-contract changes require a superseding decision first.

## Active Roadmaps

- [`roadmaps/emblor-v2-to-stable.md`](roadmaps/emblor-v2-to-stable.md) — complete milestone path; Phase 5 Alpha Iteration is active after the verified public `2.0.0-alpha.0` release.

## Completed Plans

- [`plans/emblor-v2-alpha-release/plan.md`](plans/emblor-v2-alpha-release/plan.md) — Phase 3 preparation and Phase 4 `2.0.0-alpha.0` publication completed with exact-SHA, npm, consumer, GitHub, feedback, and backlog evidence.
  - [`phase-4-publication-plan.md`](plans/emblor-v2-alpha-release/phase-4-publication-plan.md) — completed just-in-time publication and verification plan.
  - [`phase-4-publication-evidence.md`](plans/emblor-v2-alpha-release/phase-4-publication-evidence.md) — final protected publication, registry, consumer, Git/GitHub, feedback, and handoff evidence.
  - [`decision-manifest.md`](plans/emblor-v2-alpha-release/decision-manifest.md) — release, documentation, compatibility, and frozen-contract decision applicability.
  - [`coverage.md`](plans/emblor-v2-alpha-release/coverage.md) — alpha preparation and publication obligations mapped to tasks and verification.
  - [`implementation-review.md`](plans/emblor-v2-alpha-release/implementation-review.md) — final candidate and post-publish evidence, boundary review, and Alpha Iteration recommendation.
  - [`transition-runbook.md`](plans/emblor-v2-alpha-release/transition-runbook.md) — v1 preservation, internal backlog classification, manual workflow installation, v2-to-`main` integration, and post-publish disposition sequence.

- [`plans/emblor-v2-distribution-readiness/plan.md`](plans/emblor-v2-distribution-readiness/plan.md) — Phase 2 package and distribution readiness completed with verified tarball, packed consumers, release-path validation, and pushed Node 22/24 CI plus Node 24 Chromium evidence.

  - [`decision-manifest.md`](plans/emblor-v2-distribution-readiness/decision-manifest.md) — applicable accepted decisions and supersession resolution.
  - [`coverage.md`](plans/emblor-v2-distribution-readiness/coverage.md) — all required distribution obligations verified.
  - [`implementation-review.md`](plans/emblor-v2-distribution-readiness/implementation-review.md) — final evidence and Phase 3 recommendation.

- [`plans/emblor-v2-tag-primitive/plan.md`](plans/emblor-v2-tag-primitive/plan.md) — Phase 1 residual core hardening completed with 25/25 obligations Verified and passing Node 22/24 CI plus bundled Chromium.
  - [`implementation-review.md`](plans/emblor-v2-tag-primitive/implementation-review.md) — final evidence, boundary review, and Phase 1 closure verdict.
- [`plans/emblor-v2-vertical-slice/plan.md`](plans/emblor-v2-vertical-slice/plan.md) — completed package vertical slice, visual acceptance lab, and architecture-freeze gate.
