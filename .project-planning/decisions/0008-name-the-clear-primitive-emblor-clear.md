# 0008 — Name the Clear Primitive EmblorClear

## Status

Accepted

## Context

The provisional v2 core exports `EmblorClearTrigger`, while the accepted flat namespace in the project handoff names the primitive `EmblorClear`. The provisional name has not been published as a stable v2 contract.

## Decision

Rename the core clear-all primitive to `EmblorClear` and rename its public prop type to `EmblorClearProps`.

Do not export `EmblorClearTrigger` as an alias, deprecated or otherwise. Update source, tests, playground examples, and documentation to use only `EmblorClear`.

## Alternatives Considered

- Keep `EmblorClearTrigger` as the canonical name.
- Export `EmblorClear` and retain `EmblorClearTrigger` as a deprecated alias for one release.
- Export both names indefinitely.

## Consequences

- The public component namespace remains concise and matches the accepted v2 naming scheme.
- No compatibility baggage is introduced for an unpublished provisional API.
- Every internal and example import of `EmblorClearTrigger` must be updated atomically.
- The migration guide only needs to describe v1-to-v2 clear behavior, not provisional v2 aliases.

## Related Files

- `packages/emblor/src/core/components/tags-input-clear-trigger.tsx`
- `packages/emblor/src/core/index.ts`
- `packages/emblor/src/types/index.ts`
- `packages/emblor/tests/core/tags-input-clear-trigger.test.tsx`
- `packages/emblor/playground/src/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional `EmblorClearTrigger` name.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-11.
