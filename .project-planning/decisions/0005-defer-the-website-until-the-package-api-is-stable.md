# 0005 — Defer the Website Until the Package API Is Stable

## Status

Accepted

## Context

The existing website documents and embeds the v1 API. Rebuilding it while the v2 package surface is unsettled would duplicate work and risk coupling the package to demo requirements.

## Decision

Leave `website/` on published v1 until the v2 package API, behavior, tests, and migration guide are ready. Keep `packages/emblor/playground` only as a temporary core smoke harness. Build integration demos and the polished playground as part of the later website effort.

## Alternatives Considered

- Migrate the website in parallel with package work.
- Treat the in-repository playground as a permanent product surface.
- Remove all interactive examples during package development.

## Consequences

- Package work can stabilize without website churn.
- The temporary playground should be slim and must not justify new package features.
- The website will require a distinct later plan.

## Related Files

- `website/`
- `packages/emblor/playground/`
- `project-status/HANDOFF.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md` covers the package and treats website implementation as explicitly deferred.

## Supersedes

None.

## Superseded By

None.

## Notes

None.
