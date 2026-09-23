# Documentation release checklist

Run this checklist whenever the package version, compatibility policy, public API, registry, or migration guidance changes.

Record each release run in [QA_REPORT.md](./QA_REPORT.md); the reusable checklist below intentionally remains unchecked between releases.

- [ ] The exact prerelease version in `package.json`, installation docs, registry dependencies, and migration guide matches.
- [ ] Node 24 is the primary CI runtime and Node 22 remains in the compatibility matrix.
- [ ] `pnpm --filter website validate` passes, including MDX examples, API drift, behavior evidence, routes, and registry artifacts.
- [ ] Clean consumer tests install both the packed npm package and every hosted `@emblor` registry item.
- [ ] Migration examples match `packages/emblor/MIGRATION.md` and the exported v2 surface.
- [ ] Playground previews, displayed source, and registry source resolve from the same canonical component files.
- [ ] Chromium desktop/mobile, Firefox, and WebKit browser checks pass.
- [ ] Screenshot baselines have been reviewed in light and dark themes at mobile and desktop widths.
- [ ] Keyboard, [screen-reader](./SCREEN_READER_QA.md), touch, paste, IME, 200% zoom, and forced-colors checks are recorded.
