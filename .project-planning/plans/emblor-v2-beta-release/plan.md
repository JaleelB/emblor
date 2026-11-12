# Emblor v2 Beta Readiness and `2.0.0-beta.0` Release Plan

## Status

Planned on 2026-11-10; readiness implementation in progress on 2026-11-12. Local validation repairs are implemented and passing. Phase 5 and Phase 6 remain open until current exact-candidate CI, hosted-preview and manual QA evidence closes G1. Publication is gated on the evidence below; Phase 7 is not declared complete.

Jaleel considers the documentation experience satisfactory and reports no issues from alpha users. Treat this as product/design sign-off and reported feedback, not as proof that current build gates pass or that the number of independent consumers is known.

The original planning request authorized creation of this plan. Jaleel subsequently authorized implementation of the entire plan and committing/pushing the accepted docs redesign and necessary readiness fixes. Publication still requires G2 approval naming the concrete SHA/version. No production docs switch or npm tag change is authorized by readiness work.

## Feature Definition

Take the existing frozen headless tag-input package and accepted Fumadocs experience from `2.0.0-alpha.1` to a verified `2.0.0-beta.0` on npm `next`. Beta establishes the public API, types, exports, and behavior as the boundary intended for stable `2.0.0`.

## Goals and Non-Goals

- Close alpha feedback and documentation evidence with concrete results.
- Repair reproducibility, type resolution, and release tooling before version preparation.
- Publish and verify the exact beta artifact in React 18/19 consumers and the docs preview.
- Preserve one headless package, eight compound parts, root-only imports, zero runtime dependencies, and the existing behavior contracts.
- Keep `latest` on v1 and preserve access to production v1 documentation through alpha and beta.
- Add no core feature, public hook, rename, integration runtime, styling layer, or compatibility component.
- Schedule no extra alpha purely to advance a version number. A newly discovered substantive package defect is evaluated separately.
- Leave stable publication, production docs cutover, and final v1 sunset policy to the stable release plan.

## Current Evidence and Assumptions

The preceding local audit recorded these results. Reproduce them on the chosen candidate; they are not current exact-SHA CI approval:

- Package build, lint, typecheck, 78 tests, release-boundary tests, and isolated packed React 18/19 consumer compile/build/runtime/module checks passed.
- Website content checks passed for 19 routes, 35 TypeScript examples, 8 public components, 27 Root props, 19 public types, 10 behavior evidence anchors, and 10 registry items. Exact external alpha.1 resolution passed.
- Website typecheck and production build failed with React type identity/ref errors in `components/playground-examples.tsx` and `components/ui/field.tsx`. Mixed React 18/19 type resolution is a hypothesis to confirm, not a completed diagnosis.
- The root formatting gate reported 58 files. Investigate formatter version, configuration, and line endings before accepting a broad mechanical diff.
- The artifact gate completed both consumer runs but failed the reviewed Windows dependency-graph hash for React 18. Diagnose fixture graph drift before changing baselines.
- npm was last checked as `next=2.0.0-alpha.1`, `latest=1.4.8`; verify again at preparation and publication.
- `website/QA_REPORT.md` records automated evidence dated 2026-09-10 and screen-reader acceptance reported by Jaleel on 2026-09-22, without environment details. Retain that historical result and add current evidence for affected surfaces.
- The Phase 5 docs-entry checkpoint records a published-alpha performance feedback/fix cycle and real npm consumer verification. Do not invent a missing cycle or require an arbitrary additional waiting period; assess that evidence alongside website consumption and current feedback.
- The docs branch was last inspected at `bb5a53d`. Local homepage/CSS/component edits now exist and belong to ongoing user work. Do not overwrite, discard, or silently include them in a release candidate. Record the final included commit once those edits are settled.

## Decision Manifest

The decision inventory contains DR-0001 through DR-0045. Resolve statuses before execution. DR-0006 and DR-0033 are superseded; DR-0044 replaces DR-0043's framework choice while retaining its product requirements.

### Required

- **DR-0001, DR-0002, DR-0007:** headless scope, single package, root-only code API, excluded features, zero unintended runtime dependencies.
- **DR-0004:** meaningful React 18 and React 19 verification.
- **DR-0005:** website consumption follows a usable published package and remains separate from core scope.
- **DR-0012:** Changesets prerelease metadata, real consumer proof, deliberate promotion, and non-`latest` distribution.
- **DR-0013:** exact-candidate CI is authoritative; local checks expose the same gates.
- **DR-0014:** Node 24 primary/release runtime and Node 22 compatibility; no new browser-package Node engine.
- **DR-0041:** all active DR-0001–DR-0040 behavioral obligations remain frozen and must retain their existing verified regression coverage. A contract correction needs a superseding decision, not an incidental beta change.
- **DR-0042:** v2 uses `main`; v1 stays on `1.x`/`latest`; publication is manual, exact-SHA, protected, and explicitly authorized.
- **DR-0044 and retained DR-0043 requirements:** Fumadocs docs, required routes, homepage, playground, external package consumption, and website-owned registry/integrations.
- **Roadmap Phases 5–7:** close alpha/docs prerequisites, record the public boundary, publish beta under `next`, then verify public consumers and the beta docs preview.

- **DR-0045:** preserve the accepted dark-only docs design; use honest dark-only visual coverage while retaining accessibility requirements.

### Related

- Completed residual-core, distribution, performance, and alpha.1 release-closure plans supply prior proof; link it rather than rewriting their history.
- Existing Phase 6 plan/coverage governs the full documentation obligation set and remains the source for docs closure.

### Not Applicable

- Superseded DR-0006/DR-0033 and the superseded Nextra implementation requirement.
- DR-0004's original refactor-era no-rebase instruction imposes no new prohibition on ordinary beta branch integration; preserve its React compatibility contract.

### Deferred

No beta obligation is deferred. Stable `latest` promotion, production v2 docs cutover, and final v1 sunset policy remain later roadmap scope, not waived beta requirements.

### Conflicts or Uncertainty

- The roadmap normally creates the detailed beta runbook after Phase 5/6 close. This requested plan covers readiness first and permits release preparation only after gate G1 passes.
- Phase 6 coverage still lists `Planned` and obsolete Nextra references despite implemented Fumadocs code. Reconcile it against DR-0044 and actual evidence; do not mark all rows Verified from product sign-off alone.
- Merging the docs branch may trigger Vercel production deployment. Inspect hosting configuration before merge and establish a preview-only path that preserves production v1. Merge is not an unconditional beta prerequisite if the approved preview baseline can be maintained separately.

## Decision Coverage

| ID     | Obligation                                                                                   | Source                         | Tasks            | Verification        | Status            |
| ------ | -------------------------------------------------------------------------------------------- | ------------------------------ | ---------------- | ------------------- | ----------------- |
| B/O-01 | Preserve frozen API, behavior, exports, and package scope                                    | DR-0001/2/7/0041               | T-02, T-04, T-06 | VT-02, VT-04, VT-06 | Partially Covered |
| B/O-02 | Close alpha feedback using documented consumer evidence and findings disposition             | DR-0012/0041; Phase 5          | T-01             | VT-01               | Verified          |
| B/O-03 | Close all required Fumadocs/registry/docs obligations against an exact npm package           | DR-0005/0044; retained DR-0043 | T-02, T-03, T-07 | VT-02, VT-03, VT-07 | Partially Covered |
| B/O-04 | Prove React 18/19 and Node 22/24 compatibility                                               | DR-0004/0014                   | T-02, T-05, T-07 | VT-02, VT-05, VT-07 | Partially Covered |
| B/O-05 | Use reproducible authoritative CI, artifact inspection, and reviewed baselines               | DR-0013                        | T-02, T-04, T-05 | VT-02, VT-04, VT-05 | Partially Covered |
| B/O-06 | Generate coherent beta version, Changesets metadata, notes, and snapshots                    | DR-0012/0041; Phase 7          | T-04             | VT-04               | Planned           |
| B/O-07 | Publish manually from approved main SHA on Node 24 using protected OIDC and verified tarball | DR-0013/0014/0042              | T-04, T-05, T-06 | VT-04, VT-05, VT-06 | Planned           |
| B/O-08 | Verify npm identity, provenance, next/latest safety, and matching GitHub metadata            | DR-0012/0042                   | T-06, T-07       | VT-06, VT-07        | Planned           |
| B/O-09 | Preserve v1 docs/source/channel and avoid accidental production cutover                      | DR-0005/0042                   | T-03, T-06, T-07 | VT-03, VT-06, VT-07 | Planned           |
| B/O-10 | Record beta verification and hand off to stabilization                                       | Roadmap Phases 7–8             | T-07             | VT-07               | Planned           |

Files and evidence for each obligation are specified in the tasks below. Implementation is complete only when every required row is Verified or a separately approved deferral is recorded.

## Execution Sequence and Gates

1. **Readiness:** T-01 through T-03; G1 closes Phase 5/6 and recommends beta.
2. **Preparation:** T-04 and T-05; G2 produces an approved SHA/version/artifact with green CI.
3. **Publication:** T-06 requires explicit approval of that concrete candidate.
4. **Verification:** T-07; G3 closes beta publication and starts Phase 8.

### T-01 — Close alpha feedback and findings

Decisions/obligations: DR-0012/0041; B/O-02. Verification: VT-01.

Files: this plan's `implementation-review.md` (create during execution), the Phase 5 checkpoint, roadmap, and links to relevant issue/consumer evidence.

- Record Jaleel's report of no alpha issues, date, exact package version, and any known usage context. Consumer counts and independent adoption remain unknown unless evidenced.
- Inspect current v2/alpha issues and pending contract proposals. Classify historical v1 reports by applicability rather than treating them as v2 blockers.
- Link the completed alpha performance/fix cycle, published React 18/19 verification, and docs as an external alpha consumer. Exercise representative controlled/uncontrolled, native-form, styled/polymorphic, keyboard, rejection, and integration use.
- Record each current finding with reproduction, severity, contract impact, disposition, and owner. Require no unresolved critical/high defect or pending approved breaking correction.
- Write an explicit alpha exit recommendation. No arbitrary adoption count, extra alpha, or waiting interval is required by this plan.

### T-02 — Repair validation and prove reproducibility

Decisions/obligations: DR-0001/2/4/7/0013/0014/0041; B/O-01/03/04/05. Verification: VT-02.

Files: website TypeScript configuration and affected playground/shadcn wrappers; root/website manifests and lockfile only as justified; formatter configuration; `packages/emblor/tests/compat/verify-packed-consumers.mjs`; `tests/packaging/size-baseline.json` and artifact verifier; CI workflows.

- Reproduce the website failure after a frozen install and trace actual React type resolution. Fix type isolation or declarations at their source; retain React 18 package support and React 19 website support. Do not hide incompatibility using blanket casts or disabling typechecks.
- Diagnose format drift with the committed formatter/configuration and line-ending policy. Keep any required mechanical changes reviewable and verify no runtime/API changes.
- Compare consumer fixture graphs, dependency versions, package-manager serialization, platform differences, and prior baseline evidence. Pin or correct the fixture as needed; update platform hashes only after reviewing the actual graph and size results. Preserve drift detection and size tolerances.
- Run the full frozen-install distribution gate, package browser tests, website validation/build, hosted registry consumer tests, and supported website browser/visual checks on Node 24 and the configured Node 22 lane.
- Use serial install/build phases where shared dependency or generated-output mutation could race. Record exact tool versions and commits.
- Add focused regressions for confirmed type/tooling failures where useful; retain existing behavioral coverage instead of duplicating it.

### T-03 — Close Phase 6 and integrate safely

Decisions/obligations: DR-0005/0013/0042/0044 and retained DR-0043; B/O-03/09. Verification: VT-03.

Files: `.project-planning/plans/emblor-v2-docs-site/{plan.md,decision-manifest.md,coverage.md,implementation-review.md}`, `website/{QA_REPORT.md,RELEASE_CHECKLIST.md,SCREEN_READER_QA.md}`, roadmap, hosting/deployment configuration if necessary.

- Retain the accepted docs design; settle and review current user-owned homepage changes before selecting the docs commit.
- Reconcile framework references and map every Phase 6 obligation to actual files, automated results, manual evidence, or a specifically unresolved item. Product approval does not replace verification.
- Refresh QA for affected surfaces; record browser/screen-reader versions, tester, date, routes, and results when rerunning manual checks. Preserve historical acceptance rather than claiming it was never performed.
- Inspect Vercel production-branch and preview behavior. Prove production v1 remains accessible before integrating website changes into `main`; isolate hosting if merge would otherwise switch production prematurely.
- Review the docs PR/preview and merge only through the established approval process once deployment behavior is safe. If docs stays on a preview branch, record its immutable commit and integration path; the release package must still originate on `main`.
- Close Phase 6 with a written review and evidence links. Update the roadmap/index to reflect the result.

### Gate G1 — Ready to prepare beta

T-01–T-03 are verified; all alpha/docs exit obligations are closed; current required CI is green; there is no critical/high issue or unresolved public-contract correction. The review explicitly recommends `2.0.0-beta.0` with no new core features. Until G1 passes, status remains alpha/readiness work.

### T-04 — Prepare beta metadata and release automation

Decisions/obligations: DR-0012/0013/0014/0041/0042; B/O-01/05/06/07. Verification: VT-04.

Files: `.changeset/pre.json`, applicable changesets, package manifest/changelog/README, root README/release scripts, lockfile, `.github/releases/2.0.0-beta.0.md`, `.github/workflows/publish.yml`, release validators/tests, public API snapshot under this plan or package test fixtures.

- First rehearse the alpha-to-beta Changesets transition in a disposable checkout using the installed pinned CLI. Review prerelease tag/counter behavior, consumed changesets, lockfile, and changelog; require output exactly `2.0.0-beta.0`. Do not hand-edit only the version or invent a feature changeset to force a bump.
- Apply the rehearsed transition in a focused preparation branch after G1. Keep Changesets as version/changelog authority and preserve historical alpha entries.
- Capture the alpha.1 public export map, component/type declarations, peer range, and package-file boundary. Compare beta and require no unapproved public change; normalize only documented build/version noise.
- Update README and beta notes with the unchanged core scope, alpha findings, compatibility policy, limitations, feedback instructions, and beta stability expectations.
- Adapt the existing manual OIDC workflow and validators for supported alpha/beta candidates. The workflow currently rejects beta via its alpha-only regex; `validate-release.mjs` requires prerelease tag `alpha`. Audit all related assumptions, defaults, hard-coded release notes/version references, packaging assertions, and tests.
- Derive/validate candidate version and prerelease stage consistently. Add tests accepting the intended beta while rejecting stable/malformed versions, mismatched metadata, an existing target version, unsafe dist-tags, and an unverified candidate. Avoid broadening publication to stable.
- Preserve exact SHA/version inputs, successful CI checks, protected `npm` environment, Node 24, pinned pnpm, artifact checksum/identity, OIDC provenance, and explicit `--tag next`. Preserve pnpm setup in post-publication consumer verification.
- Validate the same uploaded tarball before publishing it. Ensure package README is not overwritten after inspection.

### T-05 — Approve the immutable candidate

Decisions/obligations: DR-0004/0013/0014/0042; B/O-04/05/07. Verification: VT-05.

Files/systems: preparation PR, `main`, CI, release dry-run, immutable artifact report, this plan's implementation review.

- Merge reviewed preparation through the normal process; record the resulting full `main` SHA, version, CI run IDs, tarball checksum, declaration/export comparison, and docs preview commit.
- Require green Node 22/24 gates and Node 24 release/browser validation on that exact publication SHA. Changes after approval create a new candidate and require new affected evidence.
- Run non-publishing preflight: target beta absent, `latest` still `1.4.8`, expected prerelease state coherent, credentials/environment available, artifact files/metadata correct.
- Present the concrete SHA/version/checksum and remaining limitations for publication approval. A plan or green PR does not itself authorize workflow dispatch.
- Keep website pinned to published alpha.1 before npm beta exists. Record how beta docs validation will occur after publication.

### Gate G2 — Ready to publish

G1 is passed, beta preparation is reviewed, exact main-SHA CI and artifact evidence pass, release tooling accepts beta safely, and publication approval names `2.0.0-beta.0` and its candidate SHA.

### T-06 — Publish beta to `next`

Decisions/obligations: DR-0012/0013/0014/0042; B/O-01/07/08/09. Verification: VT-06.

Systems: manually dispatched `publish.yml`, protected npm environment, npm registry, Git tag/GitHub prerelease, implementation review.

- Dispatch the approved SHA/version on Node 24. Recheck registry state immediately before publishing the verified tarball to `next` with provenance.
- Verify exact npm version, tarball/integrity, provenance, `next=2.0.0-beta.0`, and unchanged `latest=1.4.8` before creating matching Git metadata.
- Verify the Git tag targets the approved source and create the matching GitHub prerelease with beta notes. Keep it marked prerelease.
- Record workflow/run/artifact URLs and identity. If publication succeeds but a later check fails, verify registry state before retrying anything; never attempt to overwrite the published version.

### T-07 — Verify the public beta and start stabilization

Decisions/obligations: DR-0004/0005/0012/0014/0042/0044; B/O-03/04/08/09/10. Verification: VT-07.

Files/systems: website manifest/lockfile, installation docs/commands, canonical registry source/generated items, `website/QA_REPORT.md`, beta implementation review, planning index/roadmap, public npm consumer fixtures.

- Install the exact public beta tarball in clean React 18/19 projects and rerun typecheck, production build, runtime/forms, polymorphic/ref, and module/export checks. Record public integrity rather than relying only on local tarball proof.
- Update the docs preview to exact published `2.0.0-beta.0` across dependency, install commands, release labels, and registry dependencies. Regenerate registry artifacts and run drift, all-item consumer installs, content/API/example checks, Node 22/24 builds, and affected browser/accessibility checks.
- Review the preview against the beta; verify production v1 docs and npm `latest` remain unchanged.
- Record any beta findings with severity and disposition. Keep Phase 7 open if post-publication verification is blocked.
- Mark coverage Verified only from actual results. Publish the beta verification review and move the roadmap to Phase 8 after G3 passes.

### Gate G3 — Beta release complete

The public beta, source tag, GitHub prerelease, provenance, React 18/19 npm consumers, and docs preview all pass. No unresolved release blocker remains; `latest` and production v1 are preserved. Phase 8 owns feedback and further beta fixes; stable still requires a beta feedback cycle and its separate cutover plan.

## Verification Tasks

| ID    | Required evidence                                                                                                                                                                             |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| VT-01 | Dated alpha findings review links the existing feedback/fix cycle, reported absence of issues, current issue triage, realistic npm use, and explicit alpha exit verdict.                      |
| VT-02 | Clean frozen installs reproduce full package/distribution and docs gates on the supported matrix; diagnosed format/type/fixture issues are fixed with reviewed diffs and retained safeguards. |
| VT-03 | Every Phase 6 row has evidence; current preview and affected accessibility/browser results pass; hosting configuration demonstrates no premature production switch.                           |
| VT-04 | Changesets rehearsal yields exact beta.0; public surface matches alpha; release automation positive/negative tests and metadata preflight pass without publishing.                            |
| VT-05 | Approved full main SHA, beta version, green exact-SHA CI, tarball identity, release dry-run, and explicit publication approval are recorded together.                                         |
| VT-06 | Publication log and registry metadata prove approved artifact identity/provenance, correct next/latest tags, and matching Git/GitHub prerelease metadata.                                     |
| VT-07 | Exact public-beta React 18/19 consumers and beta-pinned docs/registry preview pass; final coverage/review closes Phase 7 and records Phase 8 handoff.                                         |

## State, API, and UX Changes

No planned public API or core behavior change. Repository state changes are reviewed validation repairs, beta Changesets metadata, version/changelog/notes, release tooling, API snapshots, and documentation evidence. Publication changes npm `next` from the approved alpha to beta. Preview content adopts beta after publication; no further visual redesign is required for this milestone.

## Rollback and Failure Handling

- Before publication, use ordinary reviewable Git reverts for preparation changes; preserve unrelated user edits. No npm rollback is needed.
- A preview deployment failure can roll back to its prior preview without changing production v1.
- After npm publication, do not unpublish or overwrite beta.0. A blocking package defect requires a verified follow-up prerelease and explicit release approval; a docs-only defect can be repaired in the preview.
- If a channel correction is needed, inspect exact tags and obtain approval for that specific mutation. Do not move `latest` as a recovery shortcut.
- Missing Git metadata can be repaired against the verified immutable source after npm identity is established.

## Open Execution Facts

These do not block planning; resolve them before the corresponding gate:

- Current remote branch/PR/CI and Vercel settings have not been refreshed by this planning task.
- The final homepage edits and included docs SHA are not yet settled.
- Independent alpha adoption volume is unknown; use recorded evidence and truthful reported feedback.
- Root causes of type/format/snapshot failures must be reproduced before selecting fixes.
- Exact Changesets transition behavior must be rehearsed before applying version changes.

## To-Dos

- [x] T-01 / VT-01 — Alpha findings and exit review.
- [ ] T-02 / VT-02 — Validation repair and clean matrix.
- [ ] T-03 / VT-03 — Docs evidence and safe integration.
- [ ] G1 — Readiness recommendation approved by evidence.
- [ ] T-04 / VT-04 — Beta metadata, snapshots, and automation.
- [ ] T-05 / VT-05 — Immutable candidate and publication approval.
- [ ] G2 — Publication authorized for concrete SHA/version.
- [ ] T-06 / VT-06 — Publish and verify registry/Git identity.
- [ ] T-07 / VT-07 — Public beta consumer/docs verification.
- [ ] G3 — Beta complete; begin Phase 8 stabilization.

## Execution update - 2026-11-12

See [implementation-review.md](./implementation-review.md) for the current findings, commands, artifact identities, supported matrix, coverage reconciliation, and concrete remaining actions. T-01 recommends beta preparation once G1 closes; T-02 repairs are implemented with local passing results; T-03 remains partially verified. DR-0045 records the explicitly accepted dark-only design instead of claiming light-mode tests passed. Vercel account repair, safe hosting/preview evidence and current manual screen-reader acceptance remain prerequisites. G1 has not passed; T-04 version preparation and later publication remain gated.
