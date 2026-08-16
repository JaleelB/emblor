# 0018 — Support Native Forms with Repeated Values

## Status

Accepted

## Context

A tag input commonly represents one logical form field with multiple string values. Without an explicit form contract, Emblor values exist only in React state, native `FormData` omits them, native reset cannot restore uncontrolled defaults, and `required` semantics are ambiguous because draft text is not yet a committed tag.

## Decision

`EmblorRoot` will support native form participation through `name?: string` and `required?: boolean`.

When `name` is present, each committed tag will be submitted as a repeated successful form value under that exact name, preserving tag order. For example, tags `React` and `TypeScript` with `name="skills"` produce two `FormData` entries named `skills`. Consumers who prefer bracket notation may pass `name="skills[]"`; Emblor will not rewrite the name or serialize the array as JSON.

`required` means at least one committed tag. Non-empty draft text does not satisfy the constraint. Native constraint validation must direct the user to the visible Emblor input and expose appropriate required/invalid accessibility state rather than focusing an inaccessible internal control.

When Root is disabled, its values are excluded from submission and its required constraint is disabled. Read-only values remain successful form values. A native form reset restores uncontrolled tags to `defaultValue` and uncontrolled draft text to `defaultInputValue`. Controlled tag and draft state remain owner-controlled and are not mutated by native reset.

Internal controls used for form participation are implementation details and are not public compound parts.

## Alternatives Considered

- Provide no native form support and require consumers to create hidden inputs.
- Submit one JSON-encoded array value.
- Submit only the current draft input.
- Treat non-empty draft text as satisfying `required`.
- Reset controlled state by invoking change callbacks with defaults.

## Consequences

- Emblor works with native forms and `FormData` without consumer glue.
- Server frameworks receive repeated ordered values using normal platform semantics.
- Form ownership, reset listeners, internal controls, validity, and invalid-focus routing require focused browser and DOM tests.
- The implementation must not leak internal form controls into the accessibility tree or styling contract.
- README and migration examples must document repeated fields and controlled reset ownership.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/tests/compat/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional absence of a native form contract.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12. The exact internal form-control technique is intentionally not public API, but it must pass real submission, reset, constraint-validation, and focus tests.
