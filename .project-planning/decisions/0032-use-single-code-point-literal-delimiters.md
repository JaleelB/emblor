# 0032 — Use Single-Code-Point Literal Delimiters

## Status

Accepted

## Context

DR-0010 separates literal text delimiters from the intrinsic Enter behavior and opt-in Tab behavior, but it does not define valid delimiter shapes. Empty strings can break splitting, while multi-character strings create inconsistent typing semantics, partial-match and caret-editing complexity, and additional IME concerns. Paste parsing must also avoid treating consumer text as a regular expression.

## Decision

Every entry in `delimiters` must contain exactly one Unicode code point. Empty strings and multi-code-point strings are invalid, and Root throws a descriptive configuration error when either is supplied.

Literal punctuation, whitespace, newline, tab, and emoji code points are valid. A delimiter participates in keyboard commits only when `KeyboardEvent.key` equals that literal code point. Therefore newline and tab characters can act as paste separators without becoming magic aliases for the named `Enter` and `Tab` keys. The strings `"Enter"` and `"Tab"` are invalid delimiter entries; intrinsic Enter and `addOnTab` remain their only supported keyboard contracts.

`delimiters={[]}` is valid and disables literal-delimiter keyboard commits and paste splitting. When `addOnPaste` is enabled with an empty delimiter array, the entire pasted text is evaluated as one candidate.

Duplicate valid delimiters are accepted and deduplicated internally. Delimiters are always interpreted literally and escaped before any regular-expression-based implementation detail. Consumer-provided order and regex metacharacters do not change their meaning.

Multi-code-point separators such as `"||"`, `"::"`, and composed grapheme sequences are not supported by the built-in parser. Consumers needing compound or domain-specific paste parsing can intercept the native Input `onPaste` event, call `preventDefault()`, and manage the specialized parsing through their controlled value contract.

## Alternatives Considered

- Permit arbitrary non-empty delimiter strings for paste only.
- Implement partial multi-character matching while typing.
- Treat `"Enter"` and `"Tab"` as magic delimiter aliases.
- Reject an empty delimiter array.
- Throw on duplicate delimiter entries.
- Interpret delimiter entries as regular expressions.

## Consequences

- Typing and paste use one small, predictable literal delimiter grammar.
- Unicode code points represented by surrogate pairs remain valid even though JavaScript string length is greater than one.
- Multi-code-point grapheme clusters are deliberately outside the built-in grammar.
- Empty delimiter configuration remains a supported way to use only Enter, optional Tab, blur, or consumer-owned commit behavior.
- The implementation must validate by Unicode code-point count rather than UTF-16 code-unit length.
- Tests must cover invalid empty/multi-code-point entries, punctuation, regex metacharacters, whitespace, emoji, duplicates, an empty array, whole-text paste, and composition safety.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The unresolved delimiter-shape contract under DR-0010.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12. This decision refines but does not supersede DR-0010.
