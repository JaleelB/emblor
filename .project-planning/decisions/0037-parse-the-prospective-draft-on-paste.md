# 0037 — Parse the Prospective Draft on Paste

## Status

Accepted

## Context

When paste-to-add is enabled, parsing only clipboard text ignores the existing draft and its selection. That can detach a prefix the user already typed or produce behavior unlike native text insertion. The public contract also needs an explicit default and a clear cancellation boundary for consumer `onPaste` handlers.

## Decision

`addOnPaste` defaults to `true`.

When `addOnPaste` is false, Emblor does not intercept the paste event. Native editing inserts the clipboard content and the resulting change flows through the normal Root-owned draft contract.

When `addOnPaste` is true, the consumer's native Input `onPaste` handler runs first. If it calls `preventDefault()`, Emblor performs no built-in paste parsing or mutation.

Otherwise, Emblor constructs the prospective draft that native insertion would have produced:

```ts
draft.slice(0, selectionStart) + clipboardText + draft.slice(selectionEnd)
```

The complete prospective draft, rather than clipboard text alone, is split using the accepted literal delimiters and evaluated through the ordered batch pipeline from DR-0026. Selection replacement is therefore honored. A collapsed selection inserts at the caret. When the Input does not expose usable selection offsets, Emblor uses the end of the current draft for both offsets as the deterministic fallback.

With `delimiters={[]}`, the complete prospective draft is evaluated as one paste candidate. The same is true whenever no configured delimiter occurs in it.

If at least one candidate is accepted, Emblor publishes the one accepted `add-many` transition required by DR-0026 and clears the draft. If every non-empty candidate rejects, Emblor preserves the original pre-paste draft and restores its original selection after the controlled or uncontrolled render settles. Empty split segments remain ignored. An empty clipboard string causes no interception or Emblor action.

Controlled and uncontrolled modes use the same prospective-value and selection rules. In controlled mode, Emblor requests draft clearing through `onInputValueChange`; the owner remains responsible for applying the requested state as defined by the controlled-state contract.

## Alternatives Considered

- Parse only clipboard text.
- Append clipboard text to the draft regardless of caret position.
- Replace the entire draft with clipboard text before parsing.
- Default `addOnPaste` to false.
- Always intercept paste even when the consumer prevents default.
- Keep the prospective draft after partial success.
- Preserve the browser-mutated prospective draft after total rejection.

## Consequences

- Paste behaves as native insertion followed by tokenization.
- Existing prefixes, suffixes, caret position, and selected ranges participate predictably.
- A total rejection is non-destructive to both draft text and selection.
- Selection restoration introduces a post-render DOM step and must avoid overriding later user movement.
- Custom parsers retain a complete escape hatch through consumer `preventDefault()`.
- Tests must cover prefixes, suffixes, middle insertion, selection replacement, unavailable selection offsets, empty clipboard, empty delimiters, mixed acceptance, total rejection restoration, consumer cancellation, and controlled/uncontrolled parity.

## Related Files

- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The unresolved interaction between clipboard text, current draft, caret selection, and the `addOnPaste` default.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12.
