# 0028 — Ignore Tag Keyboard Behavior During IME Composition

## Status

Accepted

## Context

Input method editors use keys such as Enter, arrows, Backspace, and sometimes Tab to select and edit composition candidates. The provisional Input keydown handler interprets those same keys as tag commit and navigation commands without checking composition state, which can prematurely commit or manipulate tags while users enter Japanese, Chinese, Korean, and other composed text.

## Decision

While a keyboard event reports active composition through the platform/React composition signal, Emblor will not interpret Enter, Tab, configured delimiters, Backspace, Delete, Home, End, or arrow keys as tag-input commands.

During composition:

- Do not commit, remove, or navigate tags.
- Do not prevent the native keyboard event on Emblor's behalf.
- Do not validate, reject, change tag values, clear draft state, or announce tag actions.
- Continue allowing native input and composition events so Root-owned draft state reflects the composed text through the normal change path.

After `compositionend`, subsequent non-composing keyboard events follow the ordinary Emblor contract. Composition end alone does not commit a tag. Paste behavior is unchanged.

Consumer native event handlers still run according to the accepted event-composition contract.

## Alternatives Considered

- Treat composing Enter as a normal tag commit.
- Track composition only with local `compositionstart`/`compositionend` state.
- Suppress only Enter and delimiters but allow tag navigation/removal keys.
- Commit automatically on `compositionend`.

## Consequences

- IME candidate selection cannot accidentally create or remove tags.
- Keyboard handling must check the reliable React/native composition signal before every Emblor command branch.
- Controlled draft updates still receive composed text normally.
- Tests must simulate composition with Enter, delimiters, Tab, Backspace/Delete, arrows/Home/End, composition end, and the first subsequent ordinary commit key.

## Related Files

- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/src/core/components/tags-input-tag.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional composition-unaware keyboard handling.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12.
