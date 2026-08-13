# 0024 — Reject Overlength Tags Without Truncation

## Status

Accepted

## Context

The provisional implementation silently slices a candidate to `maxLength`. DR-0009 assigns rewriting exclusively to `transform`, and DR-0019 provides structured rejection reporting. Implicit truncation can change a tag's meaning, produce an unexpected duplicate, and make the committed value differ from what the user entered without an explicit consumer policy.

## Decision

Evaluate `minLength` and `maxLength` against the trimmed, transformed canonical candidate. If it exceeds `maxLength`, reject it without changing the draft, do not mutate tags, do not emit `onValueChange`, set transient invalid state, and emit `onReject` with `reason: 'max-length'`.

Emblor never truncates implicitly. Consumers who intentionally want truncation implement it through `transform`, after which length and duplicate validation operate on the transformed result.

The corresponding `minLength` behavior remains rejection with `reason: 'min-length'`.

## Alternatives Considered

- Silently truncate to `maxLength`.
- Truncate and emit a warning callback while committing.
- Prevent additional typing at the input using native `maxLength`.
- Remove Emblor's tag-length constraints entirely.

## Consequences

- Committed values are never silently changed by a validation constraint.
- Transformation order and rejection metadata stay predictable.
- The visible input may contain more characters than `maxLength`; the constraint applies to tag commitment, not raw typing.
- Consumers can still opt into truncation explicitly through `transform`.
- Tests must cover transformed length, unchanged draft, callback silence, `max-length` rejection, explicit truncation transforms, and duplicate checks after transformation.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional implicit `maxLength` truncation behavior.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12.
