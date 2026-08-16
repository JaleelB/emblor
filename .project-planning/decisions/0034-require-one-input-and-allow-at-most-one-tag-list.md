# 0034 — Require One Input and Allow at Most One TagList

## Status

Accepted

## Context

DR-0033 allowed Root to render without an Input for conditional or presentation-only composition. The final audit exposed a conflict with Root's actual responsibilities: it owns one draft, requires an unambiguous keyboard focus destination, automatically associates Labels, and must route native `required` validation to a visible text-entry control. The proposed no-Input use cases can use ordinary React markup or a custom component through `EmblorInput as={CustomInput}` without weakening those invariants.

## Decision

Every mounted `EmblorRoot` must contain exactly one concurrently mounted `EmblorInput` consuming that Root context. It may contain zero or one concurrently mounted `EmblorTagList`.

Private Root registration tracks the identity of Input and TagList. After descendant refs have registered for a committed tree:

- A missing Input throws a descriptive error.
- A second concurrent Input throws a descriptive error.
- A second concurrent TagList throws a descriptive error.

These errors are consistent in development and production. Registration, validation, and cleanup must work with descendants rendered through portals, React Strict Mode, and atomic conditional replacement of one Input or TagList instance with another. A committed tree may not temporarily omit Input; consumers should keep the Input mounted or conditionally mount the entire Root.

Consumers who need a custom editor use the polymorphic Input contract so Emblor retains draft, focus, validation, form, and accessibility coordination. A read-only or disabled Emblor field still renders its one Input with the corresponding state. Display-only tags that have no text-entry control use ordinary application markup rather than EmblorRoot.

Root continues to permit any number of `EmblorLabel` instances. Every Label without an explicit native association override automatically targets the required Input. Automatically associated Label IDs contribute to Root's accessible name in deterministic DOM order.

Explicit consumer `id`, `htmlFor`, `aria-label`, and `aria-labelledby` props remain supported through the native-prop forwarding and precedence contract. A Label explicitly targeting another element is not automatically registered as an Emblor label, and consumer-provided accessible-name props are not overwritten.

Other action and presentation parts are not structural singletons. Multiple `EmblorClear` instances and repeated Tag, TagText, and TagRemove instances remain valid where their existing contexts permit them.

## Alternatives Considered

- Permit Input to be absent unless `required` is enabled.
- Permit Input to be absent only while Root is read-only or disabled.
- Route invalid focus to Root when Input is absent.
- Allow consumers to substitute an unregistered external input.
- Require exactly one TagList as well as exactly one Input.
- Preserve DR-0033 unchanged and document the form contradiction.

## Consequences

- Root always has one authoritative draft editor and focus target.
- Native required validation, Label association, input-return navigation, and form error routing no longer need no-Input exceptions.
- TagList remains optional for integrations that render committed values elsewhere while retaining Emblor's editor.
- Presentation-only uses do not carry unnecessary Emblor state or behavioral machinery.
- Consumers conditionally hiding the editor must conditionally mount the whole Root or provide a compatible replacement in the same committed tree.
- Tests must cover missing and duplicate Inputs, duplicate TagLists, optional TagList, portals, Strict Mode, atomic replacement, read-only/disabled Inputs, custom Input components, multiple Labels, explicit association overrides, and repeated action parts.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/src/core/components/tags-input-label.tsx`
- `packages/emblor/src/core/components/tags-input-tag-list.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

DR-0033 — Use a Single Input and TagList with Multiple Labels.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12 after challenging the practical value of an EmblorRoot without an Input.
