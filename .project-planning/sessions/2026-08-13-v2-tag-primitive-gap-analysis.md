# Planning Session: v2 Tag Primitive Gap Analysis

## Date

2026-08-13

## Objective

Compare the frozen Emblor v2 tag-primitive contract against the pushed vertical-slice implementation and identify only the remaining implementation, verification, and behavioral-documentation obligations.

## Baseline

- Branch: `feat/emblor-v2-refactor`
- HEAD: `da6e687` (`docs(emblor): document v2 architecture and migration`)
- Local HEAD matched `origin/feat/emblor-v2-refactor`; the worktree was clean at audit start.
- Existing package suite: 5 files and 51 tests pass.
- Frozen evidence: the vertical-slice matrix marks 64 compressed obligations Verified.
- Detailed source contract: DR-0001 through DR-0040, with DR-0006 and DR-0033 superseded; DR-0041 freezes the architecture and permits contract-restoring bug fixes.

## Method

1. Resolve the decision corpus and supersession relationships.
2. Compare each behavioral decision and the detailed 139-row package plan against source, public types, tests, and package documentation.
3. Treat vertical-slice coverage as existing evidence, not proof for clauses its compressed rows did not exercise independently.
4. Create focused temporary tests for suspected mismatches, record the results, then remove the scratch test file.

## Confirmed Implementation Gaps

| Gap  | Contract                                                                                                                                      | Implementation evidence                                                                                                                      | Focused reproduction                                                                               |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| G-01 | DR-0009 requires trim, then transform, then empty/built-in validation; DR-0026 requires non-empty pasted candidates to use the same pipeline. | The evaluator rejects trimmed emptiness before `transform`; batch, Root commit, and Input admission also short-circuit on trimmed emptiness. | Whitespace with `transform={() => 'fallback'}` rejects as `empty` instead of accepting `fallback`. |
| G-02 | DR-0019 clears transient rejection when the draft changes or a tag commits successfully.                                                      | `removeTag` clears `lastRejection` although removal is neither condition.                                                                    | A duplicate rejection followed by removing another tag clears `data-invalid`.                      |
| G-03 | DR-0034 requires automatically associated Label IDs in deterministic DOM order, including portals.                                            | Root stores Label IDs in registration order and never sorts by rendered DOM position.                                                        | Reverse-mounted portal labels expose `Later label Earlier label` instead of DOM order.             |
| G-04 | DR-0037 requires total-rejection selection restoration not to override later user movement.                                                   | `restoreSelection` checks only focus before applying the old range on the next frame.                                                        | Moving the caret after rejection but before restoration is overwritten by the stale range.         |

All four focused regressions failed. A separate nested `EmblorTagRemove` cancellation probe passed and is not a gap. The temporary audit test was removed, so no failing scratch code remains.

## Remaining Verification Gaps

The passing suite covers the main slice but does not directly and durably isolate every clause previously marked Verified. Residual evidence is needed for:

- transform/empty ordering in single and batch paths, all rejection reasons, and zero-bound ordering
- controlled/uncontrolled draft callback ordering and rejection-state clearing boundaries
- the full IME command-key set and post-composition behavior
- explicit/inherited/runtime direction at both Input caret boundaries
- `minTags` corrective behavior for externally below-minimum values
- the consumer-first cancellable-event matrix and protected-prop precedence
- Label overrides, DOM ordering, portal replacement, and dynamic order
- custom Input compile-time rejection and runtime ref validation
- sparse/omitted Tag form participation and portal/Strict Mode index integrity
- stale paste-selection restoration cancellation
- guarded and controlled-synchronization announcement silence
- browser-native validity, reset, selection, and focus behavior in a repeatable automated browser gate rather than ephemeral acceptance evidence

## Remaining Documentation Gaps

The README still needs the accepted consumer-observable rules for event cancellation/protected props, invalid state and `aria-describedby`, dynamic constraints, code-point length, delimiter grammar, prospective paste, Root-boundary blur, direction-aware navigation, external-value/sparse rendering, and post-mutation focus restoration.

## Scope Resolution

No new product or architecture decision is needed. These are restorations or proofs of accepted behavior permitted by DR-0041. Release/versioning, publication, website migration, excluded features, and public API expansion remain out of scope.

## Result

The gap analysis feeds the detailed Phase 1 implementation plan at `.project-planning/plans/emblor-v2-tag-primitive/plan.md`, with a separate decision manifest and 25-row residual coverage matrix in the same directory.
