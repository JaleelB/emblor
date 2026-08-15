# Phase 3 Implementation Review: Emblor v2 Alpha Candidate

## Status

Candidate committed and pushed at `93d955cce94b9e79a07ed60bca26ed1dcc1e6027`; not approved for Phase 4 publication.

Verdict: exact-SHA CI/browser evidence is green; approval remains blocked on external npm trusted-publisher authorization. No npm publication or dist-tag mutation occurred.

## Follow-up review — workflow and boundary fixes

- The publication workflow now runs `npm pack .` from `packages/emblor`, so the uploaded artifact is the package tarball rather than the workspace root.
- The publish job now configures Node 24 independently of the validation job before checking npm trusted-publishing compatibility.
- The invalid GitHub Discussions contact link was removed because Discussions are disabled for this repository.
- The release validator now unions committed, staged, unstaged, and untracked paths when checking the frozen Phase 2 boundary; a dirty worktree can no longer hide a forbidden source, website, or playground change.
- Static workflow assertions in both the release validator and distribution verifier cover the package working directory and publish-job Node 24 setup.

## Baseline and authority evidence

- Phase 2 baseline: `3980c5d0cda5123b5c61c4df10cbf5220610a4a3`.
- Recorded final Phase 2 CI run: `31767216492`, including Node 22/24 distribution and Node 24 bundled Chromium evidence.
- Candidate SHA: `93d955cce94b9e79a07ed60bca26ed1dcc1e6027`.
- Candidate CI run: `31814645434` passed both Node 22.x and Node 24.x jobs, including packed distribution verification and the Node 24 Chromium browser contract gate.
- Repository visibility: public; default branch: `main`.
- npm owner: `jaleelb`; registry state remains `latest: 1.4.8` and contains no `2.0.0-alpha.0`.
- GitHub `NPM_TOKEN` secret exists, but it was not used and is not treated as trusted-publishing authority.
- GitHub `npm` environment was created with protected-branch policy and a required reviewer (`JaleelB`).
- npm trusted-publisher configuration could not be verified because this workstation is not authenticated to npm (`npm whoami` returned `ENEEDAUTH`).

## Candidate evidence

- Changesets access is `public`; `@emblor/playground` and `website` are explicitly ignored so versioning cannot mutate the frozen playground or v1 website.
- Stale `cyan-owls-jump.md` was removed and `quiet-pandas-release.md` is the single v2 major changeset retained by prerelease mode.
- Two disposable clean-baseline rehearsals produced byte-identical prerelease state, package version, and generated changelog output.
- Real candidate versioning produced exactly `emblor@2.0.0-alpha.0` with `.changeset/pre.json` in `alpha` mode and `initialVersions.emblor: 1.4.8`.
- Package metadata declares the public repository, homepage, bugs URL, and `publishConfig.access: public` without adding a package Node engine or runtime dependency.
- The package tarball allowlist now includes only `dist`, `README.md`, `MIGRATION.md`, `CHANGELOG.md`, and `LICENSE` plus `package.json`.
- Local artifact fingerprint: `cb26e1d1d1c873101704600b3761aa5827e7a7b19fc7eb3f5ffdc7c97adcac64`.
- Artifact measurements: 89,169 tarball bytes; 458,496 unpacked bytes; 65,122 ESM bytes; 67,399 CJS bytes; 12,956 declaration bytes.
- The alpha issue forms, labels, and `2.0.0-alpha.0` milestone are present in GitHub.
- The manual workflow accepts exact SHA/version inputs, requires the exact successful `ci.yml` run, uses the protected `npm` environment, grants `id-token: write` only to the publish job, publishes a single verified tarball under `next` with provenance, and does not invoke Changesets publication or `NPM_TOKEN`.

## Verification performed

- `pnpm run release:dry-run` passed without publishing and confirmed npm `latest: 1.4.8` with the target version absent.
- `pnpm run distribution -- --skip-install` passed: formatting, build, lint, typecheck, 76 tests, exact tarball contents, ESM/CJS/types, React 18.3.1 and React 19.1.1 packed consumers, production bundles, runtime mount, and export/subpath checks.
- README examples compiled through the packed React 18/19 consumer fixtures.
- `git diff --check` passed.
- `pnpm run release:dry-run` passed after the boundary and workflow fixes.
- The local browser gate remains unavailable because this workspace lacks the Playwright Chromium executable, but the exact candidate's remote Node 24 Chromium gate passed in CI run `31814645434`.

## Frozen-boundary review

No source, public API/type, runtime dependency, website, playground, or excluded-feature change was introduced by the Phase 3 implementation. Changes are limited to release metadata, package documentation, release automation, feedback intake, planning evidence, and distribution assertions.

## Coverage decision

AR/O-01 through AR/O-09 and AR/O-12 are implemented and evidenced, including the pushed exact candidate SHA and green Node 22/24 plus Node 24 browser CI. AR/O-10 and AR/O-11 remain partially evidenced until npm trusted publishing is verified and Phase 4 publication is explicitly approved. AR/O-13 through AR/O-18 remain Phase 4 obligations and were not attempted.

The combined runbook remains Active. Do not dispatch `publish.yml` until npm trusted publisher identity is verified and the user explicitly approves `93d955cce94b9e79a07ed60bca26ed1dcc1e6027` with `2.0.0-alpha.0`.
