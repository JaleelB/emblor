# 0029 — Use Direction-Aware Physical Arrow Navigation

## Status

Accepted

## Context

The provisional keyboard logic always treats ArrowLeft as previous and ArrowRight as next. In a normal right-to-left layout, value/DOM order is visually arranged from right to left, so that mapping makes the printed arrow direction move focus in the opposite visual direction. Emblor already guarantees native DOM prop forwarding, including `dir`, but its behavioral effect was not defined.

## Decision

Root supports `dir?: 'ltr' | 'rtl'` as both the native DOM direction and the tag-navigation direction. When omitted, Emblor resolves the effective inherited DOM direction from the rendered Root; the fallback before resolution is `ltr`.

Horizontal arrows move focus physically in the direction printed on the key:

- In LTR, ArrowLeft targets the previous index and ArrowRight targets the next index.
- In RTL, ArrowLeft targets the next index and ArrowRight targets the previous index.

Home targets index `0` and End targets the last index regardless of direction. Backspace and Delete semantics do not change with direction.

Input-to-tag boundary navigation uses the same effective direction and current caret boundary. Direction changes at runtime take effect for subsequent keyboard events without reordering the controlled `string[]`.

Keyboard order is derived from value/DOM order plus effective `dir`. Consumers who visually reorder items independently with CSS are responsible for keeping visual and DOM order coherent; Emblor will not measure arbitrary layouts to infer navigation.

## Alternatives Considered

- Always map Left to previous and Right to next.
- Expose direction only as a required explicit Emblor prop.
- Use logical previous/next navigation regardless of physical arrow direction.
- Measure element positions on every key event.
- Add vertical orientation behavior.

## Consequences

- Standard RTL layouts receive visually intuitive horizontal navigation.
- Root direction can inherit naturally or be set explicitly.
- The implementation must resolve effective inherited direction after mount and handle dynamic explicit/inherited direction changes.
- Custom CSS visual reordering is not an Emblor navigation feature.
- Tests must cover explicit/inherited LTR/RTL, runtime direction changes, tag and input boundary navigation, Home/End, caret boundaries, and unchanged Backspace/Delete behavior.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/src/core/components/tags-input-tag.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional direction-unaware horizontal navigation.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12. This decision concerns horizontal tag navigation only; Emblor does not introduce an orientation or vertical arrow-navigation API.
