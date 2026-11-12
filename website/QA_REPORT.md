# Documentation QA report

Historical automated gates: 2026-09-10. Current readiness rerun: 2026-11-12 (details below).

This report records the release evidence for the Emblor v2 documentation site. Re-run the commands and replace the results whenever the package version, public API, registry, or documentation shell changes.

## Automated gates

| Gate                     | Result                                                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Node 22 validation       | Passed: formatting, lint, typecheck, 19 routes/MDX pages, 35 TypeScript snippets, API drift, behavior evidence, 10 registry items, external consumer         |
| Node 22 production build | Passed: 37 static/generated pages; Pagefind indexed 30 pages                                                                                                 |
| Node 24 validation       | Passed with the same coverage as Node 22                                                                                                                     |
| Node 24 production build | Passed: 37 static/generated pages; Pagefind indexed 30 pages                                                                                                 |
| Registry consumer        | Passed: list, view, add, and consumer typecheck for all hosted items                                                                                         |
| Visual regression        | Passed: 54 desktop/mobile light/dark baselines, including every playground example and all shared documentation surfaces                                     |
| Chromium desktop/mobile  | Passed: navigation, search, playground behavior, accessibility, links, responsive layout, 200% zoom equivalent, forced colors, IME, and touch                |
| Firefox                  | Passed: 11 applicable tests; 4 device-specific checks skipped. Headed mode is required on this Windows host because its headless renderer cannot initialize. |
| WebKit                   | Passed: 11 applicable tests, including all playground behaviors; 4 device-specific checks skipped                                                            |

The API validator currently covers 8 public components, 27 Root props, and 19 public types. The behavior validator anchors documented claims to 10 core or browser tests.

## Manual review recorded

- Reviewed the homepage, documentation shell, long code, responsive API table, callout, search dialog, focused preview, and installation sheet at desktop and mobile widths in both themes.
- Verified keyboard tag creation and the `Added tags …` live-region announcement through the browser accessibility tree.
- Verified focused-preview LTR/RTL, phone/compact/wide widths, disabled, read-only, invalid, and maximum-capacity states.
- Verified search focus, results, explanatory empty state, Escape dismissal, blurred overlay, and focus restoration.
- Automated touch add/remove, paste behavior, IME composition, 200% zoom equivalent, and forced-colors checks are passing in their supported projects.
- Screen-reader QA: passed, as reported by Jaleel on 2026-09-22. The specific screen reader, browser, and test notes were not recorded here.

## Historical release disposition

At the time of the historical report, no screen-reader QA blocker was recorded. The automated gate results above retain their 2026-09-10 verification date; the current readiness review below supersedes that release disposition for the changed site.

## Current readiness review — 2026-11-12

The tables and manual acceptance above are historical evidence. Current acceptance preserves Jaleel's approved dark-only design and removed theme switch (DR-0045); it does not claim light-mode support or light-mode validation.

- Windows, Node 22.23.2 and Node 24.19.0: website formatting, lint, typecheck, content/routes, 35 compiled snippets, API/behavior/registry validators, exact public alpha.1 resolution, and production builds pass. Both builds generate 37 pages; Pagefind indexes 30 pages. Pagefind notes the framework-generated global-error page has no language attribute.
- Node 24 full website browser run: 85 passed, 13 browser-specific skips (51 behavior tests across Chromium/mobile/Firefox/WebKit plus 34 desktop/mobile dark visual checks). Project-specific IME, touch, zoom/forced-colors and layout tests run in their designated project; these skips are not waived failures.
- Reviewed all changed visual captures against the accepted redesign. Updated framing, centered stages, spacing, palette and logo baselines; removed 20 obsolete light-named images. Subsequent visual-only run passes all 34 without updates. Screenshot tolerances are unchanged. Playground screenshots now wait for the existing hydration marker.
- Reorder buttons work both on their dedicated route and after scrolling to the lazily mounted catalog item in all four browser projects. Drag starts at its handle, avoiding interference with keyboard buttons. Canonical registry output includes the same fix.
- Hosted registry list/view/add/TypeScript passes on Node 24.22.3 with pinned pnpm 9.0.2 against the refreshed local production server on port 4502. Earlier Node 24.19.0 attempts exposed an upstream Windows runtime shutdown assertion and were not treated as passes. The pinned package-manager check also found and fixed mismatched website/fixture declarations; clean source checks found and fixed CRLF-sensitive registry and integrity comparisons. Full evidence is in the beta review.

Current manual screen-reader evidence remains required for the changed shell, search, preview and installation surfaces. Follow [SCREEN_READER_QA.md](./SCREEN_READER_QA.md) and record tester, date, OS, browser and screen-reader versions, routes, actual spoken output and focus/reading-order results. Jaleel's 2026-09-22 acceptance remains valid historical evidence, with its missing environment details explicitly retained.

The hosted preview is blocked externally: Vercel reports `Account is blocked.` Production still serves v1; no production cutover or main merge was performed. See the [beta readiness review](../.project-planning/plans/emblor-v2-beta-release/implementation-review.md) for exact artifacts, current CI and the remaining G1 requirements.

## Security and CI follow-up — 2026-11-12

This follow-up supersedes the earlier candidate's dependency and snippet counts. Next/eslint-config-next is now 16.4.1, Zod 4.6.6; the reviewed production audit has zero critical/high findings (one moderate and one low build-time finding remain recorded). Clean pinned-pnpm distribution and website validation/build checks pass on Node 22.23.2 and Node 24.22.3 after the update; all six artifact reports reproduce the same package checksum.

Linux CI exposed a standalone snippet compiler that did not inherit website React type paths and parsed LF/CRLF fences differently. The fixed validator and two parser regressions pass on both Node lanes. It compiles **34 active v2 examples** and explicitly distinguishes the one labeled historical v1 migration-before example, which cannot compile against v2. Earlier 35-example reports are historical command results, not current evidence that v1 compiled against v2.

Final production-server browser gate: **85 passed, 13 project-specific skips**, without snapshot updates. Clean package browser contracts: **8 passed**. The preceding dev-server run had two cold search-result timeouts; tests now assert the successful API response before checking visible results, and CI runs the built production server. No assertion tolerance or product search behavior was weakened. Current manual screen-reader and safe hosted-preview acceptance remain open.
