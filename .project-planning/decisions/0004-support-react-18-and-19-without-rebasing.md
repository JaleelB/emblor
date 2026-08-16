# 0004 — Support React 18 and 19 Without Rebasing the Refactor

## Status

Accepted

## Context

The v2 refactor branch diverged from `main`, where React 19 and version-related changes were made. Rebasing is not required to deliver the v2 package and could introduce unrelated conflict.

## Decision

Support React 18 and React 19 in the `emblor` peer dependency contract. Make the required dependency and type updates directly on the v2 branch. Do not rebase onto `main`; cherry-pick only a specific change if it becomes necessary.

## Alternatives Considered

- Support React 19 only.
- Keep React 18-only metadata.
- Rebase the entire refactor onto `main`.

## Consequences

- Both supported React majors need meaningful build/type/test verification.
- The peer range should be explicit rather than accidentally broader than tested support.
- Branch history remains focused on the refactor.

## Related Files

- `packages/emblor/package.json`
- `pnpm-lock.yaml`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

React 18-only package metadata for v2.

## Superseded By

None.

## Notes

The current peer range is `>=18.0.0`, which unintentionally admits future majors. The final range should intentionally constrain support to React 18 and 19.
