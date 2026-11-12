# Packed consumer graph review — 2026-11-12

## Diagnosis

The previous verifier pinned direct fixture versions but generated a fresh lockfile on every run. Thus the repository frozen install did not freeze the isolated consumer graphs. The original baseline contains hashes only, so its complete historical graph cannot be reconstructed from that baseline. No claim is made that the exact historical transitive delta is known.

The current graph was captured and reviewed in `graphs/react-18.json` and `graphs/react-19.json`. Both consumers use the intended exact React/DOM versions, types, jsdom, tsx, TypeScript, and Vite. Their transitive graph includes `@types/node@26.6.6`, `undici-types@8.9.0`, `rollup@4.68.2`, `postcss@8.5.32`, `nanoid@3.3.20`, `nwsapi@2.2.28`, and `ws@8.22.2`. These were previously selected through ranges without a committed consumer lock. The graph is tooling-only; the packed Emblor manifest still has zero runtime dependencies. The direct versions match the historical fixture source at `84b424d`.

## Repair and baseline review

- Commit complete React 18/19 lock templates and install with `--frozen-lockfile`; substitute only the candidate tarball path and verified SHA-512 identity. Do not resolve fresh registry graphs during checks.
- Remove machine-specific `path` fields from fingerprints. Exclude all optional `@esbuild/*` native binaries, including the previously omitted OpenHarmony target, as well as optional Rollup binaries and fsevents. Keep dependency versions, graph edges, and registry resolutions in fingerprints.
- Replace platform-specific hashes with portable fingerprints of the reviewed graphs. This changes normalization deliberately; it is not a claim that the old graph was identical.
- Retain original package and consumer byte baselines and the 10% tolerance. React 18 bundle is 171181 bytes versus 170654 baseline (+0.31%); React 19 is 215054 versus 214524 (+0.25%). Packed artifact is 90280 bytes; unpacked 475254; ESM 66385; CJS 68706; declarations 12956. All remain within the original limits.
- Full frozen distribution passes on Node 22.23.2 with pnpm 9.0.2 and Node 24.19.0 with pnpm 9.15.0. Both yield identical normalized fingerprints, bundle sizes, and tarball SHA-256 `8ff9d64df4c5bfe37140c18213c929c96a3ff8ec4bc850937c47565ee0dbbd14`.

Linux exact-commit CI remains authoritative for Linux installation and the portable normalization. Windows evidence alone does not claim that lane passed.
