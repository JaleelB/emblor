# 0030 — Keep Input Editable at maxTags

## Status

Accepted

## Context

Reaching `maxTags` prevents another tag from being committed, but it does not inherently make the draft input unavailable. Automatically disabling or making the visible input read-only at capacity would remove a useful focus target, disrupt label and keyboard-navigation behavior, and discard the opportunity to preserve a draft until an existing tag is removed.

## Decision

`EmblorInput` remains enabled, focusable, and editable when the committed tag count reaches `maxTags`.

At capacity:

- Root and Input expose `data-max-reached` for consumer styling.
- Draft changes continue through the normal controlled or uncontrolled draft-state contract.
- A commit attempt for a non-empty candidate is rejected with `reason: 'max-tags'`.
- The rejected draft remains intact.
- `onReject` and the corresponding rejection announcement follow the accepted rejection contracts.
- `onValueChange` is not called.
- Removing a tag makes capacity available and leaves the existing draft ready for a later commit.

Only explicit consumer-supplied `disabled` or `readOnly` state prevents input editing. Reaching `maxTags` does not implicitly set either native state or `aria-disabled`.

The existing full-capacity placeholder customization remains applicable when the draft is empty. It is presentation only and does not change the input's interactivity.

## Alternatives Considered

- Disable the input automatically at capacity.
- Make the input read-only automatically at capacity.
- Clear or block draft edits once capacity is reached.
- Automatically commit a preserved draft as soon as a tag is removed.

## Consequences

- The input remains a stable focus and navigation target at capacity.
- Consumers can style and explain the capacity state without Emblor imposing a disabled interaction model.
- Users may type a draft that cannot yet be committed; rejection feedback explains why and the draft is recoverable.
- Removing a tag does not cause an implicit mutation beyond that removal; committing the preserved draft remains an explicit later action.
- Tests must cover controlled and uncontrolled drafts, keyboard/blur/paste rejection, focus retention, `data-max-reached`, removal below capacity, and explicit disabled/read-only precedence.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The unresolved capacity-interaction behavior.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12.
