# 0016 — Guarantee DOM Prop Forwarding and Polymorphic Styling

## Status

Accepted

## Context

Emblor is a headless primitive, so consumers must be able to style and extend the actual elements it renders. Most provisional parts spread native props, but `EmblorRoot` only forwards a small hand-picked set. The current `as?: React.ElementType` implementation also changes the runtime element without providing fully corresponding TypeScript props and ref types.

## Decision

Every public Emblor part will forward applicable, non-consumed props to its rendered element. This guarantee includes `className`, `style`, standard HTML and ARIA attributes, custom `data-*` attributes, and supported native event handlers.

Every public part will retain the `as` polymorphic contract. Its public TypeScript props and forwarded ref will adapt to the selected intrinsic element or React component while preserving Emblor-owned props. Emblor-owned behavior, required semantics, IDs, state attributes, and composed event handling take precedence where blindly forwarding a conflicting prop would break the component contract.

The package will not add `asChild`, a styling runtime, theme tokens, built-in visual CSS, CVA variants, or named style-slot props. Consumers style rendered elements with ordinary platform props, selectors, and their chosen styling system.

## Alternatives Considered

- Keep the current partially forwarded and loosely typed `as` behavior.
- Support only fixed intrinsic elements.
- Add Radix-style `asChild` composition.
- Add library-specific `classNames`, `styles`, variants, or theme props.

## Consequences

- CSS, CSS Modules, utility CSS, inline styles, and CSS-in-JS class names work consistently on every part.
- Consumers can attach their own ARIA and data attributes when they do not conflict with required component semantics.
- Root must be changed from a hand-picked prop surface to native prop forwarding.
- Polymorphic helper types are part of the public type design, while their implementation utilities remain internal.
- Event-handler composition and prop precedence must be documented and tested so customization cannot silently disable required behavior.
- Compile-time fixtures must verify intrinsic-element props, custom components, and element-specific refs selected through `as`.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/utils/index.ts`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/src/core/components/tags-input-label.tsx`
- `packages/emblor/src/core/components/tags-input-tag-list.tsx`
- `packages/emblor/src/core/components/tags-input-tag.tsx`
- `packages/emblor/src/core/components/tags-input-tag-remove.tsx`
- `packages/emblor/src/core/components/tags-input-clear.tsx`
- `packages/emblor/tests/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional partial DOM-prop forwarding and loosely typed `as?: React.ElementType` contract.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-11. Full prop forwarding means applicable props subject to required semantic and behavioral invariants; it does not mean consumers can override internal IDs, roles, state markers, or handlers in ways that break the primitive.
