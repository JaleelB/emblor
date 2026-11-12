# Visual regression baseline policy

The accepted design is dark-only (DR-0045). `visual.spec.ts` covers ten playground
examples and seven documentation/dialog surfaces at desktop and mobile sizes.
Keep all 34 comparisons, the existing 2% differing-pixel limit, and Playwright's
pixel threshold. Behavior, accessibility, responsive layout, and focus assertions
remain separate gates in `site.spec.ts` and `playground.spec.ts`.

## Platform ownership

Images live in `visual.spec.ts-snapshots/{platform}/`, using Playwright's native
`process.platform` token. `win32` preserves the reviewed Windows captures; `linux`
is the Ubuntu 26.04 CI lane. CI pins that Ubuntu release and the lockfile pins
Playwright. A browser channel override is only an exploratory run, not baseline
acceptance. Other platforms require their own review; there is no silent fallback
to another operating system's captures.

Native glyph antialiasing can differ even with the same bundled Geist fonts and
Chromium revision. Platform images permit those reviewed rendering differences
while continuing to detect changed text, layout, colors, wrapping and controls.
The default configuration never writes snapshots. Explicit `--update-snapshots`
is a local review operation and must not be added to the CI comparison command.

## Reviewing a change

1. Use the lockfile-pinned Playwright and its installed Chromium, without a
   `PLAYWRIGHT_CHANNEL` override. Run a production build and set
   `PLAYWRIGHT_PRODUCTION=1` for the browser gate.
2. Inspect the expected, actual, and diff images from a failing run. CI retains
   `website/test-results/` as `website-browser-evidence` for 14 days, including
   retry captures and traces. Download the artifact for the exact source SHA.
3. Diagnose layout/content changes separately from native text rasterization.
   Check image dimensions, wrapping, clipping, controls, focus, colors and spacing;
   a stable retry alone does not establish that the new image is correct.
4. Update only the reviewed platform's images. Never generate baselines during
   the authoritative comparison gate or increase tolerances to accept drift.
5. Run the comparisons again without snapshot updates and record source SHA,
   OS/runner image, Playwright/browser version, commands and results in the beta
   readiness evidence. An untested platform must not be reported as passing.

A missing baseline is a failure that requires review. New or changed snapshots
must preserve the accepted design and meaningful comparisons; product approval
does not automatically approve arbitrary generated screenshots.
