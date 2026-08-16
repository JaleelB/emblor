# 0023 — Use Native Prop Names and Keep Only Emblor-Specific Root Props

## Status

Accepted

## Context

The provisional API duplicates several native React DOM props with custom names or moves them to Root: `onInputKeydown`, `ariaDescribedBy`, and `ariaLabel`. It also uses the unnecessarily qualified `inputBlurBehavior`. These aliases make prop forwarding less predictable and weaken the compound boundary between Root behavior and Input/button element behavior.

## Decision

Apply the following final naming cleanup:

- Rename Root `inputBlurBehavior` to `blurBehavior` with values `'commit' | 'discard' | 'noop'`.
- Remove Root `onInputKeydown`; consumers use native `onKeyDown` on `EmblorInput`.
- Remove Input `ariaDescribedBy`; consumers use native `'aria-describedby'`.
- Remove `ariaLabel` from `EmblorTagRemove` and `EmblorClear`; consumers use native `'aria-label'`.
- Standardize React event capitalization as `onKeyDown`, never `onKeydown`.
- Keep `placeholderWhenFull`, `minTags`, `maxTags`, `minLength`, `maxLength`, `allowDuplicates`, `addOnPaste`, and `addOnTab` because they describe Emblor behavior rather than native element behavior.
- Keep standard React casing for `readOnly` and `disabled`.

Root should own cross-part tag-input behavior and state. Element-specific DOM attributes and handlers belong directly on the public part that renders the element.

## Alternatives Considered

- Keep all provisional aliases for convenience.
- Support both native and custom aliases with precedence rules.
- Move more native input props to Root.
- Rename all behavioral props to shorter generic names.

## Consequences

- Consumers use familiar React DOM APIs without learning aliases.
- Root's public surface becomes smaller and more semantically focused.
- Prop forwarding and TypeScript polymorphism have fewer collision and precedence cases.
- Migration documentation must explicitly map removed provisional and v1 names.
- Tests and fixtures must verify native handler composition, quoted ARIA props, event cancellation behavior, and absence of removed aliases.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/src/core/components/tags-input-tag-remove.tsx`
- `packages/emblor/src/core/components/tags-input-clear.tsx`
- `packages/emblor/tests/`
- `packages/emblor/playground/`
- `packages/emblor/README.md`
- `packages/emblor/MIGRATION.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional `inputBlurBehavior`, `onInputKeydown`, `ariaDescribedBy`, and `ariaLabel` props.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12.
