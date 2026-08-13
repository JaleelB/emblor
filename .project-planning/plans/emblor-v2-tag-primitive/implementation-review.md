# Implementation Review: Residual Core Hardening

## Verdict

Ready for CI confirmation. The original contract violations and the concrete defects found during pre-push review are fixed, all residual obligations have passing local evidence, and the frozen v2 package boundary remains unchanged. Final Phase 1 closure waits for the configured Node 24 package and bundled-Chromium CI lane to pass on the pushed artifact.

## Scope delivered

- Candidate admission now applies `trim -> transform -> empty -> built-in/custom validation` consistently for keyboard, blur, and paste batches. Truly empty drafts and split segments remain silent.
- Removal and Clear preserve an unrelated transient rejection unless the Root-owned draft actually changes; successful additions still clear it.
- Automatic labels register their current DOM nodes and are derived in connected document order, including portal containers, later container reordering, and polymorphic host-node replacement. Explicit consumer naming overrides remain excluded.
- Rejected-paste selection restoration is a cancellable, current-node/current-draft selection intent. Later selection, pointer, keyboard, edit, focus, replacement, and unmount activity cancels it.
- Native Clear focus restoration now recognizes the browser-driven focus loss that occurs when the accepted action disables its originating button.
- Contract tests cover the remaining evaluator, state, callback, keyboard, IME, direction, forms, constraints, accessibility, polymorphism, labels, blur, focus, sparse-state, and selection clauses without React `act(...)` warning noise.
- A package-scoped Playwright Chromium gate uses a minimal Vite fixture importing only the public `emblor` root entry. It is dev-only and excluded from the published tarball.
- The package README documents the consumer-observable behavioral contract, and every TSX README example is compiled from the packed package by the compatibility check.

## Verification evidence

### Baseline preservation

Before runtime edits, the existing package gate passed with 51 tests, typecheck, lint, build, export checks, and packed React 18/19 consumers. The package had no runtime dependencies and a root-only export map.

### Final package gates

The post-review unit suite contains 5 test files and 76 passing tests on Node 22.23.2:

- Node 22.23.2: `pnpm -C packages/emblor test`
- Node 22.23.2: typecheck, lint, and package build
- Formatting: `pnpm prettier-check`

The packed-consumer verification passed on the post-review Node 22 package artifact for React 18.3.1 and React 19.1.1, including TypeScript compilation, mounting, and all README TSX examples. The tarball contains the intended package files only; browser tests, fixtures, and planning files are not published. The exact post-review Node 24 matrix remains pending CI.

### Browser gate

The local Chrome-channel Playwright run passed all 8 browser tests on Node 22.23.2:

- repeated FormData values and native required invalid-focus routing;
- disabled/read-only submission and uncontrolled native reset;
- untouched total-rejection paste selection preservation and pending stale-intent cancellation;
- portal focus and whole-Root blur/commit behavior;
- physical LTR and RTL arrow navigation;
- pointer and keyboard removal focus restoration;
- accepted Clear and controlled acknowledgement focus restoration;
- controlled removal refusal preserving origin focus.

The local run used the installed Chrome channel through `PLAYWRIGHT_CHANNEL=chrome`. The fixture imports the built public `emblor` root entry, and the browser command builds the package before starting Vite. The committed configuration defaults to Playwright's Chromium project, never reuses an existing server, and the CI workflow installs bundled Chromium with `playwright install --with-deps chromium` in the Node 24 lane. That CI execution is configured but not yet claimed as passing.

### Direct evidence by residual obligation

| Obligation                                  | Direct evidence                                                                                                                                                                                                                                 |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RP/O-01, RP/O-09, RP/O-11, RP/O-17, RP/O-20 | `tests/core/evaluator.test.ts`, `tests/core/constraints-and-interactions.test.tsx`, and `tests/core/vertical-slice.test.tsx` cover ordering, transformed candidates, batch behavior, delimiters, lengths, Unicode code points, and zero bounds. |
| RP/O-02, RP/O-13, RP/O-14                   | `tests/core/verification-hardening.test.tsx` covers command-key separation, composition suppression, and physical direction; browser tests exercise real LTR and RTL inputs.                                                                     |
| RP/O-03, RP/O-21, RP/O-22, RP/O-24          | The hardening suite covers actual focus, blur boundaries, controlled selection divergence, removal/Clear focus, portal blur, and cancellation; Playwright covers native caret/focus behavior.                                                   |
| RP/O-04, RP/O-07, RP/O-08                   | The hardening suite covers controlled draft callback ordering, accepted/rejected/guarded silence, transient rejection lifetime through removal and unchanged-draft Clear, persistent invalid precedence, and removal announcements.            |
| RP/O-05, RP/O-12, RP/O-19                   | The hardening suite and public type fixture cover prop/ref forwarding, protected props, polymorphic boundaries, exactly-once actions, announcements, structural replacement, and consumer-first cancellation.                                   |
| RP/O-06, RP/O-10, RP/O-15, RP/O-16, RP/O-23 | Vertical-slice and hardening tests cover capacity, `minTags`, dynamic constraints, external authority, sparse indexes, form serialization, reset ownership, and disabled/read-only behavior; browser tests cover native form behavior.          |
| RP/O-18                                     | The hardening suite covers reverse-mounted and dynamically reordered portals, explicit naming overrides, Strict Mode registration, polymorphic host replacement, and automatic DOM-order names.                                                |
| RP/O-25                                     | `tests/exports.test.ts`, typecheck, lint, build, packed React 18/19 consumers, tarball inspection, CI workflow review, and the unchanged root-only package export map establish the frozen boundary.                                            |

## Boundary and deviation review

- No public props, exports, components, callbacks, mutation types, package subpaths, or state shapes changed.
- Runtime dependencies remain empty; Playwright and Vite are dev-only package dependencies.
- No website, playground, excluded feature, or v1 compatibility source was changed.
- `packages/emblor/vitest.config.ts` was added to the task file set as a necessary test-infrastructure boundary: its explicit `tests/**` include and browser exclusion keep the unit command separate from Playwright and prevent the existing playground junction from recursive discovery.
- `PLAYWRIGHT_CHANNEL` is an optional local-browser convenience only; CI uses the default bundled Chromium project.
- No migration clarification was needed because the fixes restore the accepted contract without requiring consumer changes.

## Closure

All 25 rows in `coverage.md` have passing local direct evidence. The planning index keeps this plan Active until the post-review Node 24 package and bundled-Chromium CI lane passes. After that evidence is recorded, T-12 may close Phase 1 and move the plan to Completed; no implementation or architectural question remains open.
