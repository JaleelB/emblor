# 0020 — Use Consumer-Owned Tag Identity

## Status

Accepted

## Context

The provisional core creates tag DOM IDs from the root ID and current index and exposes `generateTagId(tag, index)`. Index-derived IDs change meaning after insertion, removal, or reordering. Value-derived IDs collide when duplicates are allowed. Since the public value model is `string[]`, Emblor has no stable occurrence identity from which to derive dependable keys or IDs. The accepted focus model uses actual DOM focus and no longer needs tag IDs for `aria-activedescendant`.

## Decision

Remove `generateTagId` from the public API and stop assigning automatic DOM IDs to `EmblorTag`.

Consumers own React keys for rendered tag occurrences. Consumers may provide an ordinary optional `id` directly to `EmblorTag` when they need a DOM identifier; Emblor will forward and preserve it under the accepted DOM-prop contract.

Emblor will use the current positional index only as ephemeral internal information for value lookup, removal, nested tag context, and DOM-node focus navigation. It will not describe that index as stable item identity.

## Alternatives Considered

- Keep default index-derived IDs.
- Keep `generateTagId` as an escape hatch.
- Generate IDs from tag strings.
- Internally reconcile opaque occurrence IDs across array changes.
- Restore object values containing stable IDs.

## Consequences

- Emblor does not make an identity guarantee it cannot uphold with `string[]` and duplicates.
- React key selection remains explicit consumer responsibility.
- DOM output is cleaner when no external relationship requires an ID.
- Focus navigation continues to use private current-index-to-node registration.
- Documentation must avoid recommending index-based keys as generally stable and explain duplicate/reorder considerations.
- Tests must verify no automatic tag ID, preservation of a supplied `id`, duplicate safety, and focus navigation after insertion/removal/reorder-like controlled updates.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-tag-list.tsx`
- `packages/emblor/src/core/components/tags-input-tag.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional automatic tag-ID generation and public `generateTagId` callback.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12. This decision does not prohibit a consumer from using index-derived keys or IDs when their own data lifecycle makes that choice safe.
