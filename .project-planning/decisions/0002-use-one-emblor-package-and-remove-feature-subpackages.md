# 0002 — Use One Emblor Package and Remove Feature Subpackages

## Status

Accepted

## Context

The repository contains both `packages/emblor` and an abandoned `@emblor/*` multi-package experiment. The single package also currently exposes `addons`, `sortable`, and `testing` subpaths that contradict the narrowed v2 scope.

## Decision

Publish one npm package named `emblor`, sourced from `packages/emblor`.

Delete the orphan `packages/core`, `packages/addons`, `packages/sortable`, `packages/types`, `packages/utils`, and `packages/playground` directories. Remove the `emblor/addons`, `emblor/sortable`, and `emblor/testing` public subpaths and their implementations. Clear-all behavior remains part of the core API. Consumers reorder controlled `string[]` values themselves.

## Alternatives Considered

- Publish separate `@emblor/*` packages.
- Keep addons and sortable as optional `emblor` subpaths.
- Keep empty or compatibility subpaths for a transition period.

## Consequences

- There is one installation and release unit.
- Duplicate implementations and drift are removed.
- Addon, sortable, and testing imports intentionally break in v2.
- Any remaining public subpaths must be reviewed as part of the final export-surface decision.

## Related Files

- `packages/emblor/package.json`
- `packages/emblor/tsup.config.ts`
- `packages/emblor/src/index.ts`
- `pnpm-workspace.yaml`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The abandoned `@emblor/*` package split and the provisional v2 feature subpaths.

## Superseded By

None.

## Notes

The exact treatment of `emblor/core`, `emblor/types`, and `emblor/utils` remains an open API-surface question.
