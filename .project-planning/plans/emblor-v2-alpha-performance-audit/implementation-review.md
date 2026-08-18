# Implementation Review: Emblor v2 Alpha Performance Audit

## Status

Implementation and verification complete. One meaningful consumer-facing performance problem was confirmed and fixed without changing a frozen contract. PR #124 merged as `e8f2a891744e3dddbc6b48b0f7b0a28bb291a35f`, and its authoritative Node 22/24, distribution, browser, lint, typecheck, and Vercel checks passed.

The `alpha.1` release is complete. The exact release-preparation candidate merged as `d13025f632107d460a37458a33281ca873cacea2`; PRs #125, #126, and #127 subsequently merged release and documentation housekeeping. The audit remains a Phase 5 evidence record; Phase 5 stays active for post-alpha feedback and checkpoint review.

This review records evidence; it does not authorize a future prerelease or change a frozen contract.

## Post-publish closure

- Publish workflow run [`32131496090`](https://github.com/JaleelB/emblor/actions/runs/32131496090) published `emblor@2.0.0-alpha.1` successfully under npm `next`, then failed in post-publish consumer verification with `spawnSync pnpm ENOENT` because the publish job lacked pnpm setup.
- PR #126 (`366298a` and `c561230`) repaired the future workflow: it installs pnpm 9.0.2 and forwards the resolved candidate version into registry validation.
- Independent verification of the public `2.0.0-alpha.1` tarball passed React 18.3.1 and React 19.1.1 install, typecheck, production build, runtime, forms, and module/export checks.
- npm state is `next=2.0.0-alpha.1`, `latest=1.4.8`; integrity and SLSA provenance are present.
- The immutable alpha.1 npm README retained two alpha.0 references. PR #127 (`42d97a5`) corrected the repository README for future releases; alpha.1 itself cannot be rewritten.
- Git tag [`emblor@2.0.0-alpha.1`](https://github.com/JaleelB/emblor/releases/tag/emblor%402.0.0-alpha.1) targets the exact published source commit `d13025f…`.

## Baseline

- `origin/main`: `47fba3067a194d04c62405434ccfceeb97a0c55f`.
- Exact npm artifact: `emblor@2.0.0-alpha.0`, integrity `sha512-rF0JEuWfbLNRm+dEjtADXMKkMCsqrn3oY47GeGioR0h9nLgj4Wj0id7wLEQBVNdFwoZIGCHK6e7FEbzFgpEWaQ==`.
- Registry state observed, not changed: `latest: 1.4.8`, `next: 2.0.0-alpha.0`.
- Exact baseline CI: GitHub Actions run `31949328375` succeeded for the baseline SHA.
- Baseline package gates: lint, typecheck, 76 tests, packed React 18/19 consumers, exports/tarball, and 8 Chrome browser tests passed locally. Repository-wide local Prettier reported the known Windows CRLF checkout mismatch; the baseline Linux CI formatting gate passed.
- Published artifact: 89,169-byte tarball, 458,496 unpacked bytes, 65,122-byte ESM, 67,399-byte CJS, 12,956 declaration bytes.
- Same-Windows-worktree size baseline used for candidate deltas: 89,499-byte tarball and 468,342 unpacked bytes. The difference from registry size is line-ending/source-map packaging, so candidate growth is compared on the same platform.

## Browser benchmark method

- Production Vite bundles; Playwright-managed headless Chromium by default, with `PLAYWRIGHT_EXECUTABLE_PATH` available for an explicit browser executable.
- React 18.3.1 and React 19.1.1.
- Controlled and uncontrolled Root operation.
- 10-tag and 200-tag lists.
- 5 warmups; 25 draft/add/remove samples; 250 navigation samples.
- Median and p95 retained with all raw samples.
- Render calls are injected into benchmark bundles only; package source and candidate artifacts contain no instrumentation.
- Controlled measurements reuse stable committed arrays and child elements so the benchmark isolates Emblor subscriptions rather than consumer-created prop identities.

Raw reports are `baseline-performance.json` and `candidate-performance.json`.

## Vercel findings

The complete rule matrix is in `findings.md`. Relevant results:

- Confirmed: one draft-bearing provider invalidated TagList and every Tag on each keystroke.
- Rejected: the Input selection effect reattaches one document listener per render; real but too small to justify an alpha fix after the main change.
- Rejected: navigation sorts mounted indexes and invalidates every Tag; 200-tag p95 remained below 3 ms and changing focus subscriptions would add disproportionate DR-0011/DR-0040 risk.
- Passed/Not Applicable: derived render state, transient refs, functional updates, static bundle paths, explicit rendering, large barrels, Next.js/server/data/image/application-only guidance.

## React Doctor findings

React Doctor was not installed or callable. `npx --no-install react-doctor --version` found the missing `react-doctor@0.9.12` package. Two exact `npx react-doctor@latest install` attempts failed before execution with `ERR_SSL_CIPHER_OPERATION_FAILED`. No files were changed by the failed installation and no React Doctor findings are claimed.

## Accepted fix

The fix adds a private tag-parts context containing only committed-tag, tag-list, focus, removal, and registration inputs. Input and other Root consumers retain the original private context. Root remains the sole owner of all committed/draft state and behavior. The private `setTags` callback now depends on stable ownership members rather than the recreated ownership wrapper.

No public component, export, type, prop, callback, DOM contract, package path, dependency, or feature was added or changed.

A focused two-case regression proves uncontrolled and controlled draft updates with stable values/children do not rerender committed tag parts. Browser evidence, not jsdom timing, supports the performance claim.

## Before/after measurements

Draft render counts and latency from the final same-run exact-alpha/candidate comparison:

| React  | Mode         | Tags | TagList renders | Individual Tag renders | Median draft latency | p95 draft latency |
| ------ | ------------ | ---: | --------------: | ---------------------: | -------------------: | ----------------: |
| 18.3.1 | Uncontrolled |   10 |           1 → 0 |                 10 → 0 |       0.30 → 0.10 ms |    0.50 → 0.20 ms |
| 18.3.1 | Uncontrolled |  200 |           1 → 0 |                200 → 0 |       1.70 → 0.10 ms |    2.60 → 0.20 ms |
| 18.3.1 | Controlled   |   10 |           1 → 0 |                 10 → 0 |       0.30 → 0.10 ms |    0.40 → 0.20 ms |
| 18.3.1 | Controlled   |  200 |           1 → 0 |                200 → 0 |       1.70 → 0.10 ms |    2.70 → 0.20 ms |
| 19.1.1 | Uncontrolled |   10 |           1 → 0 |                 10 → 0 |       0.20 → 0.10 ms |    0.30 → 0.20 ms |
| 19.1.1 | Uncontrolled |  200 |           1 → 0 |                200 → 0 |       1.30 → 0.10 ms |    2.00 → 0.20 ms |
| 19.1.1 | Controlled   |   10 |           1 → 0 |                 10 → 0 |       0.20 → 0.10 ms |    0.40 → 0.20 ms |
| 19.1.1 | Controlled   |  200 |           1 → 0 |                200 → 0 |       1.20 → 0.10 ms |    2.20 → 0.20 ms |

At 200 tags, median draft latency improved by roughly 92–94%. Add medians improved or remained within sub-millisecond run noise; remove and navigation medians remained materially unchanged, with no systematic regression.

## Size comparison

| Measurement                    | Baseline |     Candidate |  Delta |
| ------------------------------ | -------: | ------------: | -----: |
| Same-platform tarball          |   89,499 |  91,443 bytes | +2.17% |
| Same-platform unpacked package |  468,342 | 470,739 bytes | +0.51% |
| ESM                            |   65,122 |  66,385 bytes | +1.94% |
| CJS                            |   67,399 |  68,706 bytes | +1.94% |
| Declarations                   |   12,956 |  12,956 bytes |     0% |
| React 18 consumer bundle       |  170,654 | 171,181 bytes | +0.31% |
| React 19 consumer bundle       |  214,524 | 215,054 bytes | +0.25% |

The small bundle increase is accepted for eliminating O(tag count) work from every draft change. All values remain within the existing 10% review tolerance.

## Verification evidence

Node 22.23.2:

- targeted Prettier check passed for every changed/new source, test, benchmark, and planning file;
- ESLint passed;
- TypeScript passed;
- 78/78 package tests passed (76 baseline plus 2 focused regressions);
- release-boundary policy tests passed 4/4;
- packed distribution gate passed exact files, ESM, CJS, declarations, export/subpath checks, runtime mounting, and React 18/19 production consumers;
- 8/8 Chrome browser contract tests passed;
- full production browser benchmark passed all 16 exact-alpha/candidate scenarios;
- `git diff --check` passed.

Node 24.19.0:

- ESLint, TypeScript, and 78/78 tests passed;
- packed distribution and React 18/19 consumer gates passed with byte-identical candidate reports to Node 22;
- 8/8 Chrome browser contract tests passed.

The authoritative repository-wide checks passed in PR CI. The clean Windows checkout still reports baseline CRLF differences across unchanged files, so targeted formatting remains the reliable local signal. The exact baseline SHA's Linux CI also passed.

## Frozen-boundary review

- No change under `website/` or `packages/emblor/playground/`.
- No change to `packages/emblor/src/types`, `src/index.ts`, or `package.json`.
- Public declarations remain byte-identical at 12,956 bytes.
- Root remains the owner of committed values, draft, mutation coordination, forms, validation, announcements, focus restoration, and registrations.
- Existing keyboard/focus, forms, accessibility, validation, polymorphism, and native-prop browser/package tests pass.
- Source scan found no autocomplete, suggestions, sortable/drag-and-drop, Tailwind, Shadcn, CVA, addon, or v1 coupling in core.
- No superseding decision record is required.

## Remaining risks

- Browser timing is machine-specific; exact raw samples are retained and PR CI does not independently enforce latency thresholds.
- The 200-tag benchmark is deliberately large. It demonstrates scaling but is not a new public maximum-list contract.
- Selection listener churn and broad focus-context navigation remain classified low-value; neither is changed.
- React Doctor could not run because its requested installation failed in the local npm/OpenSSL path.
- The benchmark runner's repeated Vite preview startup may emit a benign local `MaxListenersExceededWarning` on the process input stream after results are written; benchmark scenarios complete successfully and temporary workspaces are removed.

## Release recommendation

The original recommendation was fulfilled: `alpha.1` is published and verified. No `alpha.2` is planned. Later findings from the alpha.1 consumer cycle determine whether another alpha is warranted.
