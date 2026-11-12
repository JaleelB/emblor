# Beta readiness implementation review

Status: readiness work implemented; G1 remains open. No beta version, prerelease metadata, npm dist-tag, publication workflow dispatch, or production docs cutover has occurred.

## Baseline and authorization

Accepted website baseline: `ad46fb5` on `docs/emblor-v2-site-polish`. Jaleel authorized the entire plan, necessary readiness fixes, and committing/pushing the accepted redesign. DR-0045 records explicit acceptance of the current dark-only presentation. Unrelated `.agents/`, `input-otp/`, `skills-lock.json`, and `website/debug.log` are excluded.

## T-01 / VT-01 - Alpha findings and exit recommendation

Jaleel reports no alpha issues (recorded 2026-11-12 in this execution). The evaluated public package is exact `2.0.0-alpha.1`; independent adoption count and detailed external-user usage context remain unknown. Website examples are an evidenced external npm consumer, not proof of independent adoption volume.

GitHub open issues #112, #108, #106, #100, #98, #97, #92, #91, #84, and #69 were inspected by title/body. They predate v2 alpha and describe v1/general requests. None reports a reproduced v2-alpha defect. No issue was closed or publicly messaged. #98 mentions tsup 6; the package uses tsup 8.5.0. The root's historical tsup 6 dev dependency is not packed or used by the package build; no unrelated dependency migration was performed.

The [Phase 5 entry checkpoint](../../sessions/2026-08-18-phase-5-docs-entry-checkpoint.md), [performance feedback/fix cycle](../emblor-v2-alpha-performance-audit/implementation-review.md), and [alpha.1 public React 18/19 verification](../emblor-v2-alpha1-release-closure/implementation-review.md) remain valid historical evidence. Current website tests exercise uncontrolled/controlled tags and draft, rejection/transform, duplicate/paste handling, native FormData/reset, React Hook Form, Popover/cmdk, dialog focus, keyboard, IME, touch, forced colors, and responsive/accessibility surfaces. Packed consumers compile polymorphic/custom-ref examples and verify ESM/CJS/export boundaries. Core tests/browser tests retain the broader frozen-contract regression coverage.

Findings:

| Finding                       | Reproduction/severity                                                                       | Contract impact                     | Disposition/owner                                                                                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| F-01 mixed React declarations | Website tsc/build legacy-ref and type-identity errors; release-tooling blocker              | No public change                    | Website-local React 19 declaration paths; fixed and traced to @types/react 19.2.18; agent                                                                          |
| F-02 formatter checkout drift | 58 flagged files under core.autocrlf=true; tooling blocker                                  | None                                | Preserve checkout endings via endOfLine:auto; only workflow line-ending changes; full root format passes; agent                                                    |
| F-03 fresh consumer graph     | Artifact hashes differ despite direct pins; tooling blocker                                 | No runtime dependency change        | Committed transitive locks, portable reviewed fingerprints, unchanged size limits; [review](evidence/fixture-review.md); agent                                     |
| F-04 reorder buttons          | WebKit example failed to move first tag; website defect                                     | Consumer-owned integration only     | SortableKnob restricts dragging; button clicks stop bubbling to tag focus; canonical registry regenerated; dedicated and scrolling-catalog regressions pass; agent |
| F-05 stale visual evidence    | Accepted layout differed from old snapshots; QA mismatch                                    | Website-only                        | Reviewed changed captures; updated dark snapshots; removed misleading light captures per DR-0045; agent                                                            |
| F-06 hosted preview           | Vercel status on ad46fb5: Account is blocked.; release-readiness blocker                    | No package defect                   | Account owner must repair Vercel account and confirm production/preview settings                                                                                   |
| F-07 manual QA currency       | Historic screen-reader pass has no versions; current shell changed                          | Unverified accessibility acceptance | Jaleel/tester must run SCREEN_READER_QA.md against current candidate and record environment/results                                                                |
| F-08 package-manager mismatch | Clean direct pnpm 9.0.2 website command rejected website/fixture pnpm 9.15.0 declarations   | Tooling only                        | Align both declarations with root/CI pnpm 9.0.2; fixed; agent                                                                                                      |
| F-09 CRLF reproducibility     | Clean archived sources failed registry drift and exact-package integrity checks             | Tooling only                        | Normalize canonical registry source and lockfile line endings before comparison; retain drift/integrity checks; fixed; agent                                       |
| F-10 Node 24 Windows shutdown | Node 24.19.0 shadcn list aborts with UV_HANDLE_CLOSING after producing JSON, repeated twice | Runtime/toolchain only              | Portable Node 24.22.3 passes complete hosted consumer; upstream Node fix #61999; no ignored failure or repository workaround                                       |

Alpha exit recommendation: no new core feature, extra alpha, arbitrary waiting period, or unapproved contract correction is indicated. Recommend beta.0 preparation once the remaining combined docs/CI G1 evidence closes. No unresolved critical/high reproduced package defect is known. This recommendation does not declare Phase 6 or G1 complete.

## T-02 / VT-02 - Validation repairs and local matrix

- Node 22.23.2 / pnpm 9.0.2: full `distribution` with frozen install passed (format, build, lint, typecheck, 78 tests, four release-boundary tests, packed-artifact checks and React 18/19 types/build/runtime/modules).
- Node 24.19.0 / pnpm 9.15.0: same full frozen distribution passed. Node 24 package Chromium contracts: eight passed. Prior Node 22 package browser run: eight passed.
- Identical tarball SHA-256 on both lanes: `8ff9d64df4c5bfe37140c18213c929c96a3ff8ec4bc850937c47565ee0dbbd14`. This is the local alpha readiness artifact, not an approved beta publication candidate. [Node 22 report](evidence/distribution-node22.json), [Node 24 report](evidence/distribution-node24.json).
- Website Node 24 validation/build passed: 19 routes, 35 TypeScript snippets, eight components/27 Root props/19 public types, ten behavior anchors, ten registry items, exact public alpha.1 resolution. Pagefind indexes 30 pages; it notes the framework-generated global-error page has no language attribute (not an authored-docs failure).
- TypeScript trace resolves React imports to website @types/react 19.2.18. Package/packed React 18 declaration checks still pass; no casts, disabled checks, or peer-range changes were introduced.
- Final full Node 24 website browser run: 85 passed, 13 browser-specific skips (51 behavior plus 34 visual). Catalog reorder actions pass Chromium/mobile/Firefox/WebKit. After adding the existing hydration-marker wait, the affected visual suite again passed all 34 without updates. Tolerances are unchanged. Node 22 website validation/build also passed.
- Refreshed hosted registry clean consumer passes list/view/add/tsc against local production URL `http://127.0.0.1:4502` with Node 24.22.3 and directly invoked pinned pnpm 9.0.2. Earlier Node 24.19.0 attempts failed with a native shutdown assertion; the [Node 24 changelog](https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V24.md) records the Windows assertion fix (#61999) in a later 24.x release. The portable runtime was downloaded from nodejs.org and checked against its published SHA-256; the machine's default Node was not changed.

These are Windows local results, not exact-SHA Linux CI approval. Current pushed baseline CI failed; repaired candidate CI must pass before G1.

## T-03 / VT-03 - Documentation and hosting

[Phase 6 implementation review](../emblor-v2-docs-site/implementation-review.md) maps all 20 obligations to files, tests, historical evidence, and unresolved requirements. Framework references now use Fumadocs per DR-0044; dark-only acceptance follows DR-0045. Historical September QA and Jaleel's screen-reader acceptance remain in QA_REPORT.md.

Production v1 was fetched on 2026-11-12 at https://emblor.jaleelbennett.com/introduction: it still exposes v1 TagInput and its old navigation. Remote `1.x` remains at `88daf89185d21f611e4986c8d3c62a966a7a5962`. npm read-only check reports `latest=1.4.8`, `next=2.0.0-alpha.1`.

GitHub deployment history: Production main SHA `7c4bb1f3977c98eca6d1377fff4324dfd0ef43b1`; docs Preview `bb5a53d979773a053650a3925d87eafbfb01934d` failed. The newer accepted docs commit ad46fb5 has Vercel status failure `Account is blocked.` with https://vercel.com/knowledge/why-is-my-account-deployment-blocked. Local Vercel project/auth configuration is unavailable. No merge is attempted; maintain this preview branch until production branch behavior is confirmed safe. This preserves v1 without guessing configuration or switching production.

## Remaining gates and required user action

1. Account owner: resolve the Vercel account block, confirm the project production branch/deployment settings preserve v1, and obtain a successful preview for the final pushed docs SHA. No main merge until safe hosting is evidenced.
2. Tester: run [SCREEN_READER_QA.md](../../../website/SCREEN_READER_QA.md) on the candidate production build; record tester/date, Windows version, screen reader/browser versions, routes, actual spoken announcements, reading/landmark/table order and dialog focus results in website/QA_REPORT.md. Historical acceptance is not erased, but automation cannot supply spoken-output evidence.
3. Exact candidate CI: await successful Node 22/24 Linux and Node 24 website/package browser/registry gates for the pushed readiness candidate. Local results do not substitute.

T-04 beta metadata/version application remains behind G1. T-05 through T-07 require later exact-main-SHA evidence and G2 approval naming version/SHA. npm publication is not authorized by this implementation request alone. No stable/latest or production-v2 cutover is permitted here.

## Initial local readiness result (before security and Linux-CI follow-up)

Fresh source archives with fresh node_modules pass distribution on Node 22.23.2 and portable Node 24.22.3 with directly invoked pnpm 9.0.2. All website validation stages and both production builds pass after the recorded package-manager/CRLF repairs. Clean Node 24 additionally passes 8 package browser contracts and 85 website checks (13 project-specific skips), without snapshot updates. [Verification matrix](evidence/verification-matrix.md), [clean Node 22 artifact](evidence/distribution-clean-node22.json), [clean Node 24 artifact](evidence/distribution-clean-node24.json). The same tarball identity is reproduced in all four artifact reports.

The [published alpha.1 public boundary](evidence/public-alpha1-boundary.json) exactly matches current built declarations and manifest boundary; declaration SHA-256 is 0a8602be35ff2db8fe8c8952f037b932a2986faaafd4d05613ff3f738db48d4b after line-ending normalization. No public API, peer range, runtime dependency or core source changed. Current local readiness work is complete; T-02 still requires authoritative exact-candidate CI, and T-03 still requires hosted-preview/safe-hosting and manual screen-reader evidence. G1 remains open.

## Security and Linux-CI follow-up

Draft [PR #129](https://github.com/JaleelB/emblor/pull/129) contains the accepted docs redesign and readiness repairs. Do not merge while hosting safety remains unverified.

- F-11: the production dependency audit on the candidate, triggered by the push warning, found 5 critical and 15 high advisories in the website graph. This was not dismissed as a v1-only warning. [Security review](evidence/security-review.md) records the compatible patches, scoped transitive overrides, and remaining low/moderate build-time findings. Current website uses Next/eslint-config-next 16.4.1, Zod 4.6.6, and website-local Vite 8.3.8/ajv-formats 2.1.1 development peers. `pnpm audit --prod --json` now reports **0 critical, 0 high, 1 moderate, 1 low**. This is not an all-severity or all-dev-dependency clean-audit claim. No published Emblor dependency or public boundary changed.
- F-12: exact-head Linux CI on `f90e4fd7c75f85a6b5e6a4861edd58a2e130c3af` failed snippet validation in [CI run 43234024718](https://github.com/JaleelB/emblor/actions/runs/43234024718) and [CC run 43234032258](https://github.com/JaleelB/emblor/actions/runs/43234032258). The standalone compiler omitted website React declaration paths and its fence parser differed across LF/CRLF. It now shares those paths, normalizes fence parsing, and has two focused regression tests. **34 active v2 TypeScript examples pass**; the single migration-before v1 sample is explicitly labeled `legacy-v1` and excluded from v2 compilation only in that route with its expected v1 import. It is historical v1 source, not a waived broken v2 example. Earlier reports of 35 compiled examples are retained as historical command results and superseded by this accurate distinction.
- F-13: the security-updated development-server run passed 83 checks and failed two initial search assertions. Search tests now await and assert the actual successful API response before retaining the five-second rendered-result assertion. CI browser validation now uses the already-built production server; local dev remains supported. HTTP failures are not accepted as empty results. The final production-browser run passes **85 tests, 13 project-specific skips**, without snapshot updates. No product search code or screenshot tolerance was changed.

## Current tested candidate

Security runtime source is `8c38788e62d0f1c1186108ac8670d5ed3d58fe37`; follow-up snippet validation is `3fae413`, and production-browser/search verification is `87fc7f0df59602f847cba9e645e637039df64bd9`. Later evidence-only commits do not change runtime behavior. Fresh security-candidate archives passed frozen distribution, website validation stages and builds on Node 22.23.2 and Node 24.22.3 with pinned pnpm 9.0.2. The parser fix and its two tests subsequently passed on both lanes, and both affected website builds passed. Clean Node 24 package browser contracts pass 8/8; its final production website browser run passes 85 with 13 project-specific skips. Updated registry list/view/add/tsc passes all 10 items against the production server on port 4502, including patched Zod dependencies.

[Security Node 22 artifact](evidence/distribution-security-node22.json) and [security Node 24 artifact](evidence/distribution-security-node24.json) reproduce the same SHA-256 as all four earlier reports: `8ff9d64df4c5bfe37140c18213c929c96a3ff8ec4bc850937c47565ee0dbbd14`. Core source, declarations, public manifest and size limits remain unchanged. The next authoritative CI run must verify the new pushed head; the failed earlier run is not called green. Vercel account/preview safety and current manual screen-reader evidence still block G1. Beta metadata and publication remain gated.

The targeted development-server search check also passes all four browser projects after the response-readiness fix (25.6 seconds total), retaining real result and empty-state assertions. The final production build is available locally at http://127.0.0.1:4502 for the required screen-reader check.

## Linux visual CI follow-up round ? 2026-11-12

This is a new follow-up to requested head `29173b66481dbc73249950bdd1152b0cbbbe49cd`,
not a declaration that the previous exact-head Linux failures passed.

- F-14: both Linux lanes failed the same 20 Windows-shared screenshot baselines.
  Neither original run retained images. Diagnostic commit `01f14dc` enabled
  expected/actual/diff/trace artifacts; all 20 triplets were reviewed from the
  real Ubuntu 26.04 runner. Both Geist font downloads succeeded and their bytes
  match Windows. Reviewed native rendering/wrapping differences now have
  platform-owned baselines, with all 34 comparisons and the 2% limit preserved.
  All 34 Windows images remain byte-identical. Linux owns 20 reviewed actual
  captures and 14 retained existing images that already passed Linux. Ubuntu is
  pinned to 26.04; missing baselines fail and CI never updates them.
- F-15: repeated mobile Axe scans exposed intermediate Fumadocs header-opacity
  contrast values. Waiting for fonts and finite animations before scanning
  passes 10/10 repeats, without excluding rules/elements or changing colors.
- F-16: a Node 24 installation-sheet capture caught dynamic-code loading
  placeholders. The visual test now requires the loading state to disappear and
  the rendered code block to be visible. The placeholder screenshot was rejected,
  not accepted as a baseline.

[Linux visual review](evidence/linux-visual-review.md) records exact CI source,
runner/browser/font identities, visual disposition and validation limits.
[Baseline manifest](evidence/linux-visual-baselines.json) records all 34 Linux
image identities and provenance. Offline replay through the pinned Playwright
comparator accepts all 60 real Linux captures/retries against the reviewed set,
reproduces all 20 failures against Windows images, and rejects a changed-heading
negative control (13% changed pixels). This does not claim an exact-new-head
Linux browser run.

Node 22.23.2 full website validation/build pass. Final Node 22 production browser
gate passes 85 with 13 project-specific skips, including all 34 platform-path
visual assertions. Final Node 24.22.3 production browser verification also passes **85 tests with
13 project-specific skips**, including all 34 visual comparisons after the
installation-code readiness wait, without snapshot updates. No core/API, package dependency, version/release metadata, screenshot
tolerance, Axe rule, npm channel or production hosting change was made. Pushed-head
Linux checks remain pending and must pass independently. Vercel account/preview
safety and current manual screen-reader acceptance still block G1; beta metadata
preparation and publication remain gated.
