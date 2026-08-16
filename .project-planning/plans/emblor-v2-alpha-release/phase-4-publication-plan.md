# Implementation Plan: Publish and Verify `emblor@2.0.0-alpha.0`

## Status

**Completed on 2026-08-16.** Phase 3 was complete, explicit authorization was supplied for merged `main` SHA `76bbd359eebc522dedd03cbfcacfcc6cfa903b96` and version `2.0.0-alpha.0`, and the resulting publication/verification is recorded in [phase-4-publication-evidence.md](./phase-4-publication-evidence.md).

This is the completed just-in-time execution plan for roadmap Phase 4. It expanded T-08 through T-10 of the existing [alpha release plan](./plan.md) without replacing the Phase 3 history, [transition runbook](./transition-runbook.md), or [T-15 evidence](./t15-evidence.md).

## Feature Definition

Publish the verified v2 candidate as `emblor@2.0.0-alpha.0` on npm's `next` dist-tag, prove the public npm artifact in clean React 18 and React 19 consumers, create matching GitHub release metadata after registry verification, activate alpha feedback, and record the evidence required to begin Alpha Iteration.

## Goals

- Publish exactly SHA `76bbd359eebc522dedd03cbfcacfcc6cfa903b96` as `2.0.0-alpha.0`.
- Use the protected manual Node 24 OIDC workflow with provenance.
- Keep npm `latest` on v1 `1.4.8`; set `next` to the alpha.
- Verify registry metadata, integrity, provenance, contents, exports, declarations, and peers.
- Verify clean npm installs with React 18.3.1 and React 19.1.1.
- Compile, build, mount, and smoke-test controlled, uncontrolled, native-form, and styled polymorphic consumers.
- Create the exact Git tag and GitHub prerelease only after npm verification.
- Activate feedback and apply only evidence-supported post-publish v1 issue/PR dispositions.
- Close Phase 4 with a durable evidence record and Alpha Iteration recommendation.

## Non-Goals

- Moving npm `latest`, rebuilding the website, or claiming beta/stable guarantees.
- Changing source, package metadata, the frozen API, candidate SHA, or release version.
- Broad v1 maintenance or claiming unresolved v1 defects are fixed.
- Adding autocomplete, suggestions, sortable/drag-and-drop, Shadcn, Tailwind, CVA, addons, compatibility components, or feature subpaths.
- Treating workspace source, a local tarball, or a Git checkout as public-consumer evidence.

## Current State

- `main` is the v2 prerelease line; `1.x` preserves v1.
- npm `latest` is `1.4.8`; `next` and `2.0.0-alpha.0` were absent at T-15.
- Exact-SHA Node 22/24 CI, Chromium, 76 package tests, packed React 18/19 consumers, distribution checks, release dry-run, and Vercel passed.
- The default-branch workflow is manually dispatched, validates the exact successful CI SHA, packs once, crosses the protected `npm` environment, and publishes via OIDC.
- Git tag and GitHub prerelease creation intentionally follow npm verification.

## Release Authority Boundary

Plan creation, merge, CI success, T-15 approval, and trusted-publisher configuration do not authorize publication. Execution starts only after the user explicitly authorizes:

```text
SHA: 76bbd359eebc522dedd03cbfcacfcc6cfa903b96
Version: 2.0.0-alpha.0
```

The protected `npm` environment approval remains a second human checkpoint. A changed SHA or version requires new Phase 3 evidence and new authorization.

## Decision Manifest

### Required

| Decision | Phase 4 requirement |
| --- | --- |
| DR-0001 | Release only the headless tag-input primitive; excluded v1 features stay out. |
| DR-0002 | Publish one `emblor` package without feature packages/subpaths. |
| DR-0004 | Prove the npm artifact with React 18 and React 19 consumers. |
| DR-0007 | Verify the root-only code API and removed-subpath failures. |
| DR-0012 | Publish alpha under `next`; keep v1 on `latest`; prove real consumers. |
| DR-0013 | Require successful authoritative CI and distribution gates. |
| DR-0014 | Publish on Node 24 while retaining Node 22 compatibility evidence. |
| DR-0016 | Smoke-test consumer styling, DOM props, polymorphism, and refs. |
| DR-0041 | Preserve the frozen architecture; stop for a superseding decision if required. |
| DR-0042 | Publish the approved merged `main` SHA manually; preserve `1.x` and v1 `latest`. |

All behavioral decisions frozen through DR-0041 remain transitive artifact-verification requirements; Phase 4 does not reimplement them.

### Related

- DR-0005: keep the website on v1 during Phase 4.
- DR-0018: include native repeated-value form submission in consumer proof.
- DR-0035: include polymorphic native semantics in consumer proof.

### Not Applicable

- DR-0003, DR-0008 through DR-0011, DR-0015, and DR-0017 through DR-0040 create no new implementation work here; their contracts are already frozen and verified.
- DR-0006 and DR-0033 are superseded.

### Deferred

- v2 docs rebuild: Phase 6.
- Beta freeze: Phase 7.
- v1 sunset/deprecation and stable `latest` cutover: later decision and Phase 9.

### Conflicts or Uncertainty

The first three dispatches exposed release-plumbing defects before npm publication. The successful run used the corrected feature-ref workflow revision while pinning checkout, ancestry, CI, candidate metadata, and the public tarball to the approved merged `main` SHA. The immediate post-publish validator also required a small npm 11 JSON-shape correction, which passed independently after propagation. Port these workflow corrections to the default-branch workflow before the next publication. No package defect or frozen-contract change was found.

## Decision Coverage

| Obligation | Source | Tasks | Verification | Status |
| --- | --- | --- | --- | --- |
| P4/O-01 exact SHA/version authorization | DR-0012, DR-0042 | T-01 | VT-01 | Verified |
| P4/O-02 protected Node 24 OIDC publication | DR-0012–DR-0014, DR-0042 | T-02 | VT-02 | Verified |
| P4/O-03 `next=alpha.0`, `latest=1.4.8` | DR-0012, DR-0042 | T-02, T-03 | VT-02, VT-03 | Verified |
| P4/O-04 immutable artifact/package-boundary proof | DR-0001, DR-0002, DR-0007, DR-0041 | T-03 | VT-03 | Verified |
| P4/O-05 React 18/19 npm consumers | DR-0004, DR-0016 | T-05 | VT-05 | Verified |
| P4/O-06 representative public behavior | DR-0016, DR-0018, DR-0035, DR-0041 | T-05 | VT-05 | Verified |
| P4/O-07 matching Git/GitHub prerelease after npm | DR-0012, DR-0042 | T-04 | VT-04 | Verified |
| P4/O-08 feedback and evidence-based backlog actions | DR-0012, DR-0042 | T-06 | VT-06 | Verified |
| P4/O-09 evidence closure and Alpha Iteration handoff | DR-0012, DR-0041 | T-07 | VT-07 | Verified |
| P4/O-10 no frozen-architecture mutation | DR-0001, DR-0041 | T-01–T-07 | VT-01, VT-07 | Verified |

All Required obligations are Verified. See [phase-4-publication-evidence.md](./phase-4-publication-evidence.md) for the run, registry, consumer, Git/GitHub, feedback, and backlog evidence.

## Implementation Strategy

Use a stop/go sequence:

```text
explicit authorization
  -> workflow validation
  -> protected environment approval
  -> npm publication
  -> independent registry verification
  -> Git tag and GitHub prerelease
  -> clean npm consumer proof
  -> feedback/backlog actions
  -> evidence closure
```

No later stage proceeds merely because an earlier irreversible action succeeded.

## Files and External State

No candidate source or package file may change. Expected post-publish planning updates:

- `coverage.md`
- `implementation-review.md`
- `phase-4-publication-evidence.md` (new)
- `plan.md`
- the umbrella roadmap and planning index

External state changed only during authorized execution:

- npm version and `next` dist-tag
- annotated Git tag `emblor@2.0.0-alpha.0`
- matching GitHub prerelease
- feedback/milestone state and approved v1 issue/PR replies or closures

## Implementation Tasks

### T-01 — Reconfirm authority and immutable pre-state

Decisions: DR-0012, DR-0013, DR-0041, DR-0042.

Obligations: P4/O-01, P4/O-10.

1. Obtain explicit authorization naming the full SHA and version.
2. Prove the SHA remains reachable from `origin/main`, equals T-15, and has successful `ci.yml` evidence.
3. Recheck npm: `latest=1.4.8`, `next` absent, target version absent.
4. Recheck trusted-publisher repository, workflow, environment, and permission identity.
5. Confirm no successful or in-progress publication already targets this version.

Stop on any mismatch. Authorization does not transfer to another candidate.

Verification: VT-01.

### T-02 — Dispatch and supervise protected publication

Decisions: DR-0012–DR-0014, DR-0042.

Obligations: P4/O-02, P4/O-03.

1. Dispatch `publish.yml` from `main` with the approved SHA/version.
2. Observe exact checkout, ancestry/boundary validation, exact-SHA CI lookup, frozen install, distribution gate, Chromium, release dry-run, single pack, checksum, and upload.
3. Review validation output before approving the protected `npm` environment.
4. Approve only when every value identifies the authorized candidate.
5. Observe registry preflight, OIDC publication with provenance, and post-publish assertion.
6. Preserve run URL, job IDs, artifact identity/checksum, and approval evidence.

If outcome is uncertain, query npm before any retry. Never blindly rerun.

Verification: VT-02.

### T-03 — Independently verify npm and the public artifact

Decisions: DR-0001, DR-0002, DR-0007, DR-0012, DR-0041, DR-0042.

Obligations: P4/O-03, P4/O-04.

1. Independently confirm exact version exists, `next` points to it, and `latest` remains `1.4.8`.
2. Verify repository, license, public access, peers, no package Node engine, zero runtime dependencies, exports, and file allowlist.
3. Download from npm and compare public contents/metadata with the validated artifact.
4. Record integrity and provenance/attestation visibility.
5. Prove root exports resolve and removed subpaths fail.
6. Inspect shipped README, migration guide, changelog, declarations, ESM, and CJS.

Do not create Git metadata if this fails. If `latest` moved, restore it to `1.4.8` immediately, record an incident, and halt.

Verification: VT-03.

### T-04 — Create Git tag and GitHub prerelease

Decisions: DR-0012, DR-0042.

Obligations: P4/O-07.

1. Require VT-03 PASS and confirm the tag/release do not exist.
2. Create annotated tag `emblor@2.0.0-alpha.0` pointing exactly to the approved SHA.
3. Push only that tag.
4. Create GitHub prerelease `2.0.0-alpha.0` from `.github/releases/2.0.0-alpha.0.md`.
5. Link npm `next`, migration guidance, alpha status, and feedback entry points.
6. Verify the public tag target and release metadata.

Verification: VT-04.

### T-05 — Verify clean npm consumers

Decisions: DR-0004, DR-0007, DR-0012, DR-0016, DR-0018, DR-0035, DR-0041.

Obligations: P4/O-05, P4/O-06.

1. Create isolated consumers outside the monorepo for React 18.3.1 and React 19.1.1.
2. Install by exact version and through `emblor@next`; record resolved registry sources.
3. Ensure no workspace, tarball, link, override, patch, branch, or source path masks npm resolution.
4. Compile strict TypeScript, production-build, and mount.
5. Exercise controlled/uncontrolled composition, repeated-value native form submission, consumer styling/DOM props, polymorphism, refs/native semantics, root exports, and removed-subpath failures.
6. Record commands, versions, outputs, and warnings.

Any failure becomes a classified release finding. Do not mutate `alpha.0`; target a follow-up alpha.

Verification: VT-05.

### T-06 — Activate feedback and post-publish backlog actions

Decisions: DR-0001, DR-0012, DR-0041, DR-0042.

Obligations: P4/O-08.

1. Confirm alpha issue forms, labels, and milestone are usable.
2. Publish one clear feedback entry point linked from the prerelease.
3. Record findings with category, severity, reproduction, environment, owner, and target release.
4. Revisit the internal v1 queue only after VT-03 and VT-05 pass.
5. Use real npm/migration links and distinguish “addressed by v2” from “removed from core.”
6. Close only obsolete or demonstrably covered work; keep genuine unresolved v1 defects open.
7. Preserve the security-verification path for issue #98.

Verification: VT-06.

### T-07 — Close Phase 4 and hand off

Decisions: DR-0012, DR-0041, DR-0042.

Obligations: P4/O-09, P4/O-10.

1. Create `phase-4-publication-evidence.md` with workflow, npm, tag, release, consumer, feedback, and backlog evidence.
2. Resynchronize coverage/review so every Phase 4 obligation is Verified or a blocker is explicit.
3. Mark Phase 4 complete and Phase 5 next in the roadmap/index.
4. Recommend Alpha Iteration or an immediate bounded `alpha.1` correction plan from actual findings.
5. Commit planning evidence separately from the immutable release candidate.
6. Create the Alpha Iteration plan only after this closure identifies real needs.

Verification: VT-07.

## Verification Tasks

- **VT-01 — Authority/pre-state:** authorization matches full SHA/version; SHA is green on `main`; trusted publishing and unpublished npm state remain correct.
- **VT-02 — Protected publication:** exact candidate passes the workflow and publishes through protected Node 24 OIDC; checksum and approval evidence are retained.
- **VT-03 — Registry/artifact:** independent npm queries prove exact version, correct dist-tags, metadata, contents, exports, declarations, integrity, and provenance.
- **VT-04 — Git identity:** annotated tag targets the approved SHA and matching GitHub release is explicitly a prerelease.
- **VT-05 — Consumers:** fresh React 18/19 npm consumers compile, build, mount, and pass representative form/styling/polymorphism/export checks.
- **VT-06 — Feedback/backlog:** feedback works; findings are actionable; public backlog mutations are evidence-supported and use real links.
- **VT-07 — Closure:** every P4 obligation is Verified, no frozen violation is hidden, and planning artifacts identify the evidence-based next step.

## Failure and Rollback

- **Before publication:** stop safely; preserve logs. Any correction creates a new candidate requiring full CI and new authorization.
- **Status uncertain:** query npm before retrying. An existing version is immutable even if the workflow UI failed.
- **npm succeeded, verification failed:** never overwrite or casually unpublish. Restore `latest` immediately if it moved; correct only a bad dist-tag after verifying the immutable version; plan `alpha.1` for package defects.
- **npm succeeded, Git metadata failed:** repair Git tag/release separately; do not republish npm.
- **Frozen-contract problem:** use a bounded contract-restoring fix plan, or stop and accept a superseding decision before any contract change.

## API, UI, and State Changes

- No package API, behavior, or website change.
- npm gains immutable `2.0.0-alpha.0`; `next` points to it; `latest` remains `1.4.8`.
- Git/GitHub gain the matching prerelease identity and feedback surface.

## Dependencies

- Explicit exact-SHA/version authorization.
- T-15 green evidence.
- Protected `npm` environment reviewer.
- Matching npm trusted publisher.
- npm/GitHub availability and Node 24 trusted-publishing toolchain.
- Clean external consumer environments with npm access.

## Commit / Release Boundaries

1. Optional planning commit containing T-15 evidence and this plan; no candidate change.
2. Manual protected npm publication; not a code commit.
3. Annotated tag/GitHub prerelease after npm verification.
4. Separate planning evidence commit after complete verification.
5. Any source fix ends this attempt and requires a replacement candidate and approval.

## Open Questions

None blocking Phase 4 closure. Port the release-plumbing corrections to the default-branch workflow before the next publication; no package or frozen-contract correction is currently required.

## To-Dos

- [x] T-01 — Reconfirm authority and immutable pre-state.
- [x] T-02 — Dispatch and supervise protected publication.
- [x] T-03 — Independently verify npm and public artifact.
- [x] T-04 — Create Git tag and GitHub prerelease.
- [x] T-05 — Verify clean npm consumers.
- [x] T-06 — Activate feedback and post-publish backlog actions.
- [x] T-07 — Close Phase 4 and hand off to Alpha Iteration.

## Completion Gate

Phase 4 completes only when npm exact-version and `next` resolve to the alpha, `latest` remains v1, public artifact/provenance checks pass, React 18/19 npm consumers pass, the exact candidate has matching GitHub release identity, feedback is active, backlog actions are accurate, and all Phase 4 coverage rows are Verified.
