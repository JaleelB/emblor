# 0031 — Fail Fast on Invalid Constraints Without Retroactive Mutation

## Status

Accepted

## Context

The numeric constraint props accept JavaScript `number` values, so TypeScript alone cannot prevent negative numbers, fractional values, `NaN`, infinities, or contradictory minimum and maximum bounds. Dynamic prop changes can also leave existing committed tags or drafts outside newly tightened constraints. Without an explicit contract, the implementation could silently clamp configuration, rewrite consumer state, or behave differently across actions.

## Decision

`minTags`, `maxTags`, `minLength`, and `maxLength`, when provided, must each be a finite, non-negative integer. Root throws a descriptive configuration error when any supplied bound is invalid.

The following relationships are also required whenever both bounds are supplied:

- `minTags <= maxTags`
- `minLength <= maxLength`

Root throws a descriptive configuration error when either relationship is violated. Configuration is validated on every render, including after dynamic prop changes. Invalid configuration is never silently clamped, swapped, or ignored, and its behavior does not differ between development and production.

Valid constraint changes do not retroactively mutate committed tags or draft text and do not emit `onValueChange`, `onReject`, or an announcement merely because props changed. The new constraints govern subsequent built-in actions and recompute derived state immediately.

In particular:

- If an existing tag count exceeds a newly reduced `maxTags`, additions remain rejected until capacity is available, while permitted removals can bring the value back within the bound.
- If an existing tag count is below a newly increased `minTags`, the value is accepted as externally supplied, additions remain available, and further built-in removal is blocked.
- Existing committed tags are not rewritten or removed when length bounds change.
- Existing draft text is preserved and evaluated against current length bounds only on a later commit attempt.
- Capacity attributes and Clear/Remove availability reflect the current constraints immediately.

Native `required` validity remains the separate committed-tag rule defined by DR-0018. Being outside `minTags`, `maxTags`, `minLength`, or `maxLength` after a valid dynamic change does not independently create a retroactive rejection event.

## Alternatives Considered

- Clamp negative or fractional bounds into a usable range.
- Swap contradictory minimum and maximum values.
- Ignore invalid constraints with a development-only warning.
- Throw only in development and normalize in production.
- Reconcile dynamic changes by truncating, deleting, or otherwise rewriting current values.
- Emit rejection events for values that predate a constraint change.

## Consequences

- Consumer configuration errors fail close to their source with consistent behavior in all environments.
- Zero remains a valid bound, including `maxTags={0}` and `maxLength={0}`.
- Controlled and uncontrolled values remain stable across valid dynamic configuration changes.
- Temporarily out-of-bounds existing state is possible, but built-in actions move toward or preserve the applicable bounds rather than performing surprise mutations.
- Tests must cover every invalid numeric shape, contradictory pairs, dynamic transitions across each boundary, callback and announcement silence, preserved values/drafts, and recomputed derived state.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-clear-trigger.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/src/core/components/tags-input-tag.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The unresolved invalid and dynamic constraint behavior.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12.
