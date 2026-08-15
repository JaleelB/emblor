# 0021 — Nested Tag Parts Inherit Private Tag Context

## Status

Accepted

## Context

The provisional API requires both `EmblorTag` and its nested `EmblorTagRemove` to receive the same positional index. Repeating that value is redundant and allows a remove button rendered inside one tag to accidentally target another. DR-0017 already requires private per-tag context for `EmblorTagText`.

## Decision

`EmblorTag` remains the positional boundary and receives `index`. It provides a private tag-item context containing the current index and value to nested public parts.

Remove `index` from `EmblorTagRemove`. Both `EmblorTagText` and `EmblorTagRemove` obtain their current tag information from the nearest `EmblorTag`.

Using either nested part outside `EmblorTag` is unsupported and throws a clear development-time error naming the misplaced component. The private tag context and hook are not exported.

The canonical composition becomes:

```tsx
<EmblorTag index={index}>
  <EmblorTagText />
  <EmblorTagRemove />
</EmblorTag>
```

## Alternatives Considered

- Keep explicit `index` on every nested part.
- Make `index` optional and fall back to context.
- Pass value/index through render-prop closure to each nested part.
- Let remove buttons accept a tag string instead of an index.

## Consequences

- Nested parts cannot drift from their containing tag.
- Common composition is shorter and more naturally compound.
- `EmblorTagRemove` no longer works as a standalone indexed command; custom external removal remains consumer-owned through controlled state.
- A private tag context becomes required infrastructure.
- Tests must cover correct removal after list changes, nested value rendering, missing-parent errors, nested tags/context isolation, and absence of an `index` prop on TagRemove.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/components/tags-input-tag.tsx`
- `packages/emblor/src/core/components/tags-input-tag-text.tsx`
- `packages/emblor/src/core/components/tags-input-tag-remove.tsx`
- A private tag-item context under `packages/emblor/src/core/`
- `packages/emblor/tests/core/`
- `packages/emblor/playground/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional explicit `index` prop on `EmblorTagRemove`.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12.
