# 0019 — Expose Controlled Invalid State and Structured Rejections

## Status

Accepted

## Context

The provisional implementation stores only the string `invalid` after any rejected commit. Consumers cannot distinguish empty, length, duplicate, capacity, or custom validation failures, and there is no supported way for a form library or server response to mark Emblor persistently invalid. The accepted boolean `validate` callback should remain a predicate rather than acquiring error-message or transformation responsibilities.

## Decision

Add the following public rejection contract:

```ts
type EmblorRejectReason =
  | 'empty'
  | 'min-length'
  | 'max-length'
  | 'duplicate'
  | 'max-tags'
  | 'custom';

type EmblorRejection = {
  rawValue: string;
  value: string;
  reason: EmblorRejectReason;
  source: 'keyboard' | 'paste' | 'blur';
};

invalid?: boolean;
onReject?: (rejection: EmblorRejection) => void;
```

`invalid` is an externally controlled persistent invalid signal suitable for form-library, server, or application validation. Emblor also tracks the most recent commit rejection internally as transient invalid state. Root and Input are invalid when either signal is present and expose stable `data-invalid` plus appropriate `aria-invalid` on the visible input.

Transient rejection state clears when the draft changes or a tag commits successfully. `onReject` fires once per rejected candidate with the original raw value, the trimmed/transformed canonical candidate, rejection reason, and commit source. A false result from `validate` reports `custom`.

Disabled or read-only commit attempts are ignored and do not emit `onReject`. Consumers own visible error messages and associate them using standard `aria-describedby`; Emblor does not add an error-message compound part in this decision.

## Alternatives Considered

- Keep a single internal boolean/string invalid flag.
- Make `validate` return error strings or structured results.
- Add an `EmblorErrorMessage` part.
- Expose only `onReject(value)` without reason or source metadata.
- Treat disabled/read-only attempts as rejection events.

## Consequences

- Consumers can render precise localized error messages without coupling validation to rendering.
- Form libraries can maintain invalid state independently from the transient draft lifecycle.
- Root and Input styling can use the same `data-invalid` hook.
- Paste may emit one rejection per rejected candidate; its batch policy remains a separate open decision.
- Tests must cover every rejection reason, raw versus canonical values, source, clearing rules, controlled invalid precedence, no disabled/read-only rejection, and `aria-describedby` composition.

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

The provisional undifferentiated internal `validationError: 'invalid'` state.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12. Native required validity from DR-0018 and `invalid` are both valid sources of visible invalid state; verification must cover their interaction.
