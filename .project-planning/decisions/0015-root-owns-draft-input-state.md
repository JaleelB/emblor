# 0015 — Root Owns Draft Input State

## Status

Accepted

## Context

The provisional API splits state ownership: `EmblorRoot` owns tag values and commit behavior, while `EmblorInput` may independently own controlled draft text through `value` and `onValueChange`. A successful commit can therefore clear Root's store without clearing a controlled input or notifying the input-value owner.

## Decision

`EmblorRoot` will own controlled and uncontrolled draft input state alongside tag state through:

```ts
inputValue?: string
defaultInputValue?: string
onInputValueChange?: (value: string) => void
```

`EmblorInput` will render and interact with the Root-owned draft. Remove its custom `value` and `onValueChange` state API. It may retain standard DOM event callbacks, composed so that consumer cancellation behavior is intentional and documented.

All draft mutations—typing, successful commit, discard-on-blur, clear behavior where applicable, and controlled integrations—must flow through one Root action that updates uncontrolled state or calls `onInputValueChange` for controlled state.

## Alternatives Considered

- Keep controlled draft state on `EmblorInput` and register child callbacks with Root.
- Keep independent child state and use effects to react to successful commits.
- Make draft text internal-only and remove controlled integration support.
- Expose an imperative input-clearing API.

## Consequences

- Tag behavior and draft behavior have one authoritative state owner.
- Controlled autocomplete or filtering compositions remain possible through Root props.
- Successful commits and discard behavior can reliably clear both controlled and uncontrolled inputs.
- The provisional playground examples and input prop types must migrate.
- Tests must cover controlled and uncontrolled typing, commit clearing, blur behavior, and callback ordering.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/playground/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional `EmblorInput value/onValueChange` controlled-state boundary.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-11 after baseline plan synthesis exposed stale controlled-input behavior.
