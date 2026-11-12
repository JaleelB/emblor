# Linux visual CI review � 2026-11-12

## Candidate and failure evidence

The requested head was `29173b66481dbc73249950bdd1152b0cbbbe49cd`.
[CC 43237676934](https://github.com/JaleelB/emblor/actions/runs/43237676934)
and [CI 43237666692](https://github.com/JaleelB/emblor/actions/runs/43237666692)
failed the same 20 shared Windows-baseline comparisons. Neither run uploaded
artifacts. No threshold change or waiver was made.

Diagnostic commit `01f14dc9a2afa39f8a1992cebe5c37d171bfb81f` only added failure
artifact retention to both workflows. Its
[CC run 43239068658](https://github.com/JaleelB/emblor/actions/runs/43239068658)
provided expected/actual/diff PNGs for all 20 failures, both retries, and traces.
The rendering source is identical to the requested head. Runner: Ubuntu 26.04,
image `20261101.186.1`; pinned Playwright 1.62.1; Chromium 151.0.7922.34.

WSL has no installed distribution on this host and Docker is absent. Linux
captures therefore come from the real CI runner, not a claimed local Linux run.

## Diagnosis and visual disposition

Reviewed expected/actual/diff triplets for desktop/mobile docs shell, API table,
code block, callout and installation sheet, plus all ten mobile playground
examples. Text, example values, controls, table order, code, spacing hierarchy,
dark colors, dialogs and responsive containment retain the accepted design.
Differences concentrate on text rendering and associated wrapping/height. These
are platform captures, not pixel-identical cross-platform rendering.

The Linux trace records successful HTTP 200 responses for both bundled fonts.
Their SHA-1 identities match the local installed Geist 1.7.2 files exactly:

- Geist Sans: `83a2ff94d322a198a1c299748acbbb893b30cde4`
- Geist Mono: `6f389a22dccd92895384cc266c2c31cd12dfc329`

This rules out failed font downloads or different bundled font bytes in the
inspected docs trace. Native shaping/rasterization and platform metrics remain
environment-dependent; the review does not claim to identify an OS font-engine
implementation defect. Merely waiting longer or accepting 3% would not provide
an honest shared baseline.

All ten docs/install actual images are pixel-identical across initial capture
and both retries. Five mobile examples are also pixel-identical. The remaining
five mobile examples differ by at most 76 raw pixels between retries (small edge
or control antialiasing differences), safely below the unchanged comparison
limit. PNG byte identity is not assumed where decoded pixels agree.

Dimension changes were explicitly reviewed: callout height 68?69 desktop and
128?129 mobile; mobile shell height 2517?2534; mobile reorder card 661?635.
Other affected dimensions are unchanged. The callout and reorder text remain
readable and contained; both reorder tags and their controls are present. The
mobile shell retains the complete content and footer. Code remains horizontally
scrollable rather than wrapping/clipping its container incorrectly.

## Baseline ownership and meaningful gate

- `win32/`: all 34 original PNGs moved byte-for-byte, verified against Git.
- `linux/`: 20 reviewed CI actual captures plus the 14 existing images whose
  comparisons already passed Linux. The latter are honestly retained passing
  shared images, not falsely labeled newly generated Linux screenshots.
- [Baseline manifest](linux-visual-baselines.json) records provenance, dimensions
  and SHA-256 identities. Both CI workflows pin Ubuntu 26.04 to avoid silently
  changing the major native rendering environment.
- Snapshot paths include Playwright's `{platform}` token. Missing/other-platform
  baselines fail; there is no cross-platform fallback. Default snapshot writing
  is disabled. CI never runs with snapshot updates.
- All 34 comparisons, default pixel threshold 0.2 and maxDiffPixelRatio 0.02 are
  unchanged. Browser behavior/accessibility assertions remain enabled.
- Both workflows retain test-results for 14 days. Failed visual tests additionally
  attach browser/platform, viewport/DPR and font-load metadata for diagnosis.

Replayed all **60** actual PNGs (20 initial + 40 retries) through the installed
Playwright `utils.getComparator('image/png')`, using the unchanged 0.02 ratio:
**60 accepted** against the reviewed Linux set. Replaying the 20 initial images
against the old Windows set reproduces **20 failures**. A negative control that
replaces a visible heading region is rejected: 24,794 pixels, ratio 0.13. This
proves the new set accepts real stable Linux renders while retaining a meaningful
gate. It is an offline comparison of real Linux captures, not a new exact-head
Linux browser-run claim.

## Additional transition readiness finding

A local full production run initially returned 84 passed, 13 skipped, one mobile
Axe failure. Repeated mobile scans reproduced intermediate header-opacity
contrast failures (3/5 in one run). The diagnostic Linux run also logged this
contrast race. The accessibility scan now waits for fonts and finite Web Animations
to finish before scanning; no Axe rule, element, color or assertion is excluded.
Ten repeated mobile scans pass after this readiness wait. A later Node 24 run
also caught installation-code loading placeholders; the test now requires those
placeholders to disappear and the rendered code block to be visible before
capture. That failed placeholder image was not promoted to a baseline.

## Validation and remaining gate

Windows 11 Home 10.0.22000, bundled Playwright Chromium, no channel override:

- Node 22.23.2: full website validation and production build pass.
- Node 22.23.2: final production browser gate **85 passed, 13 project-specific
  skips**, including all 34 platform-path visual checks without updates.
- Website lint, typecheck and formatting pass after the test/config changes.
- Node 24.22.3: final production browser gate **85 passed, 13 project-specific
  skips**, including all 34 visual checks after installation-code readiness was
  added, without updates. Its preceding 84-pass/one-placeholder-failure run is
  retained as failed evidence, not reported as green.

No core source/API, package dependency, release metadata, tolerance, publication
or production deployment changed. Exact pushed-head Linux CI remains pending;
the artifact replay does not replace it. Vercel account/safe-preview evidence and
current manual screen-reader acceptance still block G1.
