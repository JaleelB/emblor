# 0025 — Make Clear All-or-Nothing Under minTags

## Status

Accepted

## Context

`EmblorClear` semantically removes all tags, while `minTags` is an invariant enforced by individual removal. The provisional Clear component is disabled only when the current count is already at or below `minTags`, so it can clear a larger collection to zero and violate the same constraint. Partially clearing down to the minimum would require Emblor to choose an arbitrary subset to preserve.

## Decision

`EmblorClear` is an all-or-nothing remove-all operation.

- When `minTags` is omitted or zero, Clear removes every tag.
- Whenever `minTags > 0`, Clear is disabled regardless of the current tag count.
- Clear never preserves an arbitrary first, last, focused, or recently added subset.
- A disabled Clear emits neither `onValueChange` nor other mutation notifications.
- Individual tag removal remains enabled only while the resulting count stays greater than or equal to `minTags`.
- `required` remains separate native validation: `required` alone does not disable Clear, and clearing may produce an empty invalid field that must be corrected before valid submission.

Programmatic controlled prop updates remain consumer-owned and may supply values below `minTags`; Emblor's built-in mutation actions will not create such a value.

## Alternatives Considered

- Allow Clear to bypass `minTags` and remove everything.
- Clear down to the first `minTags` values.
- Clear down to the last `minTags` values.
- Treat `minTags` only as validation and allow all intermediate mutations.
- Hide Clear rather than disabling it.

## Consequences

- Built-in removal operations enforce `minTags` consistently.
- Clear's name remains semantically accurate and never means “reduce to minimum.”
- Clear has no enabled action when `minTags > 0`; consumers may omit it or render a differently named custom controlled-state action if partial reduction is desired.
- Styling can use native disabled state and `data-disabled` without a separate hidden-state contract.
- Tests must cover every count relative to `minTags`, required-only clearing, callback silence, individual-removal boundaries, controlled below-minimum values, and dynamic `minTags` changes.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-tag-remove.tsx`
- `packages/emblor/src/core/components/tags-input-clear.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional Clear disabled rule based only on `tagCount <= minTags`.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12. `minTags` is a built-in mutation guard, whereas `required` is a native validation constraint.
