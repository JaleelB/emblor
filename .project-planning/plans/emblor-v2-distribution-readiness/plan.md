# Implementation Plan: Emblor v2 Package & Distribution Readiness

## Status

Implementation complete. The exact pushed commit passed the clean-checkout Node 22/24 matrix, including bundled Chromium on Node 24. Phase 1 is complete, and this Phase 2 plan closes the remaining distribution delta between that hardened package and an alpha-ready, reproducible package artifact.

## Feature Definition

Make the exact `emblor` tarball intended for npm independently verifiable as complete, minimal, installable, type-safe, loadable, and reproducible. The output of this phase is not a v2 release; it is the authoritative distribution gate that a later alpha release candidate must pass.

## Problem Statement

Phase 1 proves the frozen tag primitive itself. It already builds ESM/CJS/declarations, packs a tarball, compiles and mounts React 18/19 consumers, and runs on Node 22/24. Distribution readiness still needs stronger artifact-level guarantees:

- CI installs are not yet frozen-lockfile installs.
- Tarball output is observed but not enforced by an exact allowlist and metadata assertions.
- Packed consumers compile and mount but do not yet prove representative production bundles and explicit ESM/CJS loading.
- Bundle and package sizes have no recorded regression baseline.
- The publish workflow copies the root README over the already-inspected package README after CI, so the released artifact can diverge from the artifact that passed verification.
- The complete package/distribution gate is spread across commands rather than exposed and enforced as one reproducible boundary.
- The current Actions run emits action-runtime deprecation annotations that should be removed while hardening the long-lived release gate.

These are packaging and automation gaps, not reasons to redesign the frozen API.

## Goals

- Verify the exact packed artifact rather than workspace source.
- Enforce the one-package, root-only export and zero-runtime-dependency boundaries.
- Prove ESM, CJS, declarations, React 18/19 types, clean installation, production bundling, and mounting.
- Make tarball contents and publication README deterministic.
- Record package/bundle sanity baselines for regression detection.
- Make clean, frozen Node 22/24 CI the authoritative distribution gate, with Node 24 as the release-validation runtime.
- Produce evidence sufficient to begin `2.0.0-alpha.0` preparation without publishing or changing versions in Phase 2.

## Non-Goals

- No public API, public type, component, behavior, state, form, focus, keyboard, validation, accessibility, or polymorphism redesign.
- No new runtime feature or dependency.
- No v1 compatibility component, subpath, addons, autocomplete/suggestions, popover, sortable/drag-and-drop, Shadcn, Tailwind, CVA, or styling runtime.
- No Changesets prerelease mode, major changeset, version bump, npm publication, GitHub release, release notes, or alpha migration campaign.
- No reconciliation of the old v1 changeset or `.changeset/config.json` access policy; the roadmap assigns prerelease metadata to Phase 3.
- No `website/` migration, polished examples, integration demos, or playground expansion.
- No arbitrary size budget that forces API or behavior changes.

## Current Architecture and Baseline

- Package: `packages/emblor`, version `1.4.8`, public and side-effect-free.
- Public entries: `emblor` and `emblor/package.json` only.
- Outputs: ESM, CJS, declarations, declaration CJS, and source maps from one `src/index.ts` entry.
- Runtime dependencies: none. React and React DOM are peers with `>=18.0.0 <20.0.0`.
- Existing packed-consumer gate: isolated temporary React 18.3.1 and 19.1.1 consumers compile, mount, and compile README TSX examples.
- Existing CI: Node 22/24 run format, build, lint, typecheck, 76 tests, and packed consumers; Node 24 additionally runs 8 bundled-Chromium tests.
- Phase 1 CI evidence: GitHub Actions run `31753494089` for commit `286819451ddc61dd29adb8b8fa8014c9070a943d`.
- Website remains on v1; package version remains at the published-v1 baseline.

## Decision Traceability

- [Decision Manifest](./decision-manifest.md)
- [Decision Coverage](./coverage.md)

Status: Complete. All required distribution obligations are verified, including the exact pushed Node 22/24 clean-checkout matrix and Node 24 bundled Chromium confirmation. No obligation was deferred.

## Implementation Strategy

Build one artifact-first verification path around `npm pack`. The verifier should pack once into a temporary directory, inspect the tarball and its extracted manifest/files, then pass that same tarball to clean consumers and module-loading checks. CI should invoke the same repository scripts contributors can run locally.

Prefer assertions and small fixtures over workflow-only shell logic. Keep package verification under `packages/emblor/tests/` so package shape and compatibility remain colocated with the package, but ensure none of the verifier, fixtures, or reports enter the tarball. Generate temporary consumers and reports outside the workspace and clean them in `finally` paths.

Treat existing Phase 1 gates as preservation inputs. Do not duplicate behavioral tests in Phase 2; compose them into the authoritative distribution command.

## Files Expected to Change

Likely modifications:

- `packages/emblor/package.json`
- `packages/emblor/tsup.config.ts` only if the audit identifies a metadata/output mismatch
- `packages/emblor/tests/exports.test.ts`
- `packages/emblor/tests/compat/verify-packed-consumers.mjs`
- `packages/emblor/README.md`
- `package.json`
- `scripts/run-distribution-gate.mjs`
- `scripts/validate-release.mjs`
- `.github/workflows/ci.yml`
- `.github/workflows/code-check.yml`
- `.github/workflows/publish.yml`
- `pnpm-lock.yaml` only when tooling changes require it
- `.project-planning/plans/emblor-v2-distribution-readiness/*`
- `.project-planning/README.md`

Likely additions:

- a package-distribution verifier under `packages/emblor/tests/packaging/`
- a machine-readable package sanity baseline under `packages/emblor/tests/packaging/`
- minimal clean-consumer build fixture templates under `packages/emblor/tests/compat/` if generated inline fixtures become difficult to maintain
- an implementation review in this plan folder after implementation

Files that must not change:

- `packages/emblor/src/**` unless a concrete distribution defect proves a frozen contract is not represented in the artifact; stop for review before any such change
- `website/**`
- `packages/emblor/playground/**`
- `.changeset/**` during Phase 2
- public component or type definitions

## Implementation Tasks

### T-00 — Preserve and record the Phase 1 baseline

Decisions:

- DR-0041
- DR-0005
- DR-0012

Obligations:

- PD/O-01
- PD/O-15

Work:

- Record the Phase 1 commit, CI run, test totals, browser totals, exports, peer range, runtime dependency count, and tarball summary.
- Capture a source/export/type boundary snapshot for comparison at Phase 2 closure.
- Confirm the working tree contains no unrelated website, playground, changeset, source, or integration work before implementation begins.

Verification: VT-00.

### T-01 — Audit and assert the package manifest and public boundary

Decisions:

- DR-0001
- DR-0002
- DR-0004
- DR-0007
- DR-0014
- DR-0041

Obligations:

- PD/O-02 through PD/O-05
- PD/O-12

Work:

- Assert the only exports are `.` and `./package.json` and that root import/require/type conditions resolve to shipped files.
- Assert `main`, `module`, `types`, `files`, `sideEffects`, package name, current version baseline, peer ranges, and absence of a package Node engine.
- Assert zero runtime dependencies and no optional dependency that behaves as a hidden runtime dependency.
- Assert unsupported subpaths and internal symbols are absent from the public artifact.
- Verify ESM and CJS builds expose the same intended public symbol set.

Verification: VT-01.

### T-02 — Enforce the exact tarball and publication README

Decisions:

- DR-0002
- DR-0007
- DR-0013
- DR-0041

Obligations:

- PD/O-02, PD/O-03, PD/O-07 through PD/O-09

Work:

- Pack into an isolated temporary directory and inspect the exact tarball rather than `dist/` in place.
- Enforce an allowlist for manifest, license, package README, ESM/CJS outputs, declarations, and intentionally shipped source maps.
- Reject tests, browser fixtures, planning files, source files, workspace configuration, caches, and generated clutter.
- Validate extracted manifest paths and ensure every referenced file exists in the tarball.
- Make `packages/emblor/README.md` the single publication README and remove any post-verification workflow step that overwrites it from the root README.
- Ensure the verifier fails if README source or tarball contents drift.

Verification: VT-02.

### T-03 — Strengthen clean packed consumers

Decisions:

- DR-0004
- DR-0016
- DR-0035
- DR-0041

Obligations:

- PD/O-04, PD/O-06, PD/O-07

Work:

- Reuse one tarball across isolated React 18.3.1 and React 19.1.1 consumers installed without workspace resolution.
- Keep strict TypeScript compilation and runtime mounting.
- Add representative production client builds that consume only the packed root export.
- Compile representative intrinsic and custom polymorphism, refs, native handlers, ARIA/data/style props, controlled/uncontrolled state, and README examples against the packed declarations.
- Prove no undeclared workspace or runtime dependency is required.

Verification: VT-03.

### T-04 — Verify module loading and record package sanity baselines

Decisions:

- DR-0001
- DR-0007
- DR-0013
- DR-0041

Obligations:

- PD/O-05, PD/O-10

Work:

- Load the packed root with native ESM import and CommonJS require in isolated consumers.
- Confirm both module formats expose the same supported symbols and no internal exports.
- Record compressed and unpacked tarball size, ESM/CJS output size, declaration size, and representative production consumer bundle size.
- Store stable measurements as review evidence or machine-readable baselines with a documented tolerance where determinism permits.
- Use size evidence to detect accidental growth; do not change the frozen API solely to meet a target.

Verification: VT-04.

### T-05 — Create the authoritative Node 22/24 distribution gate

Decisions:

- DR-0013
- DR-0014

Obligations:

- PD/O-11 through PD/O-13

Work:

- Expose one local aggregate distribution command composing frozen install expectations, formatting, build, lint, typecheck, unit/integration tests, packed verification, compatibility consumers, and package sanity.
- Keep browser verification on Node 24 and preserve Node 22 package compatibility coverage.
- Change CI dependency installation to frozen-lockfile behavior.
- Run artifact/package verification in both Node lanes unless a check is demonstrably platform-independent and the plan records why one Node 24 execution is authoritative.
- Retain failure visibility by using named CI steps even when scripts share implementation.
- Update deprecated workflow actions to supported versions without altering package semantics.

Verification: VT-05.

### T-06 — Validate the non-publishing release path

Decisions:

- DR-0012
- DR-0013
- DR-0014

Obligations:

- PD/O-09, PD/O-12 through PD/O-14

Work:

- Ensure release validation runs on Node 24 and consumes the already-verified package README/artifact inputs.
- Add an explicit publish dry-run or equivalent non-publishing check against the packed artifact.
- Confirm CI success is required before the publish workflow can run and that no artifact mutation occurs after the distribution gate.
- Document required npm/GitHub permissions, token/provenance assumptions, and the later alpha publication boundary without exposing or testing real credentials.
- Keep package version `1.4.8`, do not add a v2 changeset, and do not enter prerelease mode.

Verification: VT-06.

### T-07 — Reproduce the gate from a clean checkout

Decisions:

- DR-0013
- DR-0014
- DR-0041

Obligations:

- PD/O-16

Work:

- Run the exact committed distribution commands from a clean checkout with a frozen lockfile.
- Confirm Node 22 and Node 24 pass their agreed lanes and Node 24 passes bundled Chromium.
- Confirm the same tarball shape and package sanity results are reproducible without untracked files or prior build output.
- Record the pushed CI run and exact commit in the implementation review.

Verification: VT-07.

### T-08 — Review the distribution artifact and close Phase 2

Decisions:

- DR-0001
- DR-0002
- DR-0005
- DR-0007
- DR-0012
- DR-0041

Obligations:

- PD/O-01, PD/O-03, PD/O-15, PD/O-16

Work:

- Compare the final diff with T-00 and confirm no public/source contract changed.
- Scan source, declarations, exports, dependency graph, tarball, and Git diff for excluded v1/addon/autocomplete/cmdk/sortable/drag-and-drop/Shadcn/Tailwind/CVA/styling coupling.
- Confirm website, playground, changesets, version, and prerelease state did not change.
- Update every coverage row from evidence, create `implementation-review.md`, and close only when all rows are Verified.
- Move this plan to Completed and make Phase 3 alpha preparation the next active plan only after the pushed clean-checkout gate passes.

Verification: VT-08.

## Verification Tasks

### VT-00 — Baseline and scope preservation

Compare the implementation branch with the Phase 1 closure commit and fail the review for unexplained source, public type, website, playground, changeset, version, or integration changes.

### VT-01 — Manifest, exports, dependency, and module-contract audit

Run automated assertions against the packed manifest and extracted ESM/CJS/declaration files. Verify exact exports, zero runtime dependencies, React peer range, no package engine, and equal supported symbol sets.

### VT-02 — Tarball allowlist and publication-content verification

Pack once, extract to a temporary directory, compare exact paths with the allowlist, validate all manifest targets, verify README/license identity, and prove the publish workflow cannot replace inspected content afterward.

### VT-03 — React 18/19 clean-consumer matrix

For each supported React major, install the tarball in isolation, compile strict representative TypeScript and README examples, produce a production client bundle, mount/unmount the package, and prove no workspace resolution or undeclared dependency is used.

### VT-04 — ESM/CJS loading and package sanity

Import and require the packed package from isolated Node consumers, compare exports, and record reproducible artifact and representative bundle measurements.

### VT-05 — CI distribution matrix

From frozen installs, run Node 22 and Node 24 distribution lanes. Require format, lint, types, tests, build, exports, tarball, consumers, and sanity to pass; require bundled Chromium on Node 24. Intentionally perturb representative assertions during test development to prove the gate fails closed.

### VT-06 — Publication dry-run

Exercise the Node 24 publication path without network publication or version mutation. Verify no post-gate file copy changes the package and record permission/provenance prerequisites for Phase 3.

### VT-07 — Clean-checkout reproduction

Verify the exact pushed commit in a clean environment, record GitHub Actions run URLs/job conclusions, and compare generated artifact reports with the expected baselines.

### VT-08 — Final decision and scope review

Require all coverage rows Verified, a clean unplanned-diff report, no frozen-contract change, no excluded-feature leakage, and an implementation-review recommendation to proceed to alpha preparation.

## Data / State Changes

None. Temporary packaging and consumer directories are ephemeral and must be deleted after verification. Any retained size report is build evidence, not runtime state.

## API / Contract Changes

None permitted. Manifest corrections may clarify or enforce the already-frozen artifact contract but may not add exports, public types, runtime dependencies, or a package Node engine. A required public change stops the phase and requires a superseding decision record.

## UI / UX Changes

None. Browser tests remain regression evidence only.

## Migration Steps

None. The package remains version `1.4.8` and unpublished as v2 throughout Phase 2.

## Rollback Plan

- Keep distribution tooling in coherent commits so CI/workflow, verifier, consumer-fixture, and documentation changes can be reverted independently.
- If a new verifier is unstable, revert that verifier and leave the corresponding obligation Planned or Partially Covered; do not weaken assertions and claim completion.
- If production consumer builds reveal a package defect, fix packaging metadata/build configuration within the frozen boundary and rerun the complete gate.
- If resolution requires a public contract change, stop and create a superseding decision rather than hiding the change in distribution work.
- No npm rollback is needed because Phase 2 does not publish.

## Dependencies

- Completed Phase 1 and accepted DR-0041.
- Existing pnpm, Changesets, tsup, TypeScript, Vitest, Playwright, and Vite toolchain.
- Node 22 and Node 24 CI runners; Node 24 bundled Chromium.
- Temporary registry access for clean consumer dependency installation.
- No new runtime dependency is allowed. New dev tooling requires justification and lockfile review.

## Risks and Controls

| Risk | Control |
| --- | --- |
| Verifier accidentally checks workspace output instead of tarball | Pack once, extract, and pass the tarball path into every artifact/consumer check |
| Temporary consumers resolve workspace packages | Create them outside the repository and install an explicit tarball path with scripts disabled where appropriate |
| README or manifest changes after verification | Remove post-gate copying and verify the exact publication input |
| Size checks become noisy or drive product redesign | Record deterministic baselines/tolerances and treat growth as a review signal only |
| CI duplicates divergent local logic | Put assertions in repository scripts and keep workflows as orchestration |
| Phase 3 metadata leaks into Phase 2 | Scope-check `.changeset/`, version, and prerelease state at entry and closure |
| Release workflow dry-run publishes accidentally | Use a no-publication mode, no release credentials, and keep publication outside Phase 2 |
| Frozen API changes under packaging pressure | Stop and require a superseding decision before touching the public boundary |

## Planned Commit Series

1. `test(emblor): enforce package manifest and tarball boundary`
2. `test(emblor): strengthen packed React consumer verification`
3. `test(emblor): add module and package sanity checks`
4. `ci(emblor): enforce distribution readiness matrix`
5. `ci(emblor): validate non-publishing release path`
6. `docs(planning): close v2 distribution readiness`

Keep focused tests with the behavior they enforce. Do not squash Phase 2 into one giant milestone commit. The final planning closure commit follows successful pushed CI evidence.

## Open Questions

None at plan time. Exact size-tolerance values and whether package sanity runs once or in both Node lanes are implementation details to decide from observed determinism; they may not weaken the Node support or artifact guarantees.

## Definition of Done

- [x] Every row in `coverage.md` is Verified.
- [x] Exact root-only exports and zero runtime dependencies are machine-enforced against the tarball.
- [x] ESM, CJS, declarations, manifest targets, README, license, source maps, and tarball allowlist pass.
- [x] Clean React 18 and React 19 consumers compile, production-build, and mount from the tarball.
- [x] Native ESM import and CommonJS require work from the packed artifact.
- [x] Package and representative bundle sanity baselines are recorded and reproducible.
- [x] Frozen-lockfile Node 22 and Node 24 distribution lanes pass; Node 24 bundled Chromium passes.
- [x] The non-publishing Node 24 release validation passes without artifact mutation.
- [x] The package remains at `1.4.8`; no changeset or prerelease mode is introduced.
- [x] No public API, source contract, website, playground, runtime dependency, or excluded feature changed.
- [x] A clean checkout reproduces the complete gate on the exact pushed commit.
- [x] `implementation-review.md` recommends proceeding to Phase 3.

## To-Dos

- [x] T-00 — Preserve and record the Phase 1 baseline.
- [x] T-01 — Audit and assert the package manifest and public boundary.
- [x] T-02 — Enforce the exact tarball and publication README.
- [x] T-03 — Strengthen clean packed consumers.
- [x] T-04 — Verify module loading and record package sanity baselines.
- [x] T-05 — Create the authoritative Node 22/24 distribution gate.
- [x] T-06 — Validate the non-publishing release path.
- [x] T-07 — Reproduce the gate from a clean checkout.
- [x] T-08 — Review the distribution artifact and close Phase 2.
