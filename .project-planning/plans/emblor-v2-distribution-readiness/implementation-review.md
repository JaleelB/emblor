# Implementation Review: Emblor v2 Distribution Readiness

## Status

Phase 2 complete. The source/public contract remains frozen, the local distribution and release dry-run gates pass, and the exact pushed commit passed the clean-checkout Node 22/24 GitHub Actions matrix, including bundled Chromium on Node 24.

## Delivered

- Added `pnpm distribution`, an aggregate gate that can install with `--frozen-lockfile` and runs formatting, build, lint, types, unit tests, and packed distribution verification.
- Added `packages/emblor/tests/packaging/verify-distribution.mjs`, which packs once, extracts the same tarball, enforces the nine-file allowlist, validates manifest targets and dependencies, checks README/license identity, and records package sanity measurements.
- Strengthened the isolated packed consumers for React 18.3.1 and React 19.1.1 with exact fixture tooling, generated-then-frozen consumer lockfiles, reviewed dependency-graph fingerprints, strict declarations, representative polymorphic/native/ARIA/style/ref props, Vite production builds, runtime mounting, and native ESM/CommonJS module checks.
- Added `packages/emblor/tests/packaging/size-baseline.json` with a 10% review tolerance. The current measurements are:
  - tarball: 85,239 bytes;
  - unpacked package: 443,943 bytes;
  - ESM/CJS outputs: 65,122 / 67,399 bytes;
  - declarations: 12,956 bytes combined;
  - React 18/19 production bundles: 170,654 / 214,524 bytes.
- Removed the publish-time README copy, made `packages/emblor/README.md` the publication source, and added a non-publishing release validator. The validator uses the valid public access mode for the unscoped package, treats npm's expected refusal to republish the already-existing `1.4.8` baseline as successful dry-run evidence, and fails on other errors. The publish workflow checks out the triggering CI run's exact `head_sha` and requires it to equal the event `github.sha`, preventing Changesets from resetting to a different default-branch commit.
- Changed CI and the pull-request check to frozen-lockfile installs, retained named Node 22/24 steps, kept browser verification on the Node 24 lane, and updated deprecated checkout/cache action versions.
- Kept package version `1.4.8`, Changesets prerelease mode, website, playground, package source, public declarations, runtime dependencies, and excluded v1 feature surfaces unchanged.

## Local Verification Evidence

All of the following passed in the shared workspace on Node 22.23.2:

- `pnpm install --frozen-lockfile`
- `pnpm run distribution -- --skip-install`
- `pnpm run release:dry-run`
- `PLAYWRIGHT_CHANNEL=chrome pnpm -C packages/emblor test:browser` — 8 tests passed
- `git diff --check`
- source/export/scope scan for excluded features and unplanned website/playground/changeset changes

The aggregate distribution gate passed 76 unit tests. The artifact verifier passed the exact tarball files:

```text
LICENSE
README.md
dist/index.cjs
dist/index.cjs.map
dist/index.d.cts
dist/index.d.ts
dist/index.js
dist/index.js.map
package.json
```

## Decision Coverage

All obligations PD/O-01 through PD/O-16 are `Verified` in [`coverage.md`](./coverage.md). The final evidence is GitHub Actions run [31766929569](https://github.com/JaleelB/emblor/actions/runs/31766929569) for commit `7e0f0b0cdf30067364b28a94166712cef5a19a82`: Node 22 passed the complete distribution lane, and Node 24 passed the complete lane plus Chromium installation and the browser contract gate.

## Closure Evidence

- Commit: `7e0f0b0cdf30067364b28a94166712cef5a19a82`.
- CI run: [31766929569](https://github.com/JaleelB/emblor/actions/runs/31766929569).
- Node 22: success; frozen install, format, build, lint, typecheck, 76 tests, packed distribution, consumers, and package sanity passed.
- Node 24: success; the same distribution checks passed, Chromium installed successfully, and all 8 browser contract tests passed.
- Local release validation: `pnpm run release:dry-run` passed without publishing, changing `1.4.8`, or mutating the inspected package inputs.

## Recommendation

Proceed to Phase 3 alpha preparation. Do not publish, bump the version, add a Phase 2 changeset, enter prerelease mode, or modify the frozen source/API boundary until the separate alpha release runbook authorizes those actions.
