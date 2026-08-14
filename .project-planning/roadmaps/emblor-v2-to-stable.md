# Emblor v2 Roadmap: Frozen Vertical Slice to Stable `2.0.0`

## Status

Active umbrella roadmap as of 2026-08-14. Phases 1 and 2 are complete; Phase 3 — `2.0.0-alpha.0` Preparation is next.

This roadmap sequences the remaining implementation, prerelease, documentation, stabilization, and publication work. It does not duplicate the detailed residual primitive plan. Future phases receive separate just-in-time implementation plans only when their prerequisites are satisfied.

## Where We Are Now

The Emblor v2 vertical slice is implemented, reviewed, committed, pushed, and architecture-frozen by DR-0041.

The current package already has:

- one `emblor` package and a root-only code API;
- the eight frozen compound parts;
- Root-owned committed and draft state;
- native forms, validation, keyboard/focus behavior, announcements, polymorphism, and consumer-owned styling;
- React 18/19 and Node 22/24 verification;
- packed-consumer and package-content checks;
- no core autocomplete, suggestions, sortable/drag-and-drop, Shadcn, Tailwind, CVA, addons, or v1 compatibility layer.

The completed gap analysis was authoritative. Its four primitive defects and bounded verification/documentation work are complete under the [residual tag-primitive plan](../plans/emblor-v2-tag-primitive/plan.md). Phase 2 package and distribution readiness is also complete under the [distribution-readiness plan](../plans/emblor-v2-distribution-readiness/plan.md): commit `7e0f0b0cdf30067364b28a94166712cef5a19a82` passed Node 22 and Node 24 CI, including bundled Chromium on Node 24. Phase 3 — `2.0.0-alpha.0` Preparation is next.

The package manifest remains at the published-v1 development baseline `1.4.8`. No v2 prerelease has been published yet. The existing `website/` still consumes and documents published v1, as required by DR-0005.

Release preparation also has known repository housekeeping—not new product gaps—to resolve at the appropriate phase: `.changeset/` still contains an old v1 patch changeset, Changesets is configured with restricted access despite `emblor` being public, and the publish workflow copies the root README over the package README. Phase 3 must deliberately reconcile those files so prerelease metadata and published documentation describe v2 exactly once.

## Stable Destination

Emblor may be called stable `2.0.0` only when:

- every frozen core contract has direct durable evidence and no known violation;
- the published artifact, declarations, exports, installation, compatibility, and release automation are proven outside the workspace;
- a public alpha and beta have been installed by representative consumers;
- alpha and beta findings have been resolved or explicitly classified as non-blocking;
- the v2 docs site consumes the published package and covers the complete core contract plus clearly external integrations;
- the final accessibility, browser, TypeScript, package, and migration gates pass;
- npm `latest`, the docs site, and migration guidance can move to v2 together without stranding v1 users.

## Locked Boundaries

These apply to every phase:

- Emblor v2 remains only a headless tag-input primitive.
- The compound architecture frozen by DR-0041 is not redesigned.
- No public API is added merely to simplify implementation or examples.
- There is no built-in autocomplete/suggestions, popover, sortable/drag-and-drop, styling runtime, Shadcn/Tailwind/CVA layer, v1 compatibility component, addons package, or feature subpath.
- Third-party integrations appear only in consumer documentation/examples and must depend on those tools directly.
- Internal refactors, tests, documentation clarification, and contract-restoring fixes are allowed within DR-0041.
- Any required change to frozen exports, public types/props, ownership, mutations, forms, keyboard/focus, accessibility, polymorphism, or package boundaries stops the active phase and requires a new accepted decision that supersedes the affected record.

## Governing Decisions

| Decision                  | Roadmap effect                                                                                                             |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| DR-0001, DR-0002, DR-0007 | Fix the product scope, one-package shape, root-only API, and excluded features.                                            |
| DR-0004                   | Require meaningful React 18 and React 19 consumer verification.                                                            |
| DR-0005                   | Keep the website on v1 until a published v2 alpha is stable enough to consume; rebuild it under a separate plan.           |
| DR-0012                   | Start with `2.0.0-alpha.0`, use Changesets prerelease mode and a non-`latest` tag, and prove real consumers before stable. |
| DR-0013                   | Make CI—not local hooks—the authoritative quality and release gate.                                                        |
| DR-0014                   | Use Node 24 for release and retain Node 22 compatibility verification.                                                     |
| DR-0016                   | Preserve headless DOM prop forwarding, polymorphic refs, and consumer styling ownership.                                   |
| DR-0041                   | Preserve the frozen architecture; require a superseding decision for contract changes.                                     |

All other accepted DR-0001–DR-0040 behavioral decisions remain binding release requirements through DR-0041. DR-0006 and DR-0033 remain superseded.

## Dependency and Release Flow

```text
Completed: frozen vertical slice and residual core hardening on v1.4.8 baseline
  |
  v
1. Residual Core Hardening
  |
  v
2. Package & Distribution Readiness
  |
  v
3. alpha.0 Preparation
  |
  v
4. Publish 2.0.0-alpha.0
  |
  v
5. Alpha Iteration (alpha.1, alpha.2, ... as needed)
  |
  +--------------------------+
  | alpha is usable enough   |
  v                          |
6. v2 Docs Site Rebuild -----+
  |                          |
  +------------+-------------+
               v
7. Publish 2.0.0-beta.0 / effective public API freeze
  |
  v
8. Beta Stabilization
  |
  v
9. Publish stable 2.0.0 and switch docs/default channel
```

The docs rebuild may overlap late alpha iteration after its entry gate is met. Beta cannot begin until both the alpha feedback gate and the required v2 documentation baseline are complete.

## Complete Milestone Table

| Phase                               | Release state                | Primary outcome                                                                   | Depends on          | Ends with                                   |
| ----------------------------------- | ---------------------------- | --------------------------------------------------------------------------------- | ------------------- | ------------------------------------------- |
| Current                             | v1 `latest`; v2 unpublished  | Phase 1 complete; package and distribution readiness active                       | Phase 1             | Distribution-readiness plan                 |
| 1. Residual Core Hardening          | v2 unpublished               | No known primitive contract violations; residual coverage closed                  | Frozen baseline     | Completed hardening commit series           |
| 2. Package & Distribution Readiness | v2 unpublished               | Releasable packed artifact and authoritative distribution gates                   | Phase 1             | Distribution-readiness PR                   |
| 3. `alpha.0` Preparation            | v2 unpublished               | Exact prerelease metadata, docs, notes, and publish runbook ready                 | Phase 2             | Alpha release-candidate PR                  |
| 4. `alpha.0` Release                | `2.0.0-alpha.0` on `next`    | First public installable v2 and verified npm artifact                             | Phase 3             | npm/GitHub alpha release                    |
| 5. Alpha Iteration                  | `alpha.x` on `next`          | Real-consumer, accessibility, browser, type, and packaging findings resolved      | Phase 4             | Final alpha release and beta recommendation |
| 6. v2 Docs Site Rebuild             | Published alpha              | Website becomes a genuine external v2 consumer and complete documentation surface | Stable-enough alpha | Docs-site PR/deployment candidate           |
| 7. `beta.0` / Public API Freeze     | `2.0.0-beta.0` on `next`     | Public surface treated as release-candidate stable                                | Phases 5 and 6      | npm/GitHub beta release                     |
| 8. Beta Stabilization               | `beta.x` on `next` as needed | Final release blockers removed across all supported environments                  | Phase 7             | Stable-release recommendation               |
| 9. Stable `2.0.0`                   | `2.0.0` on `latest`          | Stable package, v2 docs, and migration path published together                    | Phase 8             | npm/GitHub stable release and docs cutover  |

## Phase 1 — Residual Core Hardening

### Purpose

Restore the four accepted contracts identified by the completed gap analysis and close the remaining primitive verification/documentation obligations.

### Major deliverables

- Four independent defect fixes with focused regressions.
- Remaining unit, integration, type, focus, form, keyboard, IME, accessibility, and polymorphism proof.
- Package-scoped browser behavior gate in CI.
- Complete behavioral package documentation.
- Synchronized residual coverage and implementation review.

### Dependencies / prerequisites

- Frozen vertical slice and DR-0041.
- Authoritative gap-analysis evidence.
- Existing 51-test and packed-consumer baseline.

### Exit criteria

- Every row in the residual coverage matrix is `Verified`.
- Four confirmed defects have direct passing regressions.
- Full Node 22/24 package gates, browser suite, build, exports/tarball checks, and packed React 18/19 consumers pass.
- No public API/export, runtime dependency, website, playground, or excluded-feature change was introduced.
- The residual implementation review recommends closure.

### Plan

Use the existing [Complete the Emblor v2 Tag Primitive plan](../plans/emblor-v2-tag-primitive/plan.md). Do not create another Phase 1 plan.

### Milestone

A coherent hardening commit/PR series, followed by a planning/evidence closure commit. No release occurs.

### Do not start yet

- Changesets prerelease mode or alpha version generation.
- Website migration.
- New integration demos or optional features.

## Phase 2 — Package & Distribution Readiness

### Purpose

Prove that the exact package intended for npm—not workspace source—is complete, minimal, installable, and reproducibly releasable.

### Major deliverables

- Final public API/export audit against DR-0002, DR-0007, and DR-0041.
- Zero unintended runtime dependencies and no excluded feature code in the artifact.
- ESM, CJS where promised, declaration, tree-shaking/side-effect metadata, and production-build verification.
- Tarball inspection for only intended files, correct metadata, license, README, source maps if intentionally shipped, and no tests/internal planning/generated clutter.
- Clean temporary consumers installing the packed tarball with React 18 and React 19, compiling representative TypeScript, building production bundles, and mounting the component.
- Node 22 and Node 24 tooling matrix, with Node 24 designated for release.
- Bundle/package sanity measurements recorded as baselines; use them to catch accidental growth, not to invent an arbitrary API-driven size target.
- CI gates for frozen install, format, lint, typecheck, unit/integration, browser, build, exports, tarball contents, packed consumers, and package sanity.
- Publish workflow dry-run or equivalent non-publishing validation, including npm access and provenance/token requirements where applicable.
- Audit the README source used by publication so the inspected package README cannot be replaced by stale or divergent root content after CI passes.

### Dependencies / prerequisites

- Phase 1 closed with all residual obligations Verified.
- No unresolved frozen-contract question.

### Exit criteria

- A clean checkout can reproduce the complete distribution gate.
- The packed artifact passes React 18/19 clean-install consumers without workspace resolution.
- Node 22 and 24 pass the agreed matrix; release automation uses Node 24.
- Export and tarball allowlists match the frozen package boundary.
- Runtime dependency count is zero unless a new accepted decision explicitly changes it.
- CI blocks release when any distribution check fails.

### Plan

Use the active [Emblor v2 Package & Distribution Readiness plan](../plans/emblor-v2-distribution-readiness/plan.md). It reuses the existing packed-consumer scripts and package tests and covers only the remaining distribution delta.

### Milestone

One distribution-readiness PR/commit series merged before prerelease metadata is generated.

### Do not start yet

- Version bump to an alpha.
- npm publication.
- Website rebuild.
- Broad release marketing or stable migration claims.

## Phase 3 — `2.0.0-alpha.0` Preparation

### Purpose

Turn the verified `1.4.8` development baseline into an auditable first v2 prerelease candidate without changing npm `latest`.

### Major deliverables

- Reconcile stale existing changesets and create one accurate major v2 changeset.
- Set Changesets/npm access metadata for the public `emblor` package and remove or supersede the stale v1 patch changeset without folding it accidentally into v2 release notes.
- Enter Changesets prerelease mode and verify it mechanically produces `2.0.0-alpha.0` from `1.4.8`.
- Configure/verify publication under `next` or another explicit non-`latest` prerelease tag.
- Package README suitable for actual v2 installation and use.
- Establish one canonical published README source and make the publish workflow preserve it.
- Initial complete v1 → v2 migration guide covering removed component/API, state conversion, compound markup, styling ownership, removed integrations/subpaths, and native forms/accessibility differences.
- Alpha changelog and release notes that clearly state prerelease status, frozen architectural scope, known limitations, supported React/Node policy, and feedback channel.
- Release checklist covering npm authentication/access, exact tarball inspection, clean install, CI success, tag behavior, and rollback-by-follow-up-release rather than unpublish.
- Alpha issue taxonomy and templates for runtime bugs, accessibility/browser issues, TypeScript/package ergonomics, docs gaps, and proposed frozen-contract changes.

### Dependencies / prerequisites

- Phase 2 distribution gate passes from a clean checkout.
- npm package ownership, token, and publish permissions are verified.
- No release-blocking documentation or licensing issue.

### Exact alpha entry criteria

- Phase 1 and Phase 2 exit criteria are satisfied.
- All required CI checks are green on the exact release candidate.
- The generated version is exactly `2.0.0-alpha.0` or the mechanically correct first alpha if prerelease history already exists.
- npm `latest` will remain on v1; prerelease publication targets `next` explicitly.
- README, migration guide, and release notes are included in the inspected tarball or linked appropriately.
- There are no known critical data-loss, form-submission, focus-stranding, inaccessible-operation, install, or build failures.

### Plan

Create a just-in-time `emblor-v2-alpha-release` plan covering both Phase 3 preparation and Phase 4 execution. It should be a release runbook, not another package architecture plan.

### Milestone

An alpha release-candidate PR containing changeset/prerelease metadata, release notes, documentation, and workflow adjustments. Publication remains a separate approved release action.

### Do not start yet

- Website v2 cutover.
- `latest` dist-tag changes.
- Beta promises or stable support claims.
- Casual API additions prompted by release-note convenience.

## Phase 4 — Publish `2.0.0-alpha.0`

### Purpose

Publish the first usable public v2 artifact and prove that npm distribution behaves like the verified packed candidate.

### Major deliverables

- Publish `emblor@2.0.0-alpha.0` under `next`; leave `latest` on v1.
- Create the corresponding Git tag/GitHub prerelease and publish release notes.
- Verify npm metadata, dist-tags, package contents, integrity, declarations, and peer ranges.
- Install the exact npm version—not `workspace:*`, a local tarball, branch URL, or source path—into clean React 18 and React 19 consumers.
- Compile, production-build, and mount controlled/uncontrolled examples from npm.
- Smoke-test representative real consumer projects, including at least a native form and a styled/polymorphic composition.
- Open and publicize the alpha feedback channel and apply the agreed issue labels/severity.

### Dependencies / prerequisites

- Approved Phase 3 release candidate.
- Publish workflow and npm credentials ready on Node 24.

### Exit criteria / alpha.0 definition of done

- Exact-version and `next` installs resolve to the intended alpha.
- `latest` still resolves to the v1 line.
- npm-installed React 18/19 consumers compile, build, and mount.
- No publication, integrity, export, declaration, or peer-dependency blocker remains.
- Any discovered problem is recorded with severity, reproduction, owner, and target alpha.

### Plan

Execute the approved `emblor-v2-alpha-release` runbook created in Phase 3.

### Milestone

Public npm/GitHub prerelease `2.0.0-alpha.0` plus a post-publish verification record.

### Do not start yet

- Move npm `latest`.
- Announce API stability equivalent to beta or stable.
- Switch the production docs site away from v1.

## Phase 5 — Alpha Iteration

### Purpose

Use real npm consumers to uncover and resolve bugs, compatibility issues, accessibility gaps, and package/type ergonomics problems before beta.

### Major deliverables

- `alpha.1`, `alpha.2`, and later alphas only when fixes are ready; do not publish empty cadence releases.
- Regressions for every confirmed package defect.
- Repeated npm-install verification in representative React 18/19 consumers.
- Accessibility and browser findings triaged against frozen decisions.
- TypeScript and package ergonomics validated in realistic consumer configurations.
- Feedback log showing resolved, deferred-nonblocking, duplicate, and rejected-scope items.

### Change policy

- Contract-restoring fixes, private refactors, tests, package corrections, and documentation clarification proceed normally.
- A request that changes a frozen public contract is not silently accepted as “alpha feedback.” It requires a new decision record superseding the affected decision, an updated plan/coverage map, and explicit approval before implementation.
- Suggestions, autocomplete, popovers, sorting/drag-and-drop, or styling conveniences remain external integrations regardless of consumer demand unless the entire product scope is deliberately reconsidered through a new decision.

### Dependencies / prerequisites

- `alpha.0` is publicly installable and the feedback process is active.

### Beta threshold / alpha definition of done

- At least one complete real-consumer feedback cycle has occurred against an npm-published alpha.
- No open critical/high-severity core behavior, accessibility, installation, declaration, export, or compatibility defect remains.
- No unresolved proposal to change the frozen public contract is pending.
- React 18/19, Node policy, browser gate, packed/npm consumers, and package checks remain green.
- API names, types, ownership, behavior, and migration guidance have survived alpha use without an approved breaking correction pending.
- The latest alpha is stable enough for the website to consume as a normal external dependency.

### Plan

Use small issue-scoped implementation plans for complex fixes. Do not create a blanket alpha implementation plan. If a frozen-contract correction is genuinely required, create the superseding decision and a dedicated plan before coding.

### Milestone

One or more `alpha.x` releases and a written beta-readiness recommendation.

### Do not start yet

- Beta publication before the threshold is met.
- Stable dist-tag changes.
- Website work before an npm alpha is explicitly declared suitable for docs consumption.

## Phase 6 — v2 Docs Site Rebuild

### Purpose

Replace the v1 website with documentation and examples built against the actual published v2 package, making the site a genuine external consumer and compatibility signal.

### Major deliverables

- `website/` installs an exact published v2 prerelease during development/CI rather than importing workspace source.
- Rebuilt information architecture for the v2 headless primitive.
- Reference and examples for Root, Label, TagList, Tag, TagText, Input, TagRemove, and Clear.
- Basic, controlled, uncontrolled, validation/rejection, paste, constraints, native forms, accessibility, keyboard/focus, RTL, styling, and polymorphic composition guides.
- Full v1 → v2 migration guide with removed API and integration mappings.
- Third-party integration examples such as cmdk, Radix Popover, and a drag-and-drop library implemented entirely in website/example code with explicit third-party dependencies.
- Clear labeling that integrations are consumer compositions, not Emblor core capabilities.
- Responsive, keyboard, screen-reader-oriented, typecheck, production-build, and link/example validation.
- Removal or archival of stale v1 examples from the active v2 navigation without erasing historical guidance prematurely.

### Dependencies / prerequisites

- An npm-published alpha meets the Phase 5 “suitable for docs consumption” threshold.
- Core README and migration semantics are already accurate.

### Exit criteria

- The site builds from a clean install against an exact npm v2 prerelease.
- Every frozen core part and major behavior has an accurate runnable example.
- Integration examples add no dependency or export to `packages/emblor`.
- Site accessibility, keyboard behavior, responsive layouts, typecheck, and production build pass.
- Migration guidance is complete enough for a v1 consumer to reach an equivalent core tag-input experience.
- The v2 site is deployable but need not replace the production v1 site until stable cutover.

### Plan

Create a dedicated just-in-time `emblor-v2-docs-site` implementation plan once an alpha is approved for website consumption. Inventory the existing v1 site then; do not pre-plan every page now.

### Milestone

A docs-site rebuild PR and preview deployment consuming the published v2 prerelease.

### Do not start yet

- Production docs cutover to v2.
- Core APIs invented to simplify demos.
- Copying cmdk, Radix, drag-and-drop, Tailwind, or Shadcn code into the package.

## Phase 7 — Publish `2.0.0-beta.0` / Effective Public API Freeze

### Purpose

Declare the v2 public surface release-candidate stable and publish a beta suitable for broader adoption.

DR-0041 already freezes the architecture. Beta adds a stricter release policy: after `beta.0`, public names and contracts are effectively frozen for stable, with changes allowed only for a demonstrated release blocker and an explicit superseding decision.

### Major deliverables

- Beta readiness review across core evidence, alpha feedback, package distribution, and docs.
- Updated changeset/prerelease metadata for `2.0.0-beta.0` under `next`.
- Beta release notes summarizing alpha findings, resolved defects, remaining known limitations, and stable criteria.
- Public API/export/type snapshot compared to the last approved alpha.
- npm-installed consumer verification and docs preview against the exact beta.

### Dependencies / prerequisites

- Phase 5 beta threshold satisfied.
- Phase 6 documentation baseline complete and consuming the published package.
- No pending approved breaking correction.

### Exit criteria / beta.0 definition of done

- `2.0.0-beta.0` is published under `next`; `latest` remains v1.
- Exact npm installs pass React 18/19 compile, production build, and mount checks.
- Docs preview installs and passes against the beta.
- Public API/type/export snapshot is recorded and treated as stable-boundary evidence.
- All known remaining work is classified as bugs, types, compatibility, accessibility, packaging, tests, or docs—not casual API redesign.

### Plan

Create a just-in-time `emblor-v2-beta-release` plan after alpha and docs exit gates pass.

### Milestone

Public npm/GitHub prerelease `2.0.0-beta.0` and beta verification report.

### Do not start yet

- npm `latest` promotion.
- Production docs cutover.
- Non-blocking renames or contract reshaping.

## Phase 8 — Beta Stabilization

### Purpose

Resolve release-candidate findings and prove that package, behavior, accessibility, types, browsers, and documentation are ready for stable support.

### Major deliverables

- `beta.1`, `beta.2`, and later betas only as required by substantive fixes.
- Final supported browser/platform matrix with repeatable evidence.
- Final accessibility review of labeling, announcements, forms, focus, keyboard, disabled/read-only, errors, RTL, and polymorphic semantics.
- Final TypeScript matrix across supported React types and representative compiler/bundler consumers.
- Final package/export/tarball/runtime-dependency/bundle sanity audit.
- Complete v2 docs site, migration guide, release notes draft, and v1 disposition proposal.
- Explicit source/artifact scan confirming no v1, Shadcn, Tailwind, CVA, cmdk, autocomplete, sortable, or drag-and-drop coupling leaked into core.

### Dependencies / prerequisites

- `beta.0` published and available to broader consumers.

### Stable threshold / beta definition of done

- At least one beta feedback cycle has completed against npm and the docs preview.
- No open release-blocking behavior, accessibility, browser, install, packaging, declaration, TypeScript, or documentation issue remains.
- All supported compatibility and CI matrices pass on the exact stable candidate.
- Public API, export map, behavior, and package contents match the recorded beta boundary unless an explicit release-blocking superseding decision was approved.
- Migration guide and v2 documentation are complete and validated by at least one v1-to-v2 migration exercise.
- The production docs cutover and npm `latest` promotion have an approved coordinated runbook.
- The v1 documentation/maintenance policy is decided and ready to communicate.

### Plan

Use issue-scoped plans during beta. Create a just-in-time stable-release readiness plan only when the stable threshold is nearly satisfied; it becomes the Phase 9 runbook.

### Milestone

Final beta release if needed, followed by a written stable-release recommendation.

### Do not start yet

- Stable version generation or `latest` promotion before every release blocker closes.
- New public capabilities.

## Phase 9 — Stable `2.0.0`

### Purpose

Publish the supported v2 package, move the default documentation and npm channel to v2, and provide a clear path for existing v1 users.

### Major deliverables

- Final stable changeset/version generation from prerelease mode to `2.0.0`.
- Final changelog and release notes with breaking changes, migration summary, supported environments, accessibility statement, and integration-scope boundaries.
- Exact stable tarball approval and immutable release checklist sign-off.
- Publish `emblor@2.0.0`, promote `latest` to v2, and remove/update prerelease tags only according to the release runbook.
- Git tag and GitHub stable release.
- Production docs site switch to the verified v2 build.
- Migration guidance prominently linked from npm README, release notes, and docs navigation.
- Post-publish clean installs in React 18 and React 19 consumer fixtures plus representative real projects.
- Verification of npm metadata, dist-tags, integrity, exports, types, package contents, and docs URLs.
- Publish and communicate the approved v1 documentation/maintenance policy.

### Dependencies / prerequisites

- Phase 8 stable threshold and stable-release recommendation.
- Approved coordinated npm/docs runbook and rollback communication.

### Stable release readiness gate

- Exact release commit passes every CI, browser, compatibility, package, docs, and security/sanity gate.
- Stable tarball matches the approved beta public boundary and intended file allowlist.
- No known release blocker or pending contract decision exists.
- npm permissions, Node 24 release environment, GitHub release, and docs deployment are ready.
- Migration and v1 disposition messaging are approved.

### Exit criteria / stable definition of done

- `emblor@2.0.0` is installable from npm and is the intended `latest` version.
- Clean npm consumers using React 18 and React 19 compile, production-build, and mount.
- Production v2 docs work against the published stable package.
- Release notes and migration guidance are reachable from all primary entry points.
- npm metadata, integrity, package contents, exports, declarations, and dist-tags are verified after publication.
- v1 users have an explicit archived-docs and maintenance path rather than silently losing guidance.
- Post-release issues use the normal patch-release process; regressions are not fixed by unpublishing `2.0.0`.

### Plan

Execute the just-in-time stable-release readiness/runbook plan created near the end of Phase 8.

### Milestone

Public npm/GitHub stable `2.0.0`, production v2 docs cutover, and post-publish verification record.

### Do not start yet

- `2.1` feature planning as part of the release runbook.
- Removing v1 historical documentation before its approved archive/maintenance action is complete.

## Release Progression

| Stage           | npm tag  | Meaning                                              | Promotion gate                                                                |
| --------------- | -------- | ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| `2.0.0-alpha.0` | `next`   | First public, usable v2 artifact; feedback expected  | Core and distribution readiness complete                                      |
| `2.0.0-alpha.x` | `next`   | Contract-restoring fixes and real-consumer hardening | Publish only for substantive verified changes                                 |
| `2.0.0-beta.0`  | `next`   | Public API and behavior are release-candidate stable | Alpha feedback and docs baseline complete                                     |
| `2.0.0-beta.x`  | `next`   | Release-blocking stabilization only                  | Publish only when beta fixes require another public candidate                 |
| `2.0.0`         | `latest` | Stable supported v2                                  | Full stable threshold, coordinated docs/npm cutover, and post-publish runbook |

## Just-in-Time Planning Points

Create plans at these boundaries, after prerequisites are known:

1. **Now:** use the existing residual tag-primitive plan; create nothing duplicative.
2. **After Phase 1:** create the distribution-readiness plan based on the hardened artifact and actual CI/package delta.
3. **After Phase 2:** create one alpha preparation/publication runbook for Phases 3–4.
4. **During alpha:** create issue-scoped plans only for complex findings; frozen changes require a superseding decision first.
5. **When an alpha is approved for docs:** create the website rebuild plan from the then-current site and published package.
6. **After alpha and docs exit gates:** create the beta release plan.
7. **Near the end of beta:** create the stable release/cutover runbook using actual npm, docs, and v1 disposition state.

Do not create detailed implementation plans for all future phases now. The roadmap owns order and gates; each future plan owns the concrete repository work visible at its phase boundary.

## v1 Documentation and Maintenance Line

The exact v1 disposition must be decided during beta stabilization and included in the stable runbook. The recommended default is:

- keep the last v1 package available on npm by exact version;
- archive the final v1 documentation at a clearly labeled versioned location;
- make the main docs and npm `latest` point to v2 after stable cutover;
- publish only critical v1 fixes if the project explicitly chooses a time-bounded maintenance window;
- avoid a v1 compatibility component or dual API inside v2.

If a different maintenance promise is desired, record it as a separate release-policy decision before stable publication.

## Roadmap Completion

This roadmap is complete only when Phase 9 post-publish verification succeeds. Finishing implementation, publishing an alpha, or completing the docs site alone does not make Emblor v2 stable.

At that point the planning index should move this roadmap to Completed and link the final stable release review, npm version, GitHub release, production docs deployment, and v1 disposition record.
