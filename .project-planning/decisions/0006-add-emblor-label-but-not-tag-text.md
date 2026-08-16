# 0006 — Add EmblorLabel but Not EmblorTagText

## Status

Superseded

## Context

The current core requires consumers to create a label identifier, pass it to `EmblorRoot` through `labelId`, and manually coordinate the rendered `<label>`. A first-party label primitive can own that association. By contrast, consumers already have each string while mapping their controlled tag values and can render tag text with ordinary markup.

## Decision

Add `EmblorLabel` as a core compound primitive. It will render a semantic `label` by default, support the package's polymorphic `as` convention, and automatically associate itself with the Emblor input and relevant grouped semantics.

Do not add `EmblorTagText`. `EmblorTag` will continue to render its current tag value when children are omitted, while consumers rendering custom tag contents can use their own text element.

Remove the need for routine consumer-managed `labelId` plumbing. Any retained labeling escape hatch must use standard ARIA/HTML props rather than a bespoke prop unless implementation constraints demonstrate a concrete need.

## Alternatives Considered

- Add both `EmblorLabel` and `EmblorTagText`.
- Add neither and retain manual `labelId` coordination.
- Add `EmblorTagText` without a label primitive.

## Consequences

- Common labeling becomes less error-prone and easier to demonstrate.
- The core gains one small semantic component and any internal registration needed to label the root/input correctly.
- Tag rendering remains flexible without introducing tag-item context solely for a text wrapper.
- Tests must verify label activation, accessible naming, custom IDs, and polymorphic rendering behavior.

## Related Files

- `packages/emblor/src/core/index.ts`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/src/types/index.ts`
- `packages/emblor/tests/core/`
- `packages/emblor/playground/src/examples/tags-input-core-only.tsx`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

Consumer-managed `labelId` as the normal labeling pattern in the provisional v2 API.

## Superseded By

DR-0017 — Render Root Values Through EmblorTagList and Add EmblorTagText.

## Notes

Accepted by Jaleel on 2026-08-11. Superseded later that day when the post-plan API audit exposed the uncontrolled rendering gap and Jaleel chose to add `EmblorTagText`.
