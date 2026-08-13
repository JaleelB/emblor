# 0022 — Use One Metadata-Rich Value Change Callback

## Status

Accepted

## Context

The provisional Root exposes `onValueChange`, `onTagAdd`, `onTagRemove`, `onClearAll`, and `onTagClick`. Multiple mutation callbacks create ordering and consistency questions, especially for controlled state and multi-value paste. Root-level tag clicks duplicate the native `onClick` already available on each `EmblorTag`.

## Decision

Use `onValueChange` as the only tag-value mutation callback and provide structured details with every accepted state transition:

```ts
type EmblorValueChangeDetails =
  | {
      type: 'add';
      value: string;
      index: number;
      source: 'keyboard' | 'blur';
    }
  | {
      type: 'add-many';
      values: string[];
      startIndex: number;
      source: 'paste';
    }
  | {
      type: 'remove';
      value: string;
      index: number;
      source: 'keyboard' | 'pointer';
    }
  | {
      type: 'clear';
      values: string[];
      source: 'keyboard' | 'pointer';
    };

onValueChange?: (
  value: string[],
  details: EmblorValueChangeDetails,
) => void;
```

One accepted state transition emits one `onValueChange` call. A paste transition uses `add-many` rather than emitting one callback per accepted tag. `values` in `clear` contains the values removed, in original order. `startIndex` identifies where the accepted pasted values begin in the next array.

Remove `onTagAdd`, `onTagRemove`, `onClearAll`, and Root-level `onTagClick`. Consumers handle tag interaction with the ordinary `onClick` forwarded by `EmblorTag`.

Rejected candidates do not produce `onValueChange`; they use `onReject` from DR-0019. Controlled and uncontrolled modes use the same callback contract. The remaining paste decision controls whether the `add-many` values represent partial acceptance or an all-or-nothing batch.

## Alternatives Considered

- Keep all convenience callbacks alongside `onValueChange`.
- Keep `onTagAdd` and `onTagRemove` but remove only clear/click callbacks.
- Expose a separate generic `onAction` callback.
- Emit one `onValueChange` for every accepted pasted candidate.
- Keep `onValueChange(nextValue)` without metadata.

## Consequences

- Each mutation has one authoritative notification and deterministic metadata.
- Consumers can distinguish additions, paste batches, removals, and clearing without diffing arrays.
- Root's API and callback-ordering surface become smaller.
- Tag click behavior remains directly composable through standard DOM handlers.
- Input modality classification for TagRemove and Clear activation must be implemented and tested consistently.
- Tests must verify callback count, next value, detail payload, canonical transformed values, source, controlled/uncontrolled parity, and silence on rejection or guarded actions.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/src/core/components/tags-input-tag.tsx`
- `packages/emblor/src/core/components/tags-input-tag-remove.tsx`
- `packages/emblor/src/core/components/tags-input-clear.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`
- `packages/emblor/MIGRATION.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional mutation convenience callbacks and Root-level `onTagClick`.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12. This decision describes user-driven Emblor transitions; receiving a new controlled `value` prop is not itself a callback-producing transition.
