# Documentation QA report

Automated gates last verified: 2026-09-10

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

## Remaining release review

No screen-reader QA blocker is currently recorded. The automated gate results above retain their 2026-09-10 verification date; rerun them after further site changes before using this report as current release evidence.
