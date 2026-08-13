# 0033 — Use a Single Input and TagList with Multiple Labels

## Status

Superseded

## Context

Emblor Root owns one draft, one visible invalid-focus target, and one index-to-tag-node navigation registry. Multiple Input or TagList instances under the same Root would make those responsibilities ambiguous or duplicate the same committed values. Labels differ because HTML natively permits multiple labels for one form control and concatenates their contribution to its accessible name.

## Decision

A single Emblor Root permits at most one concurrently mounted `EmblorInput` and at most one concurrently mounted `EmblorTagList`, including descendants rendered through portals that consume the same Root context.

Private Root registration tracks the identity of each structural singleton. Mounting a second concurrent Input or TagList throws a descriptive error consistently in development and production. Registration and cleanup must remain correct under React Strict Mode and ordinary conditional replacement.

Neither Input nor TagList is required at runtime. Root may temporarily or permanently render without either part, preserving conditional composition and read-only/presentation use cases. Documentation identifies one Input and one TagList as the normal complete interactive composition.

Root permits any number of `EmblorLabel` instances. Every Label without an explicit native association override automatically targets the single Input. Automatically associated Label IDs are registered with Root so they can contribute to Root's accessible name in deterministic DOM order.

Explicit consumer `id`, `htmlFor`, `aria-label`, and `aria-labelledby` props remain supported through the existing native-prop forwarding and precedence contract. A Label that explicitly targets another element is not automatically registered as an Emblor label. Consumer-provided accessible-name props are not overwritten by automatic association.

Other action or presentation parts are not structural singletons. Multiple `EmblorClear` instances and repeated Tag, TagText, and TagRemove instances remain valid where their existing contexts permit them.

## Alternatives Considered

- Allow multiple Inputs synchronized to the same draft.
- Allow multiple TagLists rendering the same Root values.
- Require exactly one Input and one TagList at all times.
- Restrict Root to one Label.
- Treat every public compound part as a singleton.
- Silently let the last mounted Input or TagList replace the previous registration.

## Consequences

- Draft ownership, native invalid focus, and input-return focus remain unambiguous.
- Tag node registration and keyboard navigation have one rendered list authority.
- Conditional composition remains possible without mount-order warnings for temporarily absent parts.
- Native multiple-label use cases remain supported, with additional private ID registration work.
- Consumers needing two independent editors or two rendered tag collections should compose two Roots and coordinate their controlled state explicitly.
- Tests must cover duplicate structural parts, portals, Strict Mode, conditional replacement, absent parts, multiple labels, explicit association overrides, accessible-name ordering, and permitted repeated action parts.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/src/core/components/tags-input-label.tsx`
- `packages/emblor/src/core/components/tags-input-list.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The unresolved compound-part cardinality contract.

## Superseded By

DR-0034 — Require One Input and Allow at Most One TagList.

## Notes

Accepted by Jaleel on 2026-08-12. Superseded later that day by DR-0034 after the final audit showed that permitting a missing Input conflicted with form, focus, labeling, and draft ownership guarantees.
