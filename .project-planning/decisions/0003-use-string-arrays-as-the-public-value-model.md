# 0003 — Use String Arrays as the Public Value Model

## Status

Accepted

## Context

Emblor v1 exposed arrays of `{ id, text }` objects and required callers to coordinate active-tag state. Those details make ordinary controlled usage unnecessarily heavy.

## Decision

The v2 public value model is `string[]`, exposed through `value`, `defaultValue`, and `onValueChange`. DOM identifiers are generated internally, with an optional `generateTagId` customization point if retained by the final API review.

Consumers do not need to provide active-tag state for basic usage. Internal focus state must be owned by the primitive unless a separately justified public control surface is accepted.

## Alternatives Considered

- Retain the v1 `{ id, text }[]` model.
- Make tag objects generic or consumer-defined.
- Require callers to coordinate focus or active indexes.

## Consequences

- Common controlled and uncontrolled usage becomes simpler.
- Object metadata belongs in consumer state outside Emblor.
- Duplicate string behavior requires an explicit `allowDuplicates` policy.
- The migration guide must explain the data-model break.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/tags-input-context.tsx`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The v1 public `Tag[]` model and required active-index props.

## Superseded By

None.

## Notes

The current source still exposes optional `focusedIndex`, `setFocusedIndex`, `activeIndex`, and `setActiveIndex` props. Their removal or consolidation needs a final API decision.
