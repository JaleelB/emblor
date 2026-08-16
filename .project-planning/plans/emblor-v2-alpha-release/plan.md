# Release Runbook: Emblor v2 `2.0.0-alpha.0`

## Status

Phase 3 and Phase 4 are complete. T-15 records a PASS for exact merged `main` SHA `76bbd359eebc522dedd03cbfcacfcc6cfa903b96`, and [phase-4-publication-evidence.md](./phase-4-publication-evidence.md) records the protected publication, registry verification, consumer proof, GitHub prerelease, and backlog handoff.

The explicit Phase 4 authorization was supplied for SHA `76bbd359eebc522dedd03cbfcacfcc6cfa903b96` and version `2.0.0-alpha.0`; the protected `npm` environment was then approved. Phase 5 Alpha Iteration is now the next active phase.

## Release Definition

Prepare and then, under a separate approval, publish the first public Emblor v2 prerelease:

- package/version: `emblor@2.0.0-alpha.0`
- npm prerelease channel: `next`
- npm stable channel: `latest` remains `1.4.8`
- Git tag: `emblor@2.0.0-alpha.0`
- GitHub release: prerelease, not latest
- package scope: the frozen headless tag-input primitive only

This is a release runbook, not a package architecture plan.

## Current State

- Phase 1 and Phase 2 are complete with all coverage obligations Verified.
- The approved integrated candidate is `76bbd359eebc522dedd03cbfcacfcc6cfa903b96`; exact-SHA CI run `31923283942` passed Node 22 and Node 24.
- npm reports `next: 2.0.0-alpha.0` and `latest: 1.4.8`; the public exact version is installable.
- `npm owner ls emblor` identifies `jaleelb` as package owner.
- npm trusted publishing is configured for `JaleelB/emblor`, `publish.yml`, environment `npm`, and permission `npm publish`; protected OIDC publication and provenance succeeded in Phase 4.
- The existing `NPM_TOKEN` was not used.
- Changesets prerelease metadata, package version `2.0.0-alpha.0`, README, migration guide, changelog, release notes, feedback intake, and packed-artifact checks are complete on the feature branch.
- Current v1 `main` remains preserved on remote `1.x` at the recorded v1 SHA; evidence-supported backlog replies and closures occurred only after the real npm `next` link existed.
- The protected manual OIDC workflow published the verified tarball once, then the exact Git tag and GitHub prerelease were created after registry verification.
- The final dispatch used a corrected feature-ref workflow revision to repair three pre-publication defects; its checkout, ancestry, CI, candidate metadata, and tarball remained pinned to the approved merged `main` SHA. Port these release-plumbing fixes to the default-branch workflow before the next publication.

## Release Mechanism

### Versioning and changelog

Use Changesets `2.27.1` prerelease mode to generate the version and changelog:

1. remove the unrelated stale v1 patch changeset;
2. add one major changeset describing the v2 hard break;
3. set Changesets access to `public`;
4. enter prerelease mode with `alpha`;
5. run Changesets versioning and verify the result is exactly `2.0.0-alpha.0`.

Changesets remains the version/changelog authority. It is not the alpha publication command.

### npm channel

Changesets prerelease mode couples its prerelease tag to its npm tag. Emblor intentionally needs `alpha.0` in semver while consumers install from `next`. Publish the exact verified tarball directly with npm using the `next` tag. Do not invoke `changeset publish` for this release.

### Authentication and provenance

Use npm trusted publishing from a dedicated GitHub Actions workflow and protected GitHub environment. The package manifest must contain the exact public repository URL, the workflow must receive `id-token: write`, and the runner must use a trusted-publishing-compatible npm version on Node 24. Trusted publishing should generate provenance automatically for this public package/repository.

The existing long-lived `NPM_TOKEN` is not the primary alpha mechanism. Retain it until the first OIDC publication succeeds; retiring it afterward is a separate explicitly authorized security action.

### Approval boundary

Phase 3 may generate and commit version/release metadata but must not publish. Phase 4 uses a manually dispatched workflow with:

- exact expected commit SHA;
- exact expected version `2.0.0-alpha.0`;
- a protected `npm` environment requiring approval;
- validation that the SHA passed the required CI run;
- a pre-publish assertion that `latest` is still `1.4.8` and the target version is absent.

After npm publication, verify the registry before creating the Git tag and GitHub prerelease.

## Goals

- Produce an auditable alpha release candidate from the verified `1.4.8` baseline.
- Reconcile stale Changesets state without contaminating v2 history or notes.
- Make README, migration guidance, changelog, and release notes sufficient for real v2 consumers.
- Establish secure, provenance-bearing, explicitly approved publication under `next`.
- Verify the public npm artifact—not workspace source or a local tarball—in React 18/19 consumers.
- Open a structured alpha feedback channel and hand off to Alpha Iteration with evidence.

## Non-Goals

- No website v2 migration or production docs cutover.
- No npm `latest` change.
- No beta/stable promise, support guarantee, or API-stability claim.
- No public API, behavior, type, state, forms, focus, keyboard, accessibility, polymorphism, or package-boundary redesign.
- No v1 compatibility component or excluded integrations/features.
- No alpha.1 work unless alpha.0 post-publish verification discovers a blocking defect.
- No unpublish-based rollback.

## Decision Traceability

- [Decision Manifest](./decision-manifest.md)
- [Decision Coverage](./coverage.md)
- [v1 Maintenance and v2 Alpha Integration Transition Runbook](./transition-runbook.md)

Status: Phase 3 and Phase 4 are complete. AR/O-01 through AR/O-23 are Verified in [coverage.md](./coverage.md) and [phase-4-publication-evidence.md](./phase-4-publication-evidence.md). Phase 5 Alpha Iteration is active; remaining behavior and security findings are carried forward without claiming they are fixed.

## Files and External Systems

Expected repository changes:

- `.changeset/config.json`
- stale/new `.changeset/*.md`
- `.changeset/pre.json`
- `packages/emblor/package.json`
- `packages/emblor/README.md`
- `packages/emblor/MIGRATION.md`
- `packages/emblor/CHANGELOG.md`
- `pnpm-lock.yaml`
- package tarball allowlist/baselines and distribution tests when new documentation files are shipped
- a release-notes source under `.github/releases/2.0.0-alpha.0.md`
- `.github/workflows/publish.yml` or a replacement dedicated alpha workflow
- `.github/ISSUE_TEMPLATE/*` and issue-template configuration
- `website/package.json` only for a narrow v1 build-toolchain compatibility correction; no docs/content migration
- root release scripts only where needed for deterministic preparation/verification
- this plan folder, planning index, and roadmap status

Expected external configuration during Phase 3:

- npm trusted publisher for `JaleelB/emblor`, the exact release workflow filename, and the protected environment
- GitHub `npm` environment with required approval
- alpha issue labels/milestone or equivalent tracking surface

Forbidden Phase 3 changes:

- `packages/emblor/src/**`
- public exports/types/props
- runtime dependencies
- `website` source, docs, or application behavior (a narrow build-toolchain compatibility correction is allowed)
- `packages/emblor/playground/**`
- npm publication or dist-tag mutation

## Implementation Tasks

### T-00 — Establish release authority and immutable baseline

Decisions: DR-0012, DR-0013, DR-0014, DR-0041.

Obligations: AR/O-01, AR/O-10.

Work:

- Record the Phase 2 commit, final CI run `31767216492`, npm version/dist-tags/owner, existing Git tags/releases, package fingerprint, and current documentation/changeset state.
- Confirm the repository is public and package ownership is correct.
- Configure or verify the npm trusted publisher and exact GitHub workflow/environment identity without publishing.
- Confirm the GitHub environment has an explicit approval boundary and the workflow can request OIDC.
- Record that local npm authentication is absent and is not required for the OIDC workflow.

Verification: VT-00.

### T-01 — Reconcile Changesets and rehearse `alpha.0`

Decisions: DR-0001, DR-0002, DR-0012.

Obligations: AR/O-02 through AR/O-04, AR/O-07.

Work:

- Delete the stale `cyan-owls-jump.md` patch changeset; record why it must not enter v2 notes.
- Change Changesets access from `restricted` to `public`.
- Add one major changeset summarizing the complete v2 hard break and pointing to migration guidance.
- In a disposable clean worktree, enter `alpha` prerelease mode and run versioning.
- Assert the only package version becomes `2.0.0-alpha.0`, the lockfile and prerelease state agree, the major changeset is consumed correctly, and generated changelog content is accurate.
- Repeat the rehearsal from a clean baseline to prove deterministic output before applying it to the candidate branch.

Verification: VT-01.

### T-02 — Finalize package metadata and shipped documentation

Decisions: DR-0001, DR-0002, DR-0004, DR-0007, DR-0012–DR-0014, DR-0041.

Obligations: AR/O-04, AR/O-05, AR/O-08.

Work:

- Add exact repository/homepage/bugs metadata required for npm provenance and consumer navigation.
- Add `publishConfig.access: public` without adding a Node engine or runtime dependency.
- Include `MIGRATION.md` and `CHANGELOG.md` in the package files and exact tarball allowlist.
- Keep `packages/emblor/README.md` as the one publication README.
- Add a prominent prerelease warning, exact `npm`/`pnpm` `@next` installation, React support, feedback link, migration link, and statement that `latest` remains v1.
- Re-run package-size baselines intentionally for the added documentation only.

Verification: VT-02.

### T-03 — Complete migration, changelog, and alpha release notes

Decisions: all active DR-0001 through DR-0041, with DR-0006 and DR-0033 superseded.

Obligations: AR/O-05 through AR/O-08.

Work:

- Expand `MIGRATION.md` into a complete v1-to-v2 guide with before/after examples.
- Cover object-to-string values, state ownership, controlled/uncontrolled draft, compound markup, consumer-owned identity, styling/DOM ownership, renamed/removed props, callbacks/rejections, forms, validation, keyboard/focus, accessibility, and removed integrations/subpaths.
- Keep advanced integrations framed as consumer composition, not core features.
- Create concise alpha release notes stating prerelease risk, frozen architecture versus semver stability, supported React/Node policy, known limitations, migration path, excluded scope, feedback taxonomy, and no `latest` change.
- Ensure generated changelog, package README, migration guide, and GitHub release notes agree.
- Compile every TSX example from the packed candidate.

Verification: VT-03.

### T-04 — Establish the alpha feedback system

Decisions: DR-0001, DR-0012, DR-0041.

Obligations: AR/O-09, AR/O-17.

Work:

- Add or update issue forms for runtime behavior, accessibility/browser compatibility, TypeScript/package ergonomics, documentation/migration gaps, and proposed frozen-contract changes.
- Require version, environment, reproduction, severity/impact, and expected behavior where applicable.
- Create the corresponding labels and an `alpha` milestone or documented equivalent.
- Make contract-change proposals explicitly cite the affected decision and require a superseding record before implementation.
- Define severity and target-alpha fields used during post-publish triage.

Verification: VT-04.

### T-05 — Build the approval-gated alpha publication workflow

Decisions: DR-0012, DR-0013, DR-0014, DR-0041.

Obligations: AR/O-10, AR/O-11, AR/O-13.

Work:

- Replace automatic token-oriented publication with a dedicated manual alpha workflow or an equivalently explicit protected release job.
- Accept expected SHA and version inputs; reject anything other than `2.0.0-alpha.0` for the first run.
- Checkout the exact SHA, use Node 24 and frozen install, confirm required CI success, then run the complete distribution/browser gate as appropriate for the release candidate.
- Pack once, compare its fingerprint with the candidate evidence, and publish that tarball directly to npm with `--tag next --access public` using OIDC trusted publishing.
- Require `id-token: write` only in the publish job and use the protected `npm` environment.
- Assert target version absence and unchanged `latest` before publish; never invoke `changeset publish` for alpha.0.
- Stop after npm publish if registry verification fails; do not create misleading Git/GitHub release metadata.

Verification: VT-05.

### T-06 — Generate the exact alpha release candidate

Decisions: DR-0012–DR-0014, DR-0041.

Obligations: AR/O-03, AR/O-08, AR/O-12.

Work:

- Apply the rehearsed prerelease/version step once on the candidate branch.
- Verify package manifest, prerelease state, lockfile, changelog, README, migration, release notes, tarball contents, and fingerprints.
- Run the complete distribution gate locally without any publish command or release credential.
- Create a coherent release-candidate commit/PR series ending with the versioned `2.0.0-alpha.0` artifact.

Verification: VT-06.

### T-07 — Approve or reject Phase 3

Decisions: DR-0012, DR-0013, DR-0041.

Obligations: AR/O-01, AR/O-11, AR/O-12.

Work:

- Require the exact candidate SHA to pass Node 22/24 distribution CI and Node 24 bundled Chromium.
- Review the candidate diff against DR-0041 and scan for public/source/website/playground/excluded-feature changes.
- Confirm trusted publisher/environment configuration, npm ownership, licensing, docs, and feedback tracking are ready.
- Record the npm preflight showing `latest: 1.4.8` and the target version absent.
- Create a Phase 3 implementation review with one verdict: approved for explicit Phase 4 publication, needs fixes, or blocked on external release authority.
- Do not publish as part of this task.

Verification: VT-07.

### T-08 — Publish `2.0.0-alpha.0` under `next`

Decisions: DR-0012–DR-0014.

Obligations: AR/O-11, AR/O-13, AR/O-14, AR/O-17.

Prerequisite: explicit user approval naming the exact Phase 3 SHA and `2.0.0-alpha.0`.

Work:

- Manually dispatch the protected release workflow with the approved SHA/version.
- Monitor through package publication and registry verification.
- Confirm npm accepted the provenance-bearing public tarball under `next` and did not move `latest`.
- Only then create/push `emblor@2.0.0-alpha.0` and create the GitHub prerelease from the reviewed notes.
- If npm publication succeeds but a later metadata step fails, repair tags/release metadata; never republish the same version or unpublish it casually.

Verification: VT-08.

### T-09 — Verify the public npm release

Decisions: DR-0002, DR-0004, DR-0007, DR-0012–DR-0014, DR-0016, DR-0018, DR-0035, DR-0041.

Obligations: AR/O-14 through AR/O-18.

Work:

- Query exact npm version and dist-tags; require exact-version and `@next` resolution to alpha.0 and `latest` to remain 1.4.8.
- Download and inspect the registry tarball/integrity/provenance and compare contents, exports, declarations, peers, README, migration, changelog, and fingerprint with the approved candidate.
- In fresh external React 18 and React 19 consumers, install from npm by exact version and by `@next`—never workspace, file, source, or branch.
- Compile strict TypeScript, production-build, mount controlled/uncontrolled examples, submit a native form, and render styled/polymorphic composition.
- Record every finding with severity, reproduction, owner, and target alpha.

Verification: VT-09.

### T-10 — Close alpha.0 release and hand off to iteration

Decisions: DR-0001, DR-0005, DR-0012, DR-0041.

Obligations: AR/O-01, AR/O-17, AR/O-18.

Work:

- Resynchronize coverage and create the final post-publish implementation review.
- Link npm version/dist-tags, provenance, Git tag, GitHub prerelease, CI run, consumer evidence, and open findings.
- Revisit the Phase 3 internal v1 backlog classifications only after publication; reply or close applicable issues and pull requests with migration evidence and a real npm `next` link.
- Keep this runbook Active if any Required obligation lacks evidence or publication did not occur.
- When complete, move the plan to Completed and make Phase 5 Alpha Iteration active.
- Do not start website migration until the roadmap's stable-enough-alpha gate is met.

Verification: VT-10.

## Verification Tasks

### VT-00 — Authority and baseline

Verify Phase 2 SHA/CI, npm owner/version/tags, GitHub secret names without revealing values, trusted publisher identity, protected environment, and a clean frozen boundary.

### VT-01 — Changesets rehearsal

Run initial versioning twice from disposable clean baselines and compare outputs. Require exactly `2.0.0-alpha.0`, one accurate major entry, public access, and no stale patch content.

### VT-02 — Package metadata and tarball docs

Run the Phase 2 artifact verifier with the expanded allowlist. Require exact repository metadata, public access, README/MIGRATION/CHANGELOG inclusion, no Node engine/runtime dependency, and only intentional size changes.

### VT-03 — Documentation contract review

Compile examples and compare README, migration, changelog, release notes, public declarations, decisions, and package behavior. Require no v1 API ambiguity or alpha/stable overclaim.

### VT-04 — Feedback readiness

Validate issue forms/config syntactically and dry-run each category. Verify labels/severity/target-alpha routing and the superseding-decision requirement for frozen-contract proposals.

### VT-05 — Release-workflow safety

Exercise the workflow through non-publishing validation with no release credential. Prove wrong SHA/version, failed/missing CI, existing target version, changed `latest`, missing environment approval, absent OIDC, or fingerprint mismatch fails closed.

### VT-06 — Candidate gate

Run frozen format, lint, typecheck, 76+ tests, build, distribution artifact/consumers, ESM/CJS/types, docs examples, tarball contents, release dry-run, and browser gate against the exact candidate.

### VT-07 — Phase 3 review

Require all preparation obligations Verified, green exact-SHA CI, no frozen-boundary change, npm authority ready, and a documented approval verdict. Confirm no publication/dist-tag mutation occurred.

### VT-08 — Publication observation

Record protected workflow approval, exact SHA/version, npm publication result, `next`/`latest` state, provenance, and subsequent Git/GitHub release creation. Treat partial completion explicitly.

### VT-09 — Registry and consumer acceptance

Inspect the registry artifact and run exact-version/`@next` external React 18/19 compilation, production builds, mounts, native form, and styled polymorphic smoke tests.

### VT-10 — Post-publish closure

Require every coverage row Verified, findings triaged, feedback channel active, and links to all public/evidence artifacts before moving to Alpha Iteration. Apply queued v1 issue/PR replies or closures only now, and require each applicable reply to contain a real npm `next` link rather than a placeholder.

## Release Checklist

### Phase 3 — safe preparation

- [x] Phase 2 exact SHA and final CI are recorded.
- [x] npm owner and trusted publisher configuration are verified.
- [x] Protected GitHub release environment is configured.
- [x] Stale v1 changeset is removed and one v2 major changeset exists.
- [x] Disposable rehearsal deterministically yields `2.0.0-alpha.0`.
- [x] README, migration, changelog, release notes, and feedback templates are ready.
- [x] Tarball includes the intended documentation and passes the full distribution gate.
- [x] Exact candidate passes Node 22/24 CI and Node 24 Chromium.
- [x] Phase 3 review approves the exact SHA.
- [x] npm still reports `latest: 1.4.8`; target alpha is absent.
- [x] No publish command has run.

### Phase 4 — completed

- [x] User explicitly approves the exact SHA and version.
- [x] Protected workflow publishes the verified tarball with OIDC under `next`.
- [x] `latest` remains `1.4.8`.
- [x] npm artifact, integrity, provenance, exports, declarations, peers, and docs match.
- [x] `emblor@2.0.0-alpha.0` tag and GitHub prerelease exist.
- [x] Exact-version and `@next` React 18/19 consumers pass.
- [x] Feedback channel is active and findings are triaged.
- [x] Post-publish review recommends Alpha Iteration.

## Failure and Rollback Policy

- Before publication, fix or abandon the candidate normally; no registry rollback exists yet.
- If publication is rejected, preserve logs, correct authority/configuration, rerun all preflight checks, and retry the same candidate only if npm confirms the version was never created.
- If npm publication succeeds, treat the version as immutable. Repair Git tags, GitHub release metadata, or `next` separately if needed.
- For a package defect after publication, document impact and publish a follow-up alpha after the fix passes the complete gate. Do not overwrite or casually unpublish alpha.0.
- If `latest` moves accidentally, restore it immediately to `1.4.8`, record the incident, and block further releases pending review.
- If a frozen-contract change is required, stop and create a superseding decision before any follow-up prerelease.

## Planned Commit and Release Boundaries

1. `chore(release): prepare v2 alpha changeset metadata`
2. `docs(emblor): complete alpha migration and release guidance`
3. `chore(github): add alpha feedback taxonomy`
4. `ci(emblor): add approval-gated trusted alpha publishing`
5. `chore(release): generate 2.0.0-alpha.0 candidate`
6. `docs(planning): approve v2 alpha release candidate` — only after exact-SHA CI
7. Phase 4 protected workflow publication — not a commit and requires explicit approval
8. `docs(planning): record v2 alpha publication evidence` — after public verification

Do not squash preparation, release automation, version generation, and post-publish evidence into one commit.

## External Release Facts Verified on 2026-08-14

- npm trusted publishing requires a sufficiently current npm/Node toolchain, an exact repository/workflow identity, and `id-token: write`; public GitHub packages receive automatic provenance: <https://docs.npmjs.com/trusted-publishers/>.
- Changesets prerelease mode stores state in `.changeset/pre.json` and uses its prerelease tag for versioning/publication: <https://github.com/changesets/changesets/blob/main/docs/prereleases.md>.
- Changesets CLI supports a custom publish tag outside prerelease coupling, but this runbook avoids `changeset publish` and publishes the verified tarball directly so `alpha.0` and `next` remain explicit: <https://github.com/changesets/changesets/blob/main/docs/command-line-options.md>.

## Open Questions

None blocking transition execution. Final v1 sunset duration and npm deprecation timing remain deliberately deferred to beta stabilization and the stable-release runbook.

## To-Dos

- [x] T-00 — Establish release authority and immutable baseline.
- [x] T-01 — Reconcile Changesets and rehearse `alpha.0`.
- [x] T-02 — Finalize package metadata and shipped documentation.
- [x] T-03 — Complete migration, changelog, and alpha release notes.
- [x] T-04 — Establish the alpha feedback system.
- [x] T-05 — Build the approval-gated alpha publication workflow.
- [x] T-06 — Generate the exact alpha release candidate.
- [x] T-07 — Approve or reject Phase 3.
- [x] T-08 — Publish `2.0.0-alpha.0` under `next` after explicit approval.
- [x] T-09 — Verify the public npm release.
- [x] T-10 — Close alpha.0 release and hand off to iteration.
- [x] T-11 — Preserve current v1 on remote `1.x`.
- [x] T-12 — Classify v1 issues and pull requests internally without reopening v1 implementation.
- [x] T-13 — Replace default-branch automatic publishing with manual trusted publishing.
- [x] T-14 — Prepare and review the v2 integration PR.
- [x] T-15 — Approve the exact integrated `main` candidate.
