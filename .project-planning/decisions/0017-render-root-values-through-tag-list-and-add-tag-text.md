# 0017 — Render Root Values Through EmblorTagList and Add EmblorTagText

## Status

Accepted

## Context

Root supports controlled and uncontrolled `string[]` values, but a compound consumer currently renders tags by mapping external state. When Root is uncontrolled, context/store internals are private and the consumer has no supported way to render values added after mount. The earlier decision to omit a text part also leaves examples with an unexplained consumer-owned `<span>` inside each tag.

## Decision

`EmblorTagList` will support an item-render function as its primary dynamic rendering contract:

```tsx
<EmblorTagList>
  {(tag, index) => (
    <EmblorTag key={`${tag}-${index}`} index={index}>
      <EmblorTagText />
      <EmblorTagRemove index={index} />
    </EmblorTag>
  )}
</EmblorTagList>
```

The function receives the current Root-owned tag value and index and is invoked once per tag. It behaves identically for controlled and uncontrolled Root state. `EmblorTagList` will continue to accept static React children for advanced composition, but dynamic tag rendering should use the item-render function rather than a public store/context hook.

Add `EmblorTagText` as a public compound part. It reads the value from its nearest `EmblorTag`, renders a `span` by default, supports the accepted polymorphic `as` and DOM-prop forwarding contracts, and renders the current tag string when children are omitted. Explicit children may override the displayed content without changing the underlying tag value.

Retain `EmblorLabel` and automatic label association from DR-0006. Continue replacing routine bespoke `labelId` plumbing with native attributes and the Label part.

## Alternatives Considered

- Make Root controlled-only and remove `defaultValue`.
- Expose a public context or values hook.
- Put a render function on Root.
- Keep consumer-owned text markup such as `<span>{tag}</span>`.
- Have `EmblorTag` always render its value directly with no composable text part.

## Consequences

- Uncontrolled Root state becomes genuinely usable with the compound API.
- Controlled and uncontrolled examples share one rendering pattern.
- Store and context internals remain private.
- `EmblorTag` must provide a private per-tag context to `EmblorTagText` and potentially other nested parts.
- The public API gains one semantic presentation-neutral part without shipping styles.
- Tests must cover controlled and uncontrolled list rerendering, static children, TagText default/custom content, missing-parent errors, DOM-prop forwarding, and polymorphic typing.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/index.ts`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/src/core/components/tags-input-tag-list.tsx`
- `packages/emblor/src/core/components/tags-input-tag.tsx`
- `packages/emblor/src/core/components/tags-input-tag-text.tsx`
- `packages/emblor/src/index.ts`
- `packages/emblor/tests/core/`
- `packages/emblor/playground/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

DR-0006 — Add EmblorLabel but Not EmblorTagText.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-11. The repeated `index` on `EmblorTagRemove` remains a separate open API question rather than being decided implicitly here.
