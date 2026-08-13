# 0010 — Separate Text Delimiters from Keyboard Commit Controls

## Status

Accepted

## Context

The provisional `delimiter` prop is an array containing both literal separators such as `,` and magic keyboard values such as `Enter` and `Tab`. The same values are translated again for paste handling. This conflates text parsing with keyboard navigation and makes Tab behavior implicit.

## Decision

Replace the provisional contract with:

```ts
delimiters?: string[] // defaults to [","]
addOnTab?: boolean    // defaults to false
```

`Enter` always attempts to commit non-empty input. `Tab` attempts to commit only when `addOnTab` is true; otherwise native focus navigation is preserved. Literal delimiter values commit while typing and split pasted text. Consumers may provide multiple literal separators, including newline for paste input.

Do not recognize magic `"Enter"` or `"Tab"` entries in `delimiters`.

## Alternatives Considered

- Keep `delimiter: string[]` with magic key names.
- Use a single `delimiter?: string` and a separate `addOnTab` flag.
- Accept `string | string[]` under the singular `delimiter` name.
- Expose a general `commitKeys` array.

## Consequences

- Text parsing and keyboard behavior become independently understandable.
- The plural prop name accurately communicates support for multiple separators.
- Tab remains accessible native navigation by default.
- Paste logic must handle all configured literal delimiters and batch state updates correctly.
- Tests must cover Enter, delimiter characters, opt-in Tab, native Tab behavior, multiple paste delimiters, empty segments, and multi-tag controlled/uncontrolled commits.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/playground/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional `delimiter?: string[]` contract with magic `Enter` and `Tab` values.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-11.
