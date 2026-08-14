# Implementation Review: Emblor v2 Distribution Readiness

## Status

Local implementation complete; remote clean-checkout closure is pending. The source/public contract remains frozen, and the local Node 22 distribution gate passes. This review does not claim Phase 2 complete until the changes are committed and the exact pushed commit passes the Node 22/24 GitHub Actions matrix, including bundled Chromium on Node 24.

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

PD/O-01 through PD/O-10 and PD/O-15 have direct local evidence and are marked `Verified` in [`coverage.md`](./coverage.md). PD/O-11 through PD/O-14 and PD/O-16 are marked `Partially Covered` because local execution cannot substitute for the required Node 24 runner, bundled Chromium installation, clean checkout, exact pushed commit, and recorded GitHub Actions result.

## Remaining Closure Work

1. Commit the implementation without including unrelated pre-existing worktree changes.
2. Push the implementation commit and record the CI run URL, commit SHA, Node 22/24 job conclusions, and Node 24 bundled-Chromium result.
3. Re-run the committed distribution commands from a clean checkout and compare the artifact report with the baseline.
4. Update `coverage.md`, this review, the plan status, and the planning index only after that evidence passes; then activate Phase 3 alpha preparation.

## Recommendation

Proceed to the clean-checkout and remote CI closure step. Do not publish, bump the version, add a Phase 2 changeset, enter prerelease mode, or modify the frozen source/API boundary.
