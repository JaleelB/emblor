# Decision Manifest: Emblor v2 Alpha Preparation and Release

## Required

| Decision        | Alpha obligation                                                                                                                                           |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DR-0001         | Present v2 as a deliberate headless-only hard break; document removed v1 features and do not reintroduce compatibility surfaces.                           |
| DR-0002         | Release one public package named `emblor`, with no addons, sortable package, or feature subpaths.                                                          |
| DR-0003         | Document migration from v1 object values to public `string[]` values.                                                                                      |
| DR-0004         | State and verify React 18 and React 19 support against the npm-installed artifact.                                                                         |
| DR-0005         | Keep `website/` and production v1 docs unchanged during alpha preparation/publication; allow only narrow build-toolchain fixes required to keep the v1 site functional. |
| DR-0007         | Preserve and document the root-only public code API plus `emblor/package.json`.                                                                            |
| DR-0008–DR-0011 | Keep final primitive names and keyboard/focus contracts accurate in README, migration, and release notes.                                                  |
| DR-0012         | Generate the first v2 prerelease from the `1.4.8` baseline, publish under a non-`latest` tag, test representative consumers, and do not promote stable v2. |
| DR-0013         | Require authoritative CI and exact-artifact verification before any publication.                                                                           |
| DR-0014         | Use Node 24 for release and retain Node 22 compatibility; do not add a package Node engine.                                                                |
| DR-0015–DR-0032 | Keep state ownership, composition, validation, forms, accessibility, mutation, naming, and constraint documentation consistent with the frozen API.        |
| DR-0034–DR-0040 | Keep structural, polymorphic, Unicode, paste, blur, external-state, and focus-restoration documentation consistent with the frozen behavior.               |
| DR-0041         | Preserve the complete frozen architecture; any public-contract correction requires a superseding decision and resynchronized coverage before release.      |
| DR-0042         | Preserve v1 on maintenance-only `1.x`, move v2 prerelease work to `main`, triage v1 backlog without broad fixes, and keep publication manual.              |

## Related

- The completed Phase 1 and Phase 2 plans supply the implementation, compatibility, browser, tarball, and distribution evidence used by the alpha release candidate.
- The umbrella roadmap defines the Phase 3 entry gate, Phase 4 publication sequence, and the later alpha-feedback/docs phases.

## Not Applicable

- DR-0006 and DR-0033 are superseded and impose no active release obligation.
- Website v2 implementation, integration demos, beta policy, stable promotion, and final v1 sunset timing belong to later roadmap phases.

## Deferred

None within the combined Phase 3/4 runbook. Phase 4 publication is deliberately approval-gated, not deferred. If approval or npm authority is unavailable, Phase 3 may finish with a verified release candidate while the runbook remains Active and Phase 4 remains blocked.

## Conflict Resolution

Changesets prerelease mode normally uses one tag for both the semver identifier and npm dist-tag. Emblor requires the version `2.0.0-alpha.0` while the public installation channel is `next`. This plan resolves that tooling mismatch by:

1. using Changesets prerelease mode with `alpha` only for version/changelog generation;
2. publishing the already-versioned, CI-verified tarball directly with npm under `--tag next`;
3. verifying `next` points to the alpha and `latest` remains `1.4.8` before creating the GitHub prerelease.

Do not run `changeset publish` for `alpha.0`, because it would couple the npm dist-tag to the prerelease identifier and bypass the explicit `next` release contract.

## Blocker Rule

If preparation or real npm consumption exposes a need to change frozen exports, public types/props, ownership, mutations, forms, keyboard/focus, accessibility, polymorphism, package boundaries, or excluded-feature scope, stop release work and create a superseding accepted decision before continuing.
