# Phase 5 Checkpoint: Alpha.1 Docs-Consumption Entry Gate

## Status

**PASS for Phase 6 entry; NOT YET beta-ready.**

As of 2026-08-18, `emblor@2.0.0-alpha.1` is suitable for use as the exact external dependency of the v2 documentation-site rebuild. Phase 5 Alpha Iteration remains active while Phase 6 proceeds. This checkpoint does not authorize `alpha.2`, `beta.0`, npm dist-tag changes, a production documentation cutover, or a frozen-contract change.

## Evidence

- `emblor@2.0.0-alpha.1` is published under npm `next`; npm `latest` remains `1.4.8`.
- The alpha.1 tag and GitHub prerelease target the exact published source candidate.
- The public npm tarball passed isolated React 18.3.1 and React 19.1.1 installation, typecheck, production build, runtime mount, form, ref, polymorphism, and export checks.
- The Phase 5 performance audit completed one controlled feedback-and-fix cycle against the published alpha line, with PR #124 merged and the verified fix released in alpha.1.
- Node 22/24 CI, package tests, browser gates, distribution checks, and performance evidence passed for the alpha.1 work.
- No known open issue is classified as a critical or high-severity v2 alpha behavior, accessibility, installation, declaration, export, or React compatibility defect.
- Existing open issues are historical v1 reports or unclassified requests and must not be treated as v2 regressions without reproduction against `emblor@next`.
- Alpha.1 release closure, workflow repair, immutable README mismatch, and planning synchronization are recorded under the alpha.1 closure plan.

## Docs-Consumption Decision

Phase 6 may begin with these constraints:

- `website/` must consume exact published `emblor@2.0.0-alpha.1`, not `latest`, workspace source, a local tarball, or a Git branch.
- Documentation implementation must not justify additions or changes to the frozen package API.
- Any package defect discovered while building a real example becomes a Phase 5 finding and receives issue-scoped handling.
- A frozen-contract change requires a superseding decision before implementation.
- The production v1 documentation remains available; Phase 6 ends with a verified preview/deployment candidate, not the stable cutover.

## Beta Readiness

Beta readiness remains open because:

- the v2 documentation baseline is not yet complete;
- the website has not yet acted as the required full external consumer across every major documented behavior;
- historical open reports still require explicit v2 reproduction/disposition where relevant;
- final alpha findings must be reviewed after the docs implementation exercise;
- the public API/type/export snapshot and beta release runbook belong to Phase 7.

## Ongoing Phase 5 Rules

- Monitor alpha feedback while Phase 6 is active.
- Record each new finding with version, reproduction, severity, scope, decision impact, and target disposition.
- Publish `alpha.2` only for substantive verified package or shipped-documentation fixes.
- Do not publish an empty cadence release.
- Before recommending beta, repeat the Phase 5 threshold review against the latest published alpha and the completed docs preview.
