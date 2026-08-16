# 0026 — Partially Accept Valid Pasted Tags in Order

## Status

Accepted

## Context

Multi-value paste frequently includes duplicates, blank segments, invalid values, or more candidates than remaining capacity. An atomic batch policy would discard every valid candidate because one candidate fails. Repeated calls against the current rendered array, however, can lose accepted values or apply duplicate/capacity checks against stale state.

## Decision

When `addOnPaste` is enabled, split pasted text using configured literal delimiters and evaluate non-empty candidates from left to right against one accumulating next-value array.

- Apply the canonical trim, transform, length, duplicate, capacity, and custom-validation pipeline to each candidate.
- Accept each valid canonical candidate in input order.
- Evaluate later duplicates and `maxTags` against both preexisting tags and candidates already accepted from the same paste.
- Emit one `onReject` per rejected non-empty candidate with `source: 'paste'`.
- Preserve all accepted candidates even when other candidates reject.
- If at least one candidate is accepted, publish exactly one `onValueChange` with `type: 'add-many'`, the ordered accepted canonical values, and their starting index.
- If no candidate is accepted, do not emit `onValueChange`.
- Clear the Root-owned draft only when at least one pasted candidate is accepted; otherwise preserve it.
- Empty split segments are ignored rather than reported as `empty` rejections.

## Alternatives Considered

- Reject the entire batch if any candidate fails.
- Stop processing at the first failure.
- Emit one value-change transition per accepted candidate.
- Accept candidates using independent checks against only the pre-paste value.
- Treat empty split segments as rejection events.

## Consequences

- Spreadsheet and CSV-like paste remains productive despite isolated bad values.
- Ordering is deterministic and capacity/duplicate rules remain correct within the batch.
- Rejection UI may receive several events followed by one accepted value transition.
- The implementation needs a pure batch evaluator rather than repeated stale-closure `commitTag` calls.
- Tests must cover mixed validity, transformed intra-batch duplicates, capacity exhaustion, empty segments, no accepted candidates, draft clearing/preservation, callback order, and controlled/uncontrolled parity.

## Related Files

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/tests/core/`
- `packages/emblor/README.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional repeated stale-closure paste commits and the unresolved atomic-versus-partial batch policy.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12.
