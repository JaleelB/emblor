# 0014 — Use Node 24 Primary with Node 22 Compatibility

## Status

Accepted

## Context

The root currently requires Node `>=18 <20`, and CI runs Node 18. As of 2026-08-11, Node 18 and Node 20 are end-of-life. Node 22 and Node 24 are supported LTS lines, while the current local environment runs Node 22.

## Decision

Use Node 24 as the primary contributor, CI, and release runtime. Retain Node 22 as the lower supported runtime for repository tooling and package verification.

Set the private workspace root engine range to:

```json
">=22 <23 || >=24 <25"
```

Pin the default local toolchain to Node 24 with a conventional version file. Run package quality checks against Node 22 and Node 24 in CI, with release publication on Node 24.

Do not add a Node engine restriction to the published browser-focused `emblor` package unless a runtime requirement is later demonstrated.

## Alternatives Considered

- Keep Node 18 as the repository baseline.
- Support Node 20 despite end-of-life status.
- Support only Node 24.
- Allow all Node versions greater than or equal to 22, including odd-numbered and unverified future majors.
- Add the same engine restriction to the published package.

## Consequences

- Local and CI tooling use maintained Node releases.
- Node 22 compatibility provides a broader supported contributor environment during its remaining lifecycle.
- The exact engine range excludes unsupported odd majors and unverified future majors.
- Existing workflows and contributor documentation must move from Node 18 to Node 22/24.
- The support range will need routine maintenance as Node LTS lines age out.

## Related Files

- `package.json`
- `.node-version`
- `.github/workflows/ci.yml`
- `.github/workflows/code-check.yml`
- `.github/workflows/publish.yml`
- `CONTRIBUTING.md`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The root Node `>=18 <20` policy and Node 18 CI configuration.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-11. Sources consulted: the official Node.js release schedule and Node 22-to-24 migration guidance.
