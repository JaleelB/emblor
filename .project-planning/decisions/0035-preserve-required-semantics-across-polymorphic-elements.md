# 0035 — Preserve Required Semantics Across Polymorphic Elements

## Status

Accepted

## Context

DR-0016 guarantees a type-safe polymorphic `as` prop on every public part, but changing an intrinsic element can remove native list, label, button, or text-entry semantics. A headless component must remain style- and markup-flexible without silently transferring all accessibility and keyboard obligations to consumers.

## Decision

The `as` prop changes the rendered element but never removes Emblor's required behavior or accessibility semantics.

Root preserves `role="group"`. TagList preserves `role="list"`. Tag preserves `role="listitem"`, its focusability, and its keyboard-navigation behavior. TagText imposes no role.

Label renders `label` by default. When rendered as another element or component, Emblor preserves automatic accessible naming and click-to-focus behavior through private ID registration and composed activation handling. Explicit native association and naming overrides continue to follow DR-0034 and the documented prop-precedence contract.

TagRemove and Clear render `button` by default and use `type="button"`. When rendered as a non-button element or component, Emblor supplies button-equivalent semantics and interaction:

- `role="button"`
- keyboard focusability
- Enter and Space activation
- `aria-disabled` and guarded activation when unavailable

Native buttons retain native keyboard activation rather than receiving duplicate synthetic activation. Emblor prevents Space scrolling when it handles non-button activation and emits exactly one action for a physical activation.

Input supports the intrinsic `input`, intrinsic `textarea`, or a compatible ref-forwarding custom component. Incompatible intrinsic elements are rejected by public TypeScript types. A custom component must ultimately expose an input-like DOM node supporting focus, string value/change interaction, and the selection APIs required by caret-boundary navigation. Emblor throws a descriptive runtime error after ref registration when that contract is not met.

Emblor-owned roles, IDs, required state attributes, safety properties, and behavioral handlers take precedence when a conflicting consumer prop would break the primitive. Consumer event handlers run first. When an internal action supports cancellation, consumer `preventDefault()` cancels that Emblor action; otherwise required synchronization and safety behavior still runs. The cancellable-event matrix is documented and verified per part.

## Alternatives Considered

- Treat `as` as markup-only and make consumers restore all lost semantics.
- Restrict every part to its default intrinsic element.
- Permit arbitrary Input elements and rely entirely on TypeScript structural props.
- Add `asChild` instead of maintaining `as`.
- Always synthesize keyboard activation, including on native buttons.
- Let consumer roles, IDs, and handlers override required Emblor semantics.

## Consequences

- Polymorphism remains useful without making accessible behavior conditional on consumer expertise.
- Non-button Clear and TagRemove variants behave like real buttons across pointer and keyboard input.
- Custom Input components must forward a ref to a compatible DOM node; components that do not do so fail clearly.
- The polymorphic type layer must narrow Input intrinsic choices while retaining compatible custom components and correctly typed refs.
- Event composition requires explicit cancellation tests rather than a universal blind-spread rule.
- Tests must cover default and polymorphic roles, keyboard activation, disabled guards, Space scrolling, exactly-once actions, Label click focus, Input compatibility failures, consumer cancellation, and protected prop precedence.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/utils/index.ts`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/src/core/components/tags-input-label.tsx`
- `packages/emblor/src/core/components/tags-input-tag-list.tsx`
- `packages/emblor/src/core/components/tags-input-tag.tsx`
- `packages/emblor/src/core/components/tags-input-tag-text.tsx`
- `packages/emblor/src/core/components/tags-input-tag-remove.tsx`
- `packages/emblor/src/core/components/tags-input-clear.tsx`
- `packages/emblor/tests/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The unresolved semantic extent of the polymorphic contract under DR-0016.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12. This decision refines but does not supersede DR-0016.
