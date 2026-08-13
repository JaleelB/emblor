# 0012 — Release v2 Through an Alpha Channel First

## Status

Accepted

## Context

Emblor v2 is a hard API break with a new compound-component architecture and several behavior and accessibility paths still to harden. The branch manifest already says `2.0.0`, but the live npm `latest` version was verified as `1.4.8` on 2026-08-11. Starting from the provisional local `2.0.0` would make normal prerelease versioning awkward because `2.0.0-alpha.0` sorts before `2.0.0`.

## Decision

Restore the package manifest's development baseline to the actual published `1.4.8` version before generating release metadata.

Create a major changeset and use Changesets prerelease mode to publish `2.0.0-alpha.0` (or the next mechanically generated alpha identifier) under a non-`latest` prerelease dist-tag such as `next`.

Do not promote v2 to stable `2.0.0` or npm `latest` until the alpha has been installed in representative consumer projects and the API, React 18/19 compatibility, package contents, migration guidance, and accessibility behavior have been verified.

## Alternatives Considered

- Publish stable `2.0.0` directly.
- Treat the provisional local `2.0.0` as the release baseline.
- Use a beta or release-candidate channel as the first public v2 artifact.
- Keep v2 entirely private until stable.

## Consequences

- Early adopters can test v2 without replacing the stable v1 release.
- Release automation must use prerelease mode and an explicit non-`latest` tag.
- The repository version must be reconciled with npm's `1.4.8` baseline before versioning.
- Alpha feedback may legitimately produce further breaking API changes before stable v2.
- Promotion criteria and smoke-consumer verification belong in the implementation/release plan.

## Related Files

- `packages/emblor/package.json`
- `.changeset/`
- `pnpm-lock.yaml`
- `packages/emblor/README.md`
- `project-status/HANDOFF.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional assumption that the branch's `2.0.0` manifest value is already the correct release baseline.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-11. The live npm version was checked with `npm view emblor version dist-tags --json`.
