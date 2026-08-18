# Emblor v2 Alpha Performance Audit Plan

## Status

Implementation and local verification complete; commit, PR, and authoritative CI evidence are pending. This is a bounded Phase 5 audit of the `emblor` package only. The immutable source baseline is `origin/main` at `47fba3067a194d04c62405434ccfceeb97a0c55f`; the public artifact baseline is `emblor@2.0.0-alpha.0` with npm integrity `sha512-rF0JEuWfbLNRm+dEjtADXMKkMCsqrn3oY47GeGioR0h9nLgj4Wj0id7wLEQBVNdFwoZIGCHK6e7FEbzFgpEWaQ==`.

No website work, redesign, publication, tag, release, dist-tag mutation, or merge is authorized by this plan.

## Purpose and scope

Measure the current alpha in real production browser consumers, audit the headless React implementation against applicable Vercel React guidance, run React Doctor when callable, and fix only confirmed measurable performance problems or correctness defects that fit the frozen architecture.

In scope:

- `packages/emblor/src`, package tests, browser performance fixtures, package/distribution tooling, and this plan's evidence;
- controlled and uncontrolled Root usage, small and large tag lists, React 18.3.1 and React 19.1.1;
- render counts for Root, Input, TagList, and individual Tags;
- add/remove and keyboard-navigation latency in a production browser build;
- package, output, tarball, and production-consumer bundle sizes;
- existing formatting, lint, type, unit, browser, compatibility, export, tarball, and distribution gates.

Out of scope:

- `website/`, docs-site implementation, playground product work, or application-only performance rules;
- public API, exports, types, ownership, mutation semantics, keyboard/focus, forms, accessibility, polymorphism, validation, package boundaries, and excluded-feature changes;
- autocomplete, suggestions, popovers, sortable/drag-and-drop, Tailwind, Shadcn, CVA, addons, or v1 coupling;
- npm publication, Git tags/releases, dist-tag mutation, PR merge, or planning `alpha.2`.

If a required fix crosses a frozen boundary, work stops and the finding becomes a `Frozen-contract proposal` requiring a superseding accepted decision and resynchronized plan/coverage.

## Decision manifest

| Decision                                    | Classification    | Audit obligation                                                                                                               |
| ------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| DR-0001, DR-0002, DR-0007                   | Required          | Preserve the headless one-package, root-only boundary and excluded-feature scope.                                              |
| DR-0004                                     | Required          | Measure and verify representative React 18 and React 19 consumers.                                                             |
| DR-0005                                     | Required          | Keep `website/` unchanged; this is a package-only audit.                                                                       |
| DR-0011, DR-0015, DR-0018, DR-0029, DR-0040 | Required          | Preserve actual-focus, Root-owned draft, native-form, navigation, removal, and focus-restoration contracts while benchmarking. |
| DR-0013                                     | Required          | Reuse and preserve authoritative package/CI gates.                                                                             |
| DR-0014                                     | Required          | Verify Node 22 and Node 24; Node 24 remains primary/release runtime.                                                           |
| DR-0016, DR-0023, DR-0035                   | Required          | Preserve DOM forwarding, native prop names, refs, and polymorphic semantics.                                                   |
| DR-0041                                     | Required          | Permit only private performance/refactor work and contract-restoring fixes; stop on frozen-contract change.                    |
| DR-0042                                     | Related           | Use a short-lived branch against `main`; do not publish or merge it.                                                           |
| DR-0006, DR-0033                            | Not Applicable    | Superseded; no active obligation.                                                                                              |
| Other accepted DR-0001 through DR-0040      | Related/protected | Remain binding through DR-0041 and existing regressions; this audit does not reinterpret them.                                 |

No decision conflict is known. The Phase 5 roadmap permits private refactors, package corrections, regressions, and contract-restoring fixes, while rejecting empty cadence releases and silent frozen-contract changes.

## Obligation coverage

| ID      | Obligation                                                                                                                    | Tasks            | Evidence                                                                 | Verification | Status                       |
| ------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------ | ------------ | ---------------------------- |
| PA/O-01 | Audit only current `origin/main` and published `alpha.0` package code                                                         | T-00, T-01       | Git SHA, npm metadata/integrity, scope diff                              | VT-00        | Verified                     |
| PA/O-02 | Capture repeatable production-browser render and latency baselines                                                            | T-02             | Raw benchmark JSON for controlled/uncontrolled, small/large, React 18/19 | VT-02        | Verified                     |
| PA/O-03 | Capture package/output/tarball/consumer bundle baselines                                                                      | T-03             | Distribution reports and npm artifact measurements                       | VT-03        | Verified                     |
| PA/O-04 | Audit applicable Vercel re-render, derived-state, effect, callback, transient-ref, lookup, bundle/export, and rendering rules | T-04             | Rule matrix with evidence, impact, risk, and action                      | VT-04        | Verified                     |
| PA/O-05 | Mark Next.js, server, data-fetching, image, and application-only guidance Not Applicable                                      | T-04             | Rule matrix                                                              | VT-04        | Verified                     |
| PA/O-06 | Run React Doctor only when installed/callable and classify every raw finding                                                  | T-05             | Version, command, raw IDs, file, disposition, Vercel relation            | VT-05        | Verified unavailable         |
| PA/O-07 | Allow fixes only for confirmed measurable problems or correctness defects                                                     | T-06             | Findings matrix, before/after data, focused regression/benchmark         | VT-06        | Verified                     |
| PA/O-08 | Preserve every frozen contract and excluded-feature boundary                                                                  | T-00, T-06, T-08 | Public/export/source diff and boundary scan                              | VT-00, VT-08 | Verified                     |
| PA/O-09 | Pass existing browser, package, compatibility, export, tarball, and distribution gates                                        | T-07             | Command logs and CI links                                                | VT-07        | Locally verified; CI pending |
| PA/O-10 | Verify Node 22/24 and React 18/19 consumers                                                                                   | T-07             | Node matrix and packed/npm consumer results                              | VT-07        | Verified                     |
| PA/O-11 | Justify `alpha.1` only for meaningful verified consumer-facing fixes                                                          | T-08             | Implementation review recommendation                                     | VT-08        | Verified                     |
| PA/O-12 | Open a focused PR without merge or publication                                                                                | T-09             | Branch, commits, PR, CI                                                  | VT-09        | Planned                      |

## Tasks

### T-00 — Establish immutable boundaries

- Fetch `origin/main`, record the exact SHA, and work in `perf/alpha-performance-audit` from that commit.
- Record npm metadata, integrity, dist-tags, peers, and unpacked size for exact `emblor@2.0.0-alpha.0` without changing registry state.
- Inventory accepted/superseded decisions, Phase 5 roadmap policy, package scripts, and existing gates.
- Record a source/public/export baseline so later diffs can prove frozen boundaries are unchanged.

### T-01 — Install and identify tooling

- Install the frozen workspace lockfile.
- Check React Doctor locally before any install. If absent, attempt the user-specified `npx react-doctor@latest install`; record failures without claiming tool output.
- Record browser engine, Node, pnpm, Vite, Playwright, React, and React Doctor versions used.

### T-02 — Build repeatable browser benchmarks

- Use production-built browser fixtures and `performance.now()`/React render instrumentation; do not use jsdom timings as improvement evidence.
- Run warmups followed by multiple measured samples and report median plus p95 (and sample count), not a single favorable run.
- Cover controlled/uncontrolled, small/large lists, React 18.3.1/19.1.1, and both source-baseline and exact npm alpha artifact.
- Measure Root, Input, TagList, and per-Tag renders for draft typing, add, remove, and navigation; separately measure add/remove and keyboard navigation latency.
- Keep fixtures deterministic, avoid network time in samples, and preserve raw machine-readable results.

### T-03 — Capture distribution and size baselines

- Build source and inspect ESM, CJS, declarations, source maps, packed tarball, and unpacked package bytes.
- Build isolated React 18/19 production consumers and record bundle bytes.
- Compare `origin/main`, exact npm `alpha.0`, and any proposed fix using identical commands/tool versions.

### T-04 — Vercel React Best Practices audit

For every reviewed rule, record Applicable/Not Applicable, file/evidence, finding, expected impact, risk, and proposed action. Review only:

- re-render optimization;
- state derived during render;
- effect usage;
- stable callbacks;
- transient refs;
- repeated lookup costs;
- bundle/export behavior;
- rendering behavior.

Mark Next.js, server, data-fetching, image, and application-only rules Not Applicable. Recommendations are hypotheses until code evidence and browser measurement support them.

### T-05 — React Doctor audit

- If callable, record tool version and exact command, retain raw finding identifiers, and classify each affected package file as valid, duplicate, false positive, or irrelevant.
- Link each valid item to the Vercel matrix where applicable.
- If installation/callability fails, record the exact failure and continue with no invented findings.

### T-06 — Findings and bounded fixes

- Create `findings.md` and classify every item as Confirmed measurable problem, Correctness defect, Accessibility/focus risk, Package/bundle problem, Low-value cleanup, False positive, Not Applicable, or Frozen-contract proposal.
- Implement only Confirmed measurable problem or Correctness defect rows.
- Require before evidence, a focused regression or benchmark, after evidence, and unchanged public/frozen boundaries for every fix.
- Reject unmeasurable micro-optimizations and high-risk refactors. Keep unrelated fixes in separate conventional commits.

### T-07 — Full verification

Run formatting check, lint, typecheck, full package tests, browser tests, Node 22/24 checks, React 18/19 consumers, distribution gate, exports/tarball checks, bundle comparison, benchmark comparison, and `git diff --check`. Preserve raw reports where practical.

### T-08 — Frozen-boundary and release review

- Compare package source, public declarations, exports, package metadata, tests, and dependencies to the baseline.
- Scan core for excluded features and v1 coupling; confirm `website/` stayed untouched.
- Recommend `publish alpha.1`, `no release justified`, or `blocked pending decision`.
- `alpha.1` requires a meaningful verified consumer-facing fix. Do not plan `alpha.2`.

### T-09 — Review, commit, and PR

- Create an implementation review containing baseline, Vercel findings, React Doctor findings, accepted/rejected fixes, before/after results, test evidence, frozen-boundary review, risks, and recommendation.
- Present exact commit groups before staging, stage explicit files only, validate, create conventional commits, push the branch, and open a focused PR against `main`.
- Do not merge or publish.

## Verification matrix

| ID    | Verification                                                                                                                                                                                   |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| VT-00 | `git merge-base --is-ancestor origin/main HEAD`; baseline SHA/npm integrity recorded; package-only diff and no website changes.                                                                |
| VT-02 | Repeatable production Chromium runs for all 2 × 2 × 2 controlled/list/React combinations; raw render/latency samples retained.                                                                 |
| VT-03 | Identical package and production-consumer size measurement for baseline and candidate; no unexplained growth.                                                                                  |
| VT-04 | Complete relevant Vercel rule matrix with application-only categories explicitly N/A.                                                                                                          |
| VT-05 | React Doctor version/command/raw IDs classified, or exact unavailability evidence recorded.                                                                                                    |
| VT-06 | Each accepted fix has before/after evidence and focused regression/benchmark; rejected cleanup remains unimplemented.                                                                          |
| VT-07 | Prettier, ESLint, TypeScript, Vitest, Playwright, Node 22/24, React 18/19, distribution, exports, tarball, and `git diff --check` pass locally or have an explicit environment/CI disposition. |
| VT-08 | No public declarations/exports/ownership/behavior/package boundary changed; excluded-feature scan clean; release recommendation justified.                                                     |
| VT-09 | Focused PR targets `main`, CI inspected, branch unmerged, npm/Git tags/releases/dist-tags unchanged.                                                                                           |

## Risks and controls

| Risk                                                  | Control                                                                                                                             |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Browser timing noise                                  | Production build, warmups, repeated samples, median/p95, same machine/browser, raw JSON.                                            |
| Instrumentation changes behavior                      | Keep instrumentation in benchmark consumers; compare published package and source through the same harness.                         |
| React Strict Mode inflates render counts              | Record mode explicitly and compare identical configurations; do not treat development-only double rendering as package cost.        |
| Context optimization alters ownership or focus        | Treat as frozen/high risk unless a private change proves equivalent through all existing gates; reject if equivalence is uncertain. |
| Tiny listener/callback cleanup has no consumer impact | Require measurable render/latency/listener-work evidence before fixing.                                                             |
| Browser or React Doctor unavailable locally           | Install only authorized tooling, record exact failure, rely on CI only for existing gates—not invented performance claims.          |
| Package/source mismatch                               | Benchmark exact npm alpha and current source separately, recording integrity/SHA.                                                   |
| Scope drift into website or excluded features         | Path and source scans before commit and in final review.                                                                            |

## Rollback

- No registry or release state is changed, so rollback is Git-only.
- Keep benchmark/evidence changes separate from implementation fixes where practical.
- A rejected fix is removed before commit; a committed fix can be reverted as its own conventional commit by the maintainer.
- Do not reset, rewrite, force-push, unpublish, or mutate dist-tags as rollback.
- If a fix needs a frozen-contract change, leave implementation absent and report the superseding-decision requirement.

## Release criteria

Recommend `publish alpha.1` only when this PR contains at least one meaningful, measured consumer-facing package fix, every required gate is green, the exact candidate retains the frozen boundary, and remaining risk is non-blocking.

Recommend `no release justified` when the audit yields only false positives, Not Applicable items, low-value cleanup, or improvements too small/noisy to establish.

Recommend `blocked pending decision` when a confirmed problem cannot be corrected without changing a frozen contract. This plan never authorizes publication; a later release runbook and explicit approval remain required.
