# Website dependency finding — 2026-11-12

The push warning was investigated against this branch using `pnpm audit --prod --json`, rather than assuming it referred only to historical v1. The current website graph had 5 critical and 15 high advisories. [Before](security-before.json) records package versions, affected/patched ranges and advisory URLs.

## Repair

- Update website Next.js and matching eslint-config-next from 16.3.1 to 16.4.1. This reaches the fixed ranges for the audited Windows/image optimization/next-og/cache/server-action findings, including [GHSA-673q-mjm6-r5xr](https://github.com/advisories/GHSA-673q-mjm6-r5xr).
- Update website and registry-example Zod from 4.4.3 to 4.6.6; regenerate the canonical registry artifacts. The core package's dependency/peer boundary is unchanged.
- Resolve sharp 0.35.5 through the updated Next range.
- Pin vulnerable transitive ranges to reviewed compatible fixes through root pnpm overrides: browserslist 4.28.7, fast-uri 3.1.9, brace-expansion 5.0.12, source-map-js 1.2.2, and Rollup 4.68.2. These overrides affect repository tooling and website dependencies; they add no dependency to published Emblor and do not alter the isolated consumer lock templates.
- Give the website its own Vite 8.3.8 development peer for Fumadocs Story/MDX instead of inheriting the incompatible package-test Vite 5 peer. Keep the core package's Vite 5 test tooling isolated. Add the matching ajv-formats 2.1.1 development peer requested by the installed form resolver. The website still builds with Next, not Vite.

## Result and limits

The final production audit has **0 critical, 0 high, 1 moderate, 1 low** advisories. [After](security-after.json) records the exact remaining paths and advisory identities. The low Babel sourceMappingURL and moderate minimatch glob-amplification findings are in documentation/build processing of repository-authored source and paths; they are not features of the published zero-dependency Emblor runtime. No untrusted MDX/glob input service is introduced by this preview. The minimatch fix is a major-version change and is not forced across its parent's version contract merely to erase an audit count. These remaining findings are recorded, not reported as a clean all-severity audit.

Node 24 website validation/build passes after the update. The affected clean Node 22/24 matrix, hosted registry and browser results are recorded in the implementation review after rerunning; pre-update results are retained as historical execution evidence rather than relabeled as validation of this dependency update. No publication, main merge or deployment promotion occurred.
