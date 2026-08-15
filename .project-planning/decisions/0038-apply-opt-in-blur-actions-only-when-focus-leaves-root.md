# 0038 — Apply Opt-In Blur Actions Only When Focus Leaves Root

## Status

Accepted

## Context

The three accepted `blurBehavior` values did not define a default or whether an Input blur caused by focusing a Tag, TagRemove, or Clear control should commit or discard. Acting on every immediate Input blur can mutate tag indexes before an internal click completes and makes ordinary navigation destructive.

## Decision

`blurBehavior` defaults to `'noop'`.

Blur behavior is evaluated only after focus leaves the entire Emblor Root. Moving focus from Input to a Tag, TagRemove, Clear, Label, or any other descendant consuming or rendered inside the same Root does not commit or discard the draft.

The implementation resolves the final focus destination rather than acting solely on the Input's immediate blur event. Internal pointer intent and the post-event active element must be handled so clicking an internal action cannot trigger a blur mutation before that action. Descendants rendered through a portal and registered with the same Root count as internal for this focus-boundary decision even when DOM containment alone is insufficient.

The consumer's native Input `onBlur` handler runs first. Calling `preventDefault()` cancels Emblor's configured blur action, although it does not reverse the browser's focus change.

When an uncancelled focus transition leaves Root:

- `'commit'` performs one normal commit attempt with `source: 'blur'`. A successful commit clears the draft; rejection preserves it and follows the accepted rejection/announcement contracts.
- `'discard'` clears the draft without changing tags, emitting `onReject`, or announcing a mutation.
- `'noop'` preserves the draft and performs no Emblor action.

Disabled and read-only Roots never perform a configured blur action. Root unmount does not commit or discard. Controlled and uncontrolled drafts use the same action ordering; controlled clearing is requested through `onInputValueChange` and remains owner-applied.

## Alternatives Considered

- Default to `'commit'` as in the provisional implementation.
- Default to `'discard'`.
- Apply behavior on every Input blur, including internal focus movement.
- Treat only DOM-contained descendants as internal and ignore registered portals.
- Make consumer `onBlur` observational and non-cancellable.
- Run blur behavior during Root unmount.

## Consequences

- Merely leaving or navigating within the field is non-destructive by default.
- Internal removal and clearing cannot race an implicit draft commit.
- Opt-in commit and discard remain available for form designs that need them.
- Root needs focus-boundary coordination beyond a simple Input blur callback, including portal registration and deferred focus resolution.
- Tests must cover every behavior, internal and external focus movement, pointer actions, portals, cancellation, rejection, disabled/read-only state, unmount, and controlled/uncontrolled ordering.

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

The unresolved default and event ordering for `blurBehavior`.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12.
