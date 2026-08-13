# 0009 — Separate Tag Transformation from Validation

## Status

Accepted

## Context

The provisional `validateTag` callback returns `boolean | string`: `false` rejects a value while a returned string rewrites it. This overload makes validation and transformation difficult to understand and gives string results surprising semantics.

## Decision

Replace `validateTag` with two optional root props:

```ts
transform?: (value: string) => string
validate?: (value: string) => boolean
```

The commit pipeline will trim the raw input, apply `transform` when provided, then apply built-in length, duplicate, and capacity constraints and the custom `validate` predicate to the transformed value before committing it. An empty transformed value is invalid.

`validate` only decides acceptance and never rewrites the value. `transform` only rewrites the value and does not by itself signal validity.

## Alternatives Considered

- Keep `validateTag?: (value) => boolean | string` with string-as-rewrite semantics.
- Keep only boolean validation and remove custom rewriting.
- Use a structured result object containing validity, transformed value, and error details.
- Match Dice UI's `onValidate` name exactly.

## Consequences

- Transformation and validation behavior are explicit and independently testable.
- Duplicate checks operate on the final transformed value.
- Existing provisional `validateTag` usage must be migrated with no alias because v2 is a hard break.
- The implementation must define consistent failure signaling and accessible announcements for built-in and custom rejection.
- Tests must cover transformation before validation, transformation to an empty value, transformed duplicates, and validation rejection.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional overloaded `validateTag` contract.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-11.
