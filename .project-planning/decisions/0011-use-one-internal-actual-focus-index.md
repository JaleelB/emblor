# 0011 — Use One Internal Actual-Focus Index

## Status

Accepted

## Context

The provisional core maintains `focusedIndex` and `activeIndex`, exposes both as optional controlled public props, and writes the same value to both throughout the implementation. It also marks a newly committed tag as focused while DOM focus remains on the input. The two-state model therefore adds API and internal complexity without representing distinct behavior.

## Decision

Use a single internal `focusedIndex: number | null` representing actual DOM focus on a tag.

Remove `focusedIndex`, `setFocusedIndex`, `activeIndex`, and `setActiveIndex` from the public root props. Do not expose an alternative controlled focus-index API.

After committing a tag, keep DOM focus on the input and keep `focusedIndex` null. Keyboard navigation may move actual focus from the input to a tag or between tags; tag focus and blur events keep the internal index synchronized. Clicking a tag must establish real DOM focus if it is represented as focused.

Expose focus styling through `data-focused`. Do not expose a second `data-active` state or use `aria-activedescendant` to model virtual focus.

## Alternatives Considered

- Keep both indexes as public controlled state.
- Keep both indexes internally for focused versus selected behavior.
- Rename the state to `highlightedIndex` while retaining virtual focus on the input.
- Keep a single but publicly controllable focus index.

## Consequences

- Consumers no longer coordinate internal navigation state.
- Visual focus state cannot drift intentionally from browser focus.
- The input remains ready for continued entry after a successful commit.
- Tag keyboard behavior, deletion focus restoration, clicking, and roving `tabIndex` require focused regression tests.
- The context, store, root props, tag parts, input part, and public data attributes become simpler.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/src/core/components/tags-input-tag.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional dual `focusedIndex` / `activeIndex` model and its public control props.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-11.
