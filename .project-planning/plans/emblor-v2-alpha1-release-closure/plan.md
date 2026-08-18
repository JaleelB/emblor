# Emblor v2 `2.0.0-alpha.1` Release Closure Plan

## Status

Completed on 2026-08-18. The package release is valid and publicly consumable. This plan records the post-publication housekeeping required after npm publication succeeded before the original workflow's final consumer check failed.

Phase 5 Alpha Iteration remains active. Phase 6 v2 Docs Site Rebuild is the next eligible phase after the Phase 5 checkpoint; no `alpha.2` is planned by this closure.

## Decision manifest

| Decision | Closure application |
| --- | --- |
| DR-0041 | No frozen architecture, public API, ownership, focus, forms, accessibility, polymorphism, validation, or package-boundary change was introduced. |
| DR-0042 | The v2 prerelease uses `main`; the exact published source candidate was the merged `main` commit `d13025f…`. |
| DR-0012 | The prerelease uses npm `next`; npm `latest` remains the v1 line. A matching GitHub prerelease was created. |
| DR-0013 | Exact-SHA CI, distribution, browser, package, and consumer evidence remains authoritative. |
| DR-0014 | Node 24 was used for release execution with Node 22 compatibility coverage. |

## Closure obligations

| Obligation | Evidence | Result |
| --- | --- | --- |
| Preserve exact published source identity | Release-preparation merge `d13025f632107d460a37458a33281ca873cacea2` | Verified |
| Publish alpha.1 under `next` without moving `latest` | npm `next=2.0.0-alpha.1`, `latest=1.4.8` | Verified |
| Preserve integrity and provenance | npm dist metadata includes integrity and SLSA v1 provenance | Verified |
| Create matching Git metadata | Tag `emblor@2.0.0-alpha.1` and GitHub prerelease | Verified |
| Record post-publish workflow failure | Run `32131496090`: `spawnSync pnpm ENOENT` after successful publication | Verified |
| Repair future publish verification | PR #126, commits `366298a` and `c561230` | Verified and merged |
| Verify real published consumers | Public alpha.1 tarball passed React 18.3.1 and React 19.1.1 install, typecheck, build, runtime, forms, and module/export checks | Verified |
| Correct repository documentation | PR #127, README cleanup and alpha.1 link | Verified and merged |
| Preserve Phase 5 planning state | Audit review/index/roadmap synchronization | Verified |

## Release identity

- Package: `emblor@2.0.0-alpha.1`
- npm channel: `next`
- Stable channel: `latest` remains `1.4.8`
- Source candidate: `d13025f632107d460a37458a33281ca873cacea2`
- Tag: [`emblor@2.0.0-alpha.1`](https://github.com/JaleelB/emblor/releases/tag/emblor%402.0.0-alpha.1)
- GitHub prerelease: [`Emblor v2 2.0.0-alpha.1`](https://github.com/JaleelB/emblor/releases/tag/emblor%402.0.0-alpha.1)
- Publish workflow: [`32131496090`](https://github.com/JaleelB/emblor/actions/runs/32131496090)
- Exact-SHA main CI before publication: [`32131348899`](https://github.com/JaleelB/emblor/actions/runs/32131348899)

## Known issues and dispositions

### Post-publish workflow failure

The npm publish and registry/provenance checks succeeded. The workflow then failed because the publish job invoked `verify-packed-consumers.mjs`, which shells out to `pnpm`, without installing pnpm. This did not invalidate the package. PR #126 adds pinned pnpm 9.0.2 setup and forwards the resolved candidate version into registry validation for future runs.

### Immutable alpha.1 README mismatch

The already-published alpha.1 tarball contains two alpha.0 references in its README. PR #127 corrected the repository README, but npm package contents are immutable. The corrected README will ship with the next package version; no alpha.2 is justified solely for this documentation mismatch.

## Risks and rollback

- Do not unpublish or overwrite alpha.1. A package defect requires a separately gated follow-up prerelease.
- Git tag and GitHub release metadata are repairable independently of npm and now match the published source candidate.
- The original workflow's red conclusion remains historical evidence of a post-publish verification defect; PR #126 is the repair record.
- Phase 5 findings after real consumer use determine whether another alpha is warranted.

## Release criteria

All alpha.1 closure criteria are complete: exact source identity, npm publication, `next`/`latest` safety, provenance, matching GitHub metadata, independent React 18/19 consumer verification, workflow repair, README disposition, and planning synchronization.
