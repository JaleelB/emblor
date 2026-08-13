# 0039 — Trust External String Values and Enforce Rendered Index Integrity

## Status

Accepted

## Context

Root accepts consumer-owned controlled or initial tag arrays, while built-in commits apply transformation and validation. Reapplying those policies to external state would silently rewrite ownership. Separately, positional `EmblorTag index` values drive rendering, removal, and focus registration, so invalid or duplicate rendered indexes could target the wrong value or corrupt navigation.

## Decision

`value` and `defaultValue`, when supplied, must be arrays containing only strings. Root throws a descriptive runtime error for a non-array value or any non-string member.

Valid externally supplied strings are authoritative. Emblor does not trim, transform, validate, deduplicate, truncate, or reject them. This includes empty strings, whitespace-only strings, duplicates while `allowDuplicates` is false, strings outside current length bounds, and arrays outside current tag-count bounds. Receiving or initializing from such values does not emit `onValueChange`, `onReject`, or an announcement. Current constraints govern only subsequent built-in Emblor actions, consistent with DR-0031.

When `value` is defined, Root is controlled and it takes precedence over `defaultValue`. `defaultValue` is only the uncontrolled initial value and native-reset baseline. Root records its ownership mode on first render; switching between controlled and uncontrolled tag state after mount throws a descriptive error because ownership and reset behavior would otherwise become ambiguous.

`EmblorTag index` is a positional reference into the current Root value. It must be a finite, non-negative integer strictly less than the current value length. A mounted Root may have at most one EmblorTag registered for each current index, including across portals. Invalid, out-of-range, or concurrently duplicated indexes throw descriptive errors. Registration and cleanup must be safe under React Strict Mode and atomic replacement.

TagText renders the exact current string at its containing Tag's index when children are omitted. No normalization occurs during rendering.

Rendering a Tag for every current value is not required. The TagList item-render function may return `null`, and static composition may omit indexes. Omitted values remain committed state: they count toward all constraints and state attributes and participate in native form submission.

Keyboard navigation operates over currently mounted Tag nodes in ascending value-index order and skips unmounted indexes. Reordering the external array changes positional indexes. Consumers remain responsible for React keys and stable occurrence identity as defined by DR-0020.

## Alternatives Considered

- Run transform and validation over every incoming value array.
- Reject externally supplied values that violate active constraints.
- Silently remove invalid or duplicate external values.
- Permit controlled/uncontrolled ownership switching with warnings.
- Clamp invalid Tag indexes or render nothing silently.
- Allow multiple Tags to register the same index.
- Require every current value to have exactly one mounted Tag.
- Navigate by raw DOM order regardless of value index.

## Consequences

- Controlled consumers retain complete authority over their state without hidden reconciliation.
- Runtime shape mistakes and structural index mistakes fail close to their source.
- Consumers can intentionally filter or virtualize rendered tags while preserving the complete submitted value.
- A visually omitted value still affects capacity and submission, so this behavior must be documented clearly.
- Focus/navigation helpers must operate over a sparse index-to-node registry.
- Tests must cover invalid runtime shapes, externally out-of-policy strings, mode switching, callback silence, invalid/duplicate indexes, portals, Strict Mode, omissions, sparse navigation, exact TagText output, form submission, and reordered values.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/utils/index.ts`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-tag-list.tsx`
- `packages/emblor/src/core/components/tags-input-tag.tsx`
- `packages/emblor/src/core/components/tags-input-tag-text.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The unresolved external-value normalization and rendered-index integrity contracts.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12.
