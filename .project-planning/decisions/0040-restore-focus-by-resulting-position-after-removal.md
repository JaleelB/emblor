# 0040 — Restore Focus by Resulting Position After Removal

## Status

Accepted

## Context

Removing a focused Tag or its focused TagRemove control removes the active DOM node. Without an explicit restoration contract, focus can fall to the document body or differ by mutation source. Sparse rendered indexes and controlled state make restoration more complex because the requested removal may not appear in the DOM immediately—or at all.

## Decision

After a successful individual Emblor removal is reflected in the rendered value, focus restoration uses the resulting positional order:

1. Focus the mounted Tag now occupying the removed index.
2. If none is mounted there or at a higher remaining index, focus the nearest mounted Tag at a lower index.
3. If no Tags are mounted, focus the required EmblorInput.

Sparse rendered indexes are skipped. The same policy applies to Tag Backspace/Delete and keyboard or pointer activation of TagRemove. Focus targets the Tag container, not a nested TagRemove control, so one roving-focus authority remains.

Focus moves only after the requested next value is reflected in the committed DOM. Uncontrolled mode schedules restoration after its render. Controlled mode retains a pending focus intent and applies it only if the owner supplies the exact requested next string array. If the owner does not apply the request or supplies different state, Emblor cancels the pending intent and does not move focus.

Emblor restores focus only when focus still belongs to the removal interaction or has fallen away because that focused node was removed. If a consumer deliberately moves focus elsewhere during `onValueChange` or before reconciliation, Emblor does not override it.

Guarded removal, consumer-cancelled activation, and rejection leave focus unchanged. Silent external controlled-value synchronization never creates removal focus intent.

After a successful Clear transition is reflected in the DOM, Emblor focuses Input under the same controlled acknowledgement and consumer-focus safeguards. Guarded or consumer-cancelled Clear leaves focus unchanged.

## Alternatives Considered

- Always focus Input after individual removal.
- Always focus the previous Tag.
- Focus a nested Remove control rather than the Tag container.
- Move focus immediately before the value transition renders.
- Assume controlled owners always apply the requested array.
- Restore focus after every external value change that removes an item.
- Override any consumer focus movement after removal.
- Leave Clear focus unspecified.

## Consequences

- Keyboard and assistive-technology users retain a predictable position in the tag sequence.
- Pointer-triggered removal cannot strand focus on a detached node.
- Sparse or filtered rendering still produces a stable fallback.
- Controlled mode needs an equality-checked pending focus intent tied to the requested transition.
- Focus restoration must distinguish a removed interaction target from deliberate consumer focus movement.
- Tests must cover first/middle/last removal, sparse nodes, every source, controlled acceptance/refusal/divergence, consumer focus changes, cancellation/guards, external sync, Clear, and exactly-once restoration.

## Related Files

- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/src/core/components/tags-input-tag.tsx`
- `packages/emblor/src/core/components/tags-input-tag-remove.tsx`
- `packages/emblor/src/core/components/tags-input-clear.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The unresolved post-removal focus policy.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12.
