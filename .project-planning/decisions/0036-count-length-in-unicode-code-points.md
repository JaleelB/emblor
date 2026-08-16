# 0036 — Count Length in Unicode Code Points

## Status

Accepted

## Context

The accepted `minLength` and `maxLength` constraints run after trim and transform, but JavaScript's native string `.length` counts UTF-16 code units. That makes many emoji count as two units. Counting user-perceived grapheme clusters is more visually intuitive, but robust segmentation would require relying on `Intl.Segmenter` availability or shipping additional segmentation code.

## Decision

`minLength` and `maxLength` count Unicode code points in the trimmed, transformed canonical candidate. The implementation uses code-point iteration semantics equivalent to `Array.from(value).length`, not UTF-16 code-unit length.

This means:

- Basic Latin characters count as one.
- A supplementary-plane character such as `😀` counts as one rather than two UTF-16 units.
- Combining sequences, emoji modifiers, flags, zero-width-joiner sequences, and other extended grapheme clusters may contain and count as multiple code points even when displayed as one visual symbol.

The package does not depend on `Intl.Segmenter` and does not bundle a grapheme-segmentation implementation for these built-in constraints. Consumers requiring locale- or grapheme-aware limits implement that policy through `validate`.

Constraint configuration remains governed by DR-0031. `minLength={0}` is valid, but the independent empty-candidate rule still rejects an empty canonical value. `maxLength={0}` is valid and therefore rejects every non-empty candidate with `reason: 'max-length'`.

## Alternatives Considered

- Count UTF-16 code units with `string.length`.
- Count extended grapheme clusters with `Intl.Segmenter`.
- Bundle a grapheme-splitting dependency or implementation.
- Make the counting algorithm configurable.
- Define length only for ASCII input.

## Consequences

- Length behavior is deterministic, dependency-free, and more Unicode-correct than UTF-16 code-unit counting.
- Some visually single symbols count as multiple units; this limitation is explicit rather than environment-dependent.
- Delimiter validation and length validation both use Unicode code-point concepts, though delimiter entries still require exactly one code point.
- Tests must cover BMP text, supplementary-plane emoji, combining sequences, flags/ZWJ sequences, post-transform counting, and zero bounds.

## Related Files

- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The unresolved unit used by `minLength` and `maxLength`.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12.
