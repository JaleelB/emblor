# Phase 3 Implementation Review: Emblor v2 Alpha Candidate

## Status

The integration PR is structurally reviewed and its current head has passed Node 22/24 CI, website typecheck/lint, and Vercel preview deployment. It is approved for the merge gate, not for Phase 4 publication.

Verdict: transition prerequisites are verified and the integration candidate is green. Phase 3 remains active until PR #122 merges and the exact resulting `main` SHA passes the final gate. No npm publication or dist-tag mutation occurred.

## Follow-up review — workflow and boundary fixes

- The publication workflow now runs `npm pack .` from `packages/emblor`, so the uploaded artifact is the package tarball rather than the workspace root.
- The publish job now configures Node 24 independently of the validation job before checking npm trusted-publishing compatibility.
- The invalid GitHub Discussions contact link was removed because Discussions are disabled for this repository.
- The v1 website typecheck compatibility failure was fixed narrowly by aligning its React 18 type packages with the already-resolved workspace versions (`@types/react` 18.3.26 and `@types/react-dom` 18.3.7); no v2 docs migration, website source, or runtime dependency was introduced.
- The release validator now unions committed, staged, unstaged, and untracked paths when checking the frozen Phase 2 boundary; a dirty worktree can no longer hide a forbidden source, website, or playground change.
- Static workflow assertions in both the release validator and distribution verifier cover the package working directory and publish-job Node 24 setup.
- `.cursorrules` was removed as requested, eliminating its trailing-whitespace errors from the candidate boundary.
- The migration guide retains the explicit warning that the v1 subpaths `emblor/core`, `emblor/addons`, `emblor/sortable`, `emblor/utils`, `emblor/types`, and `emblor/testing` disappeared.
- Phase 3 now classifies the v1 backlog internally; public replies and closures are deferred until post-publish, when each applicable response can include a real npm `next` link.

## Baseline and authority evidence

- Phase 2 baseline: `3980c5d0cda5123b5c61c4df10cbf5220610a4a3`.
- Recorded final Phase 2 CI run: `31767216492`, including Node 22/24 distribution and Node 24 bundled Chromium evidence.
- Package-preparation candidate SHA: `337985d5c1a8ebfecf81557a974ee2df9f67bf84`.
- Candidate CI run: `31814904247` passed both Node 22.x and Node 24.x jobs, including packed distribution verification and the Node 24 Chromium browser contract gate.
- PR #122's refreshed integration candidate passed Node 22.x and Node 24.x CI, the website `typecheck-lint` job, and the Vercel preview deployment; the PR remains unmerged.
- Repository visibility: public; default branch: `main`.
- npm owner: `jaleelb`; registry state remains `latest: 1.4.8` and contains no `2.0.0-alpha.0`.
- GitHub `NPM_TOKEN` secret exists, but it was not used and is not treated as trusted-publishing authority.
- GitHub `npm` environment was created with protected-branch policy and a required reviewer (`JaleelB`).
- npm trusted-publisher configuration was verified from authenticated npm package settings on 2026-08-14: repository `JaleelB/emblor`, workflow `publish.yml`, environment `npm`, permission `npm publish`. Operational OIDC proof remains a Phase 4 publication result.

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

- The package-preparation parent passed `pnpm run release:dry-run` and the complete distribution gate without publishing; npm remained at `latest: 1.4.8` with the target version absent.
- The current local rerun passes package build, lint, typecheck, 76 tests, exact tarball contents, ESM/CJS/types, React 18.3.1 and React 19.1.1 packed consumers, production bundles, runtime mount, and export/subpath checks. The wrapper's fixed formatting step reports the repository's Windows CRLF checkout; the normalized Prettier check passes and the authoritative PR check is green.
- README examples compiled through the packed React 18/19 consumer fixtures.
- `git diff --check` passed.
- `pnpm -C website typecheck` and `pnpm -C website lint` pass after the React type alignment. The refreshed PR also passes the website `typecheck-lint` job and Vercel deployment. The existing Contentlayer Node compatibility output remains outside this v1 website compatibility fix and is deferred to the planned docs-layer replacement.
- `pnpm run release:dry-run` passes on the Windows checkout after CRLF normalization in the validator; no publication occurred. The local Chromium gate remains unavailable because the Playwright executable is not installed.

## Frozen-boundary review

No v2 source, public API/type, runtime dependency, playground, or excluded-feature change was introduced by the Phase 3 implementation. The only website change is dev-toolchain type alignment needed to keep the unchanged v1 website typecheckable; no v2 docs migration or website source change was introduced. The remaining changes are release metadata, package documentation, release automation, feedback intake, planning evidence, and distribution assertions.

## Coverage decision

AR/O-01 through AR/O-10 and AR/O-12 are implemented and evidenced, including trusted-publisher configuration, the pushed package-preparation parent, and green Node 22/24 plus Node 24 browser CI. AR/O-19 through AR/O-21 are Verified, including v1 preservation, internal backlog classification, and manual workflow installation. AR/O-22 and AR/O-23 are Partially Covered because the integration PR is green but not merged and the exact final `main` SHA is not yet approved. AR/O-11 remains partially evidenced for the same final-SHA boundary. Public issue/PR disposition remains post-publish. AR/O-13 through AR/O-18 remain Phase 4 obligations and were not attempted.

The combined runbook remains Active. Do not dispatch `publish.yml` until the transition runbook completes and the user explicitly approves the exact verified integrated `main` SHA with `2.0.0-alpha.0`.
