# Implementation Plan: Residual Core Hardening for Emblor v2

## Status

Implementation complete locally and ready for Node 24 CI confirmation. The architecture remains frozen by DR-0041. This plan restored the four original contract violations plus the concrete rejection, polymorphic-label, and native Clear-focus defects found during pre-push review, closed the remaining local proof and documentation gaps, and did not change the public API.

## Plan Boundary

This is the complete implementation plan from the current frozen vertical slice to a fully hardened v2 tag primitive. It is not a release plan for `2.0.0-alpha`, the website migration, or future optional integrations.

The work ends when the four original defects and any concrete pre-push review regressions are fixed, every residual obligation is Verified, the browser gate is repeatable in CI, consumer-facing behavior is documented, and the frozen package boundary remains unchanged.

## Roadmap Relationship

- Umbrella roadmap: [Emblor v2: Frozen Vertical Slice to Stable 2.0.0](../../roadmaps/emblor-v2-to-stable.md)
- Roadmap phase: Phase 1 — Residual Core Hardening.
- Entry gate: satisfied by the committed and pushed vertical slice, accepted DR-0041, completed gap analysis, and existing 51-test baseline.
- Exit gate: every residual coverage row is Verified, the implementation review recommends closure, all supported package/browser/consumer gates pass, and no frozen boundary changed.
- Next phase after closure: Package & Distribution Readiness. Its just-in-time plan must be based on the hardened artifact produced here.

## Baseline

- Branch baseline: frozen v2 vertical slice governed by DR-0041.
- Public API: one root export surface with eight compound parts.
- State model: Root-owned committed tags and Root-owned controlled/uncontrolled draft.
- Existing evidence: 51 passing package tests plus packed React 18/19 consumers.
- Confirmed defects: G-01 through G-04 in the linked gap-analysis session.
- Runtime dependencies: none; that remains a hard constraint.
- Excluded scope: autocomplete, suggestions, popovers, sortable/drag-and-drop, styling runtime, and v1 compatibility.

## Desired Outcome

Consumers receive the already-approved v2 contract with no known implementation divergence:

- trim and transform ordering is consistent for keyboard, blur, and paste;
- transient invalid state has the exact accepted lifecycle;
- automatic labels contribute names in rendered DOM order, including portals;
- rejected paste never overwrites a later user caret or focus decision;
- all remaining state, keyboard, form, focus, composition, and accessibility clauses have durable direct evidence;
- browser-dependent guarantees run in CI rather than relying on an ephemeral acceptance session;
- package documentation describes consumer-observable rules without exposing private mechanics.

## Goals

- Fix each confirmed defect independently and add its regression first.
- Preserve all 51 existing tests as a non-regression baseline.
- Add only contract-level tests that close an identified evidence gap.
- Add a package-scoped Chromium browser suite for platform behavior jsdom cannot prove.
- Keep every implementation commit independently reviewable and revertible.
- Finish with a synchronized residual coverage matrix and implementation review.

## Non-Goals

- New props, exports, components, mutation types, or state ownership.
- Reconsidering DR-0001 through DR-0041.
- Broad internal refactors unrelated to a confirmed defect or verification need.
- Shipping browser-test tooling as a runtime dependency.
- Website, playground redesign, release metadata, changesets, publication, or stable-v2 promotion.
- Adding any excluded integration back into core.

## Current Architecture

`EmblorRoot` owns committed and draft state, mutation coordination, rejection state, native form participation, accessible announcements, focus restoration, and private registrations. Input converts native editing events into Root actions. The evaluator owns canonical candidate validation. Tag and action parts own actual focus and activation semantics. Labels and structural parts register privately with Root. Public values remain `string[]`, and occurrence identity remains consumer-owned.

This architecture is not being redesigned. Private state may be extended only where required to restore an accepted contract.

## Decision Traceability

- [Decision manifest](./decision-manifest.md)
- [Residual coverage matrix](./coverage.md)
- [Gap-analysis evidence](../../sessions/2026-08-13-v2-tag-primitive-gap-analysis.md)
- [Architecture freeze](../../decisions/0041-freeze-the-emblor-v2-vertical-slice-architecture.md)

Status: Ready for CI confirmation. Every residual obligation has passing local direct evidence in [coverage.md](./coverage.md), with commands, deviations, and the boundary review in [implementation-review.md](./implementation-review.md). There are no deferred obligations or unresolved decisions, but final closure waits for the configured Node 24 bundled-Chromium lane to pass on the pushed artifact.

## Execution Sequence

```text
M0 Baseline guard
  |
  +--> M1A Candidate pipeline fix --------+
  +--> M1B Invalid lifecycle fix ---------+
  +--> M1C Label DOM-order fix -----------+--> M2 Clause-level contract matrix
  +--> M1D Paste selection-intent fix ----+                  |
                                                             v
                                                   M3 Real-browser gate
                                                             |
                                                             v
                                                   M4 Behavioral docs
                                                             |
                                                             v
                                                   M5 Coverage closure
```

The four M1 fixes are logically independent. Implement them sequentially so each has its own regression and commit. M2 begins only after all four fixes and the original 51-test baseline are green. Documentation follows runtime stabilization so it describes verified behavior.

## Milestone Summary

| Milestone | Purpose                           | Tasks     | Exit gate                                                                        |
| --------- | --------------------------------- | --------- | -------------------------------------------------------------------------------- |
| M0        | Preserve the frozen baseline      | T-00      | Existing 51 tests, typecheck, exports, and diff guard are green                  |
| M1        | Restore four violated contracts   | T-01–T-04 | Four focused regressions pass; no public API diff                                |
| M2        | Complete clause-level proof       | T-05–T-09 | Unit, integration, and type matrices directly cover every listed residual clause |
| M3        | Make platform behavior repeatable | T-10      | Package-scoped Chromium suite passes locally and in Node 24 CI                   |
| M4        | Complete behavioral documentation | T-11      | README/MIGRATION agree with types and verified behavior                          |
| M5        | Close the primitive               | T-12      | All residual rows Verified; full quality gate passes                             |

## Files Expected to Change

Runtime fixes:

- `packages/emblor/src/core/evaluator.ts`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/src/core/components/tags-input-label.tsx`
- `packages/emblor/src/core/tags-input-context.tsx`

Contract verification:

- `packages/emblor/tests/core/evaluator.test.ts`
- `packages/emblor/tests/core/vertical-slice.test.tsx`
- `packages/emblor/tests/core/verification-hardening.test.tsx`
- focused new test files only when a current file would become difficult to navigate
- `packages/emblor/tests/types/public-api.tsx`
- `packages/emblor/vitest.config.ts` (required to keep the package unit runner separate from the browser runner and the symlinked playground)

Browser gate:

- `packages/emblor/playwright.config.ts`
- `packages/emblor/tests/browser/fixture/index.html`
- `packages/emblor/tests/browser/fixture/main.tsx`
- `packages/emblor/tests/browser/tag-input.spec.ts`
- `packages/emblor/package.json`
- `package.json`
- `pnpm-lock.yaml`
- `.github/workflows/ci.yml`

Documentation and evidence:

- `packages/emblor/README.md`
- `packages/emblor/MIGRATION.md` only for migration-specific clarification
- this plan, `coverage.md`, and the eventual `implementation-review.md`
- `.project-planning/README.md`

Files outside this list require a clear task-level reason. Changes to public exports/types, the website, or the playground stop the plan for review.

## Implementation Tasks

### T-00 — Establish the preservation baseline

Decisions: DR-0041.

Obligations: RP/O-25.

Work:

- Run the existing package tests, typecheck, build, export checks, and packed-consumer verification before runtime edits.
- Record the exact baseline command/results in the eventual implementation review.
- Capture the current public root exports and package export map as a comparison boundary.
- Confirm there are no runtime dependencies and no excluded feature source or exports.

Verification: VT-00.

### T-01 — Correct canonical candidate admission

Decisions: DR-0009, DR-0026, DR-0036.

Obligations: RP/O-01, RP/O-11, RP/O-20.

Files:

- `packages/emblor/src/core/evaluator.ts`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- evaluator and interaction tests

Work:

- Remove every pre-transform `trim().length === 0` short-circuit that rejects a non-empty raw candidate.
- Apply trim, then `transform`, then empty and remaining built-in/custom checks.
- Allow whitespace raw candidates to become valid when `transform` rewrites them.
- Preserve a no-op for a genuinely empty keyboard/blur draft.
- In paste batches, ignore only truly empty split segments; whitespace segments enter the canonical pipeline.
- Preserve raw/canonical rejection metadata, reason ordering, callback counts, and accumulated batch state.

Regression:

- whitespace transformed to a valid fallback succeeds by keyboard, blur, and paste;
- whitespace transformed to empty rejects as `empty` with correct metadata;
- genuinely empty Enter/blur remains silent;
- empty paste segments are ignored while whitespace segments are evaluated;
- duplicate, length, capacity, and custom validation still occur after transformation.

Verification: VT-01.

Commit boundary: `fix(emblor): run whitespace candidates through transform`

### T-02 — Restore transient-invalid lifecycle

Decisions: DR-0019, DR-0022.

Obligations: RP/O-07, RP/O-08.

Files:

- `packages/emblor/src/core/components/tags-input-root.tsx`
- Root/vertical-slice tests

Work:

- Stop clearing the latest transient rejection during individual removal.
- Preserve the rejection across removal-only transitions and silent external tag synchronization.
- Continue clearing it on actual draft changes and successful tag additions.
- Verify Clear only changes rejection state when its accepted Root-owned draft transition qualifies under the existing contract.
- Preserve persistent `invalid` precedence and controlled/uncontrolled parity.

Regression:

- a duplicate rejection survives removal of another tag;
- draft editing clears transient invalid;
- a successful keyboard, blur, or paste addition clears it;
- persistent invalid remains after transient state clears;
- removal emits only its accepted value mutation and announcement.

Verification: VT-02.

Commit boundary: `fix(emblor): preserve transient invalid state on removal`

### T-03 — Order automatic labels by rendered DOM position

Decisions: DR-0034, DR-0035.

Obligations: RP/O-18, RP/O-19.

Files:

- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-label.tsx`
- `packages/emblor/src/core/tags-input-context.tsx`
- label/registration tests

Work:

- Register the automatic Label DOM node together with its token and ID.
- Derive automatic label IDs from connected nodes in rendered document order rather than effect registration order.
- Recompute on portal mount/unmount, Strict Mode cleanup/re-registration, atomic replacement, ID change, and DOM reorder.
- Exclude labels with explicit `htmlFor`, `aria-label`, or `aria-labelledby` from automatic naming.
- Preserve consumer naming precedence and polymorphic Label click-to-focus.
- Keep ordering logic private; add no public identity or registration API.

Regression:

- reverse-mounted portal labels produce DOM-order accessible names;
- in-tree and portal labels compose deterministically;
- dynamic reorder/replacement updates Root, Input, and TagList naming;
- explicit overrides remain excluded;
- Strict Mode does not duplicate IDs.

Verification: VT-03.

Commit boundary: `fix(emblor): order automatic labels by DOM position`

### T-04 — Make paste selection restoration cancellable

Decisions: DR-0037.

Obligations: RP/O-21.

Files:

- `packages/emblor/src/core/components/tags-input-input.tsx`
- private context only if coordination cannot remain Input-local
- paste/selection tests

Work:

- Replace fire-and-forget restoration with a current selection intent tied to the Input node, source draft, and original range.
- Cancel pending restoration when later selection, pointer, keyboard, paste, edit, focus, replacement, or unmount intent supersedes it.
- Restore only after the relevant controlled/uncontrolled render settles and only if the node, draft, focus, and intent are still current.
- Use `ownerDocument`, and cancel any scheduled animation-frame or timeout work during cleanup.
- Avoid adding public events or imperative methods.

Regression:

- untouched total rejection restores the original selection;
- later caret movement, selection, typing, focus transfer, second paste, Input replacement, and unmount cancel it;
- controlled delayed draft reconciliation cannot restore stale intent;
- partial acceptance clears the draft without restoration.

Verification: VT-04.

Commit boundary: `fix(emblor): cancel stale paste selection restoration`

### T-05 — Complete evaluation, state, and callback coverage

Decisions: DR-0009, DR-0015, DR-0019, DR-0022, DR-0024, DR-0026, DR-0030, DR-0032, DR-0036.

Obligations: RP/O-01, RP/O-04, RP/O-07–RP/O-09, RP/O-11, RP/O-15, RP/O-17, RP/O-20.

Work:

- Cover all rejection reasons and exact validation ordering, including zero bounds.
- Cover `allowDuplicates`, transformed duplicates, Unicode code points, combining sequences, flags, and ZWJ sequences.
- Prove controlled/uncontrolled draft callback ordering, accepted clearing, rejected preservation, and state-mode switching errors.
- Prove one metadata-rich value callback per accepted transition and silence for rejection/guards/prop synchronization.
- Prove max-capacity editing, focusability, data attributes, draft preservation, and recovery after removal.
- Cover delimiter deduplication, regex metacharacters, whitespace/emoji delimiters, empty delimiter arrays, and whole-draft paste.

Verification: VT-05.

### T-06 — Complete keyboard, IME, and direction coverage

Decisions: DR-0010, DR-0011, DR-0028, DR-0029.

Obligations: RP/O-02, RP/O-03, RP/O-13, RP/O-14.

Work:

- Exercise every composing command key on Input and Tag: Enter, Tab, delimiters, Backspace, Delete, Home, End, and arrows.
- Prove composition end itself is silent and the first later ordinary command behaves normally.
- Cover explicit, inherited, and runtime-changing LTR/RTL direction.
- Cover both Input caret boundaries, mounted sparse indexes, Tag Home/End, and direction-independent deletion.
- Assert that `data-focused` and roving `tabIndex` follow actual DOM focus only.

Verification: VT-06.

### T-07 — Complete constraints, forms, and external-state coverage

Decisions: DR-0018, DR-0025, DR-0031, DR-0039.

Obligations: RP/O-06, RP/O-10, RP/O-16, RP/O-23.

Work:

- Cover `minTags` above, equal to, and below current count, including externally supplied below-minimum controlled values.
- Prove dynamic valid constraint changes are silent and non-retroactive while availability updates immediately.
- Prove repeated ordered FormData, bracket names, required invalid focus, disabled omission, read-only inclusion, and controlled/uncontrolled reset ownership.
- Cover authoritative external empty/whitespace/duplicate/out-of-bounds strings without normalization or callbacks.
- Cover omitted/sparse Tags retaining capacity and form participation, exact TagText rendering, index errors, portals, Strict Mode, and reorder-like updates.

Verification: VT-07.

### T-08 — Complete composition, polymorphism, labels, and announcements coverage

Decisions: DR-0016, DR-0027, DR-0034, DR-0035.

Obligations: RP/O-05, RP/O-12, RP/O-18, RP/O-19.

Work:

- Cover native props, ARIA, `data-*`, styles, refs, intrinsic/custom `as`, and incompatible Input type/runtime failures.
- Cover consumer-first cancellation for Input, Label, Tag, TagRemove, and Clear.
- Verify protected roles, IDs, safety props, disabled behavior, Space scrolling, and exactly-once activation.
- Cover missing/duplicate structural parts, optional TagList, repeated actions, portals, Strict Mode, and atomic replacement.
- Cover default/localized/suppressed/repeated announcements, paste order, live-region semantics, and silence for guarded actions or controlled synchronization.

Verification: VT-08.

### T-09 — Complete focus, blur, and selection coverage

Decisions: DR-0011, DR-0037, DR-0038, DR-0039, DR-0040.

Obligations: RP/O-03, RP/O-21–RP/O-24.

Work:

- Cover noop/commit/discard blur behavior across external, internal, portal, pointer, cancellation, disabled/read-only, controlled, and unmount paths.
- Cover prospective paste prefixes, suffixes, middle insertion, range replacement, missing offsets, empty clipboard, and total-rejection restoration.
- Cover first/middle/last removal and sparse fallback across Tag keyboard, TagRemove keyboard, and pointer activation.
- Cover controlled acknowledgement, delay, refusal, divergence, external synchronization, consumer focus preservation, and Clear restoration.
- Confirm focus never moves on guarded, cancelled, rejected, or unrelated external transitions.

Verification: VT-09.

### T-10 — Add the durable real-browser gate

Decisions: DR-0011, DR-0018, DR-0029, DR-0034, DR-0035, DR-0037, DR-0038, DR-0040, DR-0041.

Obligations: RP/O-03, RP/O-06, RP/O-14, RP/O-18, RP/O-19, RP/O-21, RP/O-22, RP/O-24, RP/O-25.

Tooling choice:

- Use Playwright Test with Chromium as a dev-only, package-scoped gate.
- Use a minimal Vite fixture that imports only the public `emblor` root entry.
- Do not use the website or acceptance-lab styling as the test host.

Work:

- Add `test:browser` at package level and include it in the documented full local gate.
- Add a deterministic fixture exposing only controls required by the browser assertions.
- Test native required validation and invalid-focus routing, repeated FormData, disabled/read-only submission, and native reset.
- Test actual selection/caret restoration and cancellation, focus restoration across pointer/keyboard removal, whole-Root blur including a portal, and physical LTR/RTL navigation.
- Install Chromium and run the suite in the Node 24 CI lane. Node 22 remains covered by the existing non-browser matrix unless browser evidence exposes a Node-specific issue.
- Retain traces/screenshots only on failure; do not commit generated browser artifacts.

Verification: VT-10.

Commit boundary: `test(emblor): add browser contract gate`

### T-11 — Complete behavioral documentation

Decisions: all Required behavioral decisions.

Obligations: documentation clauses in RP/O-02–RP/O-24.

Work:

- Document persistent versus transient invalid state and standard `aria-describedby` association.
- Add compact constraint/rejection ordering and consumer-first cancellation/protected-prop tables.
- Explain code-point length, literal delimiter grammar, transform ordering, prospective paste, partial acceptance, and selection preservation.
- Explain whole-Root blur boundaries, portal participation, default noop, and cancellation.
- Explain physical direction-aware arrows, caret boundaries, Home/End, actual focus, and DOM/visual-order responsibility.
- Explain external-value authority, sparse rendering/form consequences, positional identity, and post-removal/Clear focus restoration.
- Keep migration mappings in MIGRATION; keep behavioral reference material in the package README.
- Compile every code example against the packed public root entry.

Verification: VT-11.

Commit boundary: `docs(emblor): document frozen tag primitive behavior`

### T-12 — Resynchronize evidence and close the plan

Decisions: DR-0041.

Obligations: RP/O-25 and every residual row.

Work:

- Run formatting, lint, typecheck, unit/integration tests, browser tests, build, exports/tarball checks, and packed React 18/19 consumers.
- Run supported Node 22 and Node 24 lanes; run the browser gate on Node 24.
- Review every residual coverage row against linked tests or browser evidence.
- Create `implementation-review.md` beside this plan.
- Mark a row Verified only when its direct evidence exists and passes.
- Record any new mismatch as a new residual row; do not silently widen behavior or edit a frozen decision.
- Confirm no changes to public exports, public props/types, package subpaths, runtime dependencies, website, playground, or excluded features.
- Mark this plan complete and move its index entry from Active to Completed only after every row is Verified.

Verification: VT-12.

Commit boundary: `docs(planning): close v2 core hardening plan`

## Verification Tasks

### VT-00 — Baseline preservation

Record the pre-change 51-test result, typecheck, build, export surface, package contents, packed React 18/19 verification, and runtime-dependency check.

### VT-01 — Candidate pipeline regression

Prove trim → transform → empty/built-in/custom ordering across keyboard, blur, and paste, including whitespace transformation and truly empty segments.

### VT-02 — Invalid lifecycle regression

Prove removal-only and external tag changes preserve transient invalid state while draft edits and successful additions clear it in both state modes.

### VT-03 — Label order regression

Prove automatic accessible names follow connected DOM order across in-tree nodes, portals, reorder, replacement, overrides, and Strict Mode.

### VT-04 — Selection-intent regression

Prove untouched rejection restores selection and every later user/node intent cancels stale restoration.

### VT-05 — Evaluation/state contract suite

Run the focused evaluator, state, callback, delimiter, capacity, and Unicode matrix plus TypeScript fixtures.

### VT-06 — Keyboard contract suite

Run the complete IME, command-key, actual-focus, caret-boundary, sparse-navigation, and dynamic-direction matrix.

### VT-07 — Constraint/form/external-state suite

Run dynamic constraint, minTags, native form, reset, external authority, structural index, omission, and sparse-rendering tests.

### VT-08 — Composition/accessibility suite

Run polymorphic prop/ref, cancellation, safety precedence, labels, structural registration, and announcement tests.

### VT-09 — Focus/blur/paste suite

Run blur-boundary, prospective paste, selection, removal/Clear restoration, controlled reconciliation, and consumer-focus tests.

### VT-10 — Chromium contract suite

Run deterministic browser assertions for native validity/forms/reset, caret selection, pointer/keyboard focus, portals, blur ordering, and LTR/RTL navigation.

### VT-11 — Documentation contract review

Compile all examples from the packed artifact and compare behavioral statements against public types plus direct test evidence.

### VT-12 — Final quality and freeze-preservation gate

Require every earlier verification task, supported Node lanes, build/export/package checks, packed React consumers, zero runtime dependencies, root-only exports, and an empty unplanned-diff report.

## Planned Commit Series

1. `fix(emblor): run whitespace candidates through transform`
2. `fix(emblor): preserve transient invalid state on removal`
3. `fix(emblor): order automatic labels by DOM position`
4. `fix(emblor): cancel stale paste selection restoration`
5. `test(emblor): complete state and validation contract coverage`
6. `test(emblor): complete keyboard and accessibility coverage`
7. `test(emblor): complete form and focus contract coverage`
8. `test(emblor): add browser contract gate`
9. `docs(emblor): document frozen tag primitive behavior`
10. `docs(planning): close v2 core hardening plan`

Tests directly proving a fix remain in that fix commit. Commits 5–7 contain only additional proof for already-correct behavior. Package/CI changes required by Playwright belong with commit 8. Do not squash the plan into one milestone commit.

## State and Data Changes

No public state or data shape changes. Private implementation may add:

- Label node metadata needed to derive connected DOM order;
- a cancellable selection-restoration intent and scheduler handle.

Transient rejection lifetime changes only to match DR-0019. No persistence or migration exists.

## API and Contract Changes

None. If implementation appears to require a new prop, export, public type, callback, component, or semantic change, stop. DR-0041 requires a superseding accepted decision and plan resynchronization before proceeding.

## Consumer-Visible Corrections

- Whitespace input can commit when `transform` rewrites it to a valid non-empty value.
- Removing a tag no longer hides an unrelated draft rejection.
- Multiple automatic labels are announced in rendered DOM order.
- A rejected paste no longer moves the caret after the user has already moved it elsewhere.

These restore accepted behavior and require no consumer migration.

## Risks and Controls

| Risk                                                                      | Control                                                                                                        |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Fixing whitespace admission accidentally makes empty Enter emit rejection | Keep a distinct raw-empty admission test for keyboard and blur                                                 |
| DOM-order sorting fails for disconnected/cross-document portal nodes      | Sort only connected nodes in the owning document and cover replacement/unmount explicitly                      |
| Selection cancellation misses an input modality                           | Centralize invalidation and test pointer, keyboard, select, change, focus, replacement, and unmount            |
| Browser tests become timing-sensitive                                     | Assert observable DOM state, use Playwright locators, avoid arbitrary sleeps, retain artifacts only on failure |
| Verification work drifts into redesign                                    | Compare each change to DR-0041 and stop on any public-surface diff                                             |
| Test growth becomes unreadable                                            | Organize by contract area and prefer focused helpers over another umbrella test file                           |
| Browser tooling leaks into publication                                    | Keep dependencies dev-only and verify tarball contents/runtime dependency count                                |

## Rollback Strategy

- Each confirmed defect is one implementation-and-regression commit and can be reverted independently.
- Clause-level test commits contain no runtime behavior and can be reverted without changing the package.
- Browser tooling is isolated in one commit; if its infrastructure is unstable, revert that commit and leave browser obligations Partially Covered. Do not claim completion without an equivalent durable gate.
- Documentation and planning closure occur only after behavior is green and can be reverted independently.
- Never use rollback to mark a violated or partially covered obligation Verified.

## Dependencies

- Existing React 18 workspace and packed React 18/19 fixtures.
- Existing Vitest, Testing Library, TypeScript, tsup, and CI setup.
- Dev-only Playwright Test, Chromium, and a direct Vite fixture dependency for T-10.
- No runtime dependency is permitted.

## Open Questions

None. The architecture, behavioral contracts, browser scope, and plan boundary are determined by accepted decisions and the confirmed gap analysis.

## Definition of Done

- [x] All four original defects and all concrete pre-push review regressions have focused passing regressions.
- [x] All original 51 tests remain green.
- [x] Every clause listed in T-05 through T-09 has direct durable evidence.
- [x] The Chromium browser suite passes locally and is wired into the Node 24 CI lane.
- [x] The post-review Node 22 package gates pass.
- [ ] The post-review Node 24 package and bundled-Chromium CI gates pass.
- [x] Packed React 18 and React 19 consumers compile and mount.
- [x] Documentation examples compile from the packed root export.
- [x] No public API, export, ownership, or semantic changes occurred.
- [x] No runtime dependency or excluded feature entered core.
- [x] Every row in `coverage.md` is Verified.
- [x] `implementation-review.md` records commands, evidence, deviations, and final verdict.
- [ ] The planning index marks this plan Completed after CI confirmation.

## To-Dos

- [x] T-00 — Establish the preservation baseline.
- [x] T-01 — Correct canonical candidate admission.
- [x] T-02 — Restore transient-invalid lifecycle.
- [x] T-03 — Order automatic labels by rendered DOM position.
- [x] T-04 — Make paste selection restoration cancellable.
- [x] T-05 — Complete evaluation, state, and callback coverage.
- [x] T-06 — Complete keyboard, IME, and direction coverage.
- [x] T-07 — Complete constraints, forms, and external-state coverage.
- [x] T-08 — Complete composition, polymorphism, labels, and announcements coverage.
- [x] T-09 — Complete focus, blur, and selection coverage.
- [x] T-10 — Add the durable real-browser gate.
- [x] T-11 — Complete behavioral documentation.
- [ ] T-12 — Resynchronize final CI evidence and close the plan.
