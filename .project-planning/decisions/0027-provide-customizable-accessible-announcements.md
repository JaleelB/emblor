# 0027 — Provide Customizable Accessible Announcements

## Status

Accepted

## Context

Emblor must announce tag mutations and rejections for screen-reader users, but fixed English messages would make the primitive difficult to localize. Requiring consumers to render and synchronize their own live region would duplicate internal events and make accessibility opt-in.

## Decision

Root will expose:

```ts
type EmblorAnnouncement =
  | { type: 'add'; value: string }
  | { type: 'add-many'; values: string[] }
  | { type: 'remove'; value: string }
  | { type: 'clear'; values: string[] }
  | { type: 'reject'; rejection: EmblorRejection };

getAnnouncement?: (announcement: EmblorAnnouncement) => string;
```

Emblor provides concise default English formatting for every announcement variant. Consumers may localize or customize messages through `getAnnouncement`. Returning an empty string suppresses that individual announcement.

Root owns a private visually hidden `aria-live="polite"`, `aria-atomic="true"` region. Announcements are derived from the same accepted mutation and rejection events used by `onValueChange` and `onReject`, not from a second independently ordered callback system.

One mutation transition produces one mutation announcement. A partial paste produces individual rejection announcements for rejected candidates and one `add-many` announcement for accepted values, in the same documented event order. Guarded disabled/read-only actions and controlled prop synchronization produce no announcements.

## Alternatives Considered

- Use fixed English messages only.
- Require consumers to render a public live-region part.
- Expose separate callbacks for every announcement type.
- Disable default announcements unless configured.
- Allow arbitrary React nodes instead of strings.

## Consequences

- Accessibility works by default and remains localizable.
- Consumers do not need access to private store or live-region internals.
- Empty-string suppression supports applications with another announcement system.
- Default messages and event ordering become tested behavior.
- Tests must cover every default message, customization, localization, suppression, paste ordering, atomic/polite semantics, repeat announcements, and silence for guarded or prop-sync actions.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- A private live-region implementation under `packages/emblor/src/core/`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional stored-but-unrendered `lastAction` state and the unresolved fixed-versus-customizable message policy.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12. Announcement strings are plain text; consumers needing richer visible feedback use `onValueChange` and `onReject` to render their own UI.
